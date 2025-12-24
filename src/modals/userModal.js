import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    // Basic Information
    profileImage: {
      type: String,
      default: "/images/user/user-03.png",
    },
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    aadharCardNumber: {
      type: String,
      trim: true,
    },
    phoneNumber: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    gender: {
      type: String,
      enum: ["male", "female", "other"],
    },
    maritalStatus: {
      type: String,
      enum: ["single", "married", "divorced", "widowed"],
    },
    dateOfBirth: {
      type: Date,
    },
    
    // Address Information
    address: {
      type: String,
      trim: true,
    },
    city: {
      type: String,
      trim: true,
    },
    state: {
      type: String,
      trim: true,
    },
    pincode: {
      type: String,
      trim: true,
    },
    
    // Professional Information
    role: {
      type: String,
      enum: ["admin", "receptionist", "doctor", "laboratory"],
      default: "receptionist",
    },
    department: {
      type: String,
      trim: true,
    },
    employeeId: {
      type: String,
      trim: true,
    },
    experience: {
      type: String,
      trim: true,
    },
    
    // Educational Information
    qualification: {
      type: String,
      trim: true,
    },
    fieldOfStudy: {
      type: String,
      trim: true,
    },
    instituteName: {
      type: String,
      trim: true,
    },
    passingYear: {
      type: String,
      trim: true,
    },
    
    // Documents
    documents: [{
      documentName: {
        type: String,
        required: true,
      },
      documentUrl: {
        type: String,
        required: true,
      },
      uploadedAt: {
        type: Date,
        default: Date.now,
      }
    }],
    
    // User Credentials
    password: {
      type: String,
      required: true,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    
    // Password Reset
    resetPasswordToken: {
      type: String,
    },
    resetPasswordExpiry: {
      type: Date,
    },
    resetPasswordAttempts: {
      type: Number,
      default: 0,
    },
    resetPasswordLastAttempt: {
      type: Date,
    },
    
    // Centre Association
    centreId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Centre",
    },
  },
  {
    timestamps: true,
  },
);

export const User = mongoose.models.User || mongoose.model("User", UserSchema);

// Clear the model cache to ensure schema changes are recognized
if (mongoose.models.User) {
  delete mongoose.models.User;
}

export const UserModel = mongoose.model("User", UserSchema);
