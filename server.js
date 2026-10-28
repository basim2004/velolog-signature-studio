const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3000;
const UPLOADS_DIR = path.join(__dirname, 'uploads');
const PHOTOS_INDEX = path.join(UPLOADS_DIR, 'photos.json');

if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}
if (!fs.existsSync(PHOTOS_INDEX)) {
  fs.writeFileSync(PHOTOS_INDEX, JSON.stringify({}), 'utf8');
}

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.pdf': 'application/pdf',
  '.ico': 'image/x-icon',
  '.webp': 'image/webp'
};

const ROUTE_MAP = {
  '/': 'index.html',
  '/home': 'index.html',
  '/about': 'about.html',
  '/team': 'team.html',
  '/services': 'services.html',
  '/contact': 'contact.html',
  '/signature-studio': 'signature-studio.html',
  '/help-desk-guide': 'help-desk-guide.pdf',
  '/helpdesk': 'help-desk-guide.pdf'
};

function parseBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
      if (body.length > 10 * 1024 * 1024) {
        // 10MB limit
        reject(new Error('Body too large'));
      }
    });
    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch (e) {
        resolve({ raw: body });
      }
    });
    req.on('error', reject);
  });
}

const server = http.createServer(async (req, res) => {
  const urlParts = req.url.split('?');
  const pathname = decodeURI(urlParts[0]);

  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  // --- API: Contact Form Submission ---
  if (req.method === 'POST' && pathname === '/api/contact') {
    try {
      const data = await parseBody(req);
      const { name, email, subject, message } = data;
      if (!name || !email || !message) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, error: 'Name, email, and message are required.' }));
        return;
      }

      console.log(`[CONTACT INQUIRY RECEIVED] From: ${name} <${email}> | Subject: ${subject || 'General'} | Message: ${message}`);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        success: true,
        message: 'Thank you! Your message has been sent to VELOLOG operations desk in Dammam.'
      }));
    } catch (err) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: false, error: err.message }));
    }
    return;
  }

  // --- API: Save Clean Icons ---
  if (req.method === 'POST' && pathname === '/api/save-clean-icons') {
    try {
      const data = await parseBody(req);
      const assetsDir = path.join(__dirname, 'assets');
      if (!fs.existsSync(assetsDir)) fs.mkdirSync(assetsDir, { recursive: true });
      fs.writeFileSync(path.join(assetsDir, 'clean_icons.json'), JSON.stringify(data, null, 2), 'utf8');
      for (const [name, b64] of Object.entries(data)) {
        const matches = b64.match(/^data:image\/png;base64,(.+)$/);
        if (matches) {
          fs.writeFileSync(path.join(assetsDir, `icon_${name}.png`), Buffer.from(matches[1], 'base64'));
        }
      }
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: true }));
    } catch (err) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: false, error: err.message }));
    }
    return;
  }

  if (req.method === 'POST' && pathname === '/api/save-logo-stacked') {
    try {
      const data = await parseBody(req);
      const b64 = data.image;
      const matches = b64.match(/^data:image\/png;base64,(.+)$/);
      if (matches) {
        fs.writeFileSync(path.join(__dirname, 'assets', 'velolog_logo_stacked.png'), Buffer.from(matches[1], 'base64'));
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true }));
        return;
      }
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: false, error: 'Invalid image data' }));
    } catch (err) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: false, error: err.message }));
    }
    return;
  }

  if (req.method === 'POST' && pathname === '/api/save-cover-image') {
    try {
      const data = await parseBody(req);
      const b64 = data.image;
      const matches = b64.match(/^data:image\/png;base64,(.+)$/);
      if (matches) {
        fs.writeFileSync(path.join(__dirname, 'assets', 'help_desk_cover.png'), Buffer.from(matches[1], 'base64'));
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true }));
        return;
      }
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: false, error: 'Invalid image data' }));
    } catch (err) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: false, error: err.message }));
    }
    return;
  }

  // --- API: Get All Employees ---
  if (req.method === 'GET' && pathname === '/api/employees') {
    try {
      let employees = [];
      try {
        const dataJs = fs.readFileSync(path.join(__dirname, 'data.js'), 'utf8');
        const match = dataJs.match(/const VELOLOG_EMPLOYEES = (\[[\s\S]*?\]);/);
        if (match) {
          employees = JSON.parse(match[1]);
        }
      } catch (e) {}
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: true, employees }));
    } catch (err) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: false, error: err.message }));
    }
    return;
  }

  // --- API: Add New Employee ---
  if (req.method === 'POST' && pathname === '/api/employees') {
    try {
      const data = await parseBody(req);
      const { name, title, department, phone, email, gender, photoBase64, note } = data;

      if (!name || !title || !email) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, error: 'Name, title, and email are required.' }));
        return;
      }

      // Read current employees from data.js
      const dataJsPath = path.join(__dirname, 'data.js');
      const dataJsContent = fs.readFileSync(dataJsPath, 'utf8');
      const matchEmployees = dataJsContent.match(/const VELOLOG_EMPLOYEES = (\[[\s\S]*?\]);\s*const VELOLOG_COMPANY/);
      if (!matchEmployees) {
        throw new Error('Could not parse VELOLOG_EMPLOYEES from data.js');
      }

      const employees = JSON.parse(matchEmployees[1]);

      // Generate ID
      const baseId = name.toLowerCase().replace(/[^a-z0-9]/g, '_').replace(/_+/g, '_').replace(/^_|_$/g, '').slice(0, 15) || 'staff';
      let newId = baseId;
      let counter = 1;
      while (employees.some(e => e.id === newId)) {
        newId = `${baseId}_${counter++}`;
      }

      let photoUrl = '';
      if (photoBase64) {
        const matches = photoBase64.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
        let buffer;
        let ext = '.png';
        if (matches) {
          if (matches[1].includes('jpeg') || matches[1].includes('jpg')) ext = '.jpg';
          else if (matches[1].includes('webp')) ext = '.webp';
          buffer = Buffer.from(matches[2], 'base64');
        } else {
          buffer = Buffer.from(photoBase64, 'base64');
        }
        const filename = `${newId}_photo${ext}`;
        fs.writeFileSync(path.join(UPLOADS_DIR, filename), buffer);
        photoUrl = `/uploads/${filename}?t=${Date.now()}`;

        const photos = JSON.parse(fs.readFileSync(PHOTOS_INDEX, 'utf8') || '{}');
        photos[newId] = photoUrl;
        fs.writeFileSync(PHOTOS_INDEX, JSON.stringify(photos, null, 2), 'utf8');
      }

      const newEmployee = {
        id: newId,
        name: name.trim(),
        title: title.trim(),
        department: (department || 'Operations').trim(),
        phone: (phone || '').trim(),
        email: email.trim(),
        gender: (gender || 'male').toLowerCase(),
        photo: photoUrl,
        detailsImage: '',
        note: (note || `${title} coordinating VELOLOG freight solutions`).trim()
      };

      employees.push(newEmployee);

      // Re-write data.js with updated employees
      const updatedDataJs = dataJsContent.replace(
        /const VELOLOG_EMPLOYEES = \[[\s\S]*?\];\s*const VELOLOG_COMPANY/,
        `const VELOLOG_EMPLOYEES = ${JSON.stringify(employees, null, 2)};\n\nconst VELOLOG_COMPANY`
      );
      fs.writeFileSync(dataJsPath, updatedDataJs, 'utf8');

      // Also persist to custom_employees.json as backup
      const customPath = path.join(__dirname, 'custom_employees.json');
      let customEmps = [];
      if (fs.existsSync(customPath)) {
        try { customEmps = JSON.parse(fs.readFileSync(customPath, 'utf8')); } catch (e) {}
      }
      customEmps.push(newEmployee);
      fs.writeFileSync(customPath, JSON.stringify(customEmps, null, 2), 'utf8');

      console.log(`[STAFF ADDED] ${newEmployee.name} (${newEmployee.title}) - ${newEmployee.email} [ID: ${newId}]`);

      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: true, employee: newEmployee, employees }));
    } catch (err) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: false, error: err.message }));
    }
    return;
  }

  // --- API: Get Employee Photos ---
  if (req.method === 'GET' && pathname === '/api/employee-photos') {
    try {
      const photos = JSON.parse(fs.readFileSync(PHOTOS_INDEX, 'utf8') || '{}');
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: true, photos }));
    } catch (err) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: false, error: err.message }));
    }
    return;
  }

  // --- API: Upload Employee Photo ---
  const photoUploadMatch = pathname.match(/^\/api\/employees\/([a-zA-Z0-9_-]+)\/photo$/);
  if (photoUploadMatch && req.method === 'POST') {
    try {
      const empId = photoUploadMatch[1];
      const data = await parseBody(req);
      const { photoBase64 } = data;

      if (!photoBase64) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, error: 'No photo provided' }));
        return;
      }

      // Extract base64 buffer
      const matches = photoBase64.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
      let buffer;
      let ext = '.png';
      if (matches) {
        if (matches[1].includes('jpeg') || matches[1].includes('jpg')) ext = '.jpg';
        else if (matches[1].includes('webp')) ext = '.webp';
        buffer = Buffer.from(matches[2], 'base64');
      } else {
        buffer = Buffer.from(photoBase64, 'base64');
      }

      const filename = `${empId}_photo${ext}`;
      const filePath = path.join(UPLOADS_DIR, filename);
      fs.writeFileSync(filePath, buffer);

      const photos = JSON.parse(fs.readFileSync(PHOTOS_INDEX, 'utf8') || '{}');
      photos[empId] = `/uploads/${filename}?t=${Date.now()}`;
      fs.writeFileSync(PHOTOS_INDEX, JSON.stringify(photos, null, 2), 'utf8');

      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: true, photoUrl: photos[empId] }));
    } catch (err) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: false, error: err.message }));
    }
    return;
  }

  // --- API: Delete Employee Photo ---
  if (photoUploadMatch && req.method === 'DELETE') {
    try {
      const empId = photoUploadMatch[1];
      const photos = JSON.parse(fs.readFileSync(PHOTOS_INDEX, 'utf8') || '{}');
      delete photos[empId];
      fs.writeFileSync(PHOTOS_INDEX, JSON.stringify(photos, null, 2), 'utf8');

      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: true }));
    } catch (err) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: false, error: err.message }));
    }
    return;
  }

  // --- Static & Route Serving ---
  let targetFile = ROUTE_MAP[pathname] || pathname;
  if (targetFile.startsWith('/')) targetFile = targetFile.slice(1);

  // If path doesn't have an extension, try adding .html
  let filePath = path.join(__dirname, targetFile);
  if (!fs.existsSync(filePath) && fs.existsSync(filePath + '.html')) {
    filePath = filePath + '.html';
  }

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      // Fallback for direct URL refresh to index.html or 404
      if (pathname === '/home') {
        filePath = path.join(__dirname, 'index.html');
      } else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('404 Not Found - VELOLOG');
        return;
      }
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    res.writeHead(200, {
      'Content-Type': contentType,
      'Cache-Control': 'no-cache'
    });

    const stream = fs.createReadStream(filePath);
    stream.pipe(res);
  });
});

server.listen(PORT, () => {
  console.log(`VELOLOG Multi-Page Corporate Portal running at http://localhost:${PORT}`);
});
