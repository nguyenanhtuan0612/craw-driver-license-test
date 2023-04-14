const express = require('express');
const app = express();
const fs = require('fs');
const https = require('https');

const key = fs.readFileSync('./cert/CA/localhost/localhost.decrypted.key');
const cert = fs.readFileSync('./cert/CA/localhost/localhost.crt');

app.get('/', function (req, res) {
  res.send('Hello');
});

const server = https.createServer({ key, cert }, app);

server.listen(3000, () => {
  console.log('https://localhost:3000');
});
