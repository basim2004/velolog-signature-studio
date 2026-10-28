const fs = require('fs');
const { PNG } = require('pngjs');

const teamPng = PNG.sync.read(fs.readFileSync('website model/VELOLOG Team Across Miles.png'));

if (!fs.existsSync('images/team')) fs.mkdirSync('images/team', { recursive: true });

function cropSquare(cx, cy, r, id) {
  const size = r * 2;
  const dst = new PNG({ width: size, height: size });
  for (let dy = 0; dy < size; dy++) {
    for (let dx = 0; dx < size; dx++) {
      const srcX = cx - r + dx;
      const srcY = cy - r + dy;
      const srcIdx = (teamPng.width * srcY + srcX) << 2;
      const dstIdx = (size * dy + dx) << 2;
      dst.data[dstIdx] = teamPng.data[srcIdx];
      dst.data[dstIdx + 1] = teamPng.data[srcIdx + 1];
      dst.data[dstIdx + 2] = teamPng.data[srcIdx + 2];
      dst.data[dstIdx + 3] = teamPng.data[srcIdx + 3];
    }
  }
  fs.writeFileSync('images/team/' + id + '.png', PNG.sync.write(dst));
  console.log('Saved images/team/' + id + '.png');
}

// Row 1: Y center ~ 384, radius ~ 48
cropSquare(94, 384, 48, 'sudeer');
cropSquare(292, 384, 48, 'amjed');
cropSquare(490, 384, 48, 'shabbir');
cropSquare(688, 384, 48, 'alaftageen');
cropSquare(886, 384, 48, 'hafeez');

// Row 2: Y center ~ 594
// Card 6: Muhammed Naseeh (cx ~ 114)
// Card 7: Sanjid P (cx ~ 312)
// Card 8: Yadhu Krishna T (cx ~ 510)
// Card 9: Nihal Muhyudheen TK (cx ~ 708)
cropSquare(114, 594, 48, 'naseeh');
cropSquare(312, 594, 48, 'sanjid');
cropSquare(510, 594, 48, 'yadhu');
cropSquare(708, 594, 48, 'nihal');
