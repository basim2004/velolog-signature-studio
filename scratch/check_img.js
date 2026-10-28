const fs = require('fs');
const path = require('path');
const { PDFParse } = require('pdf-parse');

const rootDir = path.resolve(__dirname, '..');
const pdfPath = path.join(rootDir, 'company profile', 'VELOLOG PRE QUALIFICATION PROFILE.pdf');
const dataBuffer = fs.readFileSync(pdfPath);

async function check() {
  const parser = new PDFParse({ data: dataBuffer });
  await parser.load();
  const page = await parser.doc.getPage(11);
  const ops = await page.getOperatorList();
  for (let i = 0; i < ops.fnArray.length; i++) {
    if (ops.fnArray[i] === 85) {
      console.log("Op 85 args:", ops.argsArray[i]);
      const imgName = ops.argsArray[i][0];
      const imgObj = await new Promise(r => page.objs.get(imgName, r));
      console.log("imgObj keys:", Object.keys(imgObj || {}));
      console.log("imgObj width:", imgObj?.width, "height:", imgObj?.height, "kind:", imgObj?.kind);
    }
  }
}

check().catch(console.error);
