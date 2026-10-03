const http = require('http');
const fs = require('fs');
const { exec } = require('child_process');

const server = http.createServer((req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', '*');
  res.setHeader('Access-Control-Allow-Methods', '*');

  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    return res.end();
  }

  if (req.url === '/save-png' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      try {
        const json = JSON.parse(body);
        const base64Data = json.data.replace(/^data:image\/png;base64,/, '');
        fs.writeFileSync('assets/images/product-ipc-connector-trans.png', Buffer.from(base64Data, 'base64'));
        console.log('SAVED_SUCCESSFULLY');
        res.writeHead(200);
        res.end('SAVED_SUCCESSFULLY');
        setTimeout(() => process.exit(0), 1000);
      } catch (err) {
        console.error('Error saving:', err);
        res.writeHead(500);
        res.end(err.message);
      }
    });
    return;
  }

  // Serve static files
  let p = req.url.split('?')[0];
  if (p === '/') p = '/scratch/process_ipc.html';
  const filePath = '.' + p;
  if (fs.existsSync(filePath)) {
    if (filePath.endsWith('.html')) res.writeHead(200, { 'Content-Type': 'text/html' });
    else if (filePath.endsWith('.jpg')) res.writeHead(200, { 'Content-Type': 'image/jpeg' });
    else res.writeHead(200);
    fs.createReadStream(filePath).pipe(res);
  } else {
    res.writeHead(404);
    res.end('Not found');
  }
});

server.listen(8089, '127.0.0.1', () => {
  console.log('Listening on 8089, launching headless Edge...');
  const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
  exec(`"${edgePath}" --headless --disable-gpu http://127.0.0.1:8089/`, (err) => {
    if (err) console.error('Edge exec err:', err.message);
  });
});
