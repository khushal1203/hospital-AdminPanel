import { connectDB } from "@/lib/connectdb";
import {
  getAllDonorsController,
  createDonorController,
} from "@/controller/donorController";
import { NextResponse } from "next/server";

// GET - Fetch all donors
export async function GET(request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);

    const filters = {
      donorType: searchParams.get("donorType"),
      status: searchParams.get("status"),
      search: searchParams.get("search"),
      skip: parseInt(searchParams.get("skip")) || 0,
      limit: parseInt(searchParams.get("limit")) || undefined,
    };

    const result = await getAllDonorsController(filters);
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 400 },
    );
  }
}

// POST - Create new donor
export async function POST(request) {
  try {
    await connectDB();
    const body = await request.json();
    const result = await createDonorController(body, "admin");
    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 400 },
    );
  }
}
