const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const cors = require('cors');

const app = express();

// middleware
app.use(bodyParser.json());
app.use(cors());

// ✅ ROOT ROUTE (this fixes "Cannot GET /")
app.get('/', (req, res) => {
  res.send('Server is running 🚀');
});

// ✅ HEALTH CHECK (optional but smart)
app.get('/health', (req, res) => {
  res.status(200).send('OK');
});

// ✅ USE ENV VARIABLES (Render requirement)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

app.post('/send', async (req, res) => {
  const { email, message } = req.body;

  if (!email || !message) {
    return res.status(400).json({ error: 'Missing email or message' });
  }

  const mailOptions = {
    from: email,
    to: process.env.EMAIL_USER,
    subject: `New message from ${email}`,
    text: message
  };

  try {
    await transporter.sendMail(mailOptions);
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to send email' });
  }
});

// ✅ REQUIRED FOR RENDER
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});