const { spawn } = require('child_process');
const http = require('http');

const edge = spawn('C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe', [
  '--headless',
  '--disable-gpu',
  '--remote-debugging-port=9222',
  'http://127.0.0.1:8080/'
]);

setTimeout(() => {
  http.get('http://127.0.0.1:9222/json', (res) => {
    let d = '';
    res.on('data', c => d += c);
    res.on('end', () => {
      const targets = JSON.parse(d);
      const page = targets.find(t => t.type === 'page');
      if (!page) { console.log('no page'); edge.kill(); return; }
      
      const ws = new WebSocket(page.webSocketDebuggerUrl);
      ws.onopen = () => {
        // Set emulation device metrics to 320 x 600
        ws.send(JSON.stringify({
          id: 1,
          method: 'Emulation.setDeviceMetricsOverride',
          params: {
            width: 320,
            height: 600,
            deviceScaleFactor: 1,
            mobile: true
          }
        }));
      };
      
      ws.onmessage = (evt) => {
        const resp = JSON.parse(evt.data);
        if (resp.id === 1) {
          // Now evaluate scrollWidth and overflowing elements
          ws.send(JSON.stringify({
            id: 2,
            method: 'Runtime.evaluate',
            params: {
              expression: `(() => {
                const w = window.innerWidth;
                const sw = document.documentElement.scrollWidth;
                const overflows = [];
                for (const el of document.querySelectorAll('body *')) {
                  const r = el.getBoundingClientRect();
                  if (r.right > w + 1) {
                    overflows.push({
                      tag: el.tagName,
                      id: el.id,
                      cls: typeof el.className === 'string' ? el.className : '',
                      right: Math.round(r.right),
                      width: Math.round(r.width),
                      parent: el.parentElement ? el.parentElement.tagName + '.' + el.parentElement.className : ''
                    });
                  }
                }
                return { innerWidth: w, scrollWidth: sw, overflowsCount: overflows.length, topOverflows: overflows.slice(0, 20) };
              })()`,
              returnByValue: true
            }
          }));
        } else if (resp.id === 2) {
          console.log(JSON.stringify(resp.result?.result?.value, null, 2));
          ws.close();
          edge.kill();
        }
      };
    });
  }).on('error', e => {
    console.error(e);
    edge.kill();
  });
}, 2000);
