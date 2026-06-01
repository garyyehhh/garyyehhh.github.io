(function () {
  var sphere = document.querySelector("[data-learning-sphere]");

  if (!sphere) {
    return;
  }

  var reduceMotion = window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (reduceMotion) {
    return;
  }

  var list = sphere.querySelector("ul");
  var words = Array.prototype.slice.call(sphere.querySelectorAll("li"));

  if (!list || words.length === 0) {
    return;
  }

  var points = [];
  var rotationX = -0.18;
  var rotationY = 0.28;
  var velocityX = 0.0018;
  var velocityY = 0.0028;
  var targetVelocityX = velocityX;
  var targetVelocityY = velocityY;
  var isDragging = false;
  var lastX = 0;
  var lastY = 0;
  var radius = 140;

  function buildPoints() {
    var goldenAngle = Math.PI * (3 - Math.sqrt(5));

    points = words.map(function (_, index) {
      var y = 1 - (index / Math.max(words.length - 1, 1)) * 2;
      var sphereRadius = Math.sqrt(1 - y * y);
      var theta = goldenAngle * index;

      return {
        x: Math.cos(theta) * sphereRadius,
        y: y,
        z: Math.sin(theta) * sphereRadius
      };
    });
  }

  function sizeSphere() {
    var rect = list.getBoundingClientRect();
    radius = Math.max(96, Math.min(rect.width, rect.height) * 0.38);
  }

  function rotatePoint(point) {
    var cosX = Math.cos(rotationX);
    var sinX = Math.sin(rotationX);
    var cosY = Math.cos(rotationY);
    var sinY = Math.sin(rotationY);

    var y1 = point.y * cosX - point.z * sinX;
    var z1 = point.y * sinX + point.z * cosX;
    var x2 = point.x * cosY + z1 * sinY;
    var z2 = -point.x * sinY + z1 * cosY;

    return {
      x: x2,
      y: y1,
      z: z2
    };
  }

  function render() {
    points.forEach(function (point, index) {
      var rotated = rotatePoint(point);
      var depth = (rotated.z + 1) / 2;
      var scale = 0.76 + depth * 0.48;
      var alpha = 0.3 + depth * 0.68;

      words[index].style.setProperty("--sphere-x", (rotated.x * radius).toFixed(2) + "px");
      words[index].style.setProperty("--sphere-y", (rotated.y * radius).toFixed(2) + "px");
      words[index].style.setProperty("--sphere-scale", scale.toFixed(3));
      words[index].style.setProperty("--sphere-alpha", alpha.toFixed(3));
      words[index].style.zIndex = String(Math.round(depth * 100));
    });
  }

  function animate() {
    if (!isDragging) {
      targetVelocityX += (0.0018 - targetVelocityX) * 0.02;
      targetVelocityY += (0.0028 - targetVelocityY) * 0.02;
    }

    velocityX += (targetVelocityX - velocityX) * 0.12;
    velocityY += (targetVelocityY - velocityY) * 0.12;
    rotationX += velocityX;
    rotationY += velocityY;

    render();
    window.requestAnimationFrame(animate);
  }

  function startDrag(event) {
    isDragging = true;
    lastX = event.clientX;
    lastY = event.clientY;
    targetVelocityX = 0;
    targetVelocityY = 0;
    sphere.setPointerCapture(event.pointerId);
  }

  function drag(event) {
    if (!isDragging) {
      return;
    }

    var deltaX = event.clientX - lastX;
    var deltaY = event.clientY - lastY;

    rotationY += deltaX * 0.006;
    rotationX -= deltaY * 0.006;
    velocityY = deltaX * 0.00035;
    velocityX = -deltaY * 0.00035;
    targetVelocityY = velocityY;
    targetVelocityX = velocityX;
    lastX = event.clientX;
    lastY = event.clientY;
    render();
  }

  function endDrag(event) {
    if (!isDragging) {
      return;
    }

    isDragging = false;

    if (sphere.hasPointerCapture && sphere.hasPointerCapture(event.pointerId)) {
      sphere.releasePointerCapture(event.pointerId);
    }
  }

  buildPoints();
  sphere.classList.add("is-ready");
  sizeSphere();
  render();

  sphere.addEventListener("pointerdown", startDrag);
  sphere.addEventListener("pointermove", drag);
  sphere.addEventListener("pointerup", endDrag);
  sphere.addEventListener("pointercancel", endDrag);
  window.addEventListener("resize", function () {
    sizeSphere();
    render();
  });

  window.requestAnimationFrame(animate);
})();
