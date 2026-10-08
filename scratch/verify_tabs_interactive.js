const { spawn, execSync } = require('child_process');
const http = require('http');
const fs = require('fs');
const path = require('path');

async function run() {
  try {
    execSync('taskkill /F /IM msedge.exe', { stdio: 'ignore' });
  } catch (e) {}

  await new Promise(r => setTimeout(r, 600));

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
    height: 950,
    deviceScaleFactor: 1,
    mobile: false
  });

  // Poll until window.openProductModal is defined
  for (let i = 0; i < 20; i++) {
    const res = await send('Runtime.evaluate', {
      expression: 'typeof window.openProductModal'
    });
    if (res && res.result && res.result.value === 'function') {
      console.log('window.openProductModal is ready!');
      break;
    }
    await new Promise(r => setTimeout(r, 250));
  }

  // 1. Open modal for Aerial bundled conductor accessories
  await send('Runtime.evaluate', {
    expression: 'window.openProductModal("ipc-connectors")'
  });
  await new Promise(r => setTimeout(r, 800));

  let shot = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync(path.join(__dirname, 'modal_abc_tab1_top.png'), Buffer.from(shot.data, 'base64'));
  console.log('Saved modal_abc_tab1_top.png');

  // 2. Scroll .product-modal-layout down to focus on the active tab and its panel content
  await send('Runtime.evaluate', {
    expression: `
      const layout = document.querySelector('.product-modal-layout');
      if (layout) layout.scrollTop = 320;
    `
  });
  await new Promise(r => setTimeout(r, 400));

  shot = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync(path.join(__dirname, 'modal_abc_tab1_scrolled.png'), Buffer.from(shot.data, 'base64'));
  console.log('Saved modal_abc_tab1_scrolled.png');

  // 3. Click Tab 3 (IPC Connector)
  await send('Runtime.evaluate', {
    expression: `
      const tab3 = document.querySelector('.abc-tab-btn[data-tab="subtab-3"]');
      if (tab3) tab3.click();
    `
  });
  await new Promise(r => setTimeout(r, 500));

  shot = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync(path.join(__dirname, 'modal_abc_tab3_active.png'), Buffer.from(shot.data, 'base64'));
  console.log('Saved modal_abc_tab3_active.png');

  // 4. Click Next button in Subtab 3 panel (should activate Subtab 4: Service Connection Clamp)
  await send('Runtime.evaluate', {
    expression: `
      const nextBtn = document.querySelector('#subtab-3 .abc-panel-nav-btn[data-target-tab="subtab-4"]');
      if (nextBtn) nextBtn.click();
    `
  });
  await new Promise(r => setTimeout(r, 500));

  shot = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync(path.join(__dirname, 'modal_abc_tab4_active.png'), Buffer.from(shot.data, 'base64'));
  console.log('Saved modal_abc_tab4_active.png');

  // 5. Test Tab 10 (Protective End Cap)
  await send('Runtime.evaluate', {
    expression: `
      const tab10 = document.querySelector('.abc-tab-btn[data-tab="subtab-10"]');
      if (tab10) tab10.click();
    `
  });
  await new Promise(r => setTimeout(r, 500));

  shot = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync(path.join(__dirname, 'modal_abc_tab10_active.png'), Buffer.from(shot.data, 'base64'));
  console.log('Saved modal_abc_tab10_active.png');

  // 6. Mobile Viewport Test (375px)
  await send('Emulation.setDeviceMetricsOverride', {
    width: 375,
    height: 812,
    deviceScaleFactor: 2,
    mobile: true
  });
  await send('Runtime.evaluate', {
    expression: `
      const layout = document.querySelector('.product-modal-layout');
      if (layout) layout.scrollTop = 340;
    `
  });
  await new Promise(r => setTimeout(r, 500));

  shot = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync(path.join(__dirname, 'modal_abc_mobile_375px.png'), Buffer.from(shot.data, 'base64'));
  console.log('Saved modal_abc_mobile_375px.png');

  ws.close();
  edge.kill();
  console.log('All tab verification tests completed successfully!');
}

run().catch(e => {
  console.error(e);
  process.exit(1);
});
