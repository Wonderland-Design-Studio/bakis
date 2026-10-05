const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const harnessHtml = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="font-family: monospace; padding: 20px; background: #fff; color: #111;">
  <h2>Contact Form &amp; Enquiries Test Harness</h2>
  <iframe id="testFrame" src="http://127.0.0.1:8080/" style="width: 1280px; height: 900px; border: 1px solid #ccc;" onload="runFrameTests()"></iframe>
  <pre id="output" style="font-size: 14px; background: #f4f4f4; padding: 15px; border-radius: 8px; margin-top: 20px;"></pre>
  <script>
    function runFrameTests() {
      setTimeout(() => {
        const frame = document.getElementById('testFrame');
        const doc = frame.contentDocument || frame.contentWindow.document;
        const win = frame.contentWindow;

        try {
          const select = doc.getElementById('contactProduct');
          const subj = doc.getElementById('formSubjectHidden');
          const comm = doc.getElementById('formCommodityHidden');
          const prodInt = doc.getElementById('formProductInterestHidden');
          const form = doc.getElementById('contactForm');

          const log = [];
          log.push('TEST 1: Initial state -> select: "' + select.value + '" | subject: "' + subj.value + '"');

          // Test direct select: Circuit Breakers
          select.value = 'Circuit Breakers';
          select.dispatchEvent(new Event('change'));
          log.push('TEST 2: Pick "Circuit Breakers" -> select: "' + select.value + '" | commodity: "' + comm.value + '" | subject: "' + subj.value + '"');

          // Test direct select: Bi Metal Lugs
          select.value = 'Bi Metal Lugs & Connectors';
          select.dispatchEvent(new Event('change'));
          log.push('TEST 3: Pick "Bi Metal Lugs & Connectors" -> select: "' + select.value + '" | commodity: "' + comm.value + '" | subject: "' + subj.value + '"');

          // Submit inquiry for Bi Metal Lugs
          doc.getElementById('contactName').value = 'Apex Municipal Power';
          doc.getElementById('contactEmail').value = 'apex@power.gov.za';
          doc.getElementById('contactMessage').value = 'Urgent quote for 500 Bi Metal Lugs.';
          
          // Mock fetch
          win.fetch = async () => ({ ok: true, json: async () => ({ success: true }) });
          form.dispatchEvent(new Event('submit', { cancelable: true }));

          const leads = JSON.parse(win.localStorage.getItem('bakis_inquiry_leads') || '[]');
          log.push('TEST 4: Saved lead in vault -> product: "' + (leads[0] ? leads[0].product : 'none') + '" | name: "' + (leads[0] ? leads[0].name : 'none') + '"');

          // Test RFQ button from product card: Circuit Breakers
          const cbTile = doc.querySelector('[data-product="circuit-breakers"]');
          if (cbTile) {
            cbTile.click();
            const rfqBtn = doc.getElementById('productModalRfqBtn');
            if (rfqBtn) {
              rfqBtn.click();
              log.push('TEST 5: Modal RFQ clicked for "Circuit Breakers" -> dropdown value: "' + select.value + '" | subject: "' + subj.value + '"');
            }
          }

          // Test RFQ button from product card: IPC
          const ipcTile = doc.querySelector('[data-product="ipc-connectors"]');
          if (ipcTile) {
            ipcTile.click();
            const rfqBtn = doc.getElementById('productModalRfqBtn');
            if (rfqBtn) {
              rfqBtn.click();
              log.push('TEST 6: Modal RFQ clicked for "IPC" -> dropdown value: "' + select.value + '" | subject: "' + subj.value + '"');
            }
          }

          // Test Admin Portal Customer Enquiries Tab
          win.sessionStorage.setItem('bakis_admin_auth_v1', 'true');
          win.sessionStorage.setItem('bakis_admin_user', 'tsoanelomodise@gmail.com');
          doc.getElementById('openAdminBtn').click();
          doc.getElementById('tabEnquiries').click();

          const tableBody = doc.getElementById('adminEnquiriesTableBody');
          const rows = tableBody ? tableBody.querySelectorAll('tr').length : 0;
          const badgeFound = tableBody && tableBody.innerHTML.includes('enquiry-badge-product');
          log.push('TEST 7: Admin Enquiries Vault -> rows: ' + rows + ' | emerald product badge rendered: ' + (badgeFound ? 'YES' : 'NO'));

          document.getElementById('output').textContent = log.join('\\n');
          window.TEST_COMPLETED = true;
        } catch (err) {
          document.getElementById('output').textContent = 'ERROR: ' + (err.stack || err.message);
          window.TEST_COMPLETED = true;
        }
      }, 500);
    }
  </script>
</body>
</html>
`;

if (!fs.existsSync('scratch')) {
  fs.mkdirSync('scratch');
}
fs.writeFileSync('scratch/harness.html', harnessHtml);
console.log('Harness written to scratch/harness.html');

const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const outFile = path.resolve(__dirname, 'test_output.png');
const harnessUrl = 'http://127.0.0.1:8080/scratch/harness.html';

try {
  // Give it a moment to run tests and render
  execSync(`"${edgePath}" --headless --disable-gpu --screenshot="${outFile}" --window-size=1280,1024 ${harnessUrl}`);
  console.log('Test harness screenshot saved to:', outFile);
} catch (e) {
  console.error('Execution error:', e.message);
}
