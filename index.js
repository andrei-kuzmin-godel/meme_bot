require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const getNumberOfMemesRequested = require('./getNumberOfMemesRequested');

const { TELEGRAM_TOKEN, SERVER_URL, TELEGRAM_API, WEBHOOK_ID, WEBHOOK_TOKEN, MEME_API } = process.env;
const TELEGRAM_BOT_URL = `${TELEGRAM_API}/bot${TELEGRAM_TOKEN}`;
const WEBHOOK_URI = `/webhook/${WEBHOOK_ID}`;
const WEBHOOK_URL = `${SERVER_URL}${WEBHOOK_URI}`;

const app = express();
app.use(bodyParser.json());

const setWebhookUrl = async () => {
  console.log(`setting webhook url to ${WEBHOOK_URL}`);
  const result = await axios.get(`${TELEGRAM_BOT_URL}/setWebhook?url=${WEBHOOK_URL}&secret_token=${WEBHOOK_TOKEN}`);

  console.log(result.data);
}

const getRandomMemeUrls = async (numberOfMemesRequested) => {
  const memesRaw = await axios.get(`${MEME_API}/gimme/${numberOfMemesRequested}`);
  const memesArray = memesRaw.data.memes;

  return memesArray.map(meme => meme.preview[meme.preview.length - 1]);
}

const sendPhoto = async (chatId, photo) => {
  await axios.post(`${TELEGRAM_BOT_URL}/sendPhoto`, {
    chat_id: chatId,
    photo
  })
}

const sendPhotos = async (chatId, photos) => {
  await Promise.all(photos.map(photo => sendPhoto(chatId, photo)));
}

app.listen(5000, async () => {
  console.log('app is running');
  await setWebhookUrl();
})

app.post(WEBHOOK_URI, async (req, res) => {
  const chatId = req.body.message.chat.id;
  const receivedMessage = req.body?.message?.text;
  const numberOfMemesRequested = getNumberOfMemesRequested(receivedMessage)
  
  const memeUrls = await getRandomMemeUrls(numberOfMemesRequested);
  await sendPhotos(chatId, memeUrls);

  return res.send();
})