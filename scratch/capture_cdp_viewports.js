const { spawn } = require('child_process');
const http = require('http');
const fs = require('fs');
const path = require('path');

const viewports = [
  { name: 'verify_hero_mobile_320.png', w: 320, h: 640, mobile: true },
  { name: 'verify_hero_mobile_375.png', w: 375, h: 667, mobile: true },
  { name: 'verify_hero_tablet_768.png', w: 768, h: 900, mobile: false },
  { name: 'verify_hero_laptop_1024.png', w: 1024, h: 800, mobile: false },
  { name: 'verify_hero_desktop_1440.png', w: 1440, h: 900, mobile: false }
];

async function captureAll() {
  const edge = spawn('C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe', [
    '--headless',
    '--disable-gpu',
    '--remote-debugging-port=9222',
    'http://127.0.0.1:8080/'
  ]);

  await new Promise(r => setTimeout(r, 2000));

  const jsonStr = await new Promise((res, rej) => {
    http.get('http://127.0.0.1:9222/json', (r) => {
      let d = '';
      r.on('data', c => d += c);
      r.on('end', () => res(d));
    }).on('error', rej);
  });

  const targets = JSON.parse(jsonStr);
  const page = targets.find(t => t.type === 'page');
  if (!page) {
    console.error('No page target found');
    edge.kill();
    return;
  }

  const ws = new WebSocket(page.webSocketDebuggerUrl);

  let msgId = 0;
  function send(method, params = {}) {
    return new Promise((resolve) => {
      const id = ++msgId;
      const handler = (evt) => {
        const resp = JSON.parse(evt.data);
        if (resp.id === id) {
          ws.removeEventListener('message', handler);
          resolve(resp.result);
        }
      };
      ws.addEventListener('message', handler);
      ws.send(JSON.stringify({ id, method, params }));
    });
  }

  await new Promise(r => { ws.onopen = r; });

  for (const vp of viewports) {
    await send('Emulation.setDeviceMetricsOverride', {
      width: vp.w,
      height: vp.h,
      deviceScaleFactor: 2,
      mobile: vp.mobile
    });
    await send('Emulation.setVisibleSize', { width: vp.w, height: vp.h });
    await new Promise(r => setTimeout(r, 300));
    
    const shot = await send('Page.captureScreenshot', {
      format: 'png',
      clip: { x: 0, y: 0, width: vp.w, height: vp.h, scale: 1 }
    });

    if (shot && shot.data) {
      const buf = Buffer.from(shot.data, 'base64');
      const outPath = path.join(__dirname, vp.name);
      fs.writeFileSync(outPath, buf);
      console.log(`Saved: ${vp.name} (${vp.w}x${vp.h})`);
    } else {
      console.error(`Failed to capture: ${vp.name}`);
    }
  }

  ws.close();
  edge.kill();
}

captureAll().catch(e => {
  console.error(e);
  process.exit(1);
});
