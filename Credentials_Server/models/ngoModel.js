const mongoose = require("mongoose");
const { nanoid } = require("nanoid");

const ngoSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    shortId: { type: String, unique: true, default: () => nanoid(8) },
    ngoName: String,
    ngoPhone: String,
    ngoAddress: String,
    ngoDescription: String,
    ngoImage: String,
  },
  { timestamps: true }
);

const ngoModel = mongoose.models.ngo || mongoose.model("ngo", ngoSchema);

module.exports = ngoModel;
