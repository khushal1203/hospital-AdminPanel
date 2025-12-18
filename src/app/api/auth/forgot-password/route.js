import { NextResponse } from "next/server";
import { connectDB } from "@/lib/connectdb";
import { User } from "@/modals/userModal";
import crypto from "crypto";

export async function POST(req) {
    try {
        await connectDB();

        const { email } = await req.json();

        if (!email) {
            return NextResponse.json(
                { success: false, message: "Email is required" },
                { status: 400 }
            );
        }

        // Find user by email
        const user = await User.findOne({ email });
        if (!user) {
            return NextResponse.json(
                { success: false, message: "User not found" },
                { status: 404 }
            );
        }

        // Generate reset token
        const resetToken = crypto.randomBytes(32).toString("hex");
        const resetTokenExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

        // Save reset token to user
        user.resetPasswordToken = resetToken;
        user.resetPasswordExpiry = resetTokenExpiry;
        await user.save();

        // For now, just return success (email functionality can be added later)
        return NextResponse.json({
            success: true,
            message: "Password reset token generated. Check console for reset link.",
            resetToken, // Remove this in production
            resetUrl: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/auth/reset-password?token=${resetToken}`
        });

    } catch (error) {
        console.error("Forgot password error:", error);
        return NextResponse.json(
            { success: false, message: "Internal server error" },
            { status: 500 }
        );
    }
}