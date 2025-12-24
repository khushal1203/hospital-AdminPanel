import { NextResponse } from "next/server";
import { connectDB } from "@/lib/connectdb";
import Centre from "@/modals/centreModal";
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

    const centres = await Centre.find({}).sort({ createdAt: -1 });

    return NextResponse.json({
      success: true,
      centres,
      total: centres.length,
    });
  } catch (error) {
    console.error("Error fetching centres:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch centres" },
      { status: 500 }
    );
  }
}