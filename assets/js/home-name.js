(function () {
  var heading = document.querySelector(".typing-name[data-typing-text]");

  if (!heading) {
    return;
  }

  var text = heading.getAttribute("data-typing-text") || heading.textContent;
  var prefersReducedMotion = window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  heading.setAttribute("aria-label", text);

  if (prefersReducedMotion) {
    heading.textContent = text;
    return;
  }

  var index = 0;
  var speed = 115;
  var bumpTimer;
  var caret = document.createElement("span");

  caret.className = "typing-caret";
  caret.setAttribute("aria-hidden", "true");

  function renderName(value, showCaret) {
    heading.textContent = "";
    heading.appendChild(document.createTextNode(value));

    if (showCaret) {
      heading.appendChild(caret);
    }
  }

  renderName("", true);
  heading.classList.add("is-typing");

  function typeNextCharacter() {
    renderName(text.slice(0, index + 1), true);
    window.clearTimeout(bumpTimer);
    heading.classList.remove("caret-bump");
    void heading.offsetWidth;
    heading.classList.add("caret-bump");
    bumpTimer = window.setTimeout(function () {
      heading.classList.remove("caret-bump");
    }, 190);
    index += 1;

    if (index < text.length) {
      window.setTimeout(typeNextCharacter, text.charAt(index - 1) === " " ? speed * 1.4 : speed);
      return;
    }

    window.setTimeout(function () {
      window.clearTimeout(bumpTimer);
      heading.classList.remove("caret-bump");
      heading.classList.remove("is-typing");
      heading.classList.add("is-finishing");

      window.setTimeout(function () {
        heading.classList.remove("is-finishing");
        renderName(text, false);
      }, 2700);
    }, 220);
  }

  window.setTimeout(typeNextCharacter, 220);
})();
