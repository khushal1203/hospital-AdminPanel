"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { ColumnProvider } from "@/contexts/ColumnContext";
import { FilterProvider } from "@/contexts/FilterContext";
import DonorRequestTable from "@/components/DonorRequests/DonorRequestTable";
import DonorTableToolbar from "@/components/Donors/DonorTableToolbar";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import Link from "next/link";
import { MdAdd } from "react-icons/md";

function DonorRequestsContent() {
  const [requests, setRequests] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const searchParams = useSearchParams();
  const page = parseInt(searchParams.get("page")) || 1;
  const search = searchParams.get("search") || "";
  const limit = 10;

  useEffect(() => {
    fetchDonorRequests();
  }, [page, search]);

  const fetchDonorRequests = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_END_POINT}/donor-requests/all?page=${page}&search=${search}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (data.success) {
        setRequests(data.requests);
        setTotal(data.total);
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError("Failed to fetch donor requests");
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
                Donor Requests
              </h1>
              <div className="flex items-center gap-3">
                <div className="w-full sm:w-auto">
                  <DonorTableToolbar />
                </div>
                <Link
                  href="/donor-requests/add"
                  className="inline-flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
                  style={{ backgroundColor: "#ECE9F1", color: "#402575" }}
                >
                  <MdAdd className="h-5 w-5" />
                  Add Request
                </Link>
              </div>
            </div>
          </div>

          {/* Scrollable Table Content */}
          <div className="flex-1 overflow-hidden bg-gray-50">
            <div className="h-full overflow-auto p-4">
              <DonorRequestTable
                requests={requests}
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

export default function DonorRequestsPage() {
  return (
    <Suspense fallback={<LoadingSpinner message="Loading..." />}>
      <DonorRequestsContent />
    </Suspense>
  );
}