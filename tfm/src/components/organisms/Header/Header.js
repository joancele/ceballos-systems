// Header client-side behavior: add scrolled styles
document.addEventListener('DOMContentLoaded', () => {
  const header = document.querySelector('.main-header');
  
  if (header) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 50) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    });
  }
});
