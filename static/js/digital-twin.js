(function () {
  var form = document.getElementById("digital-twin-form");
  var input = document.getElementById("digital-twin-input");
  var log = document.getElementById("digital-twin-log");
  if (!form || !input || !log) return;

  var history = [];
  var maxHistoryMessages = 20;
  var cooldownMs = 3000;
  var lastSentAt = 0;
  var isStreaming = false;

  function appendMessage(role, text) {
    var row = document.createElement("div");
    row.className = "digital-twin-line digital-twin-line--" + role;

    var prompt = document.createElement("span");
    prompt.className = "digital-twin-line-prompt";
    prompt.textContent = role === "assistant" ? "twin>" : "you>";

    var content = document.createElement("span");
    content.className = "digital-twin-line-content";
    content.textContent = text;

    row.appendChild(prompt);
    row.appendChild(content);
    log.appendChild(row);
    log.scrollTop = log.scrollHeight;
    return content;
  }

  function appendSeparator() {
    var sep = document.createElement("div");
    sep.className = "digital-twin-separator";
    sep.setAttribute("aria-hidden", "true");
    log.appendChild(sep);
    log.scrollTop = log.scrollHeight;
  }

  function appendError(text) {
    var row = document.createElement("p");
    row.className = "digital-twin-error";
    row.textContent = text;
    log.appendChild(row);
    log.scrollTop = log.scrollHeight;
  }

  function setFormDisabled(disabled) {
    input.disabled = disabled;
    form.querySelector("button").disabled = disabled;
  }

  function normalizedHistory() {
    return history.slice(-maxHistoryMessages);
  }

  function appendLoadingState() {
    var row = document.createElement("div");
    row.className = "digital-twin-line digital-twin-line--assistant digital-twin-line--loading";

    var prompt = document.createElement("span");
    prompt.className = "digital-twin-line-prompt";
    prompt.textContent = "twin>";

    var content = document.createElement("span");
    content.className = "digital-twin-line-content digital-twin-loading-content";

    var spinner = document.createElement("span");
    spinner.className = "digital-twin-loading-spinner";
    spinner.setAttribute("aria-hidden", "true");
    spinner.textContent = "[~]";

    var label = document.createElement("span");
    label.className = "digital-twin-loading-label";
    label.textContent = "compiling answer";

    var dots = document.createElement("span");
    dots.className = "digital-twin-loading-dots";
    dots.setAttribute("aria-hidden", "true");

    var srText = document.createElement("span");
    srText.className = "sr-only";
    srText.textContent = "Assistant is loading a response";

    content.appendChild(spinner);
    content.appendChild(label);
    content.appendChild(dots);
    content.appendChild(srText);
    row.appendChild(prompt);
    row.appendChild(content);
    log.appendChild(row);
    log.scrollTop = log.scrollHeight;
    return row;
  }

  async function streamAssistantResponse(messages, loadingRow) {
    var response = await fetch("/.netlify/functions/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages: messages })
    });

    if (!response.ok || !response.body) {
      var txt = await response.text();
      throw new Error(txt || "Chat request failed.");
    }

    var reader = response.body.getReader();
    var decoder = new TextDecoder();
    var assistantText = "";
    var assistantNode = null;
    var assistantNodeReady = false;

    function ensureAssistantNode() {
      if (assistantNodeReady) return;
      if (loadingRow) {
        loadingRow.classList.remove("digital-twin-line--loading");
        assistantNode = loadingRow.querySelector(".digital-twin-line-content");
        assistantNode.classList.remove("digital-twin-loading-content");
        assistantNode.textContent = "";
      } else {
        assistantNode = appendMessage("assistant", "");
      }
      assistantNodeReady = true;
    }

    while (true) {
      var chunkResult = await reader.read();
      if (chunkResult.done) break;
      ensureAssistantNode();
      assistantText += decoder.decode(chunkResult.value, { stream: true });
      assistantNode.textContent = assistantText;
      log.scrollTop = log.scrollHeight;
    }

    assistantText += decoder.decode();
    ensureAssistantNode();
    assistantNode.textContent = assistantText;

    return assistantText;
  }

  var suggestions = document.getElementById("digital-twin-suggestions");
  if (suggestions) {
    suggestions.addEventListener("click", function (event) {
      var chip = event.target.closest(".digital-twin-chip");
      if (!chip) return;
      var question = chip.dataset.q;
      if (!question) return;
      input.value = question;
      form.dispatchEvent(new Event("submit", { bubbles: true, cancelable: true }));
    });
  }

  form.addEventListener("submit", async function (event) {
    event.preventDefault();
    if (isStreaming) return;

    var now = Date.now();
    if (now - lastSentAt < cooldownMs) {
      var secondsLeft = Math.ceil((cooldownMs - (now - lastSentAt)) / 1000);
      appendError("Cooldown active. Please wait " + secondsLeft + "s before sending again.");
      return;
    }

    var userText = input.value.trim();
    if (!userText) return;

    isStreaming = true;
    setFormDisabled(true);
    appendMessage("user", userText);
    input.value = "";

    history.push({ role: "user", content: userText });
    history = normalizedHistory();

    var loadingRow = null;

    try {
      lastSentAt = now;
      loadingRow = appendLoadingState();
      var assistantText = await streamAssistantResponse(history, loadingRow);
      history.push({ role: "assistant", content: assistantText });
      history = normalizedHistory();
      appendSeparator();
    } catch (error) {
      if (loadingRow && loadingRow.classList.contains("digital-twin-line--loading")) {
        loadingRow.remove();
      }
      appendError("Error: unable to reach digital twin right now. Please try again.");
      console.error(error);
    } finally {
      isStreaming = false;
      setFormDisabled(false);
      input.focus();
    }
  });
})();
