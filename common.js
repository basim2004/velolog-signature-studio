/**
 * VELOLOG Corporate Portal - Shared Common Logic
 * Mobile menu toggles, active link highlighting, and toast alerts
 */

// Mobile Navigation Toggle
document.addEventListener('DOMContentLoaded', () => {
  const mobileToggle = document.getElementById('mobile-menu-toggle');
  const navMenu = document.getElementById('nav-menu-list');

  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => {
      navMenu.classList.toggle('show');
      mobileToggle.classList.toggle('active');
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (!navMenu.contains(e.target) && !mobileToggle.contains(e.target) && navMenu.classList.contains('show')) {
        navMenu.classList.remove('show');
        mobileToggle.classList.remove('active');
      }
    });
  }
});

// Toast Notification Helper
let toastTimeout;
function showToast(msg) {
  let toast = document.getElementById('toast-notification');
  let toastMessage = document.getElementById('toast-message');

  if (!toast) {
    toast = document.createElement('div');
    toast.className = 'toast';
    toast.id = 'toast-notification';
    toast.innerHTML = `
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#22c55e" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
      <span id="toast-message">${msg}</span>
    `;
    document.body.appendChild(toast);
    toastMessage = document.getElementById('toast-message');
  } else {
    toastMessage.textContent = msg;
  }

  toast.classList.add('show');
  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => {
    toast.classList.remove('show');
  }, 3500);
}
