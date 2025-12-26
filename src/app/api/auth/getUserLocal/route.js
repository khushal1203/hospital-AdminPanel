import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { connectDB } from "@/lib/connectdb";
import { User } from "@/modals/userModal";

export async function GET(req) {
  try {
    await connectDB();

    const authHeader = req.headers.get("authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized",
        },
        {
          status: 401,
        },
      );
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    let user = await User.findById(decoded.userId).select("-password");

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "User not found",
        },
        {
          status: 404,
        },
      );
    }

    // Only set default profile image if both profileImage and doctorImage are missing
    // Don't override with default if doctorImage exists
    if (!user.profileImage && !user.doctorImage) {
      user.profileImage = "/images/user/user-03.png";
      await user.save();
    } else if (user.profileImage === "/images/user/user-03.png" && user.doctorImage) {
      // If profileImage is default but doctorImage exists, clear the default profileImage
      user.profileImage = null;
      await user.save();
    }

    return NextResponse.json({
      success: true,
      user,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Invalid or expired token",
      },
      {
        status: 401,
      },
    );
  }
}
