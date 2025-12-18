import DonorListTable from "@/components/Donors/DonorListTable";
import { getAllDonorsController } from "@/controller/donorController";
import { connectDB } from "@/lib/connectdb";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";

export const metadata = {
    title: "Donors History | Hospital Admin Panel",
    description: "History of past donors",
};

export default async function DonorsHistoryPage() {
    await connectDB();
    // Fetch historical donors (assuming 'completed' or similar status, or just not active/pending)
    // For demonstration, let's fetch 'completed' status.
    const { donors } = await getAllDonorsController({ status: "completed" });

    return (
        <div className="mx-auto max-w-7xl">
            <Breadcrumb pageName="Donors History" />

            <div className="flex flex-col gap-10">
                <DonorListTable donors={JSON.parse(JSON.stringify(donors))} />
            </div>
        </div>
    );
}
