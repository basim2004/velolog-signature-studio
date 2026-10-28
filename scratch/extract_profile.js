const fs = require('fs');
const path = require('path');
const { PDFParse } = require('pdf-parse');

const rootDir = path.resolve(__dirname, '..');
const pdfPath = path.join(rootDir, 'company profile', 'VELOLOG PRE QUALIFICATION PROFILE.pdf');
console.log("Reading PDF from:", pdfPath);
const dataBuffer = fs.readFileSync(pdfPath);

async function run() {
  try {
    const parser = new PDFParse({ data: dataBuffer });
    await parser.load();
    const textResult = await parser.getText();
    const info = await parser.getInfo();
    console.log("Info:", JSON.stringify(info));
    fs.writeFileSync(path.join(rootDir, 'scratch', 'company_profile_text.txt'), typeof textResult === 'string' ? textResult : JSON.stringify(textResult, null, 2), 'utf8');
    console.log("Successfully extracted text!");
  } catch (e) {
    console.error("Error:", e);
  }
}

run();
