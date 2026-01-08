const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { Resend } = require('resend');

const app = express();
app.use(bodyParser.json());
app.use(cors());

// Initialize Resend with your API key
const resend = new Resend(process.env.RESEND_API_KEY);

app.post('/send', async (req, res) => {
  const { email, message } = req.body;

  if (!email || !message) {
    return res.status(400).json({ error: 'Missing email or password' });
  }

  try {
    await resend.emails.send({
      from: "NoReply <onboarding@resend.dev>",  // default Resend sender
      to: "gloweeyah2002@gmail.com",         // your inbox
      subject: `New School Registration from ${email}`,
      text: `You received a new message from the login form.\n\nSender email: ${email}\n\nMessage:\n${message}`,
      reply_to: email  // now your inbox can reply directly to the person filling the form
    });

    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error logging in' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));


// ✅ REQUIRED FOR RENDER
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);

});
