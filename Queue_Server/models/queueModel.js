const mongoose = require("mongoose");

const QueueEntrySchema = new mongoose.Schema({
  clinicId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "clinic",
    required: true,
  },

  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Patient",
  },

  patient: {
    name: { type: String, required: true },
    phone: { type: String, required: true },
    age: Number,
    email: { type: String, required: true },
    gender: {
      type: String,
      enum: ["Male", "Female", "Other"],
      required: true,
    },
  },

  visitType: {
    type: String,
    enum: ["Walk In", "Online"],
    required: true,
  },

  reason: String,

  isEmergency: {
    type: Boolean,
    default: false,
  },

  notifyBySMS: {
    type: Boolean,
    default: false,
  },

  joinedAt: {
    type: Date,
    default: Date.now,
  },

  serviceStartTime: Date, // when doctor starts serving
  serviceEndTime: Date, // when doctor marks as done

  estimatedStartTime: Date,
  estimatedEndTime: Date,

  status: {
    type: String,
    enum: ["waiting", "serving", "done", "cancelled"],
    default: "waiting",
  },

  tokenNumber: {
    type: Number,
    required: true,
  },

  notifiedAt: Date,

  notified: { type: Boolean, default: false },

  servedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },
});

// Compound index for efficient queue sorting
QueueEntrySchema.index({ clinicId: 1, tokenNumber: 1 });
QueueEntrySchema.index({ clinicId: 1, status: 1, tokenNumber: 1 }); // Optional, for active queue queries

// Virtual for consultation duration
QueueEntrySchema.virtual("consultationDuration").get(function () {
  if (this.serviceStartTime && this.serviceEndTime) {
    return this.serviceEndTime - this.serviceStartTime;
  }
  return null;
});

module.exports = mongoose.model("QueueEntry", QueueEntrySchema);
