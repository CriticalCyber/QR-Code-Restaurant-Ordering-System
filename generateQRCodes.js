// backend/generateQRCodes.js
const QRCode = require("qrcode");
const fs = require("fs");
const path = require("path");
const { createCanvas, loadImage } = require("canvas");

const baseURL = "http://10.147.185.125:3000";
const outputDir = path.join(__dirname, "../qrcodes");
const logoPath = path.join(__dirname, "../assets/logo.png"); // replace with your logo path

// Ensure output folder exists
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir);
  console.log("📁 Created /qrcodes folder");
}

const generateForTable = async (tableNumber) => {
  const url = `${baseURL}?table=${tableNumber}`;
  const qrOptions = {
    errorCorrectionLevel: 'H',
    type: 'image/png',
    color: {
      dark: '#0a5275', // dark blue
      light: '#ffffff'
    },
    margin: 1,
    scale: 10
  };

  // Generate QR data URL
  const qrDataURL = await QRCode.toDataURL(url, qrOptions);
  const qrImage = await loadImage(qrDataURL);
  const logo = await loadImage(logoPath);

  const canvasSize = 500;
  const canvas = createCanvas(canvasSize, canvasSize + 80);
  const ctx = canvas.getContext("2d");

  // Background
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Draw QR code
  ctx.drawImage(qrImage, 50, 20, canvasSize - 100, canvasSize - 100);

  // Draw logo at the center of QR
  const logoSize = 80;
  const qrCenterX = canvas.width / 2;
  const qrCenterY = (canvasSize - 100) / 2 + 20;
  ctx.drawImage(
    logo,
    qrCenterX - logoSize / 2,
    qrCenterY - logoSize / 2,
    logoSize,
    logoSize
  );

  // Draw table number
  ctx.fillStyle = '#0a5275';
  ctx.font = 'bold 28px Arial';
  ctx.textAlign = 'center';
  ctx.fillText(`Table Number: ${tableNumber}`, canvas.width / 2, canvasSize + 40);

  // Save QR
  const qrFileName = path.join(outputDir, `table-${tableNumber}.png`);
  const out = fs.createWriteStream(qrFileName);
  const stream = canvas.createPNGStream();
  stream.pipe(out);
  out.on('finish', () => console.log(`✅ QR for Table ${tableNumber} saved to ${qrFileName}`));
};

// Batch generate QR codes
(async () => {
  for (let i = 1; i <= 10; i++) {
    await generateForTable(i);
  }
})();
