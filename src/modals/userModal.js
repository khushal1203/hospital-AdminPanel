import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
    {
        fullName: {
            type: String,
            required: true,
            trim: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },
        password: {
            type: String,
            required: true,
        },
        role: {
            type: String,
            enum: ["admin", "receptionist", "doctor", "laboratory"],
            default: "receptionist",
        },
        isAdmin: {
            type: Boolean,
            default: false,
        },
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
        profileImage: {
            type: String,
            default: "/images/user/user-03.png",
        },
    },
    {
        timestamps: true,
    }
);

export const User =
    mongoose.models.User || mongoose.model("User", UserSchema);
