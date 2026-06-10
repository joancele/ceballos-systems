// Button client-side behavior: micro-interaction ripple effect
document.addEventListener('DOMContentLoaded', () => {
  const buttons = document.querySelectorAll('.btn');
  
  buttons.forEach(button => {
    button.addEventListener('click', function (e) {
      // Create ripple element
      const ripple = document.createElement('span');
      ripple.classList.add('btn-ripple');
      
      // Get position
      const rect = this.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      ripple.style.left = `${x}px`;
      ripple.style.top = `${y}px`;
      
      this.appendChild(ripple);
      
      // Remove ripple after animation completes
      setTimeout(() => {
        ripple.remove();
      }, 600);
    });
  });
});
