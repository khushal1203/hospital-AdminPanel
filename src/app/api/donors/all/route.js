import { NextResponse } from "next/server";
import { connectDB } from "@/lib/connectdb";
import { getAllDonorsController } from "@/controller/donorController";

export async function GET(req) {
    try {
        await connectDB();

        // Get query parameters
        const { searchParams } = new URL(req.url);
        const filters = {
            donorType: searchParams.get("donorType"),
            status: searchParams.get("status"),
            search: searchParams.get("search"),
        };

        // Get all donors
        const result = await getAllDonorsController(filters);

        return NextResponse.json(result);
    } catch (error) {
        return NextResponse.json(
            {
                success: false,
                message: error.message || "Failed to fetch donors",
            },
            {
                status: 500,
            }
        );
    }
}
