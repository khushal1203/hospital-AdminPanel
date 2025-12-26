"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import DonorListTable from "@/components/Donors/DonorListTable";
import DonorTableToolbar from "@/components/Donors/DonorTableToolbar";
import { ColumnProvider } from "@/contexts/ColumnContext";
import { FilterProvider } from "@/contexts/FilterContext";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import Link from "next/link";
import { MdAdd, MdClose } from "react-icons/md";

function ActiveDonorsContent() {
  const [donors, setDonors] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showSideFilter, setShowSideFilter] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState("all");
  const searchParams = useSearchParams();
  const page = parseInt(searchParams.get("page")) || 1;
  const search = searchParams.get("search") || "";
  const limit = 10;

  // Filter donors based on selected filter
  const getFilteredDonors = () => {
    if (selectedFilter === "all") return donors;

    return donors.filter((donor) => {
      switch (selectedFilter) {
        case "bloodReport":
          const bloodReport = donor.documents?.reports?.find(
            (r) => r.reportName?.toLowerCase() === "blood report",
          );
          return !bloodReport?.hasFile;
        case "donorConsents":
          const consent = donor.documents?.donorDocuments?.find(
            (d) => d.reportName?.toLowerCase() === "consent form",
          );
          return !consent?.hasFile;
        case "affidavit":
          const affidavit = donor.documents?.donorDocuments?.find(
            (d) => d.reportName?.toLowerCase() === "affidavit form",
          );
          return !affidavit?.hasFile;
        case "follicularScan":
          const follicular = donor.documents?.reports?.find(
            (r) => r.reportName?.toLowerCase() === "follicular scan",
          );
          return !follicular?.hasFile;
        case "insurance":
          const insurance = donor.documents?.otherDocuments?.find(
            (d) => d.reportName?.toLowerCase() === "life insurance document",
          );
          return !insurance?.hasFile;
        case "allotted":
          return donor.isAllotted;
        case "opuPending":
          const opu = donor.documents?.reports?.find(
            (r) => r.reportName?.toLowerCase() === "opu process",
          );
          return !opu?.hasFile;
        default:
          return true;
      }
    });
  };

  const filteredDonors = getFilteredDonors();

  const handleApplyFilter = () => {
    setShowSideFilter(false);
  };

  // Calculate filter counts
  const getFilterCounts = () => {
    const counts = {
      all: donors.length,
      bloodReport: 0,
      donorConsents: 0,
      affidavit: 0,
      follicularScan: 0,
      insurance: 0,
      allotted: 0,
      opuPending: 0,
    };

    donors.forEach((donor) => {
      // Blood Report - hasFile false
      const bloodReport = donor.documents?.reports?.find(
        (r) => r.reportName?.toLowerCase() === "blood report",
      );
      if (!bloodReport?.hasFile) counts.bloodReport++;

      // Donor Consents - hasFile false
      const consent = donor.documents?.donorDocuments?.find(
        (d) => d.reportName?.toLowerCase() === "consent form",
      );
      if (!consent?.hasFile) counts.donorConsents++;

      // Affidavit - hasFile false
      const affidavit = donor.documents?.donorDocuments?.find(
        (d) => d.reportName?.toLowerCase() === "affidavit form",
      );
      if (!affidavit?.hasFile) counts.affidavit++;

      // Follicular Scan - hasFile false
      const follicular = donor.documents?.reports?.find(
        (r) => r.reportName?.toLowerCase() === "follicular scan",
      );
      if (!follicular?.hasFile) counts.follicularScan++;

      // Insurance - hasFile false
      const insurance = donor.documents?.otherDocuments?.find(
        (d) => d.reportName?.toLowerCase() === "life insurance document",
      );
      if (!insurance?.hasFile) counts.insurance++;

      // Allotted Donors
      if (donor.isAllotted) counts.allotted++;

      // OPU Pending - hasFile false
      const opu = donor.documents?.reports?.find(
        (r) => r.reportName?.toLowerCase() === "opu process",
      );
      if (!opu?.hasFile) counts.opuPending++;
    });

    return counts;
  };

  const filterCounts = getFilterCounts();

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
      let url = `${process.env.NEXT_PUBLIC_API_END_POINT}/donors/all?search=${search}&page=${page}&limit=${limit}&excludeCaseDone=true`;
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
      <FilterProvider>
        <div className="flex h-screen flex-col">
          {/* Fixed Header with Toolbar */}
          <div
            className="sticky top-0 z-[1000] flex-shrink-0 border-b border-gray-200 bg-white shadow-sm"
            style={{ padding: "5px 15px 0px 15px" }}
          >
            <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
              <h1 className="text-xl font-bold text-gray-900 sm:text-2xl">
                Active Donors
              </h1>
              <div className="flex items-center gap-3">
                <div className="w-full sm:w-auto">
                  <DonorTableToolbar
                    onFilterToggle={() => setShowSideFilter(!showSideFilter)}
                  />
                </div>
                <Link
                  href="/donors/add"
                  className="inline-flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
                  style={{ backgroundColor: "#ECE9F1", color: "#402575" }}
                >
                  <MdAdd className="h-5 w-5" />
                  Add New
                </Link>
              </div>
            </div>
          </div>

          {/* Main Content Area with Side Filter */}
          <div className="relative flex flex-1 overflow-hidden bg-gray-50">
            {/* Side Filter Panel - Initially hidden */}
            <div
              className={`absolute left-4 top-4 z-[9999] w-72 transform rounded-xl border border-gray-200 bg-white shadow-md transition-transform duration-300 ${showSideFilter ? "translate-x-0" : "-translate-x-[120%]"}`}
            >
              <div className="flex flex-col">
                {/* Filter Content */}
                <div className="overflow-auto">
                  <div className="divide-y divide-gray-100">
                    <label
                      className={`flex cursor-pointer items-center justify-between p-4 transition-colors hover:bg-purple-50/30 ${selectedFilter === "all" ? "text-[#402575]" : ""}`}
                      style={
                        selectedFilter === "all"
                          ? { backgroundColor: "#ECE9F1" }
                          : {}
                      }
                    >
                      <div className="flex items-center">
                        <input
                          type="radio"
                          name="donorFilter"
                          value="all"
                          className="h-4 w-4 border-gray-300 text-purple-600 focus:ring-purple-500"
                          checked={selectedFilter === "all"}
                          onChange={(e) => setSelectedFilter(e.target.value)}
                        />
                        <span
                          className={`ml-3 text-sm font-medium ${selectedFilter === "all" ? "text-[#402575]" : "text-gray-900"}`}
                        >
                          All Donors
                        </span>
                      </div>
                      <span
                        className="flex h-7 w-[47px] items-center justify-center rounded-full text-xs text-black"
                        style={{
                          backgroundColor:
                            selectedFilter === "all" ? "white" : "#E5E7EB",
                        }}
                      >
                        {filterCounts.all}
                      </span>
                    </label>

                    {/* Blood Report */}
                    <label
                      className={`flex cursor-pointer items-center justify-between p-4 transition-colors hover:bg-purple-50/30 ${selectedFilter === "bloodReport" ? "text-[#402575]" : ""}`}
                      style={
                        selectedFilter === "bloodReport"
                          ? { backgroundColor: "#ECE9F1" }
                          : {}
                      }
                    >
                      <div className="flex items-center">
                        <input
                          type="radio"
                          name="donorFilter"
                          value="bloodReport"
                          className="h-4 w-4 border-gray-300 text-purple-600 focus:ring-purple-500"
                          checked={selectedFilter === "bloodReport"}
                          onChange={(e) => setSelectedFilter(e.target.value)}
                        />
                        <span
                          className={`ml-3 text-sm font-medium ${selectedFilter === "bloodReport" ? "text-[#402575]" : "text-gray-900"}`}
                        >
                          Blood Report
                        </span>
                      </div>
                      <span
                        className="flex h-7 w-[47px] items-center justify-center rounded-full text-xs text-black"
                        style={{
                          backgroundColor:
                            selectedFilter === "bloodReport"
                              ? "white"
                              : "#E5E7EB",
                        }}
                      >
                        {filterCounts.bloodReport}
                      </span>
                    </label>

                    {/* Donor Consents */}
                    <label
                      className={`flex cursor-pointer items-center justify-between p-4 transition-colors hover:bg-purple-50/30 ${selectedFilter === "donorConsents" ? "text-[#402575]" : ""}`}
                      style={
                        selectedFilter === "donorConsents"
                          ? { backgroundColor: "#ECE9F1" }
                          : {}
                      }
                    >
                      <div className="flex items-center">
                        <input
                          type="radio"
                          name="donorFilter"
                          value="donorConsents"
                          className="h-4 w-4 border-gray-300 text-purple-600 focus:ring-purple-500"
                          checked={selectedFilter === "donorConsents"}
                          onChange={(e) => setSelectedFilter(e.target.value)}
                        />
                        <span
                          className={`ml-3 text-sm font-medium ${selectedFilter === "donorConsents" ? "text-[#402575]" : "text-gray-900"}`}
                        >
                          Donor Consents
                        </span>
                      </div>
                      <span
                        className="flex h-7 w-[47px] items-center justify-center rounded-full text-xs text-black"
                        style={{
                          backgroundColor:
                            selectedFilter === "donorConsents"
                              ? "white"
                              : "#E5E7EB",
                        }}
                      >
                        {filterCounts.donorConsents}
                      </span>
                    </label>

                    {/* Affidavit of Donor */}
                    <label
                      className={`flex cursor-pointer items-center justify-between p-4 transition-colors hover:bg-purple-50/30 ${selectedFilter === "affidavit" ? "text-[#402575]" : ""}`}
                      style={
                        selectedFilter === "affidavit"
                          ? { backgroundColor: "#ECE9F1" }
                          : {}
                      }
                    >
                      <div className="flex items-center">
                        <input
                          type="radio"
                          name="donorFilter"
                          value="affidavit"
                          className="h-4 w-4 border-gray-300 text-purple-600 focus:ring-purple-500"
                          checked={selectedFilter === "affidavit"}
                          onChange={(e) => setSelectedFilter(e.target.value)}
                        />
                        <span
                          className={`ml-3 text-sm font-medium ${selectedFilter === "affidavit" ? "text-[#402575]" : "text-gray-900"}`}
                        >
                          Affidavit of Donor
                        </span>
                      </div>
                      <span
                        className="flex h-7 w-[47px] items-center justify-center rounded-full text-xs text-black"
                        style={{
                          backgroundColor:
                            selectedFilter === "affidavit"
                              ? "white"
                              : "#E5E7EB",
                        }}
                      >
                        {filterCounts.affidavit}
                      </span>
                    </label>

                    {/* Follicular Scan */}
                    <label
                      className={`flex cursor-pointer items-center justify-between p-4 transition-colors hover:bg-purple-50/30 ${selectedFilter === "follicularScan" ? "text-[#402575]" : ""}`}
                      style={
                        selectedFilter === "follicularScan"
                          ? { backgroundColor: "#ECE9F1" }
                          : {}
                      }
                    >
                      <div className="flex items-center">
                        <input
                          type="radio"
                          name="donorFilter"
                          value="follicularScan"
                          className="h-4 w-4 border-gray-300 text-purple-600 focus:ring-purple-500"
                          checked={selectedFilter === "follicularScan"}
                          onChange={(e) => setSelectedFilter(e.target.value)}
                        />
                        <span
                          className={`ml-3 text-sm font-medium ${selectedFilter === "follicularScan" ? "text-[#402575]" : "text-gray-900"}`}
                        >
                          Follicular Scan
                        </span>
                      </div>
                      <span
                        className="flex h-7 w-[47px] items-center justify-center rounded-full text-xs text-black"
                        style={{
                          backgroundColor:
                            selectedFilter === "follicularScan"
                              ? "white"
                              : "#E5E7EB",
                        }}
                      >
                        {filterCounts.follicularScan}
                      </span>
                    </label>

                    {/* Insurance */}
                    <label
                      className={`flex cursor-pointer items-center justify-between p-4 transition-colors hover:bg-purple-50/30 ${selectedFilter === "insurance" ? "text-[#402575]" : ""}`}
                      style={
                        selectedFilter === "insurance"
                          ? { backgroundColor: "#ECE9F1" }
                          : {}
                      }
                    >
                      <div className="flex items-center">
                        <input
                          type="radio"
                          name="donorFilter"
                          value="insurance"
                          className="h-4 w-4 border-gray-300 text-purple-600 focus:ring-purple-500"
                          checked={selectedFilter === "insurance"}
                          onChange={(e) => setSelectedFilter(e.target.value)}
                        />
                        <span
                          className={`ml-3 text-sm font-medium ${selectedFilter === "insurance" ? "text-[#402575]" : "text-gray-900"}`}
                        >
                          Insurance
                        </span>
                      </div>
                      <span
                        className="flex h-7 w-[47px] items-center justify-center rounded-full text-xs text-black"
                        style={{
                          backgroundColor:
                            selectedFilter === "insurance"
                              ? "white"
                              : "#E5E7EB",
                        }}
                      >
                        {filterCounts.insurance}
                      </span>
                    </label>

                    {/* Allotted Donors */}
                    <label
                      className={`flex cursor-pointer items-center justify-between p-4 transition-colors hover:bg-purple-50/30 ${selectedFilter === "allotted" ? "text-[#402575]" : ""}`}
                      style={
                        selectedFilter === "allotted"
                          ? { backgroundColor: "#ECE9F1" }
                          : {}
                      }
                    >
                      <div className="flex items-center">
                        <input
                          type="radio"
                          name="donorFilter"
                          value="allotted"
                          className="h-4 w-4 border-gray-300 text-purple-600 focus:ring-purple-500"
                          checked={selectedFilter === "allotted"}
                          onChange={(e) => setSelectedFilter(e.target.value)}
                        />
                        <span
                          className={`ml-3 text-sm font-medium ${selectedFilter === "allotted" ? "text-[#402575]" : "text-gray-900"}`}
                        >
                          Allotted Donors
                        </span>
                      </div>
                      <span
                        className="flex h-7 w-[47px] items-center justify-center rounded-full text-xs text-black"
                        style={{
                          backgroundColor:
                            selectedFilter === "allotted" ? "white" : "#E5E7EB",
                        }}
                      >
                        {filterCounts.allotted}
                      </span>
                    </label>

                    {/* OPU Pending */}
                    <label
                      className={`flex cursor-pointer items-center justify-between p-4 transition-colors hover:bg-purple-50/30 ${selectedFilter === "opuPending" ? "text-[#402575]" : ""}`}
                      style={
                        selectedFilter === "opuPending"
                          ? { backgroundColor: "#ECE9F1" }
                          : {}
                      }
                    >
                      <div className="flex items-center">
                        <input
                          type="radio"
                          name="donorFilter"
                          value="opuPending"
                          className="h-4 w-4 border-gray-300 text-purple-600 focus:ring-purple-500"
                          checked={selectedFilter === "opuPending"}
                          onChange={(e) => setSelectedFilter(e.target.value)}
                        />
                        <span
                          className={`ml-3 text-sm font-medium ${selectedFilter === "opuPending" ? "text-[#402575]" : "text-gray-900"}`}
                        >
                          OPU Pending
                        </span>
                      </div>
                      <span
                        className="flex h-7 w-[47px] items-center justify-center rounded-full text-xs text-black"
                        style={{
                          backgroundColor:
                            selectedFilter === "opuPending"
                              ? "white"
                              : "#E5E7EB",
                        }}
                      >
                        {filterCounts.opuPending}
                      </span>
                    </label>
                  </div>
                </div>

                {/* Filter Actions */}
                <div className="border-t border-gray-200 p-4">
                  <button
                    onClick={handleApplyFilter}
                    className="w-full rounded-lg bg-purple-600 px-4 py-2 text-sm font-medium text-white hover:bg-purple-700"
                  >
                    Apply Filter
                  </button>
                </div>
              </div>
            </div>

            {/* Table Content */}
            <div
              className={`w-full overflow-hidden transition-all duration-300 ${showSideFilter ? "pl-80" : "pl-0"}`}
            >
              <div className="h-full overflow-auto p-4">
                <DonorListTable
                  donors={filteredDonors}
                  currentPage={page}
                  totalItems={filteredDonors.length}
                  itemsPerPage={limit}
                />
              </div>
            </div>
          </div>
        </div>
      </FilterProvider>
    </ColumnProvider>
  );
}

export default function ActiveDonorsPage() {
  return (
    <Suspense fallback={<LoadingSpinner message="Loading..." />}>
      <ActiveDonorsContent />
    </Suspense>
  );
}
