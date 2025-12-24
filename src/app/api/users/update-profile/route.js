import { NextResponse } from "next/server";
import { connectDB } from "@/lib/connectdb";
import { User } from "@/modals/userModal";
import jwt from "jsonwebtoken";

export async function PUT(request) {
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
    const { id, fullName, email, role, contactNumber, isActive, profileImage, phoneNumber, address, city, state, pincode, gender, maritalStatus, dateOfBirth, aadharCardNumber, department, employeeId, experience, qualification, fieldOfStudy, instituteName, passingYear, documents } = await request.json();

    // Check if user exists
    const user = await User.findById(id);
    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 },
      );
    }

    // Update user fields
    if (fullName !== undefined) user.fullName = fullName;
    if (email !== undefined) user.email = email;
    if (phoneNumber !== undefined) user.phoneNumber = phoneNumber;
    if (address !== undefined) user.address = address;
    if (city !== undefined) user.city = city;
    if (state !== undefined) user.state = state;
    if (pincode !== undefined) user.pincode = pincode;
    if (gender !== undefined) user.gender = gender || null;
    if (maritalStatus !== undefined) user.maritalStatus = maritalStatus || null;
    if (dateOfBirth !== undefined) user.dateOfBirth = dateOfBirth;
    if (aadharCardNumber !== undefined) user.aadharCardNumber = aadharCardNumber;
    if (department !== undefined) user.department = department;
    if (employeeId !== undefined) user.employeeId = employeeId;
    if (experience !== undefined) user.experience = experience;
    if (qualification !== undefined) user.qualification = qualification;
    if (fieldOfStudy !== undefined) user.fieldOfStudy = fieldOfStudy;
    if (instituteName !== undefined) user.instituteName = instituteName;
    if (passingYear !== undefined) user.passingYear = passingYear;
    if (role !== undefined) {
      user.role = role;
      user.isAdmin = role === "admin";
    }
    if (contactNumber !== undefined) user.contactNumber = contactNumber;
    if (isActive !== undefined) user.isActive = isActive;
    if (profileImage !== undefined) user.profileImage = profileImage;
    if (documents !== undefined) user.documents = documents;
    
    await user.save();

    const updatedUser = await User.findById(id).select("-password");

    return NextResponse.json({
      success: true,
      message: "User updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Update profile error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 },
    );
  }
}
