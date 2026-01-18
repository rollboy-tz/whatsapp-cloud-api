import express from 'express';
import axios from 'axios';
import chalk from 'chalk';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(express.json());

const { WHATSAPP_TOKEN, PHONE_NUMBER_ID, VERIFY_TOKEN, PORT } = process.env;

// 1. WEBHOOK VERIFICATION (Kwa ajili ya Meta ku-verify server yako)
app.get('/webhook', (req, res) => {
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  if (mode && token) {
    if (mode === 'subscribe' && token === VERIFY_TOKEN) {
      console.log(chalk.green('✅ WEBHOOK_VERIFIED'));
      res.status(200).send(challenge);
    } else {
      res.sendStatus(403);
    }
  }
});

// 2. WEBHOOK RECEIVER (Hapa ndipo meseji za wateja zinaingia)
app.post('/webhook', async (req, res) => {
  const body = req.body;

  if (body.object) {
    if (body.entry && body.entry[0].changes && body.entry[0].changes[0].value.messages) {
      const message = body.entry[0].changes[0].value.messages[0];
      const from = message.from; // Namba ya mteja (Wewe)
      const msgBody = message.text ? message.text.body.toLowerCase() : "";

      console.log(chalk.cyan(`📩 Meseji imeingia kutoka ${from}: "${msgBody}"`));

      // LOGIC: Kama mteja akiandika "habari", mfumo unajibu na Options
      if (msgBody.includes("habari") || msgBody.includes("mambo")) {
        await sendInteractiveButtons(from);
      } else {
        // Jibu la kawaida kama haijaelewa
        await sendTextMessage(from, "Karibu Imarisha Mikopo! Andika 'Habari' ili kuona huduma zetu.");
      }
    }
    res.sendStatus(200);
  } else {
    res.sendStatus(404);
  }
});

// 3. FUNCTION YA KUTUMA OPTIONS (Buttons)
async function sendInteractiveButtons(to) {
  try {
    await axios.post(
      `https://graph.facebook.com/v22.0/${PHONE_NUMBER_ID}/messages`,
      {
        messaging_product: "whatsapp",
        to: to,
        type: "interactive",
        interactive: {
          type: "button",
          body: { text: "Karibu Imarisha Mikopo! Unahitaji nini leo?" },
          action: {
            buttons: [
              { type: "reply", reply: { id: "omba_mkopo", title: "Omba Mkopo" } },
              { type: "reply", reply: { id: "hali_ya_mkopo", title: "Hali ya Mkopo" } }
            ]
          }
        }
      },
      { headers: { Authorization: `Bearer ${WHATSAPP_TOKEN}` } }
    );
    console.log(chalk.green(`✅ Buttons zimetumwa kwa ${to}`));
  } catch (error) {
    console.error(chalk.red('❌ Error kutuma buttons:'), error.response?.data || error.message);
  }
}

// 4. FUNCTION YA KUTUMA MESEJI YA KAWAIDA
async function sendTextMessage(to, text) {
  try {
    await axios.post(
      `https://graph.facebook.com/v22.0/${PHONE_NUMBER_ID}/messages`,
      {
        messaging_product: "whatsapp",
        to: to,
        text: { body: text }
      },
      { headers: { Authorization: `Bearer ${WHATSAPP_TOKEN}` } }
    );
  } catch (error) {
    console.error(chalk.red('❌ Error kutuma meseji:'), error.response?.data || error.message);
  }
}

app.listen(PORT || 3000, () => {
  console.log(chalk.green(`🚀 Server inafanya kazi kwenye port ${PORT || 3000}`));
});