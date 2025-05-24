// patch-https.js
const fs   = require('fs');
const http = require('http');
const https= require('https');


console.info(__dirname)

// 預讀證書
const key  = fs.readFileSync('./certs/lbtw.ca.starlbtwsys.20230719.20321231.key');
const cert = fs.readFileSync('./certs/lbtw.ca.starlbtwsys.20230719.20321231.pem');

// https.globalAgent.options.ca = fs.readFileSync('./certs/cert.pem');

// Monkey patch http.createServer
http.createServer = (listener) => https.createServer({ key, cert }, listener);
