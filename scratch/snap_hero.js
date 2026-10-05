const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const outFile = path.resolve(__dirname, 'hero_deck_test.png');
const url = 'http://127.0.0.1:8080/';

try {
  execSync(`"${edgePath}" --headless --disable-gpu --screenshot="${outFile}" --window-size=1400,900 ${url}`);
  console.log('Saved screenshot to:', outFile);
} catch (e) {
  console.error('Error:', e.message);
}
