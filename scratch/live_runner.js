const http = require('http');
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// We create a temporary reporting endpoint on port 8089 to receive the test logs from Edge
let resultsReceived = null;

const reportServer = http.createServer((req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  if (req.method === 'POST') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      try {
        resultsReceived = JSON.parse(body);
        console.log('=== TEST RESULTS RECEIVED ===');
        resultsReceived.forEach(r => console.log(r));
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ status: 'ok' }));
      } catch (e) {
        console.error('Error parsing body:', e);
        res.writeHead(400);
        res.end();
      }
    });
  }
});

reportServer.listen(8089, async () => {
  const runnerHtml = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body>
  <iframe id="testFrame" src="http://127.0.0.1:8080/" style="width: 1280px; height: 800px;"></iframe>
  <script>
    const frame = document.getElementById('testFrame');
    frame.onload = function() {
      setTimeout(async () => {
        const doc = frame.contentDocument || frame.contentWindow.document;
        const win = frame.contentWindow;
        const log = [];

        try {
          const select = doc.getElementById('contactProduct');
          const subj = doc.getElementById('formSubjectHidden');
          const comm = doc.getElementById('formCommodityHidden');
          const prodInt = doc.getElementById('formProductInterestHidden');
          const form = doc.getElementById('contactForm');

          log.push('1. Initial dropdown value: "' + select.value + '" | subject: "' + subj.value + '"');

          // Test A: Direct Selection of Circuit Breakers
          select.value = 'Circuit Breakers';
          select.dispatchEvent(new Event('change'));
          log.push('2. Picked "Circuit Breakers" -> select.value: "' + select.value + '", commodity: "' + comm.value + '", subject: "' + subj.value + '"');

          // Test B: Direct Selection of Bi Metal Lugs
          select.value = 'Bi Metal Lugs & Connectors';
          select.dispatchEvent(new Event('change'));
          log.push('3. Picked "Bi Metal Lugs & Connectors" -> select.value: "' + select.value + '", commodity: "' + comm.value + '", subject: "' + subj.value + '"');

          // Test C: Submit Inquiry for Bi Metal Lugs
          doc.getElementById('contactName').value = 'Eskom Transmission';
          doc.getElementById('contactEmail').value = 'procurement@eskom.co.za';
          doc.getElementById('contactMessage').value = 'Please provide quote for 250 Bi-Metal Lugs.';
          
          win.fetch = async (url, opts) => {
            const parsed = JSON.parse(opts.body);
            log.push('FETCH payload Product: "' + parsed.Product + '", Commodity: "' + parsed.Commodity + '", subject: "' + parsed._subject + '"');
            return { ok: true, json: async () => ({ success: true }) };
          };

          // Clear prior localStorage leads for clean test
          win.localStorage.removeItem('bakis_inquiry_leads');

          form.dispatchEvent(new Event('submit', { cancelable: true }));

          // Wait for async fetch and lead storage
          await new Promise(r => setTimeout(r, 200));

          const leads = JSON.parse(win.localStorage.getItem('bakis_inquiry_leads') || '[]');
          log.push('4. Saved lead in localStorage -> product: "' + (leads[0]?.product) + '", name: "' + (leads[0]?.name) + '"');

          // Test D: Open Circuit Breakers Modal & click RFQ
          const cbTile = doc.querySelector('[data-product="circuit-breakers"]');
          if (cbTile) {
            cbTile.click();
            const rfqBtn = doc.getElementById('productModalRfqBtn');
            if (rfqBtn) {
              rfqBtn.click();
              log.push('5. Modal RFQ for Circuit Breakers -> dropdown selected: "' + select.value + '", subject: "' + subj.value + '"');
            }
          }

          // Test E: Open IPC Modal & click RFQ
          const ipcTile = doc.querySelector('[data-product="ipc-connectors"]');
          if (ipcTile) {
            ipcTile.click();
            const rfqBtn = doc.getElementById('productModalRfqBtn');
            if (rfqBtn) {
              rfqBtn.click();
              log.push('6. Modal RFQ for IPC -> dropdown selected: "' + select.value + '", subject: "' + subj.value + '"');
            }
          }

          // Test F: Admin Portal Customer Enquiries Tab
          win.sessionStorage.setItem('bakis_admin_auth_v1', 'true');
          win.sessionStorage.setItem('bakis_admin_user', 'tsoanelomodise@gmail.com');
          doc.getElementById('openAdminBtn').click();
          doc.getElementById('tabEnquiries').click();

          const tableBody = doc.getElementById('adminEnquiriesTableBody');
          const rows = tableBody ? tableBody.querySelectorAll('tr').length : 0;
          const badgeHtml = tableBody ? tableBody.querySelector('.enquiry-badge-product')?.textContent?.trim() : 'NONE';
          log.push('7. Admin Enquiries Vault -> total rows: ' + rows + ', badge text: "' + badgeHtml + '"');

        } catch (err) {
          log.push('ERROR: ' + (err.stack || err.message));
        }

        // Send results back to runner
        await fetch('http://127.0.0.1:8089/report', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(log)
        });
      }, 700);
    };
  </script>
</body>
</html>
  `;

  fs.writeFileSync('scratch/runner.html', runnerHtml);

  const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
  const runnerUrl = 'http://127.0.0.1:8080/scratch/runner.html';

  try {
    execSync(`"${edgePath}" --headless --disable-gpu ${runnerUrl}`, { timeout: 10000 });
  } catch (e) {
    // Edge may timeout or finish
  }

  setTimeout(() => {
    reportServer.close();
    process.exit(0);
  }, 1000);
});
