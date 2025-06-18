const express = require("express");
const nodemailer = require("nodemailer");
const router = express.Router();
require("dotenv").config();

// Contact form route
router.post("/", async (req, res) => {
  const { name, email, organization, message } = req.body;

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.VITE_EMAIL_USER,
      pass: process.env.VITE_EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: `"${name}" <${email}>`,
    to: process.env.VITE_EMAIL_USER,
    subject: `New Contact Form Submission from ${name}`,
    html: `
      <h3>Contact Details</h3>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Organization:</strong> ${organization}</p>
      <p><strong>Message:</strong></p>
      <p>${message}</p>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.json({ success: true });
  } catch (err) {
    console.error("Email sending error:", err);
    res.status(500).json({ success: false, message: "Failed to send email" });
  }
});

// Feedback form route
router.post("/feedback", async (req, res) => {
  const { name, email, feedback } = req.body;
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.VITE_EMAIL_USER,
      pass: process.env.VITE_EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: `"${name}" <${email}>`,
    to: process.env.VITE_EMAIL_USER,
    subject: `New Feedback from About Page`,
    html: `
      <h3>Feedback Received</h3>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Feedback:</strong></p>
      <p>${feedback}</p>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.json({ success: true });
  } catch (err) {
    console.error("Feedback email error:", err);
    res
      .status(500)
      .json({ success: false, message: "Failed to send feedback" });
  }
});

module.exports = router;
