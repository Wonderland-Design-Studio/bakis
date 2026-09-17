const fs = require('fs');
const html = fs.readFileSync('bakis_raw.html', 'utf8');

const text = html.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
                 .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
                 .replace(/<[^>]+>/g, '\n');
const lines = text.split('\n').map(s => s.trim()).filter(Boolean);
fs.writeFileSync('bakis_content.txt', lines.join('\n'));
console.log('Total extracted lines:', lines.length);

const imgRegex = /<img[^>]+src=["']([^"']+)["']/gi;
let match;
const images = [];
while ((match = imgRegex.exec(html)) !== null) {
    images.push(match[1]);
}
fs.writeFileSync('bakis_images.json', JSON.stringify([...new Set(images)], null, 2));
console.log('Unique images found:', new Set(images).size);
