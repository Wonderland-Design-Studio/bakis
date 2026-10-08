const { execSync } = require('child_process');
const path = require('path');

const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const rootDir = __dirname;

const snapshots = [
  { name: 'hero_desktop_1440.png', w: 1440, h: 900, url: 'http://127.0.0.1:8080/' },
  { name: 'hero_laptop_1024.png', w: 1024, h: 800, url: 'http://127.0.0.1:8080/' },
  { name: 'hero_tablet_768.png', w: 768, h: 900, url: 'http://127.0.0.1:8080/' },
  { name: 'hero_mobile_375.png', w: 375, h: 700, url: 'http://127.0.0.1:8080/' },
  { name: 'hero_mobile_320.png', w: 320, h: 600, url: 'http://127.0.0.1:8080/' }
];

for (const s of snapshots) {
  const fullPath = path.join(rootDir, 'scratch', s.name);
  const cmd = `"${edgePath}" --headless --disable-gpu "--screenshot=${fullPath}" --window-size=${s.w},${s.h} ${s.url}`;
  try {
    execSync(cmd, { timeout: 15000 });
    console.log(`Saved screenshot: ${fullPath}`);
  } catch (e) {
    console.error(`Failed ${s.name}:`, e.message);
  }
}
