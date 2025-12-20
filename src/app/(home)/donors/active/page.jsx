import DonorListTable from "@/components/Donors/DonorListTable";
import DonorTableToolbar from "@/components/Donors/DonorTableToolbar";
import { getAllDonorsController } from "@/controller/donorController";
import { connectDB } from "@/lib/connectdb";
import { ColumnProvider } from "@/contexts/ColumnContext";

export const dynamic = 'force-dynamic';

export const metadata = {
    title: "Active Donors | Hospital Management",
    description: "List of active donors",
};

export default async function ActiveDonorsPage({ searchParams }) {
    await connectDB();
    const params = await searchParams;
    const page = parseInt(params?.page) || 1;
    const search = params?.search || '';
    const limit = 10;
    const skip = (page - 1) * limit;
    
    const { donors, total } = await getAllDonorsController({ 
        status: "active", 
        donorType: "oocyte",
        search,
        skip,
        limit 
    });

    return (
        <ColumnProvider>
            <div className="h-screen flex flex-col">
                {/* Fixed Header with Toolbar */}
                <div className="sticky top-0 z-10 bg-white px-4 py-4 shadow-sm border-b border-gray-200 flex-shrink-0">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Active Donors</h1>
                        <div className="w-full sm:w-auto">
                            <DonorTableToolbar />
                        </div>
                    </div>
                </div>  
                
                {/* Scrollable Table Content */}
                <div className="flex-1 overflow-hidden bg-gray-50">
                    <div className="h-full overflow-auto p-4">
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
