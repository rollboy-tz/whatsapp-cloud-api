import express from 'express';
import axios from 'axios';
import chalk from 'chalk';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(express.json());

const {
  WHATSAPP_TOKEN,
  PHONE_NUMBER_ID,
  TO_NUMBER,
  PORT
} = process.env;

console.log(`Token ${WHATSAPP_TOKEN} \n Phone number ${PHONE_NUMBER_ID} \n To number ${TO_NUMBER}`)

app.get('/', (req, res) => {
  console.log(chalk.blue('📡 Health check hit'));
  res.send('WhatsApp API demo running');
});
/*
app.get('/send', async (req, res) => {
  console.log(chalk.yellow('📤 Sending WhatsApp message...'));

  try {
    await axios.post(
      `https://graph.facebook.com/v17.0/${PHONE_NUMBER_ID}/messages`,
      {
        messaging_product: 'whatsapp',
        to: TO_NUMBER,
        text: { body: 'Hello from Render WhatsApp API demo 🚀' }
      },
      {
        headers: {
          Authorization: `Bearer ${WHATSAPP_TOKEN}`,
          'Content-Type': 'application/json'
        }
      }
    );

    console.log(chalk.green('✅ Message sent successfully'));
    res.send('Message sent successfully');
  } catch (error) {
    console.log(chalk.red('❌ Failed to send message'));
    console.error(error.response?.data || error.message);
    res.status(500).send('Failed to send message');
  }
});
*/
app.listen(PORT || 3000, () => {
  console.log(
    chalk.green(`🚀 Server running on port ${PORT || 3000}`)
  );
});
