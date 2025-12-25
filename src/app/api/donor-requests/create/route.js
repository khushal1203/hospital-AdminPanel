import { NextResponse } from "next/server";
import { connectDB } from "@/lib/connectdb";
import DonorRequest from "@/modals/donorRequestModal";
import jwt from "jsonwebtoken";

export async function POST(request) {
  try {
    await connectDB();

    const token = request.headers.get("authorization")?.replace("Bearer ", "");
    if (!token) {
      return NextResponse.json({ success: false, message: "No token provided" }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.userId;

    const body = await request.json();
    const {
      hospitalId,
      doctorId,
      requiredByDate,
      gender,
      ageRange,
      maritalStatus,
      cast,
      bloodGroup,
      nationality,
      heightRange,
      weightRange,
      skinColour,
      hairColour,
      eyeColour,
      donorEducation,
    } = body;

    console.log('Creating donor request with data:', {
      ...body,
      createdBy: userId,
      isAlloted: false,
      allottedDoctors: [],
    });

    const donorRequest = new DonorRequest({
      hospitalId,
      doctorId,
      requiredByDate,
      gender,
      ageRange,
      maritalStatus,
      cast,
      bloodGroup,
      nationality,
      heightRange,
      weightRange,
      skinColour,
      hairColour,
      eyeColour,
      donorEducation,
      createdBy: userId,
      isAlloted: false,
      allottedDoctors: [],
    });

    await donorRequest.save();
    console.log('Saved donor request:', donorRequest);

    return NextResponse.json({
      success: true,
      message: "Donor request created successfully",
      request: donorRequest,
    });
  } catch (error) {
    console.error("Error creating donor request:", error);
    return NextResponse.json(
      { success: false, message: "Failed to create donor request" },
      { status: 500 }
    );
  }
}