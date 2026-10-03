const { exec } = require('child_process');
const fs = require('fs');

const testHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <link rel="stylesheet" href="assets/css/style.css">
  <style>
    body { background: #0b1523; padding: 30px; font-family: sans-serif; }
    .product-modal-backdrop { display: flex !important; opacity: 1 !important; visibility: visible !important; position: static !important; }
    .product-modal-box { transform: none !important; max-width: 820px; margin: 0 auto; }
  </style>
</head>
<body>
  <!-- Modal Preview Bi-Metal Lugs -->
  <div class="product-modal-backdrop active">
    <div class="product-modal-box">
      <button class="product-modal-close">&times;</button>
      <div class="product-modal-layout">
        <div class="product-modal-visual" style="background-color: #1e3352;">
          <div class="product-modal-badge">Cable Termination &amp; Jointing</div>
          <div class="product-modal-image-wrap">
            <img src="assets/images/product-bimetal-lugs-connectors.jpg" alt="Bi Metal Lugs and Connectors">
          </div>
        </div>
        <div class="product-modal-info">
          <div class="product-modal-header">
            <h3>Bi Metal Lugs &amp; Connectors</h3>
            <p class="product-modal-tagline">Friction-welded bi-metallic cable lugs, pin terminals, and connecting ferrules engineered for seamless aluminum-to-copper cable transitions and terminations.</p>
          </div>
          <div class="product-modal-specs">
            <div class="spec-badge"><span class="spec-label">Conductor Sizes</span><span class="spec-value">16mm² – 630mm² (Al to Cu)</span></div>
            <div class="spec-badge"><span class="spec-label">Manufacturing Process</span><span class="spec-value">Friction Welding (Solid Bond)</span></div>
            <div class="spec-badge"><span class="spec-label">Voltage Application</span><span class="spec-value">1kV – 36kV (LV & MV)</span></div>
            <div class="spec-badge"><span class="spec-label">Standards</span><span class="spec-value">IEC 61238-1 / SANS / Eskom</span></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</body>
</html>
`;

fs.writeFileSync('scratch/preview_bimetal_modal.html', testHtml);

const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const cmd = '"' + edgePath + '" --headless --disable-gpu --screenshot=scratch/bimetal_modal_preview.png --window-size=1200,850 http://127.0.0.1:8080/scratch/preview_bimetal_modal.html';

exec(cmd, (err) => {
  if (err) console.error(err);
  else console.log('Bi-Metal Modal Screenshot captured successfully');
});
