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

    // Get the donor request
    const donorRequest = await DonorRequest.findById(id);
    if (!donorRequest) {
      return NextResponse.json({ success: false, message: "Donor request not found" }, { status: 404 });
    }

    // Update the donor request to cancel allotment
    const updatedRequest = await DonorRequest.findByIdAndUpdate(
      id,
      { 
        isAlloted: false,
        allottedTo: null,
        status: "pending",
        allottedAt: null,
        $unset: { allottedDonors: 1 }
      },
      { new: true }
    );

    // Update the donor status back to active if it was allotted
    if (donorRequest.allottedTo) {
      await Donor.findByIdAndUpdate(
        donorRequest.allottedTo,
        {
          isAllotted: false,
          status: "active",
          allottedToRequest: null,
          allottedBy: null
        }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Allotment cancelled successfully",
      request: updatedRequest,
    });
  } catch (error) {
    console.error("Error cancelling allotment:", error);
    return NextResponse.json(
      { success: false, message: "Failed to cancel allotment" },
      { status: 500 }
    );
  }
}