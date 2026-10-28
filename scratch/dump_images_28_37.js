const fs = require('fs');
const path = require('path');
const { PDFParse } = require('pdf-parse');
const { PNG } = require('pngjs');

const rootDir = path.resolve(__dirname, '..');
const pdfPath = path.join(rootDir, 'company profile', 'VELOLOG PRE QUALIFICATION PROFILE.pdf');
const dataBuffer = fs.readFileSync(pdfPath);
const outDir = path.join(rootDir, 'images', 'company_profile');

async function extractPages28To37() {
  const parser = new PDFParse({ data: dataBuffer });
  await parser.load();
  const totalPages = parser.doc._pdfInfo.numPages;

  const seenImages = new Set();

  for (let i = 28; i <= totalPages; i++) {
    console.log(`Processing page ${i}...`);
    try {
      const page = await parser.doc.getPage(i);
      const ops = await page.getOperatorList();
      for (let j = 0; j < ops.fnArray.length; j++) {
        if (ops.fnArray[j] === 85 || ops.fnArray[j] === 82) {
          const imgName = ops.argsArray[j][0];
          if (seenImages.has(imgName)) continue;
          seenImages.add(imgName);

          try {
            const img = await new Promise((resolve) => page.objs.get(imgName, resolve));
            if (!img || !img.data) continue;

            if (img.width >= 300 && img.height >= 200) {
              const outName = `page_${i}_${imgName}_${img.width}x${img.height}.png`;
              const outPath = path.join(outDir, outName);
              const png = new PNG({ width: img.width, height: img.height });

              if (img.kind === 2) {
                let p = 0;
                for (let k = 0; k < img.data.length; k += 3) {
                  png.data[p++] = img.data[k];
                  png.data[p++] = img.data[k + 1];
                  png.data[p++] = img.data[k + 2];
                  png.data[p++] = 255;
                }
              } else if (img.kind === 3) {
                for (let k = 0; k < img.data.length; k++) {
                  png.data[k] = img.data[k];
                }
              } else {
                let p = 0;
                for (let k = 0; k < img.data.length; k++) {
                  png.data[p++] = img.data[k];
                  png.data[p++] = img.data[k];
                  png.data[p++] = img.data[k];
                  png.data[p++] = 255;
                }
              }

              fs.writeFileSync(outPath, PNG.sync.write(png));
              console.log(`Saved: ${outName}`);
            }
          } catch (err) {
            console.warn(`Error on page ${i} ${imgName}:`, err.message);
          }
        }
      }
    } catch (pageErr) {
      console.warn(`Error on page ${i}:`, pageErr.message);
    }
  }
  console.log("Pages 28-37 extraction complete!");
}

extractPages28To37().catch(console.error);
