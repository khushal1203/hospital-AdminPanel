import { NextResponse } from "next/server";
import { connectDB } from "@/lib/connectdb";
import { Donor } from "@/modals/donorModal";

export async function DELETE(request) {
    try {
        await connectDB();

        const { donorId, sectionKey, index } = await request.json();

        if (!donorId || !sectionKey || index === undefined) {
            return NextResponse.json(
                { success: false, message: "Missing required fields" },
                { status: 400 }
            );
        }

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

        if (donor.documents[sectionKey][index]) {
            const existingReportName = donor.documents[sectionKey][index].reportName;
            donor.documents[sectionKey][index] = {
                reportName: existingReportName,
                documentName: null,
                filePath: null,
                uploadBy: null,
                uploadDate: null,
                hasFile: false,
                isUploaded: false,
            };
        }

        donor.markModified("documents");
        await donor.save();

        return NextResponse.json({
            success: true,
            message: "Document deleted successfully",
        });
    } catch (error) {
        console.error("Delete error:", error);
        return NextResponse.json(
            { success: false, message: error.message },
            { status: 500 }
        );
    }
}