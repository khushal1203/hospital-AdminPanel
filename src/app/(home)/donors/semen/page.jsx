import DonorListTable from "@/components/Donors/DonorListTable";
import { getAllDonorsController } from "@/controller/donorController";
import { connectDB } from "@/lib/connectdb";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";

export const metadata = {
    title: "Semen Storage | Hospital Admin Panel",
    description: "List of semen donors",
};

export default async function SemenStoragePage() {
    await connectDB();
    // Fetch semen donors
    const { donors } = await getAllDonorsController({ donorType: "semen" });

    return (
        <div className="mx-auto max-w-7xl">
            <Breadcrumb pageName="Semen Storage" />

            <div className="flex flex-col gap-10">
                <DonorListTable donors={JSON.parse(JSON.stringify(donors))} />
            </div>
        </div>
    );
}
