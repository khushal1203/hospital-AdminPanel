import { NextResponse } from "next/server";
import { connectDB } from "@/lib/connectdb";
import { Donor } from "@/modals/donorModal";
import { writeFile, mkdir } from "fs/promises"; // ✅ ADD mkdir
import path from "path";

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

        const safeName = reportName.replace(/[\s\/\\:*?"<>|]/g, "_");
        const ext = file.name.split(".").pop();

        const fileName = `${safeName}-${donorId}-${Date.now()}.${ext}`;

        // ✅ ENSURE DIRECTORY EXISTS
        const uploadDir = path.join(
            process.cwd(),
            "public",
            "uploads",
            "documents"
        );

        await mkdir(uploadDir, { recursive: true }); // 🔥 FIX

        const filePath = path.join(uploadDir, fileName);

        await writeFile(filePath, buffer);

        const fileUrl = `/uploads/documents/${fileName}`;

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

        while (donor.documents[sectionKey].length <= index) {
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

        donor.documents[sectionKey][index] = {
            reportName,
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
