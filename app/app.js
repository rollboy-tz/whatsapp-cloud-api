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

app.post('/webhook', (req, res) => {
  // Hii itachapisha kila kitu kinachoingia kutoka Meta
  console.log("----------------------------");
  console.log("KUNA KITU KIMEINGIA KUTOKA META!");
  console.log(JSON.stringify(req.body, null, 2)); 
  console.log("----------------------------");

  res.sendStatus(200);
});

/* app.post('/webhook', async (req, res) => {
  // 1. Pokea meseji
  const message = req.body.entry?.[0]?.changes?.[0]?.value?.messages?.[0];

  if (message) {
    const from = message.from; // Hapa itachukua "255787885020"
    const text = message.text.body; // Hapa itachukua "habari"

    console.log(`Meseji imepokelewa kutoka ${from}: ${text}`);

    // 2. Tuma jibu
    try {
      await axios.post(
        `https://graph.facebook.com/v22.0/${process.env.PHONE_NUMBER_ID}/messages`,
        {
          messaging_product: "whatsapp",
          to: from,
          type: "text",
          text: { body: "Karibu! Mfumo wa Imarisha umepokea meseji yako." }
        },
        { 
          headers: { 
            Authorization: `Bearer ${process.env.WHATSAPP_TOKEN}`,
            'Content-Type': 'application/json'
          } 
        }
      );
      console.log("✅ Jibu limetumwa!");
    } catch (error) {
      // Hapa utaona kosa kama Token ni mbaya
      console.error("❌ Kosa la kutuma:", error.response?.data || error.message);
    }
  }

  

  res.sendStatus(200);
}); */
app.listen(3000, () => console.log("🚀 Server ya Imarisha iko hewani!"));