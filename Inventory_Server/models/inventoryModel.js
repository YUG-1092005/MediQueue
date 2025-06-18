const mongoose = require("mongoose");

const inventoryItemSchema = new mongoose.Schema({
  clinicId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "clinic",
    required: true,
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  category: {
    type: String,
    enum: [
      "Medications",
      "Medical Devices",
      "Surgical Supplies",
      "Laboratory",
      "First Aid",
      "Personal Protective Equipment",
      "Diagnostic Equipment",
    ],
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: 0,
  },
  expiryDate: {
    type: Date,
    required: true,
  },
  batchNumber: {
    type: String,
    required: true,
    trim: true,
  },
  supplier: {
    type: String,
    required: true,
    trim: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("InventoryItem", inventoryItemSchema);
