import { NextResponse } from "next/server";
import { connectDB } from "@/lib/connectdb";
import { User } from "@/modals/userModal";
import { sendPasswordResetEmail } from "@/lib/nodemailer";
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

        // Check rate limiting (3 attempts per 24 hours)
        const now = new Date();
        const twentyFourHoursAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
        
        if (user.resetPasswordLastAttempt && user.resetPasswordLastAttempt > twentyFourHoursAgo) {
            if (user.resetPasswordAttempts >= 3) {
                return NextResponse.json(
                    { success: false, message: "You have reset password multiple times. Please try later after 24 hours." },
                    { status: 429 }
                );
            }
        } else {
            // Reset attempts if 24 hours have passed
            user.resetPasswordAttempts = 0;
        }

        // Generate reset token
        const resetToken = crypto.randomBytes(32).toString("hex");
        const resetTokenExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

        // Update user with reset token and increment attempts
        user.resetPasswordToken = resetToken;
        user.resetPasswordExpiry = resetTokenExpiry;
        user.resetPasswordAttempts = (user.resetPasswordAttempts || 0) + 1;
        user.resetPasswordLastAttempt = now;
        await user.save();

        // Send password reset email
        const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}api/auth/reset-password?token=${resetToken}`;
        const emailResult = await sendPasswordResetEmail(email, user.fullName, resetUrl);

        if (!emailResult.success) {
            console.error("Failed to send reset email:", emailResult.error);
            return NextResponse.json(
                { success: false, message: "Failed to send reset email" },
                { status: 500 }
            );
        }

        return NextResponse.json({
            success: true,
            message: "Password reset email sent successfully"
        });

    } catch (error) {
        console.error("Forgot password error:", error);
        return NextResponse.json(
            { success: false, message: "Internal server error" },
            { status: 500 }
        );
    }
}