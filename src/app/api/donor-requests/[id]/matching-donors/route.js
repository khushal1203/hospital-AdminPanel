import { NextResponse } from "next/server";
import { connectDB } from "@/lib/connectdb";
import DonorRequest from "@/modals/donorRequestModal";
import { Donor } from "@/modals/donorModal";
import jwt from "jsonwebtoken";

export async function GET(request, { params }) {
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

    // Build matching criteria with flexible range matching
    const matchingCriteria = {
      status: { $in: ["active", "pending"] }, // Exclude allotted donors
      $or: [
        { isAllotted: { $exists: false } },
        { isAllotted: false }
      ]
    };

    // Strict matches
    if (donorRequest.gender) {
      matchingCriteria.gender = donorRequest.gender;
    }
    if (donorRequest.maritalStatus) {
      matchingCriteria.maritalStatus = donorRequest.maritalStatus;
    }
    if (donorRequest.bloodGroup) {
      matchingCriteria.bloodGroup = donorRequest.bloodGroup;
    }

    // Flexible text matches (case insensitive)
    if (donorRequest.cast) {
      matchingCriteria.cast = { $regex: new RegExp(donorRequest.cast, 'i') };
    }
    if (donorRequest.nationality) {
      matchingCriteria.nationality = { $regex: new RegExp(donorRequest.nationality, 'i') };
    }
    if (donorRequest.skinColour) {
      matchingCriteria.skinColor = { $regex: new RegExp(donorRequest.skinColour, 'i') };
    }
    if (donorRequest.hairColour) {
      matchingCriteria.hairColor = { $regex: new RegExp(donorRequest.hairColour, 'i') };
    }
    if (donorRequest.eyeColour) {
      matchingCriteria.eyeColor = { $regex: new RegExp(donorRequest.eyeColour, 'i') };
    }
    if (donorRequest.donorEducation) {
      matchingCriteria.donorEducation = { $regex: new RegExp(donorRequest.donorEducation, 'i') };
    }

    // Range matches - donor's value should be within the requested range
    if (donorRequest.ageRange?.min && donorRequest.ageRange?.max) {
      matchingCriteria.age = {
        $gte: donorRequest.ageRange.min,
        $lte: donorRequest.ageRange.max
      };
    }
    if (donorRequest.heightRange?.min && donorRequest.heightRange?.max) {
      matchingCriteria.height = {
        $gte: donorRequest.heightRange.min,
        $lte: donorRequest.heightRange.max
      };
    }
    if (donorRequest.weightRange?.min && donorRequest.weightRange?.max) {
      matchingCriteria.weight = {
        $gte: donorRequest.weightRange.min,
        $lte: donorRequest.weightRange.max
      };
    }

    // Find matching donors
    let matchingDonors = await Donor.find(matchingCriteria)
      .select('fullName age gender bloodGroup cast nationality height weight skinColor hairColor eyeColor donorEducation maritalStatus donorImage')
      .limit(50)
      .sort({ createdAt: -1 });

    // If no exact matches found, try with relaxed criteria (only essential matches)
    if (matchingDonors.length === 0) {
      const relaxedCriteria = {
        status: { $in: ["active", "pending"] }, // Exclude allotted donors
        $or: [
          { isAllotted: { $exists: false } },
          { isAllotted: false }
        ]
      };
      
      // Only match essential criteria
      if (donorRequest.gender) {
        relaxedCriteria.gender = donorRequest.gender;
      }
      if (donorRequest.bloodGroup) {
        relaxedCriteria.bloodGroup = donorRequest.bloodGroup;
      }
      
      matchingDonors = await Donor.find(relaxedCriteria)
        .select('fullName age gender bloodGroup cast nationality height weight skinColor hairColor eyeColor donorEducation maritalStatus donorImage')
        .limit(50)
        .sort({ createdAt: -1 });
    }

    return NextResponse.json({
      success: true,
      donors: matchingDonors,
      total: matchingDonors.length,
      criteria: donorRequest
    });

  } catch (error) {
    console.error("Error finding matching donors:", error);
    return NextResponse.json(
      { success: false, message: "Failed to find matching donors" },
      { status: 500 }
    );
  }
}