const TelegramBot = require('node-telegram-bot-api');
const express = require('express');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.send('বট চালু আছে');
});

app.listen(port, () => {
  console.log(`সার্ভার পোর্ট ${port} এ চলছে`);
});
