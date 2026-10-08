const { spawn, execSync } = require('child_process');
const http = require('http');
const fs = require('fs');
const path = require('path');

async function testTabs() {
  try {
    execSync('taskkill /F /IM msedge.exe', { stdio: 'ignore' });
  } catch (e) {}

  await new Promise(r => setTimeout(r, 500));

  const edge = spawn('C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe', [
    '--headless',
    '--disable-gpu',
    '--remote-debugging-port=9222',
    'http://127.0.0.1:8080/'
  ]);

  await new Promise(r => setTimeout(r, 2500));

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

  // Check if openProductModal exists
  const check = await send('Runtime.evaluate', {
    expression: 'typeof window.openProductModal'
  });
  console.log('typeof window.openProductModal:', check.result.value);

  // If undefined, wait a moment and reload
  if (check.result.value !== 'function') {
    await send('Page.reload');
    await new Promise(r => setTimeout(r, 2000));
  }

  // Open modal
  const openRes = await send('Runtime.evaluate', {
    expression: `window.openProductModal("ipc-connectors")`
  });
  console.log('openRes:', openRes);

  await new Promise(r => setTimeout(r, 800));

  // Scroll down modal content slightly so tabs and panels are well centered in screenshot
  await send('Runtime.evaluate', {
    expression: `
      const box = document.querySelector('.product-modal-box');
      if (box) box.scrollTop = 260;
    `
  });
  await new Promise(r => setTimeout(r, 400));

  let shot = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync(path.join(__dirname, 'verify_tabs_tab1.png'), Buffer.from(shot.data, 'base64'));
  console.log('Saved verify_tabs_tab1.png');

  // Click Tab 3 (IPC Connector)
  await send('Runtime.evaluate', {
    expression: `document.querySelector('.abc-tab-btn[data-tab="subtab-3"]')?.click()`
  });
  await new Promise(r => setTimeout(r, 500));

  shot = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync(path.join(__dirname, 'verify_tabs_tab3.png'), Buffer.from(shot.data, 'base64'));
  console.log('Saved verify_tabs_tab3.png');

  // Click next button in subtab-3 panel to go to subtab-4 (Service Connection Clamp)
  await send('Runtime.evaluate', {
    expression: `document.querySelector('#subtab-3 .abc-panel-nav-btn[data-target-tab="subtab-4"]')?.click()`
  });
  await new Promise(r => setTimeout(r, 500));

  shot = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync(path.join(__dirname, 'verify_tabs_tab4.png'), Buffer.from(shot.data, 'base64'));
  console.log('Saved verify_tabs_tab4.png');

  // Also capture all modals
  await send('Runtime.evaluate', { expression: `window.closeProductModal()` });
  await new Promise(r => setTimeout(r, 300));

  ws.close();
  edge.kill();
  console.log('Done!');
}

testTabs().catch(e => {
  console.error(e);
  process.exit(1);
});
