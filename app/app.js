import express from 'express';
import axios from 'axios';
import 'dotenv/config';

const app = express();
app.use(express.json());

// 1. WEBHOOK VERIFICATION (Inabaki hivi hivi kwa ajili ya Meta)
app.get('/webhook', (req, res) => {
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  if (mode === 'subscribe' && token === process.env.VERIFY_TOKEN) {
    res.status(200).send(challenge);
  } else {
    res.sendStatus(403);
  }
});

// 2. WEBHOOK RECEIVER (Kupokea na kurudisha jibu)
app.post('/webhook', async (req, res) => {
  const body = req.body;

  // Angalia kama kuna meseji imeingia
  if (body.object && body.entry?.[0]?.changes?.[0]?.value?.messages?.[0]) {
    const from = body.entry[0].changes[0].value.messages[0].from; // Namba ya mteja
    const msgText = body.entry[0].changes[0].value.messages[0].text.body; // Meseji aliyoandika

    console.log(`📩 Mteja (${from}) ameandika: ${msgText}`);

    // JARIBIO LA KUREPLY: Tunatuma meseji ya kawaida
    try {
      await axios.post(
        `https://graph.facebook.com/v22.0/${process.env.PHONE_NUMBER_ID}/messages`,
        {
          messaging_product: "whatsapp",
          to: from,
          type: "text",
          text: { body: `Asante kwa kuwasiliana na Imarisha Mikopo! Tumepokea meseji yako: "${msgText}"` }
        },
        { headers: { Authorization: `Bearer ${process.env.WHATSAPP_TOKEN}` } }
      );
      console.log("✅ Jibu limetumwa kwa mafanikio!");
    } catch (error) {
      console.error("❌ Kosa limetokea:", error.response?.data || error.message);
    }
  }

  res.sendStatus(200); // Lazima umjibu Meta "200 OK"
});

app.listen(3000, () => console.log("🚀 Server ya Imarisha iko hewani!"));