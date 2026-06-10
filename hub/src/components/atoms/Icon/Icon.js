// Icon component client behavior: optional micro-animation effects on hover
document.addEventListener('DOMContentLoaded', () => {
  const iconWrappers = document.querySelectorAll('.icon-wrapper');
  
  iconWrappers.forEach(wrapper => {
    wrapper.addEventListener('mouseenter', () => {
      const svg = wrapper.querySelector('svg');
      if (svg) {
        svg.style.transform = 'scale(1.1)';
        svg.style.transition = 'transform 0.2s ease';
      }
    });
    
    wrapper.addEventListener('mouseleave', () => {
      const svg = wrapper.querySelector('svg');
      if (svg) {
        svg.style.transform = 'scale(1)';
      }
    });
  });
});
