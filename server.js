const express = require('express');
const fs = require('fs');
const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static('public')); // folder berisi HTML dan script.js

app.set('trust proxy', true); // biar Express percaya pada IP dari proxy

app.post('/simpan', (req, res) => {
  // Ambil IP asli dari pengunjung
  let ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.socket.remoteAddress;

  // Kalau bentuknya IPv6 (::ffff:xxx.xxx.xxx.xxx), ambil hanya bagian IPv4-nya
  if (ip && ip.includes('::ffff:')) {
    ip = ip.split('::ffff:')[1];
  }

  const waktu = new Date().toISOString();
  const dataBaru = { ip, waktu };
  const filePath = './database.json';
  let dataLama = [];

  // Baca file lama kalau ada
  if (fs.existsSync(filePath)) {
    try {
      dataLama = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    } catch {
      dataLama = [];
    }
  }

  dataLama.push(dataBaru);
  fs.writeFileSync(filePath, JSON.stringify(dataLama, null, 2));

  res.json({ status: 'OK', ip, waktu });
});

app.listen(PORT, () => console.log(`✅ Server jalan di http://localhost:${PORT}`));