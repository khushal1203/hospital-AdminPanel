import { NextResponse } from "next/server";
import { connectDB } from "@/lib/connectdb";
import DonorRequest from "@/modals/donorRequestModal";
import { User } from "@/modals/userModal";
import Notification from "@/modals/notificationModal";
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

    // Get user's centreId for hospitalId
    const user = await User.findById(userId).select('centreId doctorImage');
    if (!user) {
      return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
    }

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
    const donorRequest = new DonorRequest({
      hospitalId: user.centreId, // User ki centreId ko hospitalId mein save kar rahe hain
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
      allottedDonors: [],
    });

    await donorRequest.save();

    // Create notification for admin
    const adminUsers = await User.find({ role: "admin" }).select("_id");
    const doctorUser = await User.findById(userId).select("fullName");
    
    for (const admin of adminUsers) {
      await Notification.create({
        type: "doctor_request",
        title: "New Donor Request",
        message: `Dr. ${doctorUser.fullName} has submitted a new donor request`,
        recipientId: admin._id,
        senderId: userId,
        relatedId: donorRequest._id,
      });
    }

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