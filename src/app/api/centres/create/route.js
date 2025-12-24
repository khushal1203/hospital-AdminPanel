import { NextResponse } from "next/server";
import { connectDB } from "@/lib/connectdb";
import Centre from "@/modals/centreModal";
import { User, UserModel } from "@/modals/userModal";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

export async function POST(request) {
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

    const body = await request.json();
    console.log("Request body:", body);
    
    const {
      hospitalName,
      phoneNumber,
      email,
      hospitalLicenseNumber,
      address,
      city,
      state,
      pincode,
      doctorImage,
      doctorName,
      doctorPhoneNumber,
      doctorEmail,
      medicalLicenseNumber,
      userEmail,
      userRole,
      userPassword,
      userStatus,
    } = body;

    // Handle doctorImage - convert to string or null
    const imageUrl = doctorImage && typeof doctorImage === 'string' ? doctorImage : null;

    // Check if centre with same email or license already exists
    const existingCentre = await Centre.findOne({
      $or: [
        { email },
        { hospitalLicenseNumber },
        { doctorEmail },
        { medicalLicenseNumber }
      ]
    });

    if (existingCentre) {
      return NextResponse.json(
        { success: false, message: "Centre with this email or license number already exists" },
        { status: 400 }
      );
    }

    // Check if user with same email already exists
    const existingUser = await User.findOne({ email: userEmail });
    if (existingUser) {
      return NextResponse.json(
        { success: false, message: "User with this email already exists" },
        { status: 400 }
      );
    }

    const newCentre = new Centre({
      hospitalName,
      phoneNumber,
      email,
      hospitalLicenseNumber,
      address,
      city,
      state,
      pincode,
      doctorImage: imageUrl,
      doctorName,
      doctorPhoneNumber,
      doctorEmail,
      medicalLicenseNumber,
    });

    console.log("About to save centre:", newCentre);
    await newCentre.save();
    console.log("Centre saved successfully");

    // Create user credentials
    console.log("Centre ID to save:", newCentre._id);
    const hashedPassword = await bcrypt.hash(userPassword, 10);
    
    const userData = {
      fullName: doctorName,
      email: userEmail,
      password: hashedPassword,
      role: userRole,
      isActive: userStatus === "active",
      isAdmin: userRole === "admin",
      centreId: newCentre._id,
    };
    
    console.log("User data to save:", { ...userData, password: "[HIDDEN]" });
    
    const newUser = new UserModel(userData);
    console.log("User object after creation:", { ...newUser.toObject(), password: "[HIDDEN]" });
    
    await newUser.save();
    console.log("User saved successfully with ID:", newUser._id);
    
    // Update user with centreId if it wasn't saved initially
    if (!newUser.centreId) {
      console.log("CentreId not saved, updating user...");
      await UserModel.findByIdAndUpdate(newUser._id, { centreId: newCentre._id });
      console.log("User updated with centreId");
    }

    // Verify the user was saved with centreId
    const savedUser = await User.findById(newUser._id);
    console.log("Saved user centreId:", savedUser.centreId);

    return NextResponse.json({
      success: true,
      message: "Centre and user created successfully",
      centre: newCentre,
      user: {
        id: newUser._id,
        fullName: newUser.fullName,
        email: newUser.email,
        role: newUser.role,
        isActive: newUser.isActive,
      },
    });
  } catch (error) {
    console.error("Error creating centre:", error);
    console.error("Error stack:", error.stack);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to create centre" },
      { status: 500 }
    );
  }
}