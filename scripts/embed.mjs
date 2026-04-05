/**
 * Build embeddings for knowledge/*.md and write knowledge-base.json.
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const KNOWLEDGE_DIR = path.join(__dirname, "../netlify/functions/knowledge");
const OUTPUT_FILE = path.join(__dirname, "../netlify/functions/knowledge-base.json");

const OPENROUTER_EMBED_URL = "https://openrouter.ai/api/v1/embeddings";
const EMBEDDING_MODEL = "openai/text-embedding-3-small";

// Chunk config (character-based).
const CHUNK_SIZE = 500;
const CHUNK_OVERLAP = 100;
const MIN_CHUNK_LENGTH = 60;
const EMBED_BATCH_SIZE = 20;

// Split text into overlapping windows. Prefer sentence boundaries.
function chunkText(text, source) {
  const chunks = [];
  let start = 0;

  while (start < text.length) {
    let end = Math.min(start + CHUNK_SIZE, text.length);

    // Try to end near a sentence boundary.
    if (end < text.length) {
      const searchWindow = text.slice(Math.max(start, end - 100), end);
      const sentenceEnd = Math.max(
        searchWindow.lastIndexOf(". "),
        searchWindow.lastIndexOf("! "),
        searchWindow.lastIndexOf("? "),
        searchWindow.lastIndexOf("\n\n")
      );

      if (sentenceEnd !== -1) {
        end = Math.max(start, end - 100) + sentenceEnd + 1;
      }
    }

    const chunk = text.slice(start, end).trim();
    if (chunk.length >= MIN_CHUNK_LENGTH) {
      chunks.push({ text: chunk, source });
    }

    if (end >= text.length) break;
    start = end - CHUNK_OVERLAP;
  }

  return chunks;
}

async function embedBatch(texts, apiKey) {
  const response = await fetch(OPENROUTER_EMBED_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: EMBEDDING_MODEL,
      input: texts,
    }),
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Embedding API failed (${response.status}): ${errText}`);
  }

  const json = await response.json();

  return json.data
    .sort((a, b) => a.index - b.index)
    .map((d) => d.embedding);
}

async function main() {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    console.error("❌  OPENROUTER_API_KEY is not set.");
    console.error("    Run: OPENROUTER_API_KEY=your_key node scripts/embed.mjs");
    process.exit(1);
  }

  // Load markdown knowledge files.
  if (!fs.existsSync(KNOWLEDGE_DIR)) {
    console.error(`❌  Knowledge directory not found: ${KNOWLEDGE_DIR}`);
    process.exit(1);
  }

  const files = fs
    .readdirSync(KNOWLEDGE_DIR)
    .filter((f) => f.endsWith(".md"))
    .sort();

  if (files.length === 0) {
    console.error("❌  No .md files found in knowledge/");
    process.exit(1);
  }

  console.log(`📂  Found ${files.length} knowledge files:`);
  files.forEach((f) => console.log(`    • ${f}`));

  // Chunk all files.
  const allChunks = [];
  for (const file of files) {
    const rawText = fs.readFileSync(path.join(KNOWLEDGE_DIR, file), "utf-8");
    const source = file.replace(".md", "");
    const chunks = chunkText(rawText, source);
    console.log(`\n✂️   ${file} → ${chunks.length} chunks`);
    allChunks.push(...chunks);
  }

  console.log(`\n🔢  Total chunks to embed: ${allChunks.length}`);

  // Embed chunks in batches.
  const allEmbeddings = [];
  for (let i = 0; i < allChunks.length; i += EMBED_BATCH_SIZE) {
    const batch = allChunks.slice(i, i + EMBED_BATCH_SIZE);
    const batchEmbeddings = await embedBatch(
      batch.map((c) => c.text),
      apiKey
    );
    allEmbeddings.push(...batchEmbeddings);

    const done = Math.min(i + EMBED_BATCH_SIZE, allChunks.length);
    console.log(`🔄  Embedded ${done}/${allChunks.length} chunks`);
  }

  // Write final knowledge base.
  const knowledgeBase = allChunks.map((chunk, i) => ({
    source: chunk.source,
    text: chunk.text,
    embedding: allEmbeddings[i],
  }));

  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(knowledgeBase));

  const fileSizeKB = (fs.statSync(OUTPUT_FILE).size / 1024).toFixed(1);
  console.log(`\n✅  Done! Wrote ${knowledgeBase.length} chunks to:`);
  console.log(`    ${OUTPUT_FILE}`);
  console.log(`    File size: ${fileSizeKB} KB`);
  console.log(`\n💡  Commit knowledge-base.json to deploy the updated RAG context.`);
}

main().catch((err) => {
  console.error("❌  Fatal error:", err.message);
  process.exit(1);
});
