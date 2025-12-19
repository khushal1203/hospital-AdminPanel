import { NextResponse } from "next/server";
import { connectDB } from "@/lib/connectdb";
import { Donor } from "@/modals/donorModal";
import { writeFile } from "fs/promises";
import path from "path";

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

        const fileName = `donor-${donorId}-${Date.now()}.${file.name.split('.').pop()}`;
        const filePath = path.join(process.cwd(), 'public/uploads/donors', fileName);
        
        await writeFile(filePath, buffer);
        
        const imageUrl = `/uploads/donors/${fileName}`;
        
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