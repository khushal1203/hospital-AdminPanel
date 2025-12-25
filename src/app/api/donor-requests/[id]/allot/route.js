import { NextResponse } from "next/server";
import { connectDB } from "@/lib/connectdb";
import DonorRequest from "@/modals/donorRequestModal";
import { Donor } from "@/modals/donorModal";
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
    const { donorId } = body;

    if (!donorId) {
      return NextResponse.json({ success: false, message: "Donor ID is required" }, { status: 400 });
    }

    // Update the donor request
    const donorRequest = await DonorRequest.findByIdAndUpdate(
      id,
      { 
        $addToSet: { allottedDonors: donorId },
        isAlloted: true,
        allottedTo: donorId,
        status: "approved",
        allottedAt: new Date()
      },
      { new: true }
    ).populate("allottedTo", "fullName email").populate("allottedDonors", "fullName email");

    if (!donorRequest) {
      return NextResponse.json({ success: false, message: "Donor request not found" }, { status: 404 });
    }

    // Update the donor status
    const updatedDonor = await Donor.findByIdAndUpdate(
      donorId,
      {
        isAllotted: true,
        status: "allotted",
        allottedToRequest: id,
        allottedBy: id  // donor-request ki ID set kar rahe hain
      },
      { new: true }
    );
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