const { execSync } = require('child_process');
const fs = require('fs');

const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const testHtml = `<!DOCTYPE html><html><body><iframe id="f" src="http://127.0.0.1:8080/" style="width:320px;height:600px;"></iframe><script>
  document.getElementById('f').onload = () => {
    setTimeout(() => {
      const win = document.getElementById('f').contentWindow;
      const winW = win.innerWidth;
      const bad = [];
      win.document.querySelectorAll('*').forEach(el => {
        const r = el.getBoundingClientRect();
        if (r.right > winW + 1) {
          bad.push({ tag: el.tagName, cls: (el.className && typeof el.className === 'string') ? el.className : '', id: el.id, right: Math.round(r.right), width: Math.round(r.width) });
        }
      });
      const p = document.createElement('pre');
      p.id = 'res';
      p.textContent = JSON.stringify(bad.slice(0, 20), null, 2);
      document.body.appendChild(p);
    }, 500);
  };
</script></body></html>`;

fs.writeFileSync('scratch/test_overflow.html', testHtml);
try {
  const out = execSync(`"${edgePath}" --headless --disable-gpu --dump-dom http://127.0.0.1:8080/scratch/test_overflow.html`, { timeout: 10000 }).toString();
  const m = out.match(/<pre id="res">([\s\S]*?)<\/pre>/);
  if (m) console.log(m[1]);
  else console.log('No pre found');
} catch (e) {
  console.error(e.message);
}
