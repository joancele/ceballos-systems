// HardwareBlock client-side logic
document.addEventListener('DOMContentLoaded', () => {
  const hwBlock = document.getElementById('dev-block-hardware');
  const hwOverlay = document.getElementById('hardware-lock-overlay');
  
  const hwTabBtns = document.querySelectorAll('.hw-tab-btn');
  const hwPanes = document.querySelectorAll('.hw-tab-pane');
  
  const submitHwQuiz = document.getElementById('submit-hardware-quiz');
  const hwQuizFeedback = document.getElementById('hardware-quiz-feedback');

  // Tab switching logic
  hwTabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      hwTabBtns.forEach(b => b.classList.remove('active-hw-tab'));
      btn.classList.add('active-hw-tab');

      const target = btn.getAttribute('data-hw');
      hwPanes.forEach(pane => {
        pane.classList.add('hidden');
        if (pane.id === `hw-pane-${target}`) {
          pane.classList.remove('hidden');
        }
      });
    });
  });

  // Quiz submission & validation logic
  function syncHardwareState(state) {
    if (!state || !state.develop) return;

    // Handle lock overlay based on software block completion
    if (state.develop.softwareQuizPassed) {
      if (hwBlock) hwBlock.classList.remove('locked-section');
      if (hwOverlay) hwOverlay.classList.add('hidden');
    } else {
      if (hwBlock) hwBlock.classList.add('locked-section');
      if (hwOverlay) hwOverlay.classList.remove('hidden');
    }

    // Handle quiz completion state
    if (state.develop.hardwareQuizPassed) {
      if (hwQuizFeedback) {
        hwQuizFeedback.textContent = "✅ ¡FELICIDADES! Entiendes perfectamente cómo conectar tus sensores y actuadores de forma segura. El bloque de Retos ha sido desbloqueado.";
        hwQuizFeedback.className = "quiz-feedback success mono";
        hwQuizFeedback.classList.remove('hidden');
      }
      // Check correct choices
      const correctRadio1 = document.querySelector('input[name="q-hw-1"][value="correct"]');
      const correctRadio2 = document.querySelector('input[name="q-hw-2"][value="correct"]');
      if (correctRadio1) correctRadio1.checked = true;
      if (correctRadio2) correctRadio2.checked = true;
    }
  }

  if (submitHwQuiz) {
    submitHwQuiz.addEventListener('click', () => {
      const q1 = document.querySelector('input[name="q-hw-1"]:checked');
      const q2 = document.querySelector('input[name="q-hw-2"]:checked');

      if (!q1 || !q2) {
        hwQuizFeedback.textContent = "❌ Por favor, responde a todas las preguntas antes de validar.";
        hwQuizFeedback.className = "quiz-feedback error mono";
        hwQuizFeedback.classList.remove('hidden');
        return;
      }

      if (q1.value === 'correct' && q2.value === 'correct') {
        if (window.updateToolboxState) {
          window.updateToolboxState((state) => {
            state.develop.hardwareQuizPassed = true;
          });
        }
      } else {
        hwQuizFeedback.textContent = "❌ Algunas respuestas son incorrectas. Consulta las pestañas de conexiones y vuelve a intentarlo.";
        hwQuizFeedback.className = "quiz-feedback error mono";
        hwQuizFeedback.classList.remove('hidden');
      }
    });
  }

  // Listen to global state updates
  document.addEventListener('toolbox-state-changed', (e) => {
    syncHardwareState(e.detail.state);
  });

  // Sync initially
  if (window.getToolboxState) {
    syncHardwareState(window.getToolboxState());
  }
});
