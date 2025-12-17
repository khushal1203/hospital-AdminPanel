import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
    {
        fullName: String,
        email: { type: String, unique: true },
        password: String,
        role: { type: String, default: "admin" }
    },
    { timestamps: true }
);

export const User =
    mongoose.models.User || mongoose.model("User", UserSchema);
