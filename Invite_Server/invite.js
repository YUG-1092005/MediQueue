const express = require("express");
const app = express();
const connectDB = require("./config/db.js");
const cors = require("cors");
const bcrypt = require("bcrypt");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const User = require("./models/userModel.js");
const Clinic = require("./models/clinicsModel.js");
const nodemailer = require("nodemailer");
require("dotenv").config();
const Invite = require("./models/inviteModel");

const PORT = process.env.VITE_EMAIL_PORT || 5000;

app.use(cookieParser());
app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

connectDB();

app.use(cors());
// CORS configuration
app.use(
  cors({
    origin: (origin, callback) => {
      if (origin === process.env.VITE_FRONTEND_URL || origin === "http://localhost:5173") {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Content-Type"],
    credentials: true,
  })
);

app.use(express.json());

// Send Clinic Invite Email
app.post("/send-invite-email", async (req, res) => {
  const { email, name, link, role, clinicId, inviteId } = req.body;
  console.log("Received invite data:", req.body);
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);
  try {
    const clinic = await Clinic.findById(clinicId);
    if (!clinic) {
      return res.status(404).json({ message: "Clinic not found." });
    }

    const clinicName = clinic.clinicName || "Clinic";

    // Save invite to DB
    const newInvite = new Invite({
      clinicId,
      email,
      role,
      inviteId,
      expiresAt,
    });

    await newInvite.save();

    const transporter = nodemailer.createTransport({
      service: "gmail",
      secure: true,
      port: 465,
      auth: {
        user: process.env.VITE_EMAIL_USER,
        pass: process.env.VITE_EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.VITE_EMAIL_USER,
      to: email,
      subject: `You're Invited to Join ${clinicName} on MediQueue Platform`,
      html: `
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; background-color: #f4f4f4; border-radius: 10px; box-shadow: 0 0 10px rgba(0,0,0,0.1);">
    <h2 style="color: #2e6cf6;">You're Invited to Join ${clinicName}</h2>
    <p>Hi <strong>${name}</strong>,</p>
    <p>You've been invited to join a clinic on <strong>${clinicName}</strong> as a <strong>${role}</strong>.</p>
    <p>Click the button below to accept your invitation:</p>
    
    <div style="text-align: center; margin: 30px 0;">
      <a href="${link}" style="background-color: #2e6cf6; color: white; padding: 12px 25px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">
        Accept Invite
      </a>
    </div>

    <p>This invite is valid for <strong>24 hours</strong> and can only be used once.</p>
    <p>If the button doesn't work, copy and paste this link into your browser:</p>
    <p style="word-break: break-all; color: #666;">${link}</p>

    <hr style="margin-top: 40px;"/>
    <p style="font-size: 13px; color: #888;">Thanks & Regards,<br/>The MediQueue Team</p>
    <p style="font-size: 12px; color: #bbb;">This is an automated email — please do not reply.</p>
  </div>
`,
    };

    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: "Invite email sent!" });
  } catch (err) {
    console.error("Error sending email:", err);
    res.status(500).json({ message: "Failed to send invite email." });
  }
});

// Validate Invite
app.get("/api/invite/validate/:clinicId/:inviteId", async (req, res) => {
  const { clinicId, inviteId } = req.params;

  try {
    const invite = await Invite.findOne({ clinicId, inviteId });

    if (!invite) {
      return res.status(404).json({ message: "Invite not found" });
    }

    if (invite.used) {
      return res.status(400).json({ message: "Invite already used" });
    }

    if (new Date() > invite.expiresAt) {
      return res.status(400).json({ message: "Invite has expired" });
    }

    res.status(200).json({
      email: invite.email,
      role: invite.role,
      inviteId: invite.inviteId,
      clinicId: invite.clinicId,
    });
  } catch (error) {
    console.error("Validation error:", error);
    res.status(500).json({ message: "Server error while validating invite" });
  }
});

//  Accept Invite
app.post("/api/invite/accept", async (req, res) => {
  const { clinicId, inviteId, fullName, email, password, role, personalPhone } =
    req.body;
  console.log(
    "Accepting invite with data:",
    clinicId,
    inviteId,
    fullName,
    email,
    password,
    role,
    personalPhone
  );

  try {
    const invite = await Invite.findOne({ clinicId, inviteId });

    if (!invite) {
      return res.status(404).json({ message: "Invite not found" });
    }

    if (invite.used) {
      return res.status(400).json({ message: "Invite already used" });
    }

    if (new Date() > invite.expiresAt) {
      return res.status(400).json({ message: "Invite has expired" });
    }

    let user = await User.findOne({ email });

    const hashedPassword = await bcrypt.hash(password, 10);

    if (!user) {
      user = new User({
        name: fullName,
        email,
        personalPhone,
        password: hashedPassword,
        organizationType: "user",
        clinicMemberships: [
          {
            clinicId,
            role,
            averageConsultationTime: 10,
            totalPatientsServed: 0,
          },
        ],
      });
    } else {
      const alreadyMember = user.clinicMemberships?.some(
        (m) => m.clinicId.toString() === clinicId
      );

      if (alreadyMember) {
        return res
          .status(400)
          .json({ message: "Already a member of this clinic." });
      }

      user.clinicMemberships.push({
        clinicId,
        role,
        averageConsultationTime: 10,
        totalPatientsServed: 0,
      });
    }

    await user.save();

    // Mark invite as used
    invite.used = true;
    await invite.save();

    return res
      .status(200)
      .json({ message: "Invite accepted, user onboarded." });
  } catch (err) {
    console.error("Error accepting invite:", err);
    return res.status(500).json({ message: "Server error accepting invite." });
  }
});

app.use((req, res, next) => {
  console.log(`CORS Request: ${req.method} ${req.url}`);
  next();
});

app.listen(PORT, () => {
  console.log(`Invite Server listening on port ${PORT}`);
});
