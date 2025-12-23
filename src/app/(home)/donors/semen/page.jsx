import DonorListTable from "@/components/Donors/DonorListTable";
import DonorTableToolbar from "@/components/Donors/DonorTableToolbar";
import { getAllDonorsController } from "@/controller/donorController";
import { connectDB } from "@/lib/connectdb";
import { ColumnProvider } from "@/contexts/ColumnContext";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Semen Storage | Hospital Admin Panel",
  description: "List of semen donors",
};

export default async function SemenStoragePage({ searchParams }) {
  await connectDB();
  const params = await searchParams;
  const page = parseInt(params?.page) || 1;
  const limit = 10;
  const skip = (page - 1) * limit;

  const { donors, total } = await getAllDonorsController({
    donorType: "semen",
    skip,
    limit,
  });

  return (
    <ColumnProvider>
      <div className="flex min-h-screen flex-col">
        <div className="flex-shrink-0 bg-white px-4 py-3 shadow-sm">
          <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
            <h1 className="text-xl font-bold text-gray-900 sm:text-2xl">
              Semen Storage
            </h1>
            <div className="w-full sm:w-auto">
              <DonorTableToolbar />
            </div>
          </div>
        </div>
        <div className="flex flex-1 flex-col overflow-hidden bg-gray-100">
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
