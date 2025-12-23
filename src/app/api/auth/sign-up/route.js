import { NextResponse } from "next/server";
import { connectDB } from "@/lib/connectdb";
import { signUpController } from "@/controller/authcontroller";

export async function POST(req) {
  try {
    await connectDB();
    const body = await req.json();

    const data = await signUpController(body);

    return NextResponse.json({
      success: true,
      data,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 400 },
    );
  }
}
