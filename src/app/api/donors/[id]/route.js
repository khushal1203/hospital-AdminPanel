import { connectDB } from "@/lib/connectdb";
import { getDonorByIdController, updateDonorController, deleteDonorController } from "@/controller/donorController";
import { NextResponse } from "next/server";

// GET - Fetch donor by ID
export async function GET(request, { params }) {
    try {
        await connectDB();
        const { id } = await params;
        
        if (!id) {
            return NextResponse.json(
                { success: false, message: "Donor ID is required" },
                { status: 400 }
            );
        }
        
        const result = await getDonorByIdController(id);
        return NextResponse.json(result);
    } catch (error) {
        const status = error.message.includes("Invalid") ? 400 : 404;
        return NextResponse.json(
            { success: false, message: error.message },
            { status }
        );
    }
}

// PUT - Update donor
export async function PUT(request, { params }) {
    try {
        await connectDB();
        const { id } = await params;
        const body = await request.json();
        const result = await updateDonorController(id, body, null);
        return NextResponse.json(result);
    } catch (error) {
        return NextResponse.json(
            { success: false, message: error.message },
            { status: 400 }
        );
    }
}

// DELETE - Delete donor
export async function DELETE(request, { params }) {
    try {
        await connectDB();
        const { id } = await params;
        const result = await deleteDonorController(id);
        return NextResponse.json(result);
    } catch (error) {
        return NextResponse.json(
            { success: false, message: error.message },
            { status: 400 }
        );
    }
}