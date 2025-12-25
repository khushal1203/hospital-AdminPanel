import { NextResponse } from "next/server";
import { connectDB } from "@/lib/connectdb";
import { getAllDonorsController } from "@/controller/donorController";

export async function GET(req) {
  try {
    await connectDB();

    // Get query parameters
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page")) || 1;
    const limit = parseInt(searchParams.get("limit")) || 10;
    const skip = (page - 1) * limit;

    const filters = {
      donorType: searchParams.get("donorType"),
      status: searchParams.get("status"),
      search: searchParams.get("search"),
      docFilter: searchParams.get("docFilter"),
      createdBy: searchParams.get("createdBy"),
      skip,
      limit,
    };

    // Get all donors
    const result = await getAllDonorsController(filters);

    return NextResponse.json({
      success: true,
      donors: result.donors,
      total: result.total,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: error.message || "Failed to fetch donors",
      },
      {
        status: 500,
      },
    );
  }
}
