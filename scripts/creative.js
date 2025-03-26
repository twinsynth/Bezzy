// creative.js

// DOM references
const canvas = document.getElementById('curveEditor');
const ctx = canvas.getContext('2d');
const restartButton = document.getElementById('menuButton');
const addPointButton = document.getElementById('addPoint');
const removePointButton = document.getElementById('removePoint');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const radius = 8;
const touchRadius = 15;
let draggedPointIndex = null;
let points = [];
const minPoints = 3;
const maxPoints = 30;

function getPointerPosition(event) {
  return event.touches
    ? { x: event.touches[0].clientX, y: event.touches[0].clientY }
    : { x: event.clientX, y: event.clientY };
}

function randomPoint() {
  return {
    x: Math.random() * canvas.width * 0.8 + canvas.width * 0.1,
    y: Math.random() * canvas.height * 0.8 + canvas.height * 0.1,
  };
}

function initPoints(count = 3) {
  points = [];
  for (let i = 0; i < count; i++) {
    points.push(randomPoint());
  }
  drawCurve();
}

function drawCurve() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.beginPath();
  ctx.strokeStyle = 'rgba(170, 170, 170, 0.4)';
  for (let i = 1; i < points.length; i++) {
    ctx.moveTo(points[i - 1].x, points[i - 1].y);
    ctx.lineTo(points[i].x, points[i].y);
  }
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(points[0].x, points[0].y);
  if (points.length >= 4) {
    ctx.bezierCurveTo(points[0].x, points[0].y, points[1].x, points[1].y, points[2].x, points[2].y);
  }
  for (let i = 3; i < points.length - 2; i += 3) {
    ctx.bezierCurveTo(points[i].x, points[i].y, points[i + 1].x, points[i + 1].y, points[i + 2].x, points[i + 2].y);
  }
  if (points.length % 3 !== 1) {
    ctx.lineTo(points[points.length - 1].x, points[points.length - 1].y);
  }
  ctx.strokeStyle = '#FFFFFF';
  ctx.lineWidth = 2;
  ctx.stroke();

  points.forEach((p) => {
    ctx.beginPath();
    ctx.arc(p.x, p.y, radius, 0, Math.PI * 2);
    ctx.fillStyle = 'lightgray';
    ctx.fill();
  });
}

function startDrag(event) {
  const rect = canvas.getBoundingClientRect();
  const { x, y } = getPointerPosition(event);
  draggedPointIndex = points.findIndex(
    (p) => Math.hypot(p.x - (x - rect.left), p.y - (y - rect.top)) < touchRadius
  );
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

function addPoint() {
  if (points.length >= maxPoints) return;
  const insertIndex = Math.floor(points.length / 2);
  points.splice(insertIndex, 0, randomPoint());
  drawCurve();
}

function removePoint() {
  if (points.length <= minPoints) return;
  const removeIndex = Math.floor(points.length / 2);
  points.splice(removeIndex, 1);
  drawCurve();
}

restartButton.onclick = () => window.location.href = '../index.html';
addPointButton.onclick = addPoint;
removePointButton.onclick = removePoint;

canvas.addEventListener('mousedown', startDrag);
canvas.addEventListener('mousemove', moveDrag);
canvas.addEventListener('mouseup', stopDrag);
canvas.addEventListener('touchstart', startDrag, { passive: false });
canvas.addEventListener('touchmove', moveDrag, { passive: false });
canvas.addEventListener('touchend', stopDrag);

initPoints();
