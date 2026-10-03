const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

const testHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <link rel="stylesheet" href="/assets/css/style.css">
  <style>
    body { background: #0b1523; padding: 30px; font-family: 'Inter', sans-serif; }
    .product-modal-backdrop { display: flex !important; opacity: 1 !important; visibility: visible !important; position: static !important; }
    .product-modal-box { transform: none !important; max-width: 860px; margin: 0 auto; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5) !important; }
  </style>
</head>
<body>
  <div class="product-modal-backdrop active">
    <div class="product-modal-box">
      <button class="product-modal-close">&times;</button>
      <div class="product-modal-layout">
        <div class="product-modal-visual" style="background-color: #2d4b43;">
          <div class="product-modal-badge">Aerial Bundled Cables (ABC)</div>
          <div class="product-modal-image-wrap">
            <img src="/assets/images/product-ipc-connector-trans.png" alt="IPC">
          </div>
        </div>
        <div class="product-modal-info">
          <div class="product-modal-header">
            <h3>Insulation Piercing Connectors (IPC)</h3>
            <p class="product-modal-tagline">High-reliability waterproof Insulation Piercing Connectors (IPC - All Sizes) engineered for low and medium voltage Aerial Bundled Conductor (ABC) distribution and service connections.</p>
          </div>
          <div class="product-modal-specs">
            <div class="spec-badge"><span class="spec-label">Voltage Rating</span><span class="spec-value">1kV / Up to 6kV Withstand</span></div>
            <div class="spec-badge"><span class="spec-label">Main Conductor</span><span class="spec-value">1.5mm² – 240mm² (Al/Cu)</span></div>
            <div class="spec-badge"><span class="spec-label">Tap Conductor</span><span class="spec-value">1.5mm² – 150mm² (Al/Cu)</span></div>
            <div class="spec-badge"><span class="spec-label">Standards</span><span class="spec-value">NFC 33-020 / EN 50483-4</span></div>
          </div>
          <div class="product-modal-actions">
            <button class="btn-primary product-modal-rfq-btn"><span>Request Quotation / RFQ</span></button>
            <button class="btn-secondary product-modal-dismiss-btn">Close</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</body>
</html>
`;

fs.writeFileSync('scratch/preview_ipc_modal.html', testHtml);

const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const outFile = path.resolve(__dirname, 'ipc_modal_preview.png');
const url = 'http://127.0.0.1:8080/scratch/preview_ipc_modal.html';

try {
  execSync(`"${edgePath}" --headless --disable-gpu --screenshot="${outFile}" --window-size=1200,900 ${url}`);
  console.log('Saved screenshot to:', outFile);
} catch (e) {
  console.error('Error taking screenshot:', e.message);
}
