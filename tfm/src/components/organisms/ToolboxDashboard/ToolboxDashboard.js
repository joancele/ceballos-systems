// ToolboxDashboard client-side logic
document.addEventListener('DOMContentLoaded', () => {
  // Elements
  const hub = document.getElementById('specialty-hub');
  const consoleView = document.getElementById('workstation-console');
  const narrative = document.getElementById('narrative-briefing');
  
  const startBtns = document.querySelectorAll('.start-btn');
  const backToHubBtn = document.getElementById('back-to-hub');
  const tabBtns = document.querySelectorAll('.console-tab-btn');
  const panes = document.querySelectorAll('.workstation-pane');
  
  const checkboxes = document.querySelectorAll('.step-checkbox');
  const drawer = document.getElementById('glosario-drawer');
  const drawerTitle = document.getElementById('drawer-term-title');
  const drawerDesc = document.getElementById('drawer-term-desc');
  const closeDrawerBtn = document.getElementById('close-drawer-btn');

  // State structure
  const state = {
    design: { progress: 0, steps: [false, false, false], cert: false, simPassed: false },
    develop: { 
      progress: 0, 
      steps: [false, false, false, false], 
      cert: false, 
      simPassed: false,
      softwareQuizPassed: false,
      hardwareQuizPassed: false
    },
    build: { progress: 0, steps: [false, false, false], cert: false, simPassed: false }
  };

  // Expose global API for subcomponents
  window.getToolboxState = () => {
    return JSON.parse(JSON.stringify(state));
  };

  window.updateToolboxState = (updaterFn) => {
    updaterFn(state);
    saveState();
    
    // Update local Dashboard UI (Design & Build progress bars, checkboxes)
    updateDashboardUI();
    
    // Dispatch event to notify subcomponents
    document.dispatchEvent(new CustomEvent('toolbox-state-changed', { detail: { state } }));
  };

  // Load state from localStorage
  function loadState() {
    const saved = localStorage.getItem('tfm-academy-states');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        Object.keys(parsed).forEach(role => {
          if (state[role]) {
            state[role] = { ...state[role], ...parsed[role] };
          }
        });
      } catch (e) {
        console.error("Error al cargar localStorage", e);
      }
    }
    
    // Initial sync
    updateDashboardUI();
    document.dispatchEvent(new CustomEvent('toolbox-state-changed', { detail: { state } }));
  }

  function saveState() {
    localStorage.setItem('tfm-academy-states', JSON.stringify(state));
  }

  // Synchronize general dashboard UI
  function updateDashboardUI() {
    // Sync checkboxes for Design and Build (exclude develop checkboxes which are in RetosBlock)
    checkboxes.forEach(cb => {
      const role = cb.getAttribute('data-role');
      if (role !== 'develop') {
        const stepIndex = parseInt(cb.getAttribute('data-step') || '0', 10);
        if (state[role] && state[role].steps && stepIndex < state[role].steps.length) {
          cb.checked = state[role].steps[stepIndex];
        }
      }
    });

    // Update progress bars & certifications for Design, Develop, Build
    ['design', 'develop', 'build'].forEach(role => {
      const pct = state[role].progress;
      
      const hubProgressText = document.getElementById(`hub-progress-text-${role}`);
      const hubBar = document.getElementById(`hub-bar-${role}`);
      const hubBadge = document.getElementById(`hub-badge-${role}`);
      
      if (hubProgressText) hubProgressText.textContent = `${pct}%`;
      if (hubBar) hubBar.style.width = `${pct}%`;
      
      if (hubBadge) {
        if (role === 'design' || role === 'build') {
          hubBadge.textContent = "INACTIVO";
          hubBadge.className = "status-badge status-pending mono";
        } else if (state[role].cert) {
          hubBadge.textContent = "COMPLETADO";
          hubBadge.className = "status-badge status-completed mono";
        } else if (pct > 0) {
          hubBadge.textContent = "EN CURSO";
          hubBadge.className = "status-badge status-active mono";
        } else {
          hubBadge.textContent = "PENDIENTE";
          hubBadge.className = "status-badge status-pending mono";
        }
      }
      
      // Update Design & Build certification panels (since they are in the dashboard)
      if (role !== 'develop') {
        const btn = document.getElementById(`btn-certify-${role}`);
        const indicator = document.getElementById(`cert-indicator-${role}`);
        const allStepsDone = state[role].steps.every(Boolean);

        if (indicator) {
          if (state[role].cert) {
            indicator.textContent = "CERTIFICADA";
            indicator.className = "cert-indicator mono text-success";
            if (btn) {
              btn.disabled = true;
              btn.textContent = "Certificación Completada ✓";
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

      const tabBtn = document.getElementById(`tab-${role}`);
      if (tabBtn && state[role].cert) {
        tabBtn.style.borderColor = 'var(--text-success)';
      }
    });
  }

  // Checkbox updates for Design and Build
  checkboxes.forEach(cb => {
    const role = cb.getAttribute('data-role');
    if (role !== 'develop') {
      cb.addEventListener('change', () => {
        const stepIndex = parseInt(cb.getAttribute('data-step') || '0', 10);
        window.updateToolboxState((s) => {
          s[role].steps[stepIndex] = cb.checked;
          
          // Recalculate progress for design/build:
          // 75% for steps, 25% for simulation (passed by default for now)
          const checkedCount = s[role].steps.filter(Boolean).length;
          const stepPct = Math.round((checkedCount / s[role].steps.length) * 75);
          const simPct = s[role].simPassed ? 25 : 0;
          s[role].progress = stepPct + simPct;
        });
      });
    }
  });

  // Certification buttons for Design & Build
  ['design', 'build'].forEach(role => {
    const btn = document.getElementById(`btn-certify-${role}`);
    const term = document.getElementById(`terminal-${role}`);
    
    if (btn) {
      btn.addEventListener('click', () => {
        if (state[role].steps.every(Boolean)) {
          window.updateToolboxState((s) => {
            s[role].cert = true;
          });
          
          if (term) {
            term.innerHTML = `> Iniciando encriptado de firma digital...\n> Subiendo plan de vuelo a base de datos de Marte...\n> Sincronizando con Biodomo Central...\n> [OK] Certificado de Academia de ${role === 'design' ? 'Diseño' : 'Construcción'} validado con éxito.`;
            term.style.color = 'var(--develop-accent)';
          }
          
          setTimeout(() => {
            alert(`¡Felicitaciones! Has completado y certificado la misión de la Academia de ${role === 'design' ? 'Diseño' : 'Construcción'}.`);
          }, 500);
        }
      });
    }
  });

  // Switch workstation pane
  function openWorkstation(role) {
    hub.classList.add('hidden');
    narrative.classList.add('hidden');
    consoleView.classList.remove('hidden');
    
    panes.forEach(pane => pane.classList.add('hidden'));
    const activePane = document.getElementById(`pane-${role}`);
    if (activePane) activePane.classList.remove('hidden');
    
    tabBtns.forEach(btn => {
      btn.classList.remove('active-tab');
      if (btn.getAttribute('data-role') === role) {
        btn.classList.add('active-tab');
      }
    });

    consoleView.scrollIntoView({ behavior: 'smooth' });
  }

  function returnToHub() {
    consoleView.classList.add('hidden');
    hub.classList.remove('hidden');
    narrative.classList.remove('hidden');
  }

  // Navigation Listeners
  startBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const target = btn.getAttribute('data-target');
      if (target) openWorkstation(target);
    });
  });

  backToHubBtn.addEventListener('click', returnToHub);

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const role = btn.getAttribute('data-role');
      if (role) openWorkstation(role);
    });
  });

  // Listen for glosario drawer trigger
  document.addEventListener('open-glosario-drawer', (e) => {
    if (drawer && drawerTitle && drawerDesc) {
      drawerTitle.textContent = e.detail.title;
      drawerDesc.textContent = e.detail.desc;
      drawer.classList.remove('hidden');
    }
  });

  if (closeDrawerBtn && drawer) {
    closeDrawerBtn.addEventListener('click', () => {
      drawer.classList.add('hidden');
    });
  }

  // Initialize state
  loadState();
});
