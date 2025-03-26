export function animateScore(from, to, elementId, duration = 1000) {
  const scoreElement = document.getElementById(elementId);
  if (!scoreElement) {
    console.warn(`Element with ID "${elementId}" not found.`);
    return;
  }

  const startTime = performance.now();

  function update(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const value = Math.floor(from + (to - from) * progress);
    scoreElement.textContent = value;

    if (progress < 1) {
      requestAnimationFrame(update);
    }
  }

  requestAnimationFrame(update);
}
