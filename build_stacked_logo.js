const fs = require('fs');
const { PNG } = require('pngjs');

// 1. Read file -03.png
const src = PNG.sync.read(fs.readFileSync('logo/file -03.png'));

// Mark coordinates: [281, 371] to [877, 1101]
const markSrcX = 281, markSrcY = 371;
const markSrcW = 877 - 281 + 1; // 597
const markSrcH = 1101 - 371 + 1; // 731

// Text coordinates: [1046, 473] to [4219, 997]
const textSrcX = 1046, textSrcY = 473;
const textSrcW = 4219 - 1046 + 1; // 3174
const textSrcH = 997 - 473 + 1; // 525

// Target output canvas:
// Let text width = 480px, height = 79px
// Mark width = 480 * 0.345 = 166px, mark height = 166 * (731/597) = 203px
// Gap between mark bottom and text top = 34px
// Total height = 203 + 34 + 79 = 316px
// Total width = 480px
const outW = 480;
const outH = 316;
const out = new PNG({ width: outW, height: outH });

// Initialize with transparent pixels
out.data.fill(0);

// Helper for bilinear sampling from source
function sampleSrc(px, py) {
  const x0 = Math.floor(px);
  const y0 = Math.floor(py);
  const x1 = Math.min(x0 + 1, src.width - 1);
  const y1 = Math.min(y0 + 1, src.height - 1);
  const fx = px - x0;
  const fy = py - y0;

  const idx00 = (src.width * y0 + x0) << 2;
  const idx10 = (src.width * y0 + x1) << 2;
  const idx01 = (src.width * y1 + x0) << 2;
  const idx11 = (src.width * y1 + x1) << 2;

  // We know color is brand blue #2154a3 (33, 84, 163)
  // Let's interpolate alpha channel for smooth anti-aliased edge
  const a00 = src.data[idx00 + 3];
  const a10 = src.data[idx10 + 3];
  const a01 = src.data[idx01 + 3];
  const a11 = src.data[idx11 + 3];

  const aTop = a00 * (1 - fx) + a10 * fx;
  const aBot = a01 * (1 - fx) + a11 * fx;
  const a = Math.round(aTop * (1 - fy) + aBot * fy);

  return { r: 33, g: 84, b: 163, a };
}

// Draw Mark centered at top
const markTargetW = 166;
const markTargetH = 203;
const markStartX = Math.round((outW - markTargetW) / 2);
const markStartY = 0;

for (let y = 0; y < markTargetH; y++) {
  for (let x = 0; x < markTargetW; x++) {
    const srcX = markSrcX + (x / (markTargetW - 1)) * (markSrcW - 1);
    const srcY = markSrcY + (y / (markTargetH - 1)) * (markSrcH - 1);
    const p = sampleSrc(srcX, srcY);
    if (p.a > 0) {
      const dstIdx = (outW * (markStartY + y) + (markStartX + x)) << 2;
      out.data[dstIdx] = p.r;
      out.data[dstIdx + 1] = p.g;
      out.data[dstIdx + 2] = p.b;
      out.data[dstIdx + 3] = p.a;
    }
  }
}

// Draw Text at bottom
const textTargetW = 480;
const textTargetH = 79;
const textStartX = 0;
const textStartY = 203 + 34;

for (let y = 0; y < textTargetH; y++) {
  for (let x = 0; x < textTargetW; x++) {
    const srcX = textSrcX + (x / (textTargetW - 1)) * (textSrcW - 1);
    const srcY = textSrcY + (y / (textTargetH - 1)) * (textSrcH - 1);
    const p = sampleSrc(srcX, srcY);
    if (p.a > 0) {
      const dstIdx = (outW * (textStartY + y) + (textStartX + x)) << 2;
      out.data[dstIdx] = p.r;
      out.data[dstIdx + 1] = p.g;
      out.data[dstIdx + 2] = p.b;
      out.data[dstIdx + 3] = p.a;
    }
  }
}

const buffer = PNG.sync.write(out);
fs.writeFileSync('assets/velolog_logo_stacked.png', buffer);
console.log('Saved assets/velolog_logo_stacked.png with dimensions', outW, 'x', outH);
