// backend/index.js
const express = require('express');
const app = express();

app.use('/images', express.static('public/images'));