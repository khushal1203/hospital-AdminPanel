import { NextResponse } from "next/server";
import { connectDB } from "@/lib/connectdb";
import { User } from "@/modals/userModal";
import bcrypt from "bcryptjs";

export async function POST(req) {
    try {
        await connectDB();

        const { token, password } = await req.json();

        if (!token || !password) {
            return NextResponse.json(
                { success: false, message: "Token and password are required" },
                { status: 400 }
            );
        }

        // Find user by reset token
        const user = await User.findOne({
            resetPasswordToken: token,
            resetPasswordExpiry: { $gt: new Date() }
        });

        if (!user) {
            return NextResponse.json(
                { success: false, message: "Invalid or expired reset token" },
                { status: 400 }
            );
        }

        // Hash new password
        const hashedPassword = await bcrypt.hash(password, 12);

        // Update user password and clear reset token
        user.password = hashedPassword;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpiry = undefined;
        await user.save();

        return NextResponse.json({
            success: true,
            message: "Password reset successfully"
        });

    } catch (error) {
        console.error("Reset password error:", error);
        return NextResponse.json(
            { success: false, message: "Internal server error" },
            { status: 500 }
        );
    }
}