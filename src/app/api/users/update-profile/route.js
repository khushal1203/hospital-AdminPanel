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
    const { id, fullName, email, role, contactNumber, isActive, profileImage } = await request.json();

    // Check if user exists
    const user = await User.findById(id);
    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 },
      );
    }

    // Update user fields
    user.fullName = fullName;
    user.email = email;
    if (role) {
      user.role = role;
      // Update isAdmin based on role
      user.isAdmin = role === "admin";
    }
    if (contactNumber !== undefined) user.contactNumber = contactNumber;
    if (isActive !== undefined) user.isActive = isActive;
    if (profileImage) user.profileImage = profileImage;
    
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
