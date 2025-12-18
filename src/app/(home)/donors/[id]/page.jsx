import DonorProfileView from "@/components/Donors/Profile/DonorProfileView";
import { getDonorByIdController } from "@/controller/donorController";
import { connectDB } from "@/lib/connectdb";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
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
            <div className="mx-auto max-w-7xl">
                <Breadcrumb pageName="Donor Profile" />

                <DonorProfileView donor={JSON.parse(JSON.stringify(donor))} />
            </div>
        );
    } catch (error) {
        console.error("Error fetching donor:", error);
        notFound();
    }
}
