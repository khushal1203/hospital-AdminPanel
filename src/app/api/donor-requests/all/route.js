import { NextResponse } from "next/server";
import { getAllDonorRequestsController } from "@/controller/donorRequestController";
import { connectDB } from "@/lib/connectdb";
import jwt from "jsonwebtoken";

export async function GET(request) {
  try {
    await connectDB();

    const token = request.headers.get("authorization")?.replace("Bearer ", "");
    if (!token) {
      return NextResponse.json({ success: false, message: "No token provided" }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded) {
      return NextResponse.json({ success: false, message: "Invalid token" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page")) || 1;
    const search = searchParams.get("search") || "";
    const createdBy = searchParams.get("createdBy") || "";
    const allottedTo = searchParams.get("allottedTo") || "";
    const allottedDoctors = searchParams.get("allottedDoctors") || "";
    const limit = 10;
    const skip = (page - 1) * limit;

    const { requests, total } = await getAllDonorRequestsController({
      search,
      skip,
      limit,
      createdBy,
      allottedTo,
      allottedDoctors,
    });

    return NextResponse.json({
      success: true,
      requests,
      total,
    });
  } catch (error) {
    console.error("Error fetching donor requests:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch donor requests" },
      { status: 500 }
    );
  }
}