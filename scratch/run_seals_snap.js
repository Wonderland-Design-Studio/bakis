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
  <!-- Modal Preview Seals Tool-less -->
  <div class="product-modal-backdrop active">
    <div class="product-modal-box">
      <button class="product-modal-close">&times;</button>
      <div class="product-modal-layout">
        <div class="product-modal-visual" style="background-color: #1a365d;">
          <div class="product-modal-badge">Tamper-Evident Security</div>
          <div class="product-modal-image-wrap">
            <img src="/assets/images/product-seals-tool-less.jpg" alt="Seals Tool-less">
          </div>
        </div>
        <div class="product-modal-info">
          <div class="product-modal-header">
            <h3>Seals Tool-less (All Colours)</h3>
            <p class="product-modal-tagline">High-security tamper-evident polycarbonate meter and infrastructure seals (All Colours) engineered for Eskom, municipal utility metering, and substation distribution panels.</p>
          </div>
          <div class="product-modal-specs">
            <div class="spec-badge"><span class="spec-label">Available Colours</span><span class="spec-value">Red, Blue, Green, Yellow, Orange</span></div>
            <div class="spec-badge"><span class="spec-label">Installation</span><span class="spec-value">Tool-Less Manual Twist / Snap</span></div>
            <div class="spec-badge"><span class="spec-label">Body Material</span><span class="spec-value">UV Polycarbonate (Clear Body)</span></div>
            <div class="spec-badge"><span class="spec-label">Utility Approval</span><span class="spec-value">Eskom & Municipal Approved</span></div>
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

fs.writeFileSync('scratch/preview_seals_modal.html', testHtml);

const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const outFile = path.resolve(__dirname, 'seals_modal_preview.png');
const url = 'http://127.0.0.1:8080/scratch/preview_seals_modal.html';

try {
  execSync(`"${edgePath}" --headless --disable-gpu --screenshot="${outFile}" --window-size=1200,900 ${url}`);
  console.log('Saved screenshot to:', outFile);
} catch (e) {
  console.error('Error taking screenshot:', e.message);
}
