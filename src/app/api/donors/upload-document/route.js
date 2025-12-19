import { NextResponse } from "next/server";
import { connectDB } from "@/lib/connectdb";
import { Donor } from "@/modals/donorModal";
import { writeFile } from "fs/promises";
import path from "path";

export async function POST(request) {
    try {
        await connectDB();

        const formData = await request.formData();
        const file = formData.get('document');
        const donorId = formData.get('donorId');
        const sectionKey = formData.get('sectionKey');
        const index = parseInt(formData.get('index'));
        const reportName = formData.get('reportName');

        if (!file || !donorId || !sectionKey || index === undefined) {
            return NextResponse.json({ success: false, message: "Missing required fields" });
        }

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        const fileName = `${reportName.replace(/[\s\/\\:*?"<>|]/g, '_')}-${donorId}-${Date.now()}.${file.name.split('.').pop()}`;
        const filePath = path.join(process.cwd(), 'public/uploads/documents', fileName);

        await writeFile(filePath, buffer);

        const fileUrl = `/uploads/documents/${fileName}`;

        // Update donor document in database
        const donor = await Donor.findById(donorId);

        // Initialize documents if not exists
        if (!donor.documents) {
            donor.documents = { donorDocuments: [], reports: [], otherDocuments: [] };
        }

        // Ensure section exists
        if (!donor.documents[sectionKey]) {
            donor.documents[sectionKey] = [];
        }

        // Ensure array has enough elements
        while (donor.documents[sectionKey].length <= index) {
            donor.documents[sectionKey].push({
                reportName: '',
                documentName: null,
                filePath: null,
                uploadBy: null,
                uploadDate: null,
                hasFile: false,
                isUploaded: false
            });
        }

        // Update the document
        donor.documents[sectionKey][index] = {
            reportName: reportName,
            documentName: file.name,
            filePath: fileUrl,
            uploadBy: 'Current User',
            uploadDate: new Date(),
            hasFile: true,
            isUploaded: true
        };

        // Mark as modified and save
        donor.markModified('documents');
        await donor.save();

        return NextResponse.json({
            success: true,
            filePath: fileUrl,
            message: "Document uploaded successfully"
        });

    } catch (error) {
        console.error("Upload error:", error);
        console.error("Error details:", error.message);
        return NextResponse.json({
            success: false,
            message: "Failed to upload document"
        });
    }
}