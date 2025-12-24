import mongoose from "mongoose";

const donorRequestSchema = new mongoose.Schema(
  {
    hospitalId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Centre",
      required: true,
    },
    doctorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    requiredByDate: {
      type: Date,
      required: true,
    },
    gender: {
      type: String,
      enum: ["male", "female"],
      required: true,
    },
    ageRange: {
      min: { type: Number, required: true },
      max: { type: Number, required: true },
    },
    maritalStatus: {
      type: String,
      enum: ["single", "married", "divorced", "widowed"],
      required: true,
    },
    cast: {
      type: String,
      required: true,
    },
    bloodGroup: {
      type: String,
      enum: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
      required: true,
    },
    nationality: {
      type: String,
      required: true,
    },
    heightRange: {
      min: { type: Number, required: true },
      max: { type: Number, required: true },
    },
    weightRange: {
      min: { type: Number, required: true },
      max: { type: Number, required: true },
    },
    skinColour: {
      type: String,
      required: true,
    },
    hairColour: {
      type: String,
      required: true,
    },
    eyeColour: {
      type: String,
      required: true,
    },
    donorEducation: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected", "fulfilled"],
      default: "pending",
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const DonorRequest = mongoose.models.DonorRequest || mongoose.model("DonorRequest", donorRequestSchema);

export default DonorRequest;