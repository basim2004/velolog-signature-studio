/**
 * VELOLOG Logistics Website & Email Signature Studio - Application Controller
 */

// State
let currentPage = 'home';
let currentEmployeeId = 'sudeer';
let currentDepartmentFilter = 'all';
let searchQuery = '';

// Navigation Elements
const navLinks = document.querySelectorAll('[data-nav]');
const pageViews = document.querySelectorAll('.page-view');

// Team Grid Elements
const teamGrid = document.getElementById('team-grid-container');
const teamDeptPills = document.querySelectorAll('#team-dept-pills .dept-pill');
const teamSearchInput = document.getElementById('team-search-input');
const btnBatchDownloadTeam = document.getElementById('btn-batch-download-team');

// Studio Form Elements
const fieldLayoutStyle = document.getElementById('field-layout-style');
const staffSelect = document.getElementById('field-staff-select');
const toggleRegards = document.getElementById('toggle-regards');
const fieldRegards = document.getElementById('field-regards');
const regardsInputContainer = document.getElementById('regards-input-container');
const fieldName = document.getElementById('field-name');
const fieldTitle = document.getElementById('field-title');
const fieldDept = document.getElementById('field-dept');
const fieldPhone = document.getElementById('field-phone');
const fieldEmail = document.getElementById('field-email');
const toggleCta = document.getElementById('toggle-cta');
const toggleSocial = document.getElementById('toggle-social');
const toggleTagline = document.getElementById('toggle-tagline');
const toggleBase64 = document.getElementById('toggle-base64');
const fieldCta1Text = document.getElementById('field-cta1-text');
const fieldCta2Text = document.getElementById('field-cta2-text');
const ctaInputsContainer = document.getElementById('cta-inputs-container');
const btnReset = document.getElementById('btn-reset-fields');
const btnBatchDownloadStudio = document.getElementById('btn-batch-download-studio');

// Studio Preview Elements
const signatureRenderArea = document.getElementById('signature-render-area');
const simulatorViewport = document.getElementById('simulator-viewport');
const mockFromVal = document.getElementById('mock-from-val');
const modeBtns = document.querySelectorAll('.mode-btn');

// Action Buttons
const btnCopySignature = document.getElementById('btn-copy-signature');
const btnDownloadHtml = document.getElementById('btn-download-html');
const btnViewSource = document.getElementById('btn-view-source');

// Modals & Toast
const sourceModal = document.getElementById('source-modal');
const modalCloseBtn = document.getElementById('modal-close-btn');
const rawCodeDisplay = document.getElementById('raw-code-display');
const btnCopyRawCode = document.getElementById('btn-copy-raw-code');

const refModal = document.getElementById('ref-modal');
const refModalTitle = document.getElementById('ref-modal-title');
const refModalImg = document.getElementById('ref-modal-img');
const refModalCloseBtn = document.getElementById('ref-modal-close-btn');

const toast = document.getElementById('toast-notification');
const toastMessage = document.getElementById('toast-message');

// Guide Tabs
const guideTabBtns = document.querySelectorAll('.guide-tab-btn');
const guideContents = document.querySelectorAll('.guide-content');

/**
 * Helper to get department style badge
 */
function getDeptClass(dept) {
  if (!dept) return 'ops';
  const lower = dept.toLowerCase();
  if (lower.includes('management') || lower.includes('general')) return 'mgmt';
  if (lower.includes('sales') || lower.includes('business')) return 'sales';
  if (lower.includes('account')) return 'acc';
  return 'ops';
}

/**
 * Get employee initials for avatar circle
 */
function getInitials(name) {
  if (!name) return 'VL';
  const parts = name.split(' ').filter(Boolean);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return parts[0].substring(0, 2).toUpperCase();
}

/**
 * Page Navigation Router
 */
function navigateTo(pageId) {
  currentPage = pageId;
  
  // Update view containers
  pageViews.forEach(view => {
    if (view.id === `view-${pageId}`) {
      view.classList.add('active');
    } else {
      view.classList.remove('active');
    }
  });

  // Update navbar active state
  document.querySelectorAll('.nav-link').forEach(link => {
    if (link.getAttribute('data-nav') === pageId) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });

  // Update URL hash without reload
  if (window.location.hash !== `#${pageId}`) {
    window.location.hash = pageId;
  }

  // Scroll to top
  window.scrollTo({ top: 0, behavior: 'smooth' });

  // If entering studio, ensure preview is fresh
  if (pageId === 'studio') {
    updateLivePreview();
  }
}

/**
 * Initialize application
 */
function init() {
  populateStaffDropdown();
  renderTeamGrid();
  selectEmployee('sudeer');
  setupEventListeners();

  // Handle URL hash on initial load
  const initialHash = window.location.hash.replace('#', '');
  if (initialHash && ['home', 'about', 'team', 'services', 'contact', 'studio'].includes(initialHash)) {
    navigateTo(initialHash);
  } else {
    navigateTo('home');
  }
}

/**
 * Populate Quick Staff dropdown in Studio
 */
function populateStaffDropdown() {
  staffSelect.innerHTML = '';
  VELOLOG_EMPLOYEES.forEach(emp => {
    const opt = document.createElement('option');
    opt.value = emp.id;
    opt.textContent = `${emp.name} — ${emp.title}`;
    staffSelect.appendChild(opt);
  });
}

/**
 * Render Team Grid Cards on "Our Team" Page
 */
function renderTeamGrid() {
  teamGrid.innerHTML = '';

  const filtered = VELOLOG_EMPLOYEES.filter(emp => {
    let matchesDept = true;
    if (currentDepartmentFilter !== 'all') {
      matchesDept = emp.department.toLowerCase().includes(currentDepartmentFilter.toLowerCase());
    }

    let matchesSearch = true;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      matchesSearch = (
        emp.name.toLowerCase().includes(q) ||
        emp.title.toLowerCase().includes(q) ||
        emp.email.toLowerCase().includes(q) ||
        emp.phone.toLowerCase().includes(q) ||
        emp.department.toLowerCase().includes(q)
      );
    }
    return matchesDept && matchesSearch;
  });

  if (filtered.length === 0) {
    teamGrid.innerHTML = `
      <div style="grid-column: 1 / -1; padding: 40px; text-align: center; color: var(--text-muted); background: #ffffff; border-radius: 8px; border: 1px dashed var(--border-card);">
        No team members found matching "${searchQuery}".
      </div>
    `;
    return;
  }

  filtered.forEach(emp => {
    const card = document.createElement('div');
    card.className = 'team-card';
    card.id = `team-card-${emp.id}`;

    const initials = getInitials(emp.name);
    const deptClass = getDeptClass(emp.department);

    card.innerHTML = `
      <div>
        <div class="team-card-top">
          <div class="team-avatar">${initials}</div>
          <div class="team-meta">
            <div class="team-name" title="${emp.name}">${emp.name}</div>
            <div class="team-role" title="${emp.title}">${emp.title}</div>
            <span class="dept-badge ${deptClass}">${emp.department}</span>
          </div>
        </div>

        <div class="team-contact-list">
          <div class="team-contact-item" title="${emp.email}">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#2056a5" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
            <span>${emp.email}</span>
          </div>
          <div class="team-contact-item" title="${emp.phone}">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#2056a5" stroke-width="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
            <span>${emp.phone}</span>
          </div>
        </div>
      </div>

      <div class="team-card-actions">
        <button class="team-gen-btn" data-emp-id="${emp.id}">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 20h9M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
          Generate Signature
        </button>
        <button class="team-ref-link" data-ref-img="${emp.detailsImage}" data-ref-name="${emp.name}">
          Reference
        </button>
      </div>
    `;

    // Click handler for Generate button
    const genBtn = card.querySelector('.team-gen-btn');
    genBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      selectEmployee(emp.id);
      navigateTo('studio');
      showToast(`Loaded ${emp.name} in Signature Studio`);
    });

    // Click handler for Reference link
    const refLink = card.querySelector('.team-ref-link');
    refLink.addEventListener('click', (e) => {
      e.stopPropagation();
      openReferenceModal(emp.name, emp.detailsImage);
    });

    teamGrid.appendChild(card);
  });
}

/**
 * Select an employee and update form inputs in Studio
 */
function selectEmployee(empId) {
  const emp = VELOLOG_EMPLOYEES.find(e => e.id === empId);
  if (!emp) return;

  currentEmployeeId = empId;
  staffSelect.value = empId;

  // Populate editor form inputs
  fieldName.value = emp.name;
  fieldTitle.value = emp.title;
  fieldDept.value = emp.department;
  fieldPhone.value = emp.phone;
  fieldEmail.value = emp.email;

  // Update mock email header
  mockFromVal.textContent = emp.email;

  // Render live signature
  updateLivePreview();
}

/**
 * Re-render signature in Studio
 */
function updateLivePreview() {
  const emp = VELOLOG_EMPLOYEES.find(e => e.id === currentEmployeeId) || VELOLOG_EMPLOYEES[0];

  const options = {
    name: fieldName.value,
    title: fieldTitle.value,
    department: fieldDept.value,
    phone: fieldPhone.value,
    email: fieldEmail.value,
    showCta: toggleCta.checked,
    showSocial: toggleSocial.checked,
    showTagline: toggleTagline.checked,
    useBase64: toggleBase64.checked,
    showRegards: toggleRegards ? toggleRegards.checked : true,
    regardsText: fieldRegards ? fieldRegards.value : 'Best regards,',
    layoutStyle: fieldLayoutStyle ? fieldLayoutStyle.value : 'reference-clean',
    cta1Text: fieldCta1Text.value,
    cta2Text: fieldCta2Text.value
  };

  const html = generateSignatureHtml(emp, options);
  signatureRenderArea.innerHTML = html;
  mockFromVal.textContent = fieldEmail.value || emp.email;
}

/**
 * Setup All Event Listeners
 */
function setupEventListeners() {
  // Navigation links
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const targetPage = link.getAttribute('data-nav');
      if (targetPage) {
        navigateTo(targetPage);
      }
    });
  });

  // Team department filters
  teamDeptPills.forEach(pill => {
    pill.addEventListener('click', () => {
      teamDeptPills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      currentDepartmentFilter = pill.getAttribute('data-dept');
      renderTeamGrid();
    });
  });

  // Team search
  teamSearchInput.addEventListener('input', (e) => {
    searchQuery = e.target.value.trim();
    renderTeamGrid();
  });

  // Quick staff select dropdown in Studio
  staffSelect.addEventListener('change', (e) => {
    selectEmployee(e.target.value);
  });

  // Layout style dropdown
  if (fieldLayoutStyle) {
    fieldLayoutStyle.addEventListener('change', updateLivePreview);
  }

  // Best regards greeting toggle & text
  if (toggleRegards) {
    toggleRegards.addEventListener('change', () => {
      if (regardsInputContainer) {
        regardsInputContainer.style.display = toggleRegards.checked ? 'flex' : 'none';
      }
      updateLivePreview();
    });
  }

  if (fieldRegards) {
    fieldRegards.addEventListener('input', updateLivePreview);
  }

  // Live input changes in Studio
  [fieldName, fieldTitle, fieldDept, fieldPhone, fieldEmail, fieldCta1Text, fieldCta2Text].forEach(input => {
    input.addEventListener('input', updateLivePreview);
  });

  // Toggles
  [toggleSocial, toggleTagline, toggleBase64].forEach(toggle => {
    toggle.addEventListener('change', updateLivePreview);
  });

  toggleCta.addEventListener('change', () => {
    ctaInputsContainer.style.display = toggleCta.checked ? 'flex' : 'none';
    updateLivePreview();
  });

  // Reset button
  btnReset.addEventListener('click', () => {
    selectEmployee(currentEmployeeId);
    showToast('Reset fields to original staff data');
  });

  // Simulator mode buttons
  modeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      modeBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const mode = btn.getAttribute('data-mode');
      simulatorViewport.className = 'simulator-viewport';

      if (mode === 'dark') {
        simulatorViewport.classList.add('mode-dark');
      } else if (mode === 'mobile') {
        simulatorViewport.classList.add('mode-mobile');
      } else if (mode === 'gmail') {
        simulatorViewport.classList.add('mode-gmail');
      } else if (mode === 'outlook') {
        simulatorViewport.classList.add('mode-outlook');
      }
    });
  });

  // Copy Signature button
  btnCopySignature.addEventListener('click', async () => {
    const rawHtml = signatureRenderArea.innerHTML;
    const res = await copySignatureToClipboard(signatureRenderArea, rawHtml);
    if (res.success) {
      showToast('Signature copied! Paste directly into Gmail or Outlook');
    } else {
      showToast('Copy failed. Please try "HTML Code" button instead.');
    }
  });

  // Download HTML button
  btnDownloadHtml.addEventListener('click', () => {
    const emp = VELOLOG_EMPLOYEES.find(e => e.id === currentEmployeeId) || VELOLOG_EMPLOYEES[0];
    const options = {
      name: fieldName.value,
      title: fieldTitle.value,
      department: fieldDept.value,
      phone: fieldPhone.value,
      email: fieldEmail.value,
      showCta: toggleCta.checked,
      showSocial: toggleSocial.checked,
      showTagline: toggleTagline.checked,
      useBase64: toggleBase64.checked,
      showRegards: toggleRegards ? toggleRegards.checked : true,
      regardsText: fieldRegards ? fieldRegards.value : 'Best regards,',
      layoutStyle: fieldLayoutStyle ? fieldLayoutStyle.value : 'reference-clean',
      cta1Text: fieldCta1Text.value,
      cta2Text: fieldCta2Text.value
    };
    downloadSignatureHtml(emp, options);
    showToast(`Downloaded signature for ${emp.name}`);
  });

  // Batch download for all 9 employees
  const handleBatchDownload = () => {
    let count = 0;
    VELOLOG_EMPLOYEES.forEach((emp, index) => {
      setTimeout(() => {
        downloadSignatureHtml(emp, { 
          useBase64: true,
          showRegards: true,
          regardsText: 'Best regards,',
          layoutStyle: fieldLayoutStyle ? fieldLayoutStyle.value : 'reference-clean'
        });
        count++;
        if (count === VELOLOG_EMPLOYEES.length) {
          showToast(`Generated & downloaded all 9 staff signatures!`);
        }
      }, index * 200);
    });
  };

  btnBatchDownloadTeam.addEventListener('click', handleBatchDownload);
  btnBatchDownloadStudio.addEventListener('click', handleBatchDownload);

  // View HTML Code Modal
  btnViewSource.addEventListener('click', () => {
    const emp = VELOLOG_EMPLOYEES.find(e => e.id === currentEmployeeId) || VELOLOG_EMPLOYEES[0];
    const options = {
      name: fieldName.value,
      title: fieldTitle.value,
      department: fieldDept.value,
      phone: fieldPhone.value,
      email: fieldEmail.value,
      showCta: toggleCta.checked,
      showSocial: toggleSocial.checked,
      showTagline: toggleTagline.checked,
      useBase64: toggleBase64.checked,
      showRegards: toggleRegards ? toggleRegards.checked : true,
      regardsText: fieldRegards ? fieldRegards.value : 'Best regards,',
      layoutStyle: fieldLayoutStyle ? fieldLayoutStyle.value : 'reference-clean',
      cta1Text: fieldCta1Text.value,
      cta2Text: fieldCta2Text.value
    };
    const html = generateSignatureHtml(emp, options);
    rawCodeDisplay.textContent = html;
    sourceModal.classList.add('show');
  });

  modalCloseBtn.addEventListener('click', () => {
    sourceModal.classList.remove('show');
  });
  sourceModal.addEventListener('click', (e) => {
    if (e.target === sourceModal) sourceModal.classList.remove('show');
  });

  // Copy raw HTML code
  btnCopyRawCode.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(rawCodeDisplay.textContent);
      showToast('Raw HTML code copied to clipboard!');
    } catch (err) {
      showToast('Failed to copy raw HTML code.');
    }
  });

  // Reference modal close
  refModalCloseBtn.addEventListener('click', () => {
    refModal.classList.remove('show');
  });
  refModal.addEventListener('click', (e) => {
    if (e.target === refModal) refModal.classList.remove('show');
  });

  // Guide Tabs
  guideTabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      guideTabBtns.forEach(b => b.classList.remove('active'));
      guideContents.forEach(c => c.classList.remove('active'));
      btn.classList.add('active');
      const targetGuide = btn.getAttribute('data-guide');
      const targetContent = document.getElementById(`guide-${targetGuide}`);
      if (targetContent) targetContent.classList.add('active');
    });
  });

  // Listen to hash change for browser back/forward buttons
  window.addEventListener('hashchange', () => {
    const hash = window.location.hash.replace('#', '');
    if (hash && ['home', 'about', 'team', 'services', 'contact', 'studio'].includes(hash)) {
      navigateTo(hash);
    }
  });
}

/**
 * Open Reference Image Modal
 */
function openReferenceModal(empName, imgPath) {
  refModalTitle.textContent = `Original Reference: ${empName}`;
  refModalImg.src = imgPath;
  refModal.classList.add('show');
}

/**
 * Toast Notification Trigger
 */
let toastTimeout;
function showToast(msg) {
  toastMessage.textContent = msg;
  toast.classList.add('show');
  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => {
    toast.classList.remove('show');
  }, 3500);
}

// Run on load
document.addEventListener('DOMContentLoaded', init);
