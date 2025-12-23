import DonorProfileView from "@/components/Donors/Profile/DonorProfileView";
import { getDonorByIdController } from "@/controller/donorController";
import { connectDB } from "@/lib/connectdb";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import BackButton from "@/components/ui/BackButton";
import { notFound } from "next/navigation";

export async function generateMetadata({ params }) {
    const { id } = await params;
    // We could fetch donor name here for better title but keeping it simple for now
    return {
        title: `Donor Profile | Hospital Admin Panel`,
        description: "Donor details and history",
    };
}

export default async function DonorProfilePage({ params }) {
    const { id } = await params;
    await connectDB();

    try {
        const { donor } = await getDonorByIdController(id);

        if (!donor) {
            notFound();
        }

        return (
            <div className="min-h-screen flex flex-col">
                <div className="bg-white px-4 py-4 shadow-sm flex-shrink-0">
                    <div className="flex items-center justify-between gap-3">
                        <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Donor Profile</h1>
                        <BackButton href="/donors/active" label="Back to Donors" />
                    </div>
                </div>
                <div className="bg-gray-100 flex-1 flex flex-col overflow-hidden">
                    <div className="flex-1 overflow-auto p-3 sm:p-6">
                        <DonorProfileView donor={JSON.parse(JSON.stringify(donor))} />
                    </div>
                </div>
            </div>
        );
    } catch (error) {
        console.error("Error fetching donor:", error);
        notFound();
    }
}
