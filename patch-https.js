// patch-https.js
const fs   = require('fs');
const http = require('http');
const https= require('https');

// 預讀證書
const key  = fs.readFileSync('./certs/key.pem');
const cert = fs.readFileSync('./certs/cert.pem');

// https.globalAgent.options.ca = fs.readFileSync('./certs/cert.pem');

// Monkey patch http.createServer
http.createServer = (listener) => https.createServer({ key, cert }, listener);
