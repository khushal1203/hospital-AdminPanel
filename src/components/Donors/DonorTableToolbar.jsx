"use client";

import { MdSearch, MdCalendarToday, MdFilterList } from "react-icons/md";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setDocumentFilter } from "@/store/slices/filterSlice";
import { toggleColumn } from "@/store/slices/columnSlice";

export default function DonorTableToolbar({ onFilterToggle }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilter, setShowFilter] = useState(false);
  const [showColumns, setShowColumns] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState("");
  const dispatch = useDispatch();
  const documentFilter = useSelector((state) => state.filter.documentFilter);
  const visibleColumns = useSelector((state) => state.column.visibleColumns);

  // Load search term from URL on mount
  useEffect(() => {
    const search = searchParams.get("search") || "";
    const status = searchParams.get("status") || "";
    setSearchTerm(search);
    setSelectedStatus(status);
  }, [searchParams]);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest(".relative")) {
        setShowFilter(false);
        setShowColumns(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const handleSearch = (value) => {
    setSearchTerm(value);
    const params = new URLSearchParams(searchParams);

    if (value.trim()) {
      params.set("search", value.trim());
    } else {
      params.delete("search");
    }

    params.delete("page");
    router.push(`?${params.toString()}`);
  };

  const handleStatusFilter = (status) => {
    setSelectedStatus(status);
    const params = new URLSearchParams(searchParams);

    if (status) {
      params.set("status", status);
    } else {
      params.delete("status");
    }

    params.delete("page");
    router.push(`?${params.toString()}`);
    setShowFilter(false);
  };

  const handleToggleColumn = (column) => {
    dispatch(toggleColumn(column));
  };

  return (
    <div className="flex flex-col gap-4 bg-white px-1 py-4 sm:flex-row sm:items-center sm:justify-between">
      {/* Search Input */}
      <div className="relative w-full sm:w-72">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
          <MdSearch className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => handleSearch(e.target.value)}
          className="block w-full rounded-lg border border-gray-200 bg-white p-2.5 pl-10 text-sm text-gray-900 outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
          placeholder="Search by donor name..."
        />
      </div>

      {/* Actions */}
      <div className="flex flex-wrap items-center gap-2">
        {/* Date Picker Button */}
        <button className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
          <MdCalendarToday className="h-4 w-4 text-gray-500" />
          <span>Fri 25 Apr, 2025</span>
        </button>

        {/* Filter Button */}
        <div className="relative">
          <button
            onClick={() => onFilterToggle ? onFilterToggle() : setShowFilter(!showFilter)}
            className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            <MdFilterList className="h-4 w-4 text-gray-500" />
            <span>Filter</span>
            {selectedStatus && (
              <span className="ml-1 rounded-full bg-purple-100 px-2 py-1 text-xs text-purple-800">
                {selectedStatus}
              </span>
            )}
          </button>

          {!onFilterToggle && showFilter && (
            <div className="absolute right-0 z-50 mt-2 w-48 rounded-lg border border-gray-200 bg-white shadow-lg">
              <div className="p-2">
                <div className="mb-2 text-xs font-medium text-gray-500">
                  Status Filter
                </div>
                <button
                  onClick={() => handleStatusFilter("")}
                  className={`w-full rounded px-3 py-2 text-left text-sm hover:bg-gray-50 ${selectedStatus === "" ? "bg-purple-50 text-purple-700" : ""}`}
                >
                  All
                </button>
                <button
                  onClick={() => handleStatusFilter("pending")}
                  className={`w-full rounded px-3 py-2 text-left text-sm hover:bg-gray-50 ${selectedStatus === "pending" ? "bg-purple-50 text-purple-700" : ""}`}
                >
                  Pending
                </button>
                <button
                  onClick={() => handleStatusFilter("allotted")}
                  className={`w-full rounded px-3 py-2 text-left text-sm hover:bg-gray-50 ${selectedStatus === "allotted" ? "bg-purple-50 text-purple-700" : ""}`}
                >
                  Allotted
                </button>
                <button
                  onClick={() => handleStatusFilter("approved")}
                  className={`w-full rounded px-3 py-2 text-left text-sm hover:bg-gray-50 ${selectedStatus === "approved" ? "bg-purple-50 text-purple-700" : ""}`}
                >
                  Approved
                </button>
                <button
                  onClick={() => handleStatusFilter("rejected")}
                  className={`w-full rounded px-3 py-2 text-left text-sm hover:bg-gray-50 ${selectedStatus === "rejected" ? "bg-purple-50 text-purple-700" : ""}`}
                >
                  Rejected
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Customize Columns Button */}
        <div className="relative">
          <button
            onClick={() => setShowColumns(!showColumns)}
            className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            <span>Customize Columns</span>
            <svg
              className="h-4 w-4 text-gray-500"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>

          {showColumns && (
            <div className="absolute right-0 z-50 mt-2 w-56 rounded-lg border border-gray-200 bg-white shadow-lg">
              <div className="p-3">
                <div className="mb-3 text-xs font-medium text-gray-500">
                  Show/Hide Columns
                </div>
                {Object.entries(visibleColumns).map(([key, visible]) => (
                  <label
                    key={key}
                    className="flex cursor-pointer items-center gap-2 py-1"
                  >
                    <input
                      type="checkbox"
                      checked={visible}
                      onChange={() => handleToggleColumn(key)}
                      className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                    />
                    <span className="text-sm capitalize text-gray-700">
                      {key.replace(/([A-Z])/g, " $1").trim()}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
