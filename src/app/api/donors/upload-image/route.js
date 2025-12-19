import { NextResponse } from "next/server";
import { connectDB } from "@/lib/connectdb";
import { Donor } from "@/modals/donorModal";
import { uploadToCloudinary } from "@/lib/cloudinary";

export async function POST(request) {
    try {
        await connectDB();
        
        const formData = await request.formData();
        const file = formData.get('image');
        const donorId = formData.get('donorId');

        if (!file || !donorId) {
            return NextResponse.json({ success: false, message: "Missing file or donor ID" });
        }

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        const result = await uploadToCloudinary(buffer, 'hospital-admin/donors');
        const imageUrl = result.secure_url;
        
        await Donor.findByIdAndUpdate(donorId, { donorImage: imageUrl });

        return NextResponse.json({ 
            success: true, 
            imageUrl,
            message: "Image uploaded successfully" 
        });

    } catch (error) {
        console.error("Upload error:", error);
        return NextResponse.json({ 
            success: false, 
            message: "Failed to upload image" 
        });
    }
}