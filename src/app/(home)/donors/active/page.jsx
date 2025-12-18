import DonorListTable from "@/components/Donors/DonorListTable";
import { getAllDonorsController } from "@/controller/donorController";
import { connectDB } from "@/lib/connectdb";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";

export const metadata = {
    title: "Active Donors | Hospital Admin Panel",
    description: "List of active donors",
};

export default async function ActiveDonorsPage() {
    await connectDB();
    // Fetch active donors
    // For now fetching 'active' status. If oocyte/semen separation is strict, we might filter donorType here too.
    // Assuming Active Donors is primarily Oocyte for now as Semen has its own tab.
    const { donors } = await getAllDonorsController({ status: "active", donorType: "oocyte" });

    return (
        <div className="mx-auto max-w-7xl">
            <Breadcrumb pageName="Active Donors" />

            <div className="flex flex-col gap-10">
                <DonorListTable donors={JSON.parse(JSON.stringify(donors))} />
            </div>
        </div>
    );
}
