import { NextResponse } from "next/server";
import { connectDB } from "@/lib/connectdb";
import { getDonorStatsController } from "@/controller/donorController";

export async function GET(req) {
    try {
        await connectDB();

        // Get date parameter from URL
        const { searchParams } = new URL(req.url);
        const selectedDate = searchParams.get('date');

        // Get dashboard statistics
        const result = await getDonorStatsController(selectedDate);

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
