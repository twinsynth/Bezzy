export function animateScore(startScore, endScore, elementId, duration = 2000) {
  const element = document.getElementById(elementId);
  if (!element) return;

  let startTime = performance.now();

  function updateScore(currentTime) {
    const progress = Math.min((currentTime - startTime) / duration, 1);
    const current = Math.floor(startScore + (endScore - startScore) * progress);
    element.textContent = current;
    if (progress < 1) {
      requestAnimationFrame(updateScore);
    }
  }

  requestAnimationFrame(updateScore);
}
