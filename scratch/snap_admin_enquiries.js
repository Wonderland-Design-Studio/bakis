const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const harnessHtml = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="margin: 0; background: #0f172a;">
  <iframe id="testFrame" src="http://127.0.0.1:8080/" style="width: 1400px; height: 900px; border: none;"></iframe>
  <script>
    const frame = document.getElementById('testFrame');
    frame.onload = function() {
      setTimeout(() => {
        const win = frame.contentWindow;
        const doc = frame.contentDocument || win.document;

        // Populate sample leads with various products
        const sampleLeads = [
          {
            id: 'lead_101',
            name: 'City Power Johannesburg',
            email: 'procurement@citypower.co.za',
            product: 'Circuit Breakers',
            message: 'Urgent RFQ for 50x 400V - 36kV Vacuum & SF6 Circuit Breakers for substation upgrade.',
            recipients: ['tsoanelomodise@gmail.com', 'krubashni@bakis.co.za'],
            submittedAt: new Date(Date.now() - 1000 * 60 * 25).toISOString()
          },
          {
            id: 'lead_102',
            name: 'Eskom Distribution East',
            email: 'leads@eskom.co.za',
            product: 'Bi Metal Lugs & Connectors',
            message: 'Need technical datasheets and volume quotation for 1200x 16mm² - 630mm² friction-welded bi-metal cable lugs.',
            recipients: ['tsoanelomodise@gmail.com', 'krubashni@bakis.co.za'],
            submittedAt: new Date(Date.now() - 1000 * 60 * 110).toISOString()
          },
          {
            id: 'lead_103',
            name: 'Ekurhuleni Energy Directorate',
            email: 'energy@ekurhuleni.gov.za',
            product: 'Insulation Piercing Connectors (IPC)',
            message: 'Requesting RFQ for IPC connectors across all tap ranges for overhead ABC line reticulation.',
            recipients: ['tsoanelomodise@gmail.com', 'krubashni@bakis.co.za'],
            submittedAt: new Date(Date.now() - 1000 * 60 * 240).toISOString()
          },
          {
            id: 'lead_104',
            name: 'Kempton Engineering Services',
            email: 'info@kemptoneng.co.za',
            product: 'General Enquiry',
            message: 'Requesting company profile and full product catalogue for municipal tender submission.',
            recipients: ['tsoanelomodise@gmail.com', 'krubashni@bakis.co.za'],
            submittedAt: new Date(Date.now() - 1000 * 60 * 480).toISOString()
          }
        ];

        win.localStorage.setItem('bakis_inquiry_leads', JSON.stringify(sampleLeads));
        win.sessionStorage.setItem('bakis_admin_auth_v1', 'true');
        win.sessionStorage.setItem('bakis_admin_user', 'tsoanelomodise@gmail.com');

        // Open Admin modal directly to Enquiries tab
        doc.getElementById('openAdminBtn').click();
        doc.getElementById('tabEnquiries').click();
      }, 500);
    };
  </script>
</body>
</html>
`;

fs.writeFileSync('scratch/snap_enquiries.html', harnessHtml);

const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const outFile = path.resolve(__dirname, 'admin_enquiries_preview.png');
const url = 'http://127.0.0.1:8080/scratch/snap_enquiries.html';

try {
  execSync(`"${edgePath}" --headless --disable-gpu --screenshot="${outFile}" --window-size=1400,900 ${url}`);
  console.log('Saved admin enquiries screenshot to:', outFile);
} catch (e) {
  console.error('Error taking screenshot:', e.message);
}
