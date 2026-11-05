const fs = require('fs');
const path = require('path');
const { generateCleanHtmlDocument, generateSignatureHtml } = require('./generator.js');
const { VELOLOG_EMPLOYEES, VELOLOG_BRANCHES } = require('./data.js');

const signaturesDir = path.join(__dirname, 'signatures');
const saudiDir = path.join(signaturesDir, 'saudi');
const dubaiDir = path.join(signaturesDir, 'dubai');

[signaturesDir, saudiDir, dubaiDir].forEach(dir => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
});

function getFileName(emp) {
  return emp.name.toLowerCase().replace(/[^a-z0-9]/g, '_').replace(/_+/g, '_').replace(/^_|_$/g, '') + '.html';
}

const saudiEmployees = VELOLOG_EMPLOYEES.filter(e => (e.branch || 'saudi') === 'saudi');
const dubaiEmployees = VELOLOG_EMPLOYEES.filter(e => e.branch === 'dubai');

console.log(`Generating ${saudiEmployees.length} Saudi signatures...`);
saudiEmployees.forEach(emp => {
  const doc = generateCleanHtmlDocument(emp, { branch: 'saudi' });
  const filename = getFileName(emp);
  fs.writeFileSync(path.join(saudiDir, filename), doc, 'utf8');
});

console.log(`Generating ${dubaiEmployees.length} Dubai signatures...`);
dubaiEmployees.forEach(emp => {
  const doc = generateCleanHtmlDocument(emp, { branch: 'dubai' });
  const filename = getFileName(emp);
  fs.writeFileSync(path.join(dubaiDir, filename), doc, 'utf8');
});

// Build Saudi Gallery index.html
function buildGalleryHtml(branchKey, branchInfo, employees) {
  const cardsHtml = employees.map(emp => {
    const rawSig = generateSignatureHtml(emp, { branch: branchKey, useBase64: true });
    const filename = getFileName(emp);
    return `
    <div class="sig-card">
      <div class="sig-card-header">
        <div>
          <h3 class="sig-name">${emp.name}</h3>
          <p class="sig-role">${emp.title} • <span class="sig-dept">${emp.department}</span></p>
          <p class="sig-contact">📞 ${emp.phone || 'N/A'} | ✉️ ${emp.email}</p>
        </div>
        <div class="sig-actions">
          <a href="${filename}" download="${filename}" class="btn-action btn-dl">📥 Download HTML</a>
          <a href="${filename}" target="_blank" class="btn-action btn-open">🔗 Open Single</a>
        </div>
      </div>
      <div class="sig-preview-frame">
        ${rawSig}
      </div>
    </div>`;
  }).join('\n');

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${branchInfo.name} - Official Email Signatures | VELOLOG</title>
  <style>
    :root {
      --primary: #2154a3;
      --primary-dark: #102f67;
      --bg: #f8fafc;
      --card: #ffffff;
      --border: #e2e8f0;
    }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif;
      background: var(--bg);
      color: #1e293b;
      padding: 30px 20px;
    }
    .header-box {
      max-width: 900px;
      margin: 0 auto 30px auto;
      background: #ffffff;
      border: 1px solid var(--border);
      border-radius: 12px;
      padding: 24px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.05);
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 16px;
    }
    .badge {
      display: inline-block;
      padding: 4px 10px;
      font-size: 12px;
      font-weight: 700;
      border-radius: 6px;
      background: #e0f2fe;
      color: #0369a1;
      margin-bottom: 6px;
    }
    .title {
      font-size: 22px;
      font-weight: 800;
      color: var(--primary-dark);
    }
    .sub {
      font-size: 13px;
      color: #64748b;
      margin-top: 4px;
    }
    .top-links {
      display: flex;
      gap: 10px;
    }
    .top-link {
      padding: 8px 14px;
      border-radius: 6px;
      text-decoration: none;
      font-size: 13px;
      font-weight: 600;
      border: 1px solid var(--border);
      background: #ffffff;
      color: var(--primary);
    }
    .top-link:hover {
      background: var(--primary);
      color: #ffffff;
    }
    .container {
      max-width: 900px;
      margin: 0 auto;
      display: flex;
      flex-direction: column;
      gap: 24px;
    }
    .sig-card {
      background: #ffffff;
      border: 1px solid var(--border);
      border-radius: 10px;
      padding: 20px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.04);
    }
    .sig-card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 1px solid #f1f5f9;
      padding-bottom: 12px;
      margin-bottom: 16px;
      flex-wrap: wrap;
      gap: 12px;
    }
    .sig-name {
      font-size: 16px;
      font-weight: 700;
      color: var(--primary-dark);
    }
    .sig-role {
      font-size: 12.5px;
      color: #475569;
      margin-top: 2px;
    }
    .sig-contact {
      font-size: 11.5px;
      color: #64748b;
      margin-top: 2px;
    }
    .sig-actions {
      display: flex;
      gap: 8px;
    }
    .btn-action {
      padding: 6px 12px;
      border-radius: 6px;
      font-size: 12px;
      font-weight: 600;
      text-decoration: none;
      display: inline-flex;
      align-items: center;
      gap: 4px;
    }
    .btn-dl {
      background: #2154a3;
      color: #ffffff;
    }
    .btn-dl:hover {
      background: #102f67;
    }
    .btn-open {
      background: #f1f5f9;
      color: #334155;
      border: 1px solid #cbd5e1;
    }
    .btn-open:hover {
      background: #e2e8f0;
    }
    .sig-preview-frame {
      overflow-x: auto;
      padding: 12px;
      background: #ffffff;
      border: 1px dashed #cbd5e1;
      border-radius: 6px;
    }
  </style>
</head>
<body>
  <div class="header-box">
    <div>
      <span class="badge">${branchInfo.badge}</span>
      <h1 class="title">${branchInfo.name}</h1>
      <p class="sub">${branchInfo.fullAddress} ${branchInfo.regNo ? '• ' + branchInfo.regNo : ''} • Website: <a href="${branchInfo.websiteUrl}" target="_blank" style="color: #2154a3; font-weight: 600;">${branchInfo.website}</a></p>
    </div>
    <div class="top-links">
      <a href="../" class="top-link">📁 All Branches</a>
      <a href="/signature-studio" class="top-link">⚡ Signature Studio</a>
    </div>
  </div>

  <div class="container">
    ${cardsHtml}
  </div>
</body>
</html>`;
}

fs.writeFileSync(path.join(saudiDir, 'index.html'), buildGalleryHtml('saudi', VELOLOG_BRANCHES.saudi, saudiEmployees), 'utf8');
fs.writeFileSync(path.join(dubaiDir, 'index.html'), buildGalleryHtml('dubai', VELOLOG_BRANCHES.dubai, dubaiEmployees), 'utf8');

// Build Main Portal signatures/index.html
const mainIndexHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>VELOLOG Official Signatures Directory - Branch Folders</title>
  <style>
    :root {
      --primary: #2154a3;
      --primary-dark: #102f67;
      --bg: #f8fafc;
    }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif;
      background: var(--bg);
      color: #1e293b;
      padding: 40px 20px;
    }
    .wrapper {
      max-width: 840px;
      margin: 0 auto;
    }
    .header {
      text-align: center;
      margin-bottom: 36px;
    }
    .badge {
      display: inline-block;
      padding: 4px 12px;
      font-size: 12px;
      font-weight: 700;
      border-radius: 50px;
      background: #e0f2fe;
      color: #0369a1;
      margin-bottom: 10px;
    }
    h1 {
      font-size: 28px;
      font-weight: 800;
      color: var(--primary-dark);
      margin-bottom: 8px;
    }
    p {
      color: #64748b;
      font-size: 14px;
    }
    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
      gap: 20px;
      margin-bottom: 30px;
    }
    .branch-card {
      background: #ffffff;
      border: 1px solid #e2e8f0;
      border-radius: 12px;
      padding: 24px;
      box-shadow: 0 4px 14px rgba(0,0,0,0.05);
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      transition: transform 0.2s, box-shadow 0.2s;
    }
    .branch-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 20px rgba(33,84,163,0.1);
      border-color: #93c5fd;
    }
    .branch-top {
      margin-bottom: 16px;
    }
    .branch-flag {
      font-size: 32px;
      margin-bottom: 8px;
    }
    .branch-title {
      font-size: 19px;
      font-weight: 700;
      color: var(--primary-dark);
    }
    .branch-meta {
      font-size: 12.5px;
      color: #64748b;
      margin-top: 6px;
      line-height: 1.5;
    }
    .staff-count {
      display: inline-block;
      margin-top: 10px;
      font-size: 12px;
      font-weight: 700;
      color: #2154a3;
      background: #eff6ff;
      padding: 3px 8px;
      border-radius: 4px;
    }
    .branch-actions {
      display: flex;
      gap: 8px;
      margin-top: 18px;
    }
    .btn {
      flex: 1;
      padding: 10px 14px;
      border-radius: 6px;
      font-size: 13px;
      font-weight: 600;
      text-align: center;
      text-decoration: none;
      display: inline-block;
    }
    .btn-primary {
      background: #2154a3;
      color: #ffffff;
    }
    .btn-primary:hover {
      background: #102f67;
    }
    .btn-sec {
      background: #f1f5f9;
      color: #334155;
      border: 1px solid #cbd5e1;
    }
    .btn-sec:hover {
      background: #e2e8f0;
    }
    .footer-bar {
      text-align: center;
      margin-top: 30px;
    }
    .footer-bar a {
      color: #2154a3;
      text-decoration: none;
      font-weight: 600;
      margin: 0 12px;
      font-size: 13px;
    }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="header">
      <span class="badge">Staff Signatures Repository</span>
      <h1>VELOLOG Signature Directories</h1>
      <p>Separate regional signature collections for Saudi Arabia Headquarters & UAE Dubai Branch</p>
    </div>

    <div class="grid">
      <!-- Saudi Branch -->
      <div class="branch-card">
        <div class="branch-top">
          <div class="branch-flag">🇸🇦</div>
          <div class="branch-title">Saudi Arabia (Headquarters)</div>
          <div class="branch-meta">
            📍 An Nawras, King Saud Road, Dammam, KSA<br>
            🌐 <a href="https://www.velologsa.com" target="_blank" style="color: #2154a3; font-weight: 600;">www.velologsa.com</a><br>
            📁 Folder: <code>signatures/saudi/</code>
          </div>
          <div class="staff-count">👥 ${saudiEmployees.length} Staff Signatures</div>
        </div>
        <div class="branch-actions">
          <a href="saudi/" class="btn btn-primary">📂 Open Saudi Folder</a>
        </div>
      </div>

      <!-- Dubai Branch -->
      <div class="branch-card">
        <div class="branch-top">
          <div class="branch-flag">🇦🇪</div>
          <div class="branch-title">UAE Dubai Branch</div>
          <div class="branch-meta">
            📍 Trade Square, Office -107, Al Asayel St, Al Quoz Industrial 4, Dubai, UAE<br>
            📝 Reg : 2902815<br>
            🌐 <a href="https://www.velologuae.com" target="_blank" style="color: #2154a3; font-weight: 600;">www.velologuae.com</a><br>
            📁 Folder: <code>signatures/dubai/</code>
          </div>
          <div class="staff-count">👥 ${dubaiEmployees.length} Staff Signature (Nazir Abdullah)</div>
        </div>
        <div class="branch-actions">
          <a href="dubai/" class="btn btn-primary">📂 Open Dubai Folder</a>
        </div>
      </div>
    </div>

    <div class="footer-bar">
      <a href="/signature-studio">⚡ Interactive Signature Studio</a> •
      <a href="/team">👥 Staff Directory</a> •
      <a href="/contact">📍 Branch Contact Info</a>
    </div>
  </div>
</body>
</html>`;

fs.writeFileSync(path.join(signaturesDir, 'index.html'), mainIndexHtml, 'utf8');
console.log('All branch signatures and directories built successfully!');

