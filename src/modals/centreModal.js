import mongoose from "mongoose";

const centreSchema = new mongoose.Schema(
  {
    // Hospital/Clinic Details
    hospitalName: {
      type: String,
      required: true,
      trim: true,
    },
    phoneNumber: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    hospitalLicenseNumber: {
      type: String,
      required: true,
      trim: true,
    },
    address: {
      type: String,
      required: true,
      trim: true,
    },
    city: {
      type: String,
      required: true,
      trim: true,
    },
    state: {
      type: String,
      required: true,
      trim: true,
    },
    pincode: {
      type: String,
      required: true,
      trim: true,
    },
    
    // Doctor Details
    doctorImage: {
      type: String,
      default: null,
    },
    doctorName: {
      type: String,
      required: true,
      trim: true,
    },
    doctorPhoneNumber: {
      type: String,
      required: true,
      trim: true,
    },
    doctorEmail: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    medicalLicenseNumber: {
      type: String,
      required: true,
      trim: true,
    },
    
    // Status
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const Centre = mongoose.models.Centre || mongoose.model("Centre", centreSchema);

export default Centre;