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
    
    // Doctor IDs array
    doctorIds: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: 'User',
      default: [],
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

// Clear the model cache to ensure schema changes are recognized
if (mongoose.models.Centre) {
  delete mongoose.models.Centre;
}

const CentreModel = mongoose.model("Centre", centreSchema);

export default CentreModel;