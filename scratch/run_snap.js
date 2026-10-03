const { execSync } = require('child_process');
const path = require('path');
const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const outFile = path.resolve(__dirname, 'bimetal_modal_preview.png');
const url = 'http://127.0.0.1:8080/scratch/preview_bimetal_modal.html';

try {
  execSync(`"${edgePath}" --headless --disable-gpu --screenshot="${outFile}" --window-size=1200,900 ${url}`);
  console.log('Saved screenshot to:', outFile);
} catch (e) {
  console.error('Error taking screenshot:', e.message);
}
