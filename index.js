const express = require('express');
const axios = require('axios');
const app = express();

app.get('/', (req, res) => {
  res.send('WhatsApp API demo running!');
});

app.get('/send', async (req, res) => {
  try {
    const response = await axios.post(
      `https://graph.facebook.com/v17.0/${process.env.PHONE_NUMBER_ID}/messages`,
      {
        messaging_product: "whatsapp",
        to: process.env.TO_NUMBER,
        text: { body: "Hello from Replit demo!" }
      },
      {
        headers: { Authorization: `Bearer ${process.env.WHATSAPP_TOKEN}` }
      }
    );
    res.send("Message sent!");
  } catch (err) {
    res.status(500).send("Error sending message: " + err.message);
  }
});

app.listen(process.env.PORT || 3000, () => console.log("Server running"));
