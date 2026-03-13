const TelegramBot = require('node-telegram-bot-api');
const express = require('express');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// বট সেটআপ
const bot = new TelegramBot(process.env.BOT_TOKEN, { polling: true });

// মেমরিতে ভিডিও স্টোর
let videos = [];

// বুট করার সময় চ্যানেলের পুরানো ভিডিওগুলো নিয়ে আসি
async function loadOldVideos() {
  try {
    const updates = await bot.getUpdates();
    for (const update of updates) {
      if (update.channel_post && update.channel_post.video) {
        const msg = update.channel_post;
        const exists = videos.find(v => v.message_id === msg.message_id);
        if (!exists) {
          videos.push({
            id: msg.video.file_id,
            title: msg.caption || 'নতুন ভিডিও',
            date: msg.date,
            message_id: msg.message_id
          });
        }
      }
    }
    console.log(`${videos.length} টি ভিডিও লোড করা হলো`);
  } catch (error) {
    console.log('পুরানো ভিডিও লোড করতে সমস্যা:', error.message);
  }
}

// নতুন ভিডিও পেলে
bot.on('channel_post', (msg) => {
  if (msg.video) {
    const exists = videos.find(v => v.message_id === msg.message_id);
    if (!exists) {
      videos.push({
        id: msg.video.file_id,
        title: msg.caption || 'নতুন ভিডিও',
        date: msg.date,
        message_id: msg.message_id
      });
      console.log('নতুন ভিডিও যোগ হলো:', videos.length);
    }
  }
});

// API
app.get('/api/videos', (req, res) => {
  res.json(videos.reverse());
});

app.get('/api/video/:id', (req, res) => {
  res.json({ file_id: req.params.id });
});

// শুরুতে পুরানো ভিডিও লোড করি
loadOldVideos();

app.listen(port, () => {
  console.log(`সার্ভার পোর্ট ${port} এ চলছে`);
});
