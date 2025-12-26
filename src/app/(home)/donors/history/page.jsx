"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import DonorListTable from "@/components/Donors/DonorListTable";
import DonorTableToolbar from "@/components/Donors/DonorTableToolbar";
import { ColumnProvider } from "@/contexts/ColumnContext";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

function DonorsHistoryContent() {
  const [donors, setDonors] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const searchParams = useSearchParams();
  const page = parseInt(searchParams.get("page")) || 1;
  const search = searchParams.get("search") || "";
  const limit = 10;

  useEffect(() => {
    fetchDonors();
  }, [page, search]);

  const fetchDonors = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      const userId = user._id || user.id;
      const isAdmin = user.isAdmin;
      
      const skip = (page - 1) * limit;
      let url = `${process.env.NEXT_PUBLIC_API_END_POINT}/donors/all?search=${search}&page=${page}&limit=${limit}&isCaseDone=true`;
      if (!isAdmin) {
        url += `&createdBy=${userId}`;
      }
      
      const res = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (data.success) {
        setDonors(data.donors);
        setTotal(data.total);
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError("Failed to fetch donors");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner message="" />;
  }

  return (
    <ColumnProvider>
      <div className="flex min-h-screen flex-col">
        <div className="flex-shrink-0 bg-white px-4 py-3 shadow-sm">
          <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
            <h1 className="text-xl font-bold text-gray-900 sm:text-2xl">
              Donor History
            </h1>
            <div className="w-full sm:w-auto">
              <DonorTableToolbar />
            </div>
          </div>
        </div>
        <div className="flex flex-1 flex-col overflow-hidden bg-gray-100">
          <div className="flex-1 overflow-auto p-3 sm:p-6">
            <DonorListTable
              donors={donors}
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

export default function DonorsHistoryPage() {
  return (
    <Suspense fallback={<LoadingSpinner message="Loading..." />}>
      <DonorsHistoryContent />
    </Suspense>
  );
}
