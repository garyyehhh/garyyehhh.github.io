(function () {
  var canHover = window.matchMedia &&
    window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  var reduceMotion = window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (!canHover || reduceMotion) {
    return;
  }

  var root = document.documentElement;

  function setLight(event) {
    root.style.setProperty("--desk-x", event.clientX + "px");
    root.style.setProperty("--desk-y", event.clientY + "px");
    root.style.setProperty("--desk-light-opacity", "0.72");
  }

  function dimLight() {
    root.style.setProperty("--desk-light-opacity", "0");
  }

  window.addEventListener("pointermove", setLight, { passive: true });
  document.documentElement.addEventListener("pointerleave", dimLight);
})();
