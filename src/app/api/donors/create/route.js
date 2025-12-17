import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { connectDB } from "@/lib/connectdb";
import { createDonorController } from "@/controller/donorController";

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

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.userId;

        // Get request body
        const body = await req.json();

        // Create donor
        const result = await createDonorController(body, userId);

        return NextResponse.json(result, { status: 201 });
    } catch (error) {
        return NextResponse.json(
            {
                success: false,
                message: error.message || "Failed to create donor",
            },
            {
                status: 400,
            }
        );
    }
}
