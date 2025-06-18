const mongoose = require("mongoose");
const { nanoid } = require("nanoid");

const clinicSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    shortId: { type: String, unique: true, default: () => nanoid(8) },
    clinicName: { type: String, required: true },
    clinicAddress: { type: String, required: true },
    clinicPhone: { type: String, required: true },
    clinicDescription: String,
    clinicImage: String,
  },
  { timestamps: true }
);

const clinicModel =
  mongoose.models.clinic || mongoose.model("clinic", clinicSchema);

module.exports = clinicModel;
