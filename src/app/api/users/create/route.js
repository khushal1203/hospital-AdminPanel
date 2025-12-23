import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { connectDB } from "@/lib/connectdb";
import { createUserController } from "@/controller/userController";

export async function POST(req) {
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

        // Verify token and get user data
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const adminRole = decoded.role;
        const isAdminFlag = decoded.isAdmin;

        // Get request body
        const body = await req.json();

        // Create user
        const result = await createUserController(body, adminRole, isAdminFlag);

        return NextResponse.json(result, { status: 201 });
    } catch (error) {
        return NextResponse.json(
            {
                success: false,
                message: error.message || "Failed to create user",
            },
            {
                status: error.message.includes("Unauthorized") ? 403 : 400,
            }
        );
    }
}
