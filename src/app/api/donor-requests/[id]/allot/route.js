import { NextResponse } from "next/server";
import { connectDB } from "@/lib/connectdb";
import DonorRequest from "@/modals/donorRequestModal";
import jwt from "jsonwebtoken";

export async function PUT(request, { params }) {
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
    const body = await request.json();
    const { doctorId } = body;

    if (!doctorId) {
      return NextResponse.json({ success: false, message: "Doctor ID is required" }, { status: 400 });
    }

    const donorRequest = await DonorRequest.findByIdAndUpdate(
      id,
      { 
        $addToSet: { allottedDoctors: doctorId },
        isAlloted: true,
        allottedTo: doctorId,
        status: "approved",
        allottedAt: new Date()
      },
      { new: true }
    ).populate("allottedTo", "fullName email").populate("allottedDoctors", "fullName email");

    if (!donorRequest) {
      return NextResponse.json({ success: false, message: "Donor request not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: "Request allotted successfully",
      request: donorRequest,
    });
  } catch (error) {
    console.error("Error allotting donor request:", error);
    return NextResponse.json(
      { success: false, message: "Failed to allot donor request" },
      { status: 500 }
    );
  }
}