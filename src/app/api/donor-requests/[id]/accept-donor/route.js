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
    
    if (!id) {
      return NextResponse.json({ success: false, message: "ID parameter is required" }, { status: 400 });
    }

    // Find the donor request
    const donorRequest = await DonorRequest.findById(id);
    if (!donorRequest) {
      return NextResponse.json({ success: false, message: "Request not found" }, { status: 404 });
    }

    // Check if user is the request creator (doctor)
    const userId = decoded.id || decoded._id || decoded.userId;
    const requestCreatorId = donorRequest.createdBy?._id || donorRequest.createdBy;
    
    if (requestCreatorId.toString() !== userId.toString()) {
      return NextResponse.json({ success: false, message: "Unauthorized - You can only accept your own requests" }, { status: 403 });
    }

    if (!donorRequest.isAlloted || !donorRequest.allottedTo) {
      return NextResponse.json({ success: false, message: "No donor is currently allotted to this request" }, { status: 400 });
    }

    // Update donor status to active (accepted by doctor)
    if (donorRequest.allottedTo) {
      try {
        await Donor.findByIdAndUpdate(donorRequest.allottedTo, {
          status: "active",
          allottedBy: donorRequest.doctorId  // jo doctor ko allot kiya gaya hai uska ID
        });
        console.log('Updated donor allottedBy to:', donorRequest.doctorId);
      } catch (donorError) {
        console.error("Error updating donor:", donorError);
        // Continue even if donor update fails
      }
    }

    // Update donor request status to accepted
    const updatedRequest = await DonorRequest.findByIdAndUpdate(
      id,
      {
        status: "accepted",
        acceptedAt: new Date()
      },
      { new: true }
    );

    return NextResponse.json({
      success: true,
      message: "Donor accepted",
      donorRequest: updatedRequest,
    });
  } catch (error) {
    console.error("Error accepting donor:", error);
    return NextResponse.json(
      { success: false, message: "Failed to accept donor" },
      { status: 500 }
    );
  }
}