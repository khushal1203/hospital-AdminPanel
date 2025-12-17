import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { connectDB } from "@/lib/connectdb";
import { getAllUsersController } from "@/controller/userController";

export async function GET(req) {
    try {
        await connectDB();

        // Get token from authorization header
        const authHeader = req.headers.get("authorization");

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Unauthorized",
                },
                {
                    status: 401,
                }
            );
        }

        const token = authHeader.split(" ")[1];

        // Verify token and get user role
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const adminRole = decoded.role;

        // Get all users
        const result = await getAllUsersController(adminRole);

        return NextResponse.json(result);
    } catch (error) {
        return NextResponse.json(
            {
                success: false,
                message: error.message || "Failed to fetch users",
            },
            {
                status: error.message.includes("Unauthorized") ? 403 : 500,
            }
        );
    }
}
