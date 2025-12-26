import { NextResponse } from "next/server";
import { connectDB } from "@/lib/connectdb";
import { saveDonorRemarksController } from "@/controller/donorController";
import jwt from "jsonwebtoken";

export async function POST(request, { params }) {
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

    const { id } = await params;
    const { remarks } = await request.json();

    if (!remarks) {
      return NextResponse.json({ success: false, message: "Remarks data is required" }, { status: 400 });
    }

    const result = await saveDonorRemarksController(id, remarks);

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error saving remarks:", error);
    return NextResponse.json(
      {
        success: false,
        message: error.message || "Failed to save remarks",
      },
      {
        status: 500,
      }
    );
  }
}