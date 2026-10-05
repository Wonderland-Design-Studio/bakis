const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const outMobile = path.resolve(__dirname, 'hero_mobile.png');
const outTablet = path.resolve(__dirname, 'hero_tablet.png');
const url = 'http://127.0.0.1:8080/';

try {
  execSync(`"${edgePath}" --headless --disable-gpu --screenshot="${outMobile}" --window-size=390,844 ${url}`);
  execSync(`"${edgePath}" --headless --disable-gpu --screenshot="${outTablet}" --window-size=768,1024 ${url}`);
  console.log('Mobile and tablet screenshots captured successfully');
} catch (e) {
  console.error('Error:', e.message);
}
