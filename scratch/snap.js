const { exec } = require('child_process');
const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const cmd = '"' + edgePath + '" --headless --disable-gpu --screenshot=scratch/modal_test_page.png --window-size=1280,900 http://127.0.0.1:8080/';

exec(cmd, (err) => {
  if (err) console.error(err);
  else console.log('Screenshot captured successfully');
});
