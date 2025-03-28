import { animateScore } from './scoreAnimator.js';


document.addEventListener('DOMContentLoaded', () => {
   const canvas = document.getElementById('curveEditor');
   const ctx = canvas.getContext('2d');
   const startButton = document.getElementById('startButton');
   const restartButton = document.getElementById('restartButton');
   const stageDisplay = document.getElementById('stage');
   const scoreDisplay = document.getElementById('score');
   const straightnessDisplay = document.getElementById('straightness');
 
   const timerDisplay = document.createElement("div");
   timerDisplay.style.position = "fixed";
   timerDisplay.style.bottom = "10px";
   timerDisplay.style.left = "50%";
   timerDisplay.style.transform = "translateX(-50%)";
   timerDisplay.style.color = "white";
   timerDisplay.style.fontSize = "18px";
   timerDisplay.style.fontWeight = "bold";
   timerDisplay.style.zIndex = "1000";
   timerDisplay.textContent = "60";
   document.body.appendChild(timerDisplay);
 
 
 // Create Home Button
 const homeButton = document.createElement("button");
 homeButton.id = "homeButton";
 homeButton.innerHTML = `<img src="../assets/Home.svg" alt="Home">`;
 homeButton.onclick = () => window.location.href = "../index.html";
 document.body.appendChild(homeButton);
 
 // Apply ID for timer styling
 timerDisplay.id = "timerDisplay";
 
 
 
   
 
   const gameOverOverlay = document.createElement("div");
   gameOverOverlay.style.position = "fixed";
   gameOverOverlay.style.top = "0";
   gameOverOverlay.style.left = "0";
   gameOverOverlay.style.width = "100%";
   gameOverOverlay.style.height = "100%";
   gameOverOverlay.style.background = "rgba(0, 0, 0, 0.8)";
   gameOverOverlay.style.display = "none";
   gameOverOverlay.style.justifyContent = "center";
   gameOverOverlay.style.alignItems = "center";
   gameOverOverlay.style.flexDirection = "column";
   gameOverOverlay.style.color = "white";
   gameOverOverlay.style.fontSize = "32px";
   gameOverOverlay.style.fontWeight = "bold";
   gameOverOverlay.innerHTML = `
     <p>GAME OVER</p>
     <button id="overlayRestart">
       <img src="../assets/Restart.svg" alt="Restart">
     </button>
   `;
   document.body.appendChild(gameOverOverlay);
 
   const clearedOverlay = document.createElement("div");
   clearedOverlay.style.position = "fixed";
   clearedOverlay.style.top = "0";
   clearedOverlay.style.left = "0";
   clearedOverlay.style.width = "100%";
   clearedOverlay.style.height = "100%";
   clearedOverlay.style.background = "rgba(0, 128, 0, 0.8)";
   clearedOverlay.style.display = "none";
   clearedOverlay.style.justifyContent = "center";
   clearedOverlay.style.alignItems = "center";
   clearedOverlay.style.flexDirection = "column";
   clearedOverlay.style.color = "white";
   clearedOverlay.style.fontSize = "32px";
   clearedOverlay.style.fontWeight = "bold";

   
   clearedOverlay.innerHTML = `
   <div id="scoreCounter" style="font-size: 48px; font-weight: bold; margin-bottom: 20px;">0</div>
     <p>CLEARED!</p>
     <button id="nextLevelButton">
       <img src="../assets/Next.svg" alt="Next">
     </button>
   `;
   document.body.appendChild(clearedOverlay);
 
 document.getElementById("nextLevelButton").onclick = () => {
   clearedOverlay.style.display = "none";
   const timeBonus = 60 - timeLeft;
   score += 100 + timeBonus;
   stage++;
   timeLeft = 60;
   updateUI();
   randomizePoints(12);
   draggedPointIndex = null;
   startTimer();
   drawCurve();
 };
 
 
 
 
   canvas.style.width = "100vw";
   canvas.style.height = "100vh";
   canvas.width = canvas.offsetWidth;
   canvas.height = canvas.offsetHeight;
 
   const radius = 8;
   const touchRadius = 15;
   let points = [], stage = 1, score = 0, draggedPointIndex = null, timeLeft = 60, timer;
 
   function getSafeRandom(min, max) {
     return Math.random() * (max - min) + min;
   }
 
   function isMobile() {
     return window.innerWidth <= 768;
   }
 
   function randomizePoints(count) {
     points = [];
     const safeMargin = isMobile() ? 0.15 : 0.1;
     const safeWidth = canvas.width * (1 - 2 * safeMargin);
     const safeHeight = canvas.height * (1 - 2 * safeMargin);
     const xOffset = canvas.width * safeMargin;
     const yOffset = canvas.height * safeMargin;
 
     for (let i = 0; i < count; i++) {
       points.push({
         x: getSafeRandom(xOffset, xOffset + safeWidth),
         y: getSafeRandom(yOffset, yOffset + safeHeight),
       });
     }
   }
 
   function calculateStraightness() {
     if (points.length < 2) return 100;
     let totalDistance = 0;
     for (let i = 0; i < points.length - 1; i++) {
       const dx = points[i + 1].x - points[i].x;
       const dy = points[i + 1].y - points[i].y;
       totalDistance += Math.hypot(dx, dy);
     }
     const dx = points[points.length - 1].x - points[0].x;
     const dy = points[points.length - 1].y - points[0].y;
     const straightLineDistance = Math.hypot(dx, dy);
     const straightness = (straightLineDistance / totalDistance) * 100;
     return straightness >= 99 ? 100 : Math.round(straightness);
   }



   

   
   function drawCurve() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const maxOpacity = 1;
  const fadePerLevel = 0.02;
  const minOpacity = 0.02;
  const currentOpacity = Math.max(maxOpacity - ((stage - 1) * fadePerLevel), minOpacity);

  ctx.beginPath();
  ctx.strokeStyle = `rgba(170, 170, 170, ${currentOpacity})`;
  points.forEach((p, i) => {
    if (i > 0) {
      ctx.moveTo(points[i - 1].x, points[i - 1].y);
      ctx.lineTo(p.x, p.y);
    }
  });
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

  const straightness = calculateStraightness();
  straightnessDisplay.textContent = `${straightness}%`;

  if (straightness === 100 && clearedOverlay.style.display === "none") {
    clearInterval(timer);
    clearedOverlay.style.display = "flex";

    // SCORE ANIMATION
    const timeBonus = 60 - timeLeft;
    const finalScore = score + 100 + timeBonus;

    // Call the reusable score animation
    animateScore(score, finalScore, "scoreCounter", 1000, () => {
      score = finalScore;
      updateUI();
    });
  }
}





   
   function startTimer() {
     timeLeft = 60;
     timerDisplay.textContent = timeLeft;
     clearInterval(timer);
     timer = setInterval(() => {
       timeLeft--;
       timerDisplay.textContent = timeLeft;
       if (timeLeft <= 0) {
         clearInterval(timer);
         gameOver();
       }
     }, 1000);
   }
 
   function gameOver() {
     gameOverOverlay.style.display = "flex";
   }
 
   function updateUI() {
     stageDisplay.textContent = stage;
     scoreDisplay.textContent = score;
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
 
   function startGame() {
     gameOverOverlay.style.display = "none";
     clearedOverlay.style.display = "none";
     document.getElementById("startOverlay").style.display = "none";
     stage = 1;
     score = 0;
     timeLeft = 60;
     updateUI();
     randomizePoints(12);
     startTimer();
     drawCurve();
   }
 
   document.getElementById("nextLevelButton").onclick = () => {
     clearedOverlay.style.display = "none";
     const timeBonus = 60 - timeLeft;
     score += 100 + timeBonus;
     stage++;
     timeLeft = 60;
     updateUI();
     randomizePoints(12);
     draggedPointIndex = null;
     startTimer();
     drawCurve();
   };
 
   startButton.onclick = startGame;
   restartButton.onclick = startGame;
   document.getElementById("overlayRestart").onclick = startGame;
 
   canvas.addEventListener('mousedown', startDrag);
   canvas.addEventListener('mousemove', moveDrag);
   canvas.addEventListener('mouseup', stopDrag);
   canvas.addEventListener('touchstart', startDrag, { passive: false });
   canvas.addEventListener('touchmove', moveDrag, { passive: false });
   canvas.addEventListener('touchend', stopDrag);
 });
