const fs = require('fs');
const path = require('path');
const { PDFParse } = require('pdf-parse');

const rootDir = path.resolve(__dirname, '..');
const pdfPath = path.join(rootDir, 'company profile', 'VELOLOG PRE QUALIFICATION PROFILE.pdf');
const dataBuffer = fs.readFileSync(pdfPath);

async function extractImages() {
  const parser = new PDFParse({ data: dataBuffer });
  await parser.load();
  const pages = parser.doc._pdfInfo.numPages;
  console.log("Total pages:", pages);
  
  const imgDir = path.join(rootDir, 'company profile', 'extracted_images');
  if (!fs.existsSync(imgDir)) fs.mkdirSync(imgDir, { recursive: true });
  
  // Let's see how images can be accessed or list images
  let count = 0;
  for (let i = 1; i <= pages; i++) {
    try {
      const page = await parser.doc.getPage(i);
      const ops = await page.getOperatorList();
      for (let j = 0; j < ops.fnArray.length; j++) {
        if (ops.fnArray[j] === 82 || ops.fnArray[j] === 85) { // paintImageXObject / paintInlineImageXObject
          count++;
          const imgName = ops.argsArray[j][0];
          console.log(`Page ${i} has image ${imgName}`);
        }
      }
    } catch (e) {
      // continue
    }
  }
  console.log(`Total image occurrences found: ${count}`);
}

extractImages().catch(console.error);
