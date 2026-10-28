const fs = require('fs');
const path = require('path');
const { PDFParse } = require('pdf-parse');

const rootDir = path.resolve(__dirname, '..');
const pdfPath = path.join(rootDir, 'company profile', 'VELOLOG PRE QUALIFICATION PROFILE.pdf');
const dataBuffer = fs.readFileSync(pdfPath);

async function check() {
  const parser = new PDFParse({ data: dataBuffer });
  await parser.load();
  const page = await parser.doc.getPage(11); // Page 11 has Air Freight image
  const ops = await page.getOperatorList();
  console.log("Page 11 ops.fnArray length:", ops.fnArray.length);
  const counts = {};
  for (let f of ops.fnArray) counts[f] = (counts[f] || 0) + 1;
  console.log("Ops counts:", counts);
  console.log("argsArray sample:", ops.argsArray.slice(0, 15));
}

check().catch(console.error);
