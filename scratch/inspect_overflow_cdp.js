const { spawn } = require('child_process');
const http = require('http');

const edge = spawn('C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe', [
  '--headless',
  '--disable-gpu',
  '--remote-debugging-port=9222',
  '--window-size=320,600',
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
        const expr = `
          (() => {
            const winW = window.innerWidth;
            const docW = document.documentElement.scrollWidth;
            const bad = [];
            document.querySelectorAll('*').forEach(el => {
              const r = el.getBoundingClientRect();
              if (r.right > winW + 2) {
                bad.push({
                  tag: el.tagName,
                  cls: el.className ? (typeof el.className === 'string' ? el.className : el.className.baseVal) : '',
                  id: el.id,
                  w: Math.round(r.width),
                  r: Math.round(r.right),
                  text: (el.innerText || '').slice(0, 30).trim()
                });
              }
            });
            return { winW, docW, badCount: bad.length, bad: bad.slice(0, 20) };
          })()
        `;
        ws.send(JSON.stringify({
          id: 1,
          method: 'Runtime.evaluate',
          params: { expression: expr, returnByValue: true }
        }));
      };
      ws.onmessage = (evt) => {
        const resp = JSON.parse(evt.data);
        console.log(JSON.stringify(resp.result?.result?.value, null, 2));
        ws.close();
        edge.kill();
      };
    });
  }).on('error', e => {
    console.error(e);
    edge.kill();
  });
}, 2000);
