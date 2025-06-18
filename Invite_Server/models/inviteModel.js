const mongoose = require("mongoose");

const inviteSchema = new mongoose.Schema(
  {
    clinicId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Clinic",
    },
    email: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["Doctor", "Nurse", "Receptionist"],
      required: true,
    },
    inviteId: {
      type: String,
      required: true,
      unique: true,
    },
    used: {
      type: Boolean,
      default: false,
    },
    expiresAt: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const inviteModel =
  mongoose.models.invite || mongoose.model("invite", inviteSchema);

module.exports = inviteModel;
