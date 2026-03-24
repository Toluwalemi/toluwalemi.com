(function () {
  // --- Keyboard shortcut navigation ---
  document.addEventListener("keydown", function (e) {
    if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA" || e.target.isContentEditable) return;
    if (e.ctrlKey || e.metaKey || e.altKey) return;
    switch (e.key.toLowerCase()) {
      case "b": window.location.href = "/blog/"; break;
      case "r": window.location.href = "/reading/"; break;
      case "p": window.location.href = "/projects/"; break;
    }
  });

  // --- Last login banner ---
  var loginEl = document.querySelector(".last-login-text");
  if (loginEl) {
    var now = new Date();
    var days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    var pad = function (n) { return n < 10 ? "0" + n : n; };
    var timeStr = days[now.getDay()] + " " + months[now.getMonth()] + " " +
      pad(now.getDate()) + " " + pad(now.getHours()) + ":" +
      pad(now.getMinutes()) + ":" + pad(now.getSeconds());
    loginEl.textContent = "Last login: " + timeStr + " on ttys001";
  }

  // --- Konami code easter egg (matrix rain) ---
  var konamiSeq = ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"];
  var konamiPos = 0;

  document.addEventListener("keydown", function (e) {
    var expected = konamiSeq[konamiPos];
    if (e.key === expected || e.key.toLowerCase() === expected) {
      konamiPos++;
      if (konamiPos === konamiSeq.length) {
        konamiPos = 0;
        startMatrixRain();
      }
    } else {
      konamiPos = 0;
    }
  });

  function startMatrixRain() {
    var existing = document.getElementById("matrix-canvas");
    if (existing) existing.remove();

    var canvas = document.createElement("canvas");
    canvas.id = "matrix-canvas";
    canvas.style.cssText = "position:fixed;top:0;left:0;width:100%;height:100%;z-index:9999;pointer-events:none;opacity:0.88;";
    document.body.appendChild(canvas);

    var ctx = canvas.getContext("2d");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    var chars = "01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン";
    var fontSize = 14;
    var columns = Math.floor(canvas.width / fontSize);
    var drops = [];
    for (var i = 0; i < columns; i++) drops[i] = Math.floor(Math.random() * -50);

    function draw() {
      ctx.fillStyle = "rgba(0, 0, 0, 0.05)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "#0f0";
      ctx.font = fontSize + "px monospace";
      for (var i = 0; i < drops.length; i++) {
        var text = chars[Math.floor(Math.random() * chars.length)];
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);
        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }
    }

    var interval = setInterval(draw, 40);

    // Stop after 3 seconds
    setTimeout(function () {
      clearInterval(interval);
      canvas.style.transition = "opacity 1s";
      canvas.style.opacity = "0";
      setTimeout(function () { canvas.remove(); }, 1000);
    }, 6000);
  }
})();
