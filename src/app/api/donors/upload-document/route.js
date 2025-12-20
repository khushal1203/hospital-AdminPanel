import { NextResponse } from "next/server";
import { connectDB } from "@/lib/connectdb";
import { Donor } from "@/modals/donorModal";
import { uploadToCloudinary } from "@/lib/cloudinary";

export async function POST(request) {
    try {
        await connectDB();

        const formData = await request.formData();
        const file = formData.get("document");
        const donorId = formData.get("donorId");
        const sectionKey = formData.get("sectionKey");
        const index = Number(formData.get("index"));
        const reportName = formData.get("reportName");

        if (!file || !donorId || !sectionKey || Number.isNaN(index)) {
            return NextResponse.json(
                { success: false, message: "Missing required fields" },
                { status: 400 }
            );
        }

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        const result = await uploadToCloudinary(buffer, 'hospital-admin/documents');
        const fileUrl = result.secure_url;

        // DB update
        const donor = await Donor.findById(donorId);
        if (!donor) {
            return NextResponse.json(
                { success: false, message: "Donor not found" },
                { status: 404 }
            );
        }

        if (!donor.documents) {
            donor.documents = {
                donorDocuments: [],
                reports: [],
                otherDocuments: [],
            };
        }

        if (!donor.documents[sectionKey]) {
            donor.documents[sectionKey] = [];
        }

        // Find existing document by reportName or use index
        let targetIndex = index;
        if (reportName) {
            const existingIndex = donor.documents[sectionKey].findIndex(doc => doc.reportName === reportName);
            if (existingIndex !== -1) {
                targetIndex = existingIndex;
            }
        }

        while (donor.documents[sectionKey].length <= targetIndex) {
            donor.documents[sectionKey].push({
                reportName: "",
                documentName: null,
                filePath: null,
                uploadBy: null,
                uploadDate: null,
                hasFile: false,
                isUploaded: false,
            });
        }

        // Preserve existing reportName if it exists
        const existingReportName = donor.documents[sectionKey][targetIndex]?.reportName;
        const finalReportName = reportName || existingReportName || "";

        donor.documents[sectionKey][targetIndex] = {
            reportName: finalReportName,
            documentName: file.name,
            filePath: fileUrl,
            uploadBy: "Current User",
            uploadDate: new Date(),
            hasFile: true,
            isUploaded: true,
        };

        donor.markModified("documents");
        await donor.save();

        return NextResponse.json({
            success: true,
            filePath: fileUrl,
            message: "Document uploaded successfully",
        });
    } catch (error) {
        console.error("Upload error:", error);
        return NextResponse.json(
            { success: false, message: error.message },
            { status: 500 }
        );
    }
}
