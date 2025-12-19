import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { connectDB } from "@/lib/connectdb";
import { User } from "@/modals/userModal";

export async function GET(req) {
    try {
        await connectDB();

        const authHeader = req.headers.get("authorization");

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return NextResponse.json(
                { success: false, message: "Unauthorized" },
                { status: 401 }
            );
        }

        const token = authHeader.split(" ")[1];
        jwt.verify(token, process.env.JWT_SECRET);

        const { searchParams } = new URL(req.url);
        const id = searchParams.get("id");

        if (!id || id === "null" || id === "undefined") {
            return NextResponse.json(
                { success: false, message: "Valid User ID is required" },
                { status: 400 }
            );
        }

        const user = await User.findById(id).select("-password");

        if (!user) {
            return NextResponse.json(
                { success: false, message: "User not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            user,
        });
    } catch (error) {
        return NextResponse.json(
            { success: false, message: error.message },
            { status: 400 }
        );
    }
}