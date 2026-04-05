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

  async function streamAssistantResponse(messages) {
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
    var assistantNode = appendMessage("assistant", "");

    while (true) {
      var chunkResult = await reader.read();
      if (chunkResult.done) break;
      assistantText += decoder.decode(chunkResult.value, { stream: true });
      assistantNode.textContent = assistantText;
      log.scrollTop = log.scrollHeight;
    }

    return assistantText;
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

    try {
      lastSentAt = now;
      var assistantText = await streamAssistantResponse(history);
      history.push({ role: "assistant", content: assistantText });
      history = normalizedHistory();
    } catch (error) {
      appendError("Error: unable to reach digital twin right now. Please try again.");
      console.error(error);
    } finally {
      isStreaming = false;
      setFormDisabled(false);
      input.focus();
    }
  });
})();
