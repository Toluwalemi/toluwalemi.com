# toluwalemi.com

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT) 

Toluwalemi's personal website running on Hugo.

**Note**: This repo is built for my personal site. Feel free to look around and use ideas from it, but it is not a ready-made template. 
I will be unable to provide setup support for this codebase. If you want a similar clean blog, start with [Hugo Theme Hello Friend](https://github.com/panr/hugo-theme-hello-friend).

## Digital twin environment variables (Netlify)

Set these in **Netlify Site settings → Environment variables**:

- `LLM_PROVIDER` (default: `openrouter`)
- `LLM_API_KEY` (optional generic key name; falls back to `OPENROUTER_API_KEY`)
- `OPENROUTER_API_KEY` (required if `LLM_API_KEY` is not set)
- `CHAT_MODEL` (default: `anthropic/claude-3.5-haiku`)
- `EMBEDDING_MODEL` (default: `openai/text-embedding-3-small`)
- `CHAT_COMPLETIONS_URL` (optional override; defaults to OpenRouter chat completions URL)
- `EMBEDDINGS_URL` (optional override; defaults to OpenRouter embeddings URL)
- `LLM_HTTP_REFERER` (optional override for OpenRouter header)
- `LLM_APP_TITLE` (optional override for OpenRouter header)

## License

This project is open source and available under the [MIT License](LICENSE).
