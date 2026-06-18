// SoftwareBlock client-side logic
document.addEventListener('DOMContentLoaded', () => {
  const submitSwQuiz = document.getElementById('submit-software-quiz');
  const swQuizFeedback = document.getElementById('software-quiz-feedback');

  // SPA Stepper and Slideshow Logic
  let currentSwPage = 1;
  const tinkercadSlides = document.querySelectorAll('#deck-tinkercad .slide');
  const arduinoblocksSlides = document.querySelectorAll('#deck-arduinoblocks .slide');
  let tinkercadIndex = 0;
  let arduinoblocksIndex = 0;

  const swStepperBtns = document.querySelectorAll('.sw-stepper .step-btn');
  const swSpaPages = document.querySelectorAll('.sw-spa-container .sw-spa-page');

  function updateSwPageUI() {
    // Update Pages
    swSpaPages.forEach((page, idx) => {
      if (idx === currentSwPage - 1) {
        page.classList.remove('hidden');
      } else {
        page.classList.add('hidden');
      }
    });

    // Update Stepper
    swStepperBtns.forEach((btn, idx) => {
      if (idx === currentSwPage - 1) {
        btn.classList.add('active-step');
      } else {
        btn.classList.remove('active-step');
      }
    });
  }

  function showSwPage(pageNum) {
    currentSwPage = pageNum;
    updateSwPageUI();
  }

  swStepperBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const pageNum = parseInt(btn.getAttribute('data-step-page'), 10);
      showSwPage(pageNum);
    });
  });

  // Slideshow functions
  function updateSlidesUI(deckId, index, slides, prevBtn, nextBtn, dots) {
    slides.forEach((slide, idx) => {
      if (idx === index) {
        slide.classList.add('active-slide');
      } else {
        slide.classList.remove('active-slide');
      }
    });

    // Disable/enable prev
    if (prevBtn) {
      if (deckId === 'tinkercad' && index === 0) {
        prevBtn.disabled = true;
      } else {
        prevBtn.disabled = false;
      }
    }

    // Siguiente button text/action on last slide
    if (nextBtn) {
      if (deckId === 'tinkercad' && index === slides.length - 1) {
        nextBtn.textContent = 'Siguiente Bloque →';
      } else if (deckId === 'arduinoblocks' && index === slides.length - 1) {
        nextBtn.textContent = 'Ir a la Miniprueba →';
      } else {
        nextBtn.textContent = 'Siguiente →';
      }
    }

    // Update dots
    if (dots) {
      dots.forEach((dot, idx) => {
        if (idx === index) {
          dot.classList.add('active-dot');
        } else {
          dot.classList.remove('active-dot');
        }
      });
    }
  }

  function handleNext(deckId) {
    if (deckId === 'tinkercad') {
      if (tinkercadIndex < tinkercadSlides.length - 1) {
        tinkercadIndex++;
        updateTinkercadSlides();
      } else {
        showSwPage(2);
      }
    } else if (deckId === 'arduinoblocks') {
      if (arduinoblocksIndex < arduinoblocksSlides.length - 1) {
        arduinoblocksIndex++;
        updateArduinoblocksSlides();
      } else {
        showSwPage(3);
      }
    }
  }

  function handlePrev(deckId) {
    if (deckId === 'tinkercad') {
      if (tinkercadIndex > 0) {
        tinkercadIndex--;
        updateTinkercadSlides();
      }
    } else if (deckId === 'arduinoblocks') {
      if (arduinoblocksIndex > 0) {
        arduinoblocksIndex--;
        updateArduinoblocksSlides();
      } else {
        tinkercadIndex = tinkercadSlides.length - 1;
        updateTinkercadSlides();
        showSwPage(1);
      }
    }
  }

  const tkPrev = document.querySelector('.prev-slide[data-deck="tinkercad"]');
  const tkNext = document.querySelector('.next-slide[data-deck="tinkercad"]');
  const tkDots = document.querySelectorAll('.slide-dots[data-deck="tinkercad"] .slide-dot');

  const abPrev = document.querySelector('.prev-slide[data-deck="arduinoblocks"]');
  const abNext = document.querySelector('.next-slide[data-deck="arduinoblocks"]');
  const abDots = document.querySelectorAll('.slide-dots[data-deck="arduinoblocks"] .slide-dot');

  function updateTinkercadSlides() {
    updateSlidesUI('tinkercad', tinkercadIndex, tinkercadSlides, tkPrev, tkNext, tkDots);
  }

  function updateArduinoblocksSlides() {
    updateSlidesUI('arduinoblocks', arduinoblocksIndex, arduinoblocksSlides, abPrev, abNext, abDots);
  }

  if (tkPrev) tkPrev.addEventListener('click', () => handlePrev('tinkercad'));
  if (tkNext) tkNext.addEventListener('click', () => handleNext('tinkercad'));
  tkDots.forEach(dot => {
    dot.addEventListener('click', () => {
      tinkercadIndex = parseInt(dot.getAttribute('data-slide-index'), 10);
      updateTinkercadSlides();
    });
  });

  if (abPrev) abPrev.addEventListener('click', () => handlePrev('arduinoblocks'));
  if (abNext) abNext.addEventListener('click', () => handleNext('arduinoblocks'));
  abDots.forEach(dot => {
    dot.addEventListener('click', () => {
      arduinoblocksIndex = parseInt(dot.getAttribute('data-slide-index'), 10);
      updateArduinoblocksSlides();
    });
  });

  // Tinkercad interactive infographic panels logic
  const panelCards = document.querySelectorAll('.panel-card');
  panelCards.forEach(card => {
    const activate = () => {
      const parent = card.parentElement;
      if (parent) {
        parent.querySelectorAll('.panel-card').forEach(c => {
          c.classList.remove('active-panel');
        });
      }
      card.classList.add('active-panel');
    };
    card.addEventListener('click', activate);
    card.addEventListener('mouseenter', activate);
  });

  // Initialize slides
  updateTinkercadSlides();
  updateArduinoblocksSlides();

  // Quiz submission & validation logic
  function syncQuizState(state) {
    if (state && state.develop && state.develop.softwareQuizPassed) {
      if (swQuizFeedback) {
        swQuizFeedback.textContent = "✅ ¡EXCELENTE! Has comprendido el uso del simulador y el entorno de bloques. El bloque de Hardware ha sido desbloqueado.";
        swQuizFeedback.className = "quiz-feedback success mono";
        swQuizFeedback.classList.remove('hidden');
      }
      // Check correct choices
      const correctRadio1 = document.querySelector('input[name="q-sw-1"][value="correct"]');
      const correctRadio2 = document.querySelector('input[name="q-sw-2"][value="correct"]');
      const correctRadio3 = document.querySelector('input[name="q-sw-3"][value="correct"]');
      const correctRadio4 = document.querySelector('input[name="q-sw-4"][value="correct"]');
      if (correctRadio1) correctRadio1.checked = true;
      if (correctRadio2) correctRadio2.checked = true;
      if (correctRadio3) correctRadio3.checked = true;
      if (correctRadio4) correctRadio4.checked = true;
    }
  }

  if (submitSwQuiz) {
    submitSwQuiz.addEventListener('click', () => {
      const q1 = document.querySelector('input[name="q-sw-1"]:checked');
      const q2 = document.querySelector('input[name="q-sw-2"]:checked');
      const q3 = document.querySelector('input[name="q-sw-3"]:checked');
      const q4 = document.querySelector('input[name="q-sw-4"]:checked');

      if (!q1 || !q2 || !q3 || !q4) {
        swQuizFeedback.textContent = "❌ Por favor, responde a todas las preguntas antes de validar.";
        swQuizFeedback.className = "quiz-feedback error mono";
        swQuizFeedback.classList.remove('hidden');
        return;
      }

      if (q1.value === 'correct' && q2.value === 'correct' && q3.value === 'correct' && q4.value === 'correct') {
        if (window.updateToolboxState) {
          window.updateToolboxState((state) => {
            state.develop.softwareQuizPassed = true;
          });
        }
      } else {
        swQuizFeedback.textContent = "❌ Algunas respuestas son incorrectas. Revisa las guías rápidas y vuelve a intentarlo.";
        swQuizFeedback.className = "quiz-feedback error mono";
        swQuizFeedback.classList.remove('hidden');
      }
    });
  }

  // Listen to global state updates
  document.addEventListener('toolbox-state-changed', (e) => {
    syncQuizState(e.detail.state);
  });

  // Sync initially
  if (window.getToolboxState) {
    syncQuizState(window.getToolboxState());
  }
});
