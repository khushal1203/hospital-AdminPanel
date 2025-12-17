import { NextResponse } from "next/server";
import { connectDB } from "@/lib/connectdb";
import { getDonorStatsController } from "@/controller/donorController";

export async function GET(req) {
    try {
        await connectDB();

        // Get dashboard statistics
        const result = await getDonorStatsController();

        return NextResponse.json(result);
    } catch (error) {
        return NextResponse.json(
            {
                success: false,
                message: error.message || "Failed to fetch statistics",
            },
            {
                status: 500,
            }
        );
    }
}
