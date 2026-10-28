/**
 * VELOLOG Signature Studio - Progressive Web App (PWA) Manager
 * Handles Service Worker registration, Install Prompts, and Standalone mode detection.
 */

let deferredInstallPrompt = null;

// Register Service Worker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then((reg) => {
        console.log('[PWA] Service Worker registered with scope:', reg.scope);
      })
      .catch((err) => {
        console.warn('[PWA] Service Worker registration failed:', err);
      });
  });
}

// Detect if running in standalone mode (installed app window)
function isRunningStandalone() {
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    window.navigator.standalone === true ||
    document.referrer.includes('android-app://')
  );
}

// Listen for browser install prompt
window.addEventListener('beforeinstallprompt', (e) => {
  // Prevent default mini-infobar on mobile Chrome
  e.preventDefault();
  deferredInstallPrompt = e;
  console.log('[PWA] beforeinstallprompt captured');
  updateInstallButtonVisibility(true);
});

// App installed handler
window.addEventListener('appinstalled', () => {
  console.log('[PWA] App successfully installed!');
  deferredInstallPrompt = null;
  updateInstallButtonVisibility(false);
  if (typeof showToast === 'function') {
    showToast('🎉 VELOLOG Signature Studio installed successfully!');
  }
});

// Update UI buttons based on installability
function updateInstallButtonVisibility(show) {
  if (isRunningStandalone()) {
    show = false;
  }
  const installButtons = document.querySelectorAll('.pwa-install-btn');
  installButtons.forEach((btn) => {
    btn.style.display = show ? 'inline-flex' : 'none';
  });
}

// Function to trigger installation
window.triggerPwaInstall = async function() {
  if (isRunningStandalone()) {
    if (typeof showToast === 'function') {
      showToast('You are already using the installed VELOLOG App!');
    }
    return;
  }

  // Native Chrome / Edge / Android install prompt
  if (deferredInstallPrompt) {
    deferredInstallPrompt.prompt();
    const { outcome } = await deferredInstallPrompt.userChoice;
    console.log('[PWA] User response to install prompt:', outcome);
    if (outcome === 'accepted') {
      deferredInstallPrompt = null;
      updateInstallButtonVisibility(false);
    }
    return;
  }

  // Check if iOS device
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
  if (isIOS) {
    showIosInstallModal();
    return;
  }

  // Fallback for browsers that already installed or don't support prompt
  if (typeof showToast === 'function') {
    showToast('To install: Open browser menu (⋮) and tap "Install app" or "Add to Home screen".');
  } else {
    alert('To install: Open browser menu and choose "Install App" or "Add to Home Screen".');
  }
};

// iOS install guide modal
function showIosInstallModal() {
  let modal = document.getElementById('pwa-ios-modal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'pwa-ios-modal';
    modal.className = 'modal-overlay';
    modal.innerHTML = `
      <div class="modal-card" style="max-width: 420px; text-align: center; padding: 24px;">
        <img src="/icons/icon-192.png" alt="App Icon" style="width: 72px; height: 72px; border-radius: 18px; margin: 0 auto 16px auto; display: block; box-shadow: 0 4px 14px rgba(13,71,161,0.25);">
        <h3 style="font-size: 18px; font-weight: 800; color: #0f172a; margin-bottom: 8px;">Install Signature Studio</h3>
        <p style="font-size: 13.5px; color: #475569; line-height: 1.5; margin-bottom: 18px;">
          Install this app on your iPhone or iPad for an authentic standalone experience without browser bars.
        </p>
        <div style="background: #f1f5f9; border-radius: 10px; padding: 14px; text-align: left; font-size: 13px; line-height: 1.6; color: #1e293b; margin-bottom: 20px;">
          <div style="margin-bottom: 8px; display: flex; align-items: center; gap: 10px;">
            <span style="background: #0d47a1; color: #fff; width: 22px; height: 22px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; font-size: 11px; font-weight: 700; flex-shrink: 0;">1</span>
            <span>Tap the <strong>Share</strong> button ( <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align: middle;"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><polyline points="16 6 12 2 8 6"/><line x1="12" y1="2" x2="12" y2="15"/></svg> ) at bottom of Safari.</span>
          </div>
          <div style="display: flex; align-items: center; gap: 10px;">
            <span style="background: #0d47a1; color: #fff; width: 22px; height: 22px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; font-size: 11px; font-weight: 700; flex-shrink: 0;">2</span>
            <span>Scroll down and select <strong>"Add to Home Screen"</strong> ( ⊞ ).</span>
          </div>
        </div>
        <button class="btn btn-primary" onclick="document.getElementById('pwa-ios-modal').classList.remove('show')" style="width: 100%; font-weight: 700;">Got It</button>
      </div>
    `;
    document.body.appendChild(modal);
  }
  modal.classList.add('show');
}

// Initial check on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  if (isRunningStandalone()) {
    document.body.classList.add('pwa-standalone');
    updateInstallButtonVisibility(false);
  } else {
    // Show buttons if already installable or on mobile
    const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
    if (isMobile) {
      updateInstallButtonVisibility(true);
    }
  }

  // Attach click listener to any .pwa-install-btn
  document.querySelectorAll('.pwa-install-btn').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      window.triggerPwaInstall();
    });
  });
});
