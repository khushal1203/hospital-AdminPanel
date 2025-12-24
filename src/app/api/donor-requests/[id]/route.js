import { NextResponse } from "next/server";
import { connectDB } from "@/lib/connectdb";
import DonorRequest from "@/modals/donorRequestModal";
import Centre from "@/modals/centreModal";
import User from "@/modals/userModal";
import jwt from "jsonwebtoken";

export async function GET(request, { params }) {
  try {
    await connectDB();

    const token = request.headers.get("authorization")?.replace("Bearer ", "");
    if (!token) {
      return NextResponse.json({ success: false, message: "No token provided" }, { status: 401 });
    }

    jwt.verify(token, process.env.JWT_SECRET);

    const { id } = await params;
    const donorRequest = await DonorRequest.findById(id)
      .populate("hospitalId", "hospitalName city")
      .populate("doctorId", "doctorName")
      .populate("createdBy", "fullName");

    if (!donorRequest) {
      return NextResponse.json({ success: false, message: "Request not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, donorRequest });
  } catch (error) {
    console.error("Error fetching donor request:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch donor request" },
      { status: 500 }
    );
  }
}

export async function PUT(request, { params }) {
  try {
    await connectDB();

    const token = request.headers.get("authorization")?.replace("Bearer ", "");
    if (!token) {
      return NextResponse.json({ success: false, message: "No token provided" }, { status: 401 });
    }

    jwt.verify(token, process.env.JWT_SECRET);

    const { id } = await params;
    const body = await request.json();

    const updatedRequest = await DonorRequest.findByIdAndUpdate(id, body, { new: true })
      .populate("hospitalId", "hospitalName city")
      .populate("doctorId", "doctorName")
      .populate("createdBy", "fullName");

    if (!updatedRequest) {
      return NextResponse.json({ success: false, message: "Request not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: "Request updated successfully",
      donorRequest: updatedRequest,
    });
  } catch (error) {
    console.error("Error updating donor request:", error);
    return NextResponse.json(
      { success: false, message: "Failed to update donor request" },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    await connectDB();

    const token = request.headers.get("authorization")?.replace("Bearer ", "");
    if (!token) {
      return NextResponse.json({ success: false, message: "No token provided" }, { status: 401 });
    }

    jwt.verify(token, process.env.JWT_SECRET);

    const { id } = await params;
    const deletedRequest = await DonorRequest.findByIdAndDelete(id);

    if (!deletedRequest) {
      return NextResponse.json({ success: false, message: "Request not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Request deleted successfully" });
  } catch (error) {
    console.error("Error deleting donor request:", error);
    return NextResponse.json(
      { success: false, message: "Failed to delete donor request" },
      { status: 500 }
    );
  }
}