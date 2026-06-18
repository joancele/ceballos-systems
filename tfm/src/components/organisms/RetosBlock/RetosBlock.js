// RetosBlock client-side logic
document.addEventListener('DOMContentLoaded', () => {
  const retosBlock = document.getElementById('dev-block-retos');
  const retosOverlay = document.getElementById('retos-lock-overlay');
  
  const checkboxes = document.querySelectorAll('#dev-block-retos .step-checkbox');
  const progressText = document.getElementById('retos-progress-pct');
  const progressBar = document.getElementById('retos-progress-bar');
  
  const btn = document.getElementById('btn-certify-develop');
  const indicator = document.getElementById('dev-cert-indicator');
  const term = document.getElementById('terminal-develop');

  // Checkbox listeners
  checkboxes.forEach(cb => {
    cb.addEventListener('change', () => {
      const stepIndex = parseInt(cb.getAttribute('data-step') || '0', 10);
      if (window.updateToolboxState) {
        window.updateToolboxState((state) => {
          state.develop.steps[stepIndex] = cb.checked;
          
          // Calculate progress percentage
          const checkedCount = state.develop.steps.filter(Boolean).length;
          state.develop.progress = Math.round((checkedCount / state.develop.steps.length) * 100);
          state.develop.simPassed = true; // For develop role
        });
      }
    });
  });

  // Certification button listener
  if (btn) {
    btn.addEventListener('click', () => {
      const state = window.getToolboxState ? window.getToolboxState() : null;
      if (state && state.develop.steps.every(Boolean)) {
        if (window.updateToolboxState) {
          window.updateToolboxState((s) => {
            s.develop.cert = true;
          });
        }
        
        if (term) {
          term.innerHTML = `> Iniciando encriptado de firma digital...\n> Subiendo plan de vuelo a base de datos de Marte...\n> Sincronizando con Biodomo Central...\n> [OK] Certificado de Academia de Programación validado con éxito.`;
          term.style.color = 'var(--develop-accent)';
        }

        setTimeout(() => {
          alert(`¡Felicitaciones! Has completado y certificado la misión de la Academia de Programación.`);
        }, 500);
      }
    });
  }

  // Sync state function
  function syncRetosState(state) {
    if (!state || !state.develop) return;

    // Lock overlay
    if (state.develop.hardwareQuizPassed) {
      if (retosBlock) retosBlock.classList.remove('locked-section');
      if (retosOverlay) retosOverlay.classList.add('hidden');
    } else {
      if (retosBlock) retosBlock.classList.add('locked-section');
      if (retosOverlay) retosOverlay.classList.remove('hidden');
    }

    // Checkboxes
    checkboxes.forEach(cb => {
      const stepIndex = parseInt(cb.getAttribute('data-step') || '0', 10);
      if (stepIndex < state.develop.steps.length) {
        cb.checked = state.develop.steps[stepIndex];
      }
    });

    // Progress Bar
    const pct = state.develop.progress;
    if (progressText) progressText.textContent = `${pct}%`;
    if (progressBar) progressBar.style.width = `${pct}%`;

    // Certification eligibility
    const allStepsDone = state.develop.steps.every(Boolean);
    if (indicator) {
      if (state.develop.cert) {
        indicator.textContent = "CERTIFICADA";
        indicator.className = "cert-indicator mono text-success";
        if (btn) {
          btn.disabled = true;
          btn.textContent = "Certificación Completada ✓";
        }
        if (term) {
          term.innerHTML = `> Sincronizado con Biodomo Central...\n> [OK] Certificado de Academia de Programación validado con éxito.`;
          term.style.color = 'var(--develop-accent)';
        }
      } else if (allStepsDone) {
        indicator.textContent = "APTA (LISTA PARA FIRMA)";
        indicator.className = "cert-indicator mono text-success";
        if (btn) {
          btn.disabled = false;
          btn.textContent = "Firmar y Certificar Misión";
        }
      } else {
        indicator.textContent = "INCOMPLETA";
        indicator.className = "cert-indicator mono text-danger";
        if (btn) {
          btn.disabled = true;
          btn.textContent = "Firmar y Certificar Misión (Objetivos Pendientes)";
        }
      }
    }
  }

  // Listen to global state updates
  document.addEventListener('toolbox-state-changed', (e) => {
    syncRetosState(e.detail.state);
  });

  // Sync initially
  if (window.getToolboxState) {
    syncRetosState(window.getToolboxState());
  }
});
