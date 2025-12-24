import { NextResponse } from "next/server";
import { connectDB } from "@/lib/connectdb";
import Centre from "@/modals/centreModal";
import { User, UserModel } from "@/modals/userModal";
import jwt from "jsonwebtoken";

// GET single centre
export async function GET(request, { params }) {
  try {
    await connectDB();

    const token = request.headers.get("authorization")?.replace("Bearer ", "");
    if (!token) {
      return NextResponse.json(
        { success: false, message: "No token provided" },
        { status: 401 },
      );
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded) {
      return NextResponse.json(
        { success: false, message: "Invalid token" },
        { status: 401 },
      );
    }

    const { id } = await params;

    const centre = await Centre.findById(id);

    if (!centre) {
      return NextResponse.json(
        { success: false, message: "Centre not found" },
        { status: 404 },
      );
    }

    // Find associated user by centre ID
    const user = await UserModel.findOne({ centreId: id }).select("-password");

    return NextResponse.json({
      success: true,
      centre,
      user,
    });
  } catch (error) {
    console.error("Error fetching centre:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch centre" },
      { status: 500 },
    );
  }
}

// UPDATE centre
export async function PUT(request, { params }) {
  try {
    await connectDB();

    const token = request.headers.get("authorization")?.replace("Bearer ", "");
    if (!token) {
      return NextResponse.json(
        { success: false, message: "No token provided" },
        { status: 401 },
      );
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded) {
      return NextResponse.json(
        { success: false, message: "Invalid token" },
        { status: 401 },
      );
    }

    const { id } = await params;
    const body = await request.json();

    const centre = await Centre.findById(id);
    if (!centre) {
      return NextResponse.json(
        { success: false, message: "Centre not found" },
        { status: 404 },
      );
    }

    // Check for duplicate email or license (excluding current centre)
    const existingCentre = await Centre.findOne({
      _id: { $ne: id },
      $or: [
        { email: body.email },
        { hospitalLicenseNumber: body.hospitalLicenseNumber },
        { doctorEmail: body.doctorEmail },
        { medicalLicenseNumber: body.medicalLicenseNumber },
      ],
    });

    if (existingCentre) {
      return NextResponse.json(
        {
          success: false,
          message: "Centre with this email or license number already exists",
        },
        { status: 400 },
      );
    }

    const updatedCentre = await Centre.findByIdAndUpdate(id, body, {
      new: true,
    });

    return NextResponse.json({
      success: true,
      message: "Centre updated successfully",
      centre: updatedCentre,
    });
  } catch (error) {
    console.error("Error updating centre:", error);
    return NextResponse.json(
      { success: false, message: "Failed to update centre" },
      { status: 500 },
    );
  }
}

// DELETE centre
export async function DELETE(request, { params }) {
  try {
    await connectDB();

    const token = request.headers.get("authorization")?.replace("Bearer ", "");
    if (!token) {
      return NextResponse.json(
        { success: false, message: "No token provided" },
        { status: 401 },
      );
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded) {
      return NextResponse.json(
        { success: false, message: "Invalid token" },
        { status: 401 },
      );
    }

    const { id } = await params;
    const centre = await Centre.findById(id);

    if (!centre) {
      return NextResponse.json(
        { success: false, message: "Centre not found" },
        { status: 404 },
      );
    }

    await Centre.findByIdAndDelete(id);

    return NextResponse.json({
      success: true,
      message: "Centre deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting centre:", error);
    return NextResponse.json(
      { success: false, message: "Failed to delete centre" },
      { status: 500 },
    );
  }
}
