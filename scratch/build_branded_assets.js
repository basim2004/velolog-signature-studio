const fs = require('fs');
const path = require('path');
const { PNG } = require('pngjs');

const servicesDir = path.join(__dirname, '../images/services');
if (!fs.existsSync(servicesDir)) {
  fs.mkdirSync(servicesDir, { recursive: true });
}

function resizeBilinear(src, targetW, targetH) {
  const dst = new PNG({ width: targetW, height: targetH });
  const xRatio = src.width / targetW;
  const yRatio = src.height / targetH;
  for (let y = 0; y < targetH; y++) {
    const srcY = y * yRatio;
    const yFloor = Math.floor(srcY);
    const yCeil = Math.min(src.height - 1, yFloor + 1);
    const yWeight = srcY - yFloor;
    for (let x = 0; x < targetW; x++) {
      const srcX = x * xRatio;
      const xFloor = Math.floor(srcX);
      const xCeil = Math.min(src.width - 1, xFloor + 1);
      const xWeight = srcX - xFloor;

      const idxDst = (y * targetW + x) << 2;
      for (let c = 0; c < 4; c++) {
        const p00 = src.data[(yFloor * src.width + xFloor) << 2 | c];
        const p10 = src.data[(yFloor * src.width + xCeil) << 2 | c];
        const p01 = src.data[(yCeil * src.width + xFloor) << 2 | c];
        const p11 = src.data[(yCeil * src.width + xCeil) << 2 | c];

        const top = p00 * (1 - xWeight) + p10 * xWeight;
        const bottom = p01 * (1 - xWeight) + p11 * xWeight;
        dst.data[idxDst | c] = Math.round(top * (1 - yWeight) + bottom * yWeight);
      }
    }
  }
  return dst;
}

function blendOverlay(base, overlay, startX, startY, opacity = 1.0) {
  for (let y = 0; y < overlay.height; y++) {
    const destY = startY + y;
    if (destY < 0 || destY >= base.height) continue;
    for (let x = 0; x < overlay.width; x++) {
      const destX = startX + x;
      if (destX < 0 || destX >= base.width) continue;
      const oIdx = (y * overlay.width + x) << 2;
      const bIdx = (destY * base.width + destX) << 2;

      const oA = (overlay.data[oIdx + 3] / 255) * opacity;
      if (oA <= 0.005) continue;
      const bA = base.data[bIdx + 3] / 255;

      const outA = oA + bA * (1 - oA);
      if (outA > 0) {
        for (let c = 0; c < 3; c++) {
          base.data[bIdx + c] = Math.round(
            (overlay.data[oIdx + c] * oA + base.data[bIdx + c] * bA * (1 - oA)) / outA
          );
        }
        base.data[bIdx + 3] = Math.round(outA * 255);
      }
    }
  }
}

// Create a professional pill badge with VELOLOG logo
function createBrandedBadge(logoImg, badgeW, badgeH) {
  const badge = new PNG({ width: badgeW, height: badgeH });
  // Fill with crisp white rounded/pill badge with subtle drop-shadow appearance
  const r = 8;
  for (let y = 0; y < badgeH; y++) {
    for (let x = 0; x < badgeW; x++) {
      const idx = (y * badgeW + x) << 2;
      // White with 94% opacity
      badge.data[idx] = 255;
      badge.data[idx + 1] = 255;
      badge.data[idx + 2] = 255;
      badge.data[idx + 3] = 240;
    }
  }

  // Draw 2px VELOLOG blue border
  const bColor = [32, 86, 165, 255]; // #2056a5
  for (let x = 0; x < badgeW; x++) {
    for (let t = 0; t < 2; t++) {
      const topIdx = (t * badgeW + x) << 2;
      const botIdx = ((badgeH - 1 - t) * badgeW + x) << 2;
      for (let c = 0; c < 4; c++) {
        badge.data[topIdx + c] = bColor[c];
        badge.data[botIdx + c] = bColor[c];
      }
    }
  }
  for (let y = 0; y < badgeH; y++) {
    for (let t = 0; t < 2; t++) {
      const leftIdx = (y * badgeW + t) << 2;
      const rightIdx = (y * badgeW + (badgeW - 1 - t)) << 2;
      for (let c = 0; c < 4; c++) {
        badge.data[leftIdx + c] = bColor[c];
        badge.data[rightIdx + c] = bColor[c];
      }
    }
  }

  // Resize logo to fit inside badge
  const paddingX = 10;
  const paddingY = 6;
  const targetLogoW = badgeW - (paddingX * 2);
  const targetLogoH = badgeH - (paddingY * 2);
  const scaledLogo = resizeBilinear(logoImg, targetLogoW, targetLogoH);

  blendOverlay(badge, scaledLogo, paddingX, paddingY, 1.0);
  return badge;
}

const logoRaw = fs.readFileSync('assets/velolog_logo_stacked.png');
const stackedLogo = PNG.sync.read(logoRaw);

console.log('Building branded assets...');

const badge160 = createBrandedBadge(stackedLogo, 150, 108);
const badge200 = createBrandedBadge(stackedLogo, 200, 144);

// Map of services to real PDF extracted images
const imageConfigs = [
  {
    src: 'images/company_profile/page_14_img_p13_1_2836x1547.png',
    dest: 'images/home_hero_velolog_truck.png',
    width: 1400,
    height: 760,
    badgePos: 'bottom-right'
  },
  {
    src: 'images/company_profile/page_26_img_p25_3_1280x720.png',
    dest: 'images/services/service_road_transport.png',
    width: 900,
    height: 506,
    badgePos: 'bottom-right'
  },
  {
    src: 'images/company_profile/page_18_img_p17_2_3178x1734.png',
    dest: 'images/services/service_gcc_transport.png',
    width: 900,
    height: 491,
    badgePos: 'bottom-right'
  },
  {
    src: 'images/company_profile/page_12_img_p11_1_3080x2054.png',
    dest: 'images/services/service_sea_freight.png',
    width: 900,
    height: 600,
    badgePos: 'bottom-right'
  },
  {
    src: 'images/company_profile/page_11_img_p10_1_1920x1080.png',
    dest: 'images/services/service_air_freight.png',
    width: 900,
    height: 506,
    badgePos: 'bottom-right'
  },
  {
    src: 'images/company_profile/page_13_img_p12_1_2389x1593.png',
    dest: 'images/services/service_customs_clearance.png',
    width: 900,
    height: 600,
    badgePos: 'bottom-right'
  },
  {
    src: 'images/company_profile/page_23_img_p22_1_2152x3073.png',
    dest: 'images/services/service_terminal_handling.png',
    width: 800,
    height: 1142,
    badgePos: 'bottom-right'
  },
  {
    src: 'images/company_profile/page_27_img_p26_4_1280x960.png',
    dest: 'images/services/service_project_cargo.png',
    width: 900,
    height: 675,
    badgePos: 'bottom-right'
  },
  {
    src: 'images/company_profile/page_26_img_p25_5_1280x960.png',
    dest: 'images/services/service_heavy_transport.png',
    width: 900,
    height: 675,
    badgePos: 'bottom-right'
  },
  {
    src: 'images/company_profile/page_22_img_p21_2_2506x2169.png',
    dest: 'images/services/service_warehousing.png',
    width: 900,
    height: 778,
    badgePos: 'bottom-right'
  },
  {
    src: 'images/company_profile/page_15_img_p14_1_1182x485.png',
    dest: 'images/services/service_door_to_door.png',
    width: 900,
    height: 369,
    badgePos: 'bottom-right'
  },
  {
    src: 'images/company_profile/page_16_img_p15_1_1360x765.png',
    dest: 'images/services/service_relocation.png',
    width: 900,
    height: 506,
    badgePos: 'bottom-right'
  },
  {
    src: 'images/company_profile/page_20_img_p19_1_2205x1883.png',
    dest: 'images/services/service_industrial_packing.png',
    width: 900,
    height: 768,
    badgePos: 'bottom-right'
  },
  {
    src: 'images/company_profile/page_27_img_p26_5_1280x960.png',
    dest: 'images/services/service_break_bulk.png',
    width: 900,
    height: 675,
    badgePos: 'bottom-right'
  },
  {
    src: 'images/company_profile/page_24_img_p23_1_1240x1003.png',
    dest: 'images/services/service_custom_shipping.png',
    width: 900,
    height: 728,
    badgePos: 'bottom-right'
  },
  {
    src: 'images/company_profile/page_22_img_p21_1_2152x3073.png',
    dest: 'images/about_terminal_80k.png',
    width: 900,
    height: 1285,
    badgePos: 'bottom-right'
  }
];

imageConfigs.forEach(cfg => {
  if (!fs.existsSync(cfg.src)) {
    console.log('Skipping missing:', cfg.src);
    return;
  }
  const raw = fs.readFileSync(cfg.src);
  const orig = PNG.sync.read(raw);
  const resized = resizeBilinear(orig, cfg.width, cfg.height);

  // Choose badge
  const b = cfg.width >= 1200 ? badge200 : badge160;
  const margin = 16;
  const startX = cfg.width - b.width - margin;
  const startY = cfg.height - b.height - margin;

  blendOverlay(resized, b, startX, startY, 0.96);

  fs.writeFileSync(cfg.dest, PNG.sync.write(resized));
  console.log('Created branded:', cfg.dest);
});

console.log('All branded company assets generated successfully!');
