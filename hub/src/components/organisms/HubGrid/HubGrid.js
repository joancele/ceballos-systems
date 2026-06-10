// HubGrid client-side behavior: potential grid loading animations
document.addEventListener('DOMContentLoaded', () => {
  const grid = document.querySelector('.hub-grid');
  if (grid) {
    // Reveal cards sequentially on load
    const cards = grid.querySelectorAll('.hub-card');
    cards.forEach((card, index) => {
      card.style.opacity = '0';
      card.style.transform = 'translateY(20px)';
      card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
      
      setTimeout(() => {
        card.style.opacity = '1';
        card.style.transform = 'translateY(0)';
      }, index * 100);
    });
  }
});
