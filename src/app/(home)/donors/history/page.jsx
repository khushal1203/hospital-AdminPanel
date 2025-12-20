import DonorListTable from "@/components/Donors/DonorListTable";
import DonorTableToolbar from "@/components/Donors/DonorTableToolbar";
import { getAllDonorsController } from "@/controller/donorController";
import { connectDB } from "@/lib/connectdb";
import { ColumnProvider } from "@/contexts/ColumnContext";

export const dynamic = 'force-dynamic';

export const metadata = {
    title: "Donors History | Hospital Admin Panel",
    description: "History of past donors",
};

export default async function DonorsHistoryPage({ searchParams }) {
    await connectDB();
    const params = await searchParams;
    const page = parseInt(params?.page) || 1;
    const limit = 10;
    const skip = (page - 1) * limit;

    const { donors, total } = await getAllDonorsController({
        status: "completed",
        skip,
        limit
    });

    return (
        <ColumnProvider>
            <div className="min-h-screen flex flex-col">
                <div className="bg-white px-4 py-3 shadow-sm flex-shrink-0">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Donor History</h1>
                        <div className="w-full sm:w-auto">
                            <DonorTableToolbar />
                        </div>
                    </div>
                </div>
                <div className="bg-gray-100 flex-1 flex flex-col overflow-hidden">
                    <div className="flex-1 overflow-auto p-3 sm:p-6">
                        <DonorListTable
                            donors={JSON.parse(JSON.stringify(donors))}
                            currentPage={page}
                            totalItems={total}
                            itemsPerPage={limit}
                        />
                    </div>
                </div>
            </div>
        </ColumnProvider>
    );
}
