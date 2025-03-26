// Creative Mode Script with Flexible Point Subdivision and Quadratic Curve Fallback

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
      points = points.filter((_, i) => i % 2 === 0);
      drawCurve();
    }
  };

  const addBtn = document.createElement("button");
  addBtn.textContent = "+";
  addBtn.style.width = "40px";
  addBtn.style.height = "40px";
  addBtn.style.background = "black";
  addBtn.style.color = "white";
  addBtn.style.fontSize = "24px";
  addBtn.style.fontWeight = "bold";
  addBtn.onclick = () => {
    if (points.length + 1 < 60) {
      const newPoints = [];
      for (let i = 0; i < points.length - 1; i++) {
        const p1 = points[i];
        const p2 = points[i + 1];
        const mid = {
          x: (p1.x + p2.x) / 2,
          y: (p1.y + p2.y) / 2
        };
        newPoints.push(p1);
        if (newPoints.length < 60) newPoints.push(mid);
      }
      newPoints.push(points[points.length - 1]);
      points = newPoints.slice(0, 60);
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

    // Blue Curve
    if (points.length === 3) {
      ctx.beginPath();
      ctx.moveTo(points[0].x, points[0].y);
      ctx.quadraticCurveTo(points[1].x, points[1].y, points[2].x, points[2].y);
      ctx.strokeStyle = '#007BFF';
      ctx.lineWidth = 2;
      ctx.stroke();
    } else if (points.length > 3) {
      ctx.beginPath();
      ctx.moveTo(points[0].x, points[0].y);
      for (let i = 1; i + 2 < points.length; i += 2) {
        const cp = points[i];
        const end = points[i + 1];
        ctx.quadraticCurveTo(cp.x, cp.y, end.x, end.y);
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
