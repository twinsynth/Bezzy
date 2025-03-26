// Creative Mode Script

document.addEventListener('DOMContentLoaded', () => {
  const canvas = document.getElementById('curveEditor');
  const ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const radius = 8;
  const touchRadius = 15;
  let points = [];
  let draggedPointIndex = null;

  // Home Button
  const homeButton = document.createElement("button");
  homeButton.id = "homeButton";
  homeButton.innerHTML = `<img src="../assets/Home.svg" alt="Home">`;
  homeButton.onclick = () => window.location.href = "../index.html";
  document.body.appendChild(homeButton);

  // Menu Button (acts as restart)
  const menuButton = document.createElement("button");
  menuButton.id = "restartButton";
  menuButton.innerHTML = `<img src="../assets/Menu.svg" alt="Menu">`;
  menuButton.onclick = () => location.reload();
  document.body.appendChild(menuButton);

  // Add / Remove Buttons
  const controls = document.createElement("div");
  controls.style.position = "fixed";
  controls.style.top = "20px";
  controls.style.left = "50%";
  controls.style.transform = "translateX(-50%)";
  controls.style.display = "flex";
  controls.style.gap = "10px";
  document.body.appendChild(controls);

  const addBtn = document.createElement("button");
  addBtn.textContent = "+";
  addBtn.style.width = "40px";
  addBtn.style.height = "40px";
  addBtn.style.background = "black";
  addBtn.style.color = "white";
  addBtn.style.fontSize = "24px";
  addBtn.style.fontWeight = "bold";
  addBtn.onclick = () => {
    if (points.length < 30) {
      const last = points[points.length - 1];
      const secondLast = points[points.length - 2];
      const newPoint = {
        x: (last.x + secondLast.x) / 2 + Math.random() * 30 - 15,
        y: (last.y + secondLast.y) / 2 + Math.random() * 30 - 15
      };
      points.splice(points.length - 1, 0, newPoint);
      drawCurve();
    }
  };

  const removeBtn = document.createElement("button");
  removeBtn.textContent = "-";
  removeBtn.style.width = "40px";
  removeBtn.style.height = "40px";
  removeBtn.style.background = "black";
  removeBtn.style.color = "white";
  removeBtn.style.fontSize = "24px";
  removeBtn.style.fontWeight = "bold";
  removeBtn.onclick = () => {
    if (points.length > 3) {
      points.splice(points.length - 2, 1);
      drawCurve();
    }
  };

  controls.appendChild(removeBtn);
  controls.appendChild(addBtn);

  function getSafeRandom(min, max) {
    return Math.random() * (max - min) + min;
  }

  function randomizePoints(count) {
    points = [];
    const margin = 0.15;
    const safeWidth = canvas.width * (1 - 2 * margin);
    const safeHeight = canvas.height * (1 - 2 * margin);
    const xOffset = canvas.width * margin;
    const yOffset = canvas.height * margin;

    for (let i = 0; i < count; i++) {
      points.push({
        x: getSafeRandom(xOffset, xOffset + safeWidth),
        y: getSafeRandom(yOffset, yOffset + safeHeight)
      });
    }
  }

  function drawCurve() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Grey lines
    ctx.beginPath();
    ctx.strokeStyle = 'rgba(170, 170, 170, 1)';
    points.forEach((p, i) => {
      if (i > 0) {
        ctx.moveTo(points[i - 1].x, points[i - 1].y);
        ctx.lineTo(p.x, p.y);
      }
    });
    ctx.stroke();

    // Blue Bézier curve
    if (points.length >= 2) {
      ctx.beginPath();
      ctx.moveTo(points[0].x, points[0].y);
      for (let i = 1; i + 2 < points.length; i += 3) {
        ctx.bezierCurveTo(
          points[i].x, points[i].y,
          points[i + 1].x, points[i + 1].y,
          points[i + 2].x, points[i + 2].y
        );
      }
      // Line to remaining points if any
      const remainder = points.length % 3;
      if (remainder !== 1) {
        for (let j = points.length - remainder; j < points.length; j++) {
          ctx.lineTo(points[j].x, points[j].y);
        }
      }
      ctx.strokeStyle = '#007BFF';
      ctx.lineWidth = 2;
      ctx.stroke();
    }

    // Draw control points
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

  randomizePoints(3);
  drawCurve();

  canvas.addEventListener('mousedown', startDrag);
  canvas.addEventListener('mousemove', moveDrag);
  canvas.addEventListener('mouseup', stopDrag);
  canvas.addEventListener('touchstart', startDrag, { passive: false });
  canvas.addEventListener('touchmove', moveDrag, { passive: false });
  canvas.addEventListener('touchend', stopDrag);
});
