const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    organizationType: {
      type: String,
      required: true,
      enum: ["clinic", "ngo", "user"],
    },

    // Clinic-specific fields
    clinicDetails: {
      clinicName: {
        type: String,
        required: function () {
          return this.organizationType === "clinic";
        },
      },
      clinicAddress: {
        type: String,
        required: function () {
          return this.organizationType === "clinic";
        },
      },
      clinicPhone: {
        type: String,
        required: function () {
          return this.organizationType === "clinic";
        },
      },
      clinicDescription: {
        type: String,
        required: function () {
          return this.organizationType === "clinic";
        },
      },
      clinicImage: {
        type: String,
        required: function () {
          return this.organizationType === "clinic";
        },
      },
    },

    // NGO-specific fields
    ngoDetails: {
      ngoName: {
        type: String,
        required: function () {
          return this.organizationType === "ngo";
        },
      },
      ngoPhone: {
        type: String,
        required: function () {
          return this.organizationType === "ngo";
        },
      },
      ngoAddress: {
        type: String,
        required: function () {
          return this.organizationType === "ngo";
        },
      },
      ngoDescription: {
        type: String,
        required: function () {
          return this.organizationType === "ngo";
        },
      },
      ngoImage: {
        type: String,
        required: function () {
          return this.organizationType === "ngo";
        },
      },
    },

    // User-specific field
    personalPhone: {
      type: String,
      required: function () {
        return this.organizationType === "user";
      },
    },
    clinicMemberships: [
      {
        clinicId: { type: mongoose.Schema.Types.ObjectId, ref: "clinic" },
        role: { type: String, enum: ["doctor", "nurse", "receptionist"] },
        averageConsultationTime: { type: Number, default: 10 }, // in minutes
        totalPatientsServed: { type: Number, default: 0 },
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Pre-save middleware to clean up unused fields
userSchema.pre("save", function (next) {
  if (this.organizationType !== "clinic") {
    this.clinicDetails = undefined;
  }
  if (this.organizationType !== "ngo") {
    this.ngoDetails = undefined;
  }
  if (this.organizationType !== "user") {
    this.personalPhone = undefined;
  }
  next();
});

// Virtual field to get organization-specific data
userSchema.virtual("organizationData").get(function () {
  switch (this.organizationType) {
    case "clinic":
      return this.clinicDetails;
    case "ngo":
      return this.ngoDetails;
    case "user":
      return { personalPhone: this.personalPhone };
    default:
      return null;
  }
});

// Method to get public profile (excluding sensitive data)
userSchema.methods.getPublicProfile = function () {
  const userObject = this.toObject();
  delete userObject.password;
  return userObject;
};

// Static method to find users by organization type
userSchema.statics.findByOrganizationType = function (orgType) {
  return this.find({ organizationType: orgType });
};

const userModel = mongoose.models.user || mongoose.model("user", userSchema);

module.exports = userModel;
