"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { ColumnProvider } from "@/contexts/ColumnContext";
import { FilterProvider } from "@/contexts/FilterContext";
import AllottedDonorsTable from "@/components/Donors/AllottedDonorsTable";
import DonorTableToolbar from "@/components/Donors/DonorTableToolbar";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

function AllottedDonorsContent() {
  const [donors, setDonors] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const searchParams = useSearchParams();
  const page = parseInt(searchParams.get("page")) || 1;
  const search = searchParams.get("search") || "";
  const limit = 10;

  useEffect(() => {
    fetchAllottedDonors();
  }, [page, search]);

  const fetchAllottedDonors = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      const userId = user._id || user.id;
      
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_END_POINT}/donors/all?page=${page}&search=${search}&createdBy=${userId}&limit=${limit}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (data.success) {
        // Filter only allotted donors
        const allottedDonors = data.donors.filter(donor => donor.allottedBy === userId);
        setDonors(allottedDonors);
        setTotal(allottedDonors.length);
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError("Failed to fetch allotted donors");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner message="" />;
  }

  return (
    <ColumnProvider>
      <FilterProvider>
        <div className="flex h-screen flex-col">
          {/* Fixed Header with Toolbar */}
          <div className="sticky top-0 z-30 flex-shrink-0 border-b border-gray-200 bg-white px-3 py-3 shadow-sm">
            <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
              <h1 className="text-xl font-bold text-gray-900 sm:text-2xl">
                Allotted Donors
              </h1>
              <div className="flex items-center gap-3">
                <div className="w-full sm:w-auto">
                  <DonorTableToolbar />
                </div>
              </div>
            </div>
          </div>

          {/* Scrollable Table Content */}
          <div className="flex-1 overflow-hidden bg-gray-50">
            <div className="h-full overflow-auto p-4">
              <AllottedDonorsTable
                donors={donors}
                currentPage={page}
                totalItems={total}
                itemsPerPage={limit}
              />
            </div>
          </div>
        </div>
      </FilterProvider>
    </ColumnProvider>
  );
}

export default function AllottedDonorsPage() {
  return (
    <Suspense fallback={<LoadingSpinner message="Loading..." />}>
      <AllottedDonorsContent />
    </Suspense>
  );
}