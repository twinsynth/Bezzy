// creative.js

const canvas = document.getElementById("curveEditor");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const radius = 8;
const touchRadius = 15;
let points = [];
let draggedPointIndex = null;

function getSafeRandom(min, max) {
  return Math.random() * (max - min) + min;
}

function isMobile() {
  return window.innerWidth <= 768;
}

function initPoints(count = 3) {
  const safeMargin = isMobile() ? 0.15 : 0.1;
  const safeWidth = canvas.width * (1 - 2 * safeMargin);
  const safeHeight = canvas.height * (1 - 2 * safeMargin);
  const xOffset = canvas.width * safeMargin;
  const yOffset = canvas.height * safeMargin;
  points = [];
  for (let i = 0; i < count; i++) {
    points.push({
      x: getSafeRandom(xOffset, xOffset + safeWidth),
      y: getSafeRandom(yOffset, yOffset + safeHeight),
    });
  }
}

function drawCurve() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.beginPath();
  ctx.moveTo(points[0].x, points[0].y);
  if (points.length >= 4) {
    ctx.bezierCurveTo(points[0].x, points[0].y, points[1].x, points[1].y, points[2].x, points[2].y);
  }
  for (let i = 3; i < points.length - 2; i += 3) {
    ctx.bezierCurveTo(points[i].x, points[i].y, points[i + 1].x, points[i + 1].y, points[i + 2].x, points[i + 2].y);
  }
  if (points.length % 3 !== 1) {
    const last = points.length - 1;
    ctx.lineTo(points[last].x, points[last].y);
  }
  ctx.strokeStyle = '#007BFF';
  ctx.lineWidth = 2;
  ctx.stroke();

  points.forEach((point) => {
    ctx.beginPath();
    ctx.arc(point.x, point.y, radius, 0, Math.PI * 2);
    ctx.fillStyle = 'lightgray';
    ctx.fill();
  });
}

function getPointerPosition(event) {
  return event.touches ? { x: event.touches[0].clientX, y: event.touches[0].clientY } : { x: event.clientX, y: event.clientY };
}

function startDrag(event) {
  const rect = canvas.getBoundingClientRect();
  const { x, y } = getPointerPosition(event);
  draggedPointIndex = points.findIndex((p) => Math.hypot(p.x - (x - rect.left), p.y - (y - rect.top)) < touchRadius);
}

function moveDrag(event) {
  if (draggedPointIndex !== null) {
    const rect = canvas.getBoundingClientRect();
    const { x, y } = getPointerPosition(event);
    points[draggedPointIndex] = { x: x - rect.left, y: y - rect.top };
    drawCurve();
  }
}

function stopDrag() {
  draggedPointIndex = null;
}

function createControlButtons() {
  const addBtn = document.createElement("button");
  addBtn.textContent = "+";
  addBtn.style.cssText = "position: fixed; top: 20px; left: 50%; transform: translateX(-60px); z-index: 1001; width: 40px; height: 40px; background: black; color: white; font-size: 24px;";
  document.body.appendChild(addBtn);

  const removeBtn = document.createElement("button");
  removeBtn.textContent = "-";
  removeBtn.style.cssText = "position: fixed; top: 20px; left: 50%; transform: translateX(20px); z-index: 1001; width: 40px; height: 40px; background: black; color: white; font-size: 24px;";
  document.body.appendChild(removeBtn);

  addBtn.onclick = () => {
    if (points.length < 30) {
      const midIndex = Math.floor(points.length / 2);
      const midPoint = {
        x: (points[midIndex].x + points[midIndex + 1].x) / 2,
        y: (points[midIndex].y + points[midIndex + 1].y) / 2,
      };
      points.splice(midIndex + 1, 0, midPoint);
      drawCurve();
    }
  };

  removeBtn.onclick = () => {
    if (points.length > 3) {
      const midIndex = Math.floor(points.length / 2);
      points.splice(midIndex, 1);
      drawCurve();
    }
  };
}

const menuButton = document.createElement("button");
menuButton.id = "menuButton";
menuButton.innerHTML = `<img src="../assets/Menu.svg" alt="Menu">`;
menuButton.style.position = "fixed";
menuButton.style.top = "20px";
menuButton.style.right = "20px";
menuButton.style.zIndex = "1001";
menuButton.onclick = () => window.location.href = "../index.html";
document.body.appendChild(menuButton);

initPoints();
drawCurve();
createControlButtons();

canvas.addEventListener("mousedown", startDrag);
canvas.addEventListener("mousemove", moveDrag);
canvas.addEventListener("mouseup", stopDrag);
canvas.addEventListener("touchstart", startDrag, { passive: false });
canvas.addEventListener("touchmove", moveDrag, { passive: false });
canvas.addEventListener("touchend", stopDrag);
