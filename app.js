const TelegramBot = require('node-telegram-bot-api');
const express = require('express');
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// বট সেটআপ
const bot = new TelegramBot(process.env.BOT_TOKEN, { polling: true });

// ভিডিও স্টোরেজ ফাইল
const VIDEOS_FILE = './videos.json';

// ভিডিও লোড ফাংশন
function loadVideos() {
  if (fs.existsSync(VIDEOS_FILE)) {
    return JSON.parse(fs.readFileSync(VIDEOS_FILE));
  }
  return [];
}

// ভিডিও সেভ ফাংশন
function saveVideos(videos) {
  fs.writeFileSync(VIDEOS_FILE, JSON.stringify(videos, null, 2));
}

// চ্যানেলের নতুন পোস্ট দেখা
bot.on('channel_post', (msg) => {
  if (msg.video) {
    const videos = loadVideos();
    
    const videoData = {
      id: msg.video.file_id,
      title: msg.caption || 'নতুন ভিডিও',
      date: msg.date,
      message_id: msg.message_id,
      channel_id: msg.chat.id
    };
    
    videos.push(videoData);
    saveVideos(videos);
    
    console.log('নতুন ভিডিও স্টোর করা হলো:', videoData.title);
  }
});

// অ্যাপের জন্য API
app.get('/api/videos', (req, res) => {
  const videos = loadVideos();
  res.json(videos.reverse()); // নতুনগুলো আগে দেখাবে
});

app.get('/api/video/:id', (req, res) => {
  res.json({ file_id: req.params.id });
});

app.listen(port, () => {
  console.log(`সার্ভার পোর্ট ${port} এ চলছে`);
});
