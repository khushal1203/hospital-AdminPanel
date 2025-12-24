import { NextResponse } from "next/server";
import { connectDB } from "@/lib/connectdb";
import Centre from "@/modals/centreModal";
import { User, UserModel } from "@/modals/userModal";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

// Force schema refresh
const forceSchemaRefresh = true;

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
      doctors = []
    } = body;

    // Validate that at least one doctor is provided
    if (!doctors || doctors.length === 0) {
      return NextResponse.json(
        { success: false, message: "At least one doctor is required" },
        { status: 400 }
      );
    }

    // Check if centre with same email or license already exists
    const existingCentre = await Centre.findOne({
      $or: [
        { email },
        { hospitalLicenseNumber }
      ]
    });

    if (existingCentre) {
      return NextResponse.json(
        { success: false, message: "Centre with this email or license number already exists" },
        { status: 400 }
      );
    }

    // Check for duplicate doctor emails or licenses
    const doctorEmails = doctors.map(d => d.doctorEmail).filter(Boolean);
    const medicalLicenses = doctors.map(d => d.medicalLicenseNumber).filter(Boolean);
    const userEmails = doctors.map(d => d.userEmail).filter(Boolean);

    const existingDoctorCentre = await Centre.findOne({
      $or: [
        { doctorEmail: { $in: doctorEmails } },
        { medicalLicenseNumber: { $in: medicalLicenses } }
      ]
    });

    if (existingDoctorCentre) {
      return NextResponse.json(
        { success: false, message: "Doctor with this email or license already exists" },
        { status: 400 }
      );
    }

    // Check if any user email already exists
    const existingUser = await User.findOne({ email: { $in: userEmails } });
    if (existingUser) {
      return NextResponse.json(
        { success: false, message: "User with this email already exists" },
        { status: 400 }
      );
    }

    // Create centre with only hospital details
    const newCentre = new Centre({
      hospitalName,
      phoneNumber,
      email,
      hospitalLicenseNumber,
      address,
      city,
      state,
      pincode,
    });

    console.log("About to save centre:", newCentre);
    await newCentre.save();
    console.log("Centre saved successfully");

    // Create users for all doctors
    const createdUsers = [];
    const doctorIds = [];
    
    for (const doctor of doctors) {
      const hashedPassword = await bcrypt.hash(doctor.userPassword, 10);
      
      const userData = {
        fullName: doctor.doctorName,
        email: doctor.userEmail,
        phoneNumber: doctor.doctorPhoneNumber,
        password: hashedPassword,
        role: doctor.userRole,
        isActive: doctor.userStatus === "active",
        isAdmin: doctor.userRole === "admin",
        centreId: newCentre._id,
        medicalLicenseNumber: doctor.medicalLicenseNumber,
        doctorImage: doctor.doctorImage,
      };
      
      const newUser = new UserModel(userData);
      await newUser.save();
      
      doctorIds.push(newUser._id);
      
      createdUsers.push({
        id: newUser._id,
        fullName: newUser.fullName,
        email: newUser.email,
        role: newUser.role,
        isActive: newUser.isActive,
      });
    }
    
    // Update centre with doctor IDs
    await Centre.findByIdAndUpdate(newCentre._id, { doctorIds });

    return NextResponse.json({
      success: true,
      message: `Centre and ${createdUsers.length} doctor(s) created successfully`,
      centre: newCentre,
      users: createdUsers,
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