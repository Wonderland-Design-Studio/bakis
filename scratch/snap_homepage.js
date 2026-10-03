const { execSync } = require('child_process');
const path = require('path');

const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const outFile = path.resolve(__dirname, 'homepage_verification.png');
const url = 'http://127.0.0.1:8080/';

try {
  execSync(`"${edgePath}" --headless --disable-gpu --screenshot="${outFile}" --window-size=1280,1050 ${url}`);
  console.log('Saved screenshot to:', outFile);
} catch (e) {
  console.error('Error taking screenshot:', e.message);
}
