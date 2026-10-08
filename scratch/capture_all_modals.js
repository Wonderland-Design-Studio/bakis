const { spawn } = require('child_process');
const http = require('http');
const fs = require('fs');
const path = require('path');

const modals = [
  { name: 'verify_modal_abc_accessories.png', prod: 'ipc-connectors' },
  { name: 'verify_modal_full_tension_joints.png', prod: 'distribution-boards' },
  { name: 'verify_modal_insulators_dual_images.png', prod: 'insulators-substation' },
  { name: 'verify_modal_surge_arrestors.png', prod: 'surge-arrestors' }
];

async function captureModals() {
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

  await send('Emulation.setDeviceMetricsOverride', {
    width: 1200,
    height: 900,
    deviceScaleFactor: 1,
    mobile: false
  });

  for (const m of modals) {
    // Open modal
    await send('Runtime.evaluate', {
      expression: `window.openProductModal("${m.prod}")`
    });

    await new Promise(r => setTimeout(r, 800));

    const shot = await send('Page.captureScreenshot', {
      format: 'png'
    });

    if (shot && shot.data) {
      const buf = Buffer.from(shot.data, 'base64');
      const outPath = path.join(__dirname, m.name);
      fs.writeFileSync(outPath, buf);
      console.log(`Saved modal: ${m.name}`);
    }

    if (m.prod === 'ipc-connectors') {
      // 1. Scroll modal content down
      await send('Runtime.evaluate', {
        expression: `
          const box = document.querySelector('.product-modal-box');
          if (box) box.scrollTop = 380;
        `
      });
      await new Promise(r => setTimeout(r, 400));
      const shotScrolled = await send('Page.captureScreenshot', { format: 'png' });
      fs.writeFileSync(path.join(__dirname, 'verify_modal_abc_scrolled.png'), Buffer.from(shotScrolled.data, 'base64'));
      console.log('Saved verify_modal_abc_scrolled.png');

      // 2. Click Tab 3 (IPC Connector)
      await send('Runtime.evaluate', {
        expression: `
          document.querySelector('.abc-tab-btn[data-tab="subtab-3"]')?.click();
        `
      });
      await new Promise(r => setTimeout(r, 400));
      const shotTab3 = await send('Page.captureScreenshot', { format: 'png' });
      fs.writeFileSync(path.join(__dirname, 'verify_modal_abc_tab3.png'), Buffer.from(shotTab3.data, 'base64'));
      console.log('Saved verify_modal_abc_tab3.png');
    }

    // Close modal
    await send('Runtime.evaluate', {
      expression: `window.closeProductModal()`
    });
    await new Promise(r => setTimeout(r, 400));
  }

  ws.close();
  edge.kill();
}

captureModals().catch(e => {
  console.error(e);
  process.exit(1);
});
