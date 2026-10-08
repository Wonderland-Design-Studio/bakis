const { execSync } = require('child_process');
const path = require('path');

const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const scratchDir = path.resolve(__dirname);

const tasks = [
  // 1. Hero text across devices
  { name: 'verify_hero_desktop_1440.png', w: 1440, h: 900, url: 'http://127.0.0.1:8080/' },
  { name: 'verify_hero_laptop_1024.png', w: 1024, h: 800, url: 'http://127.0.0.1:8080/' },
  { name: 'verify_hero_tablet_768.png', w: 768, h: 900, url: 'http://127.0.0.1:8080/' },
  { name: 'verify_hero_mobile_375.png', w: 375, h: 700, url: 'http://127.0.0.1:8080/' },
  { name: 'verify_hero_mobile_320.png', w: 320, h: 600, url: 'http://127.0.0.1:8080/' },

  // 2. Modals
  { name: 'verify_modal_full_tension_joints.png', w: 1200, h: 950, url: 'http://127.0.0.1:8080/scratch/modal_test.html?prod=distribution-boards' },
  { name: 'verify_modal_insulators_dual_images.png', w: 1200, h: 950, url: 'http://127.0.0.1:8080/scratch/modal_test.html?prod=insulators-substation' },
  { name: 'verify_modal_surge_arrestors.png', w: 1200, h: 950, url: 'http://127.0.0.1:8080/scratch/modal_test.html?prod=surge-arrestors' },
  { name: 'verify_modal_abc_accessories.png', w: 1200, h: 1050, url: 'http://127.0.0.1:8080/scratch/modal_test.html?prod=ipc-connectors' }
];

for (const t of tasks) {
  const dest = path.join(scratchDir, t.name);
  const cmd = `"${edgePath}" --headless --disable-gpu "--screenshot=${dest}" --window-size=${t.w},${t.h} "${t.url}"`;
  try {
    execSync(cmd, { timeout: 15000 });
    console.log(`OK: ${t.name}`);
  } catch (e) {
    console.error(`ERR: ${t.name}:`, e.message);
  }
}
