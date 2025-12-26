"use client";

import { useState } from "react";
import { MdNavigateBefore, MdNavigateNext, MdVisibility } from "react-icons/md";
import { useRouter, useSearchParams } from "next/navigation";
import dayjs from "dayjs";

const Pagination = ({ currentPage, totalItems, itemsPerPage }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = currentPage * itemsPerPage;

  const handlePageChange = (page) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", page.toString());
    router.push(`?${params.toString()}`);
  };

  return (
    <div className="flex flex-col items-center justify-between gap-3 border-t border-gray-200 bg-white px-3 py-3 sm:flex-row sm:px-4">
      <div className="text-xs text-gray-700 sm:text-sm">
        Showing <span className="font-medium">{startIndex + 1}</span>{" "}
        to{" "}
        <span className="font-medium">
          {Math.min(endIndex, totalItems)}
        </span>{" "}
        of <span className="font-medium">{totalItems}</span> results
      </div>
      <div className="flex gap-2">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="flex items-center gap-1 rounded-lg border border-gray-300 bg-white px-2 py-2 text-xs font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 sm:px-3 sm:text-sm"
        >
          <MdNavigateBefore className="h-4 w-4 sm:h-5 sm:w-5" />
          <span className="hidden sm:inline">Previous</span>
        </button>
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="flex items-center gap-1 rounded-lg border border-gray-300 bg-white px-2 py-2 text-xs font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 sm:px-3 sm:text-sm"
        >
          <span className="hidden sm:inline">Next</span>
          <MdNavigateNext className="h-4 w-4 sm:h-5 sm:w-5" />
        </button>
      </div>
    </div>
  );
};

export default function AllottedDonorsTable({ donors, currentPage, totalItems, itemsPerPage }) {
  const router = useRouter();

  const handleViewDonor = (donorId) => {
    router.push(`/donors/${donorId}`);
  };

  const getStatusBadgeColor = (status) => {
    const colors = {
      active: "bg-green-100 text-green-700",
      pending: "bg-yellow-100 text-yellow-700",
      inactive: "bg-red-100 text-red-700",
    };
    return colors[status] || "bg-gray-100 text-gray-700";
  };

  return (
    <div className="flex h-full flex-col">
      {!donors || donors.length === 0 ? (
        <div className="rounded-xl border border-gray-200 bg-white p-12 text-center shadow-md">
          <p className="text-lg text-gray-500">No allotted donors found.</p>
        </div>
      ) : (
        <div className="flex flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-md">
          <div className="custom-scrollbar flex-1 overflow-x-auto overflow-y-auto">
            <style jsx>{`
              .custom-scrollbar::-webkit-scrollbar {
                height: 6px;
                width: 6px;
              }
              .custom-scrollbar::-webkit-scrollbar-track {
                background: #f1f5f9;
                border-radius: 3px;
              }
              .custom-scrollbar::-webkit-scrollbar-thumb {
                background: linear-gradient(135deg, #cbd5e1, #e2e8f0);
                border-radius: 3px;
              }
              .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                background: linear-gradient(135deg, #94a3b8, #cbd5e1);
              }
            `}</style>
            <table className="w-full min-w-[1000px] table-auto text-left text-sm">
              <thead className="sticky top-0 z-20 bg-gradient-to-r from-purple-50 to-pink-50">
                <tr className="border-b border-gray-200">
                  <th className="p-3 text-xs font-semibold uppercase tracking-wide text-gray-700 min-w-[150px]">
                    Donor Info
                  </th>
                  <th className="p-3 text-xs font-semibold uppercase tracking-wide text-gray-700 min-w-[100px]">
                    Donor ID
                  </th>
                  <th className="p-3 text-xs font-semibold uppercase tracking-wide text-gray-700 min-w-[80px]">
                    Age
                  </th>
                  <th className="p-3 text-xs font-semibold uppercase tracking-wide text-gray-700 min-w-[80px]">
                    Gender
                  </th>
                  <th className="p-3 text-xs font-semibold uppercase tracking-wide text-gray-700 min-w-[100px]">
                    Blood Group
                  </th>
                  <th className="p-3 text-xs font-semibold uppercase tracking-wide text-gray-700 min-w-[120px]">
                    Contact
                  </th>
                  <th className="p-3 text-xs font-semibold uppercase tracking-wide text-gray-700 min-w-[100px]">
                    Status
                  </th>
                  <th className="p-3 text-xs font-semibold uppercase tracking-wide text-gray-700 min-w-[120px]">
                    Allotted Date
                  </th>
                  <th className="sticky right-0 top-0 z-30 bg-gradient-to-r from-purple-50 to-pink-50 p-3 text-xs font-semibold uppercase tracking-wide text-gray-700 shadow-sm min-w-[100px]">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {donors.map((donor) => (
                  <tr 
                    key={donor._id} 
                    className="transition-colors hover:bg-purple-50/30"
                  >
                    {/* Donor Info */}
                    <td className="p-3">
                      <div className="flex items-center gap-3">
                        <div className="flex-shrink-0">
                          <img
                            src={donor.donorImage || "/images/user/user-03.png"}
                            alt="Donor"
                            className="h-10 w-10 rounded-full object-cover border border-gray-200"
                          />
                        </div>
                        <div>
                          <div className="font-medium text-gray-900 text-sm">
                            {donor.fullName || 'N/A'}
                          </div>
                          <div className="text-sm text-gray-600">
                            {donor.email || 'N/A'}
                          </div>
                        </div>
                      </div>
                    </td>
                    
                    {/* Donor ID */}
                    <td className="p-3 text-gray-900 font-medium">
                      {donor.donorId || '-'}
                    </td>
                    
                    {/* Age */}
                    <td className="p-3 text-gray-600">
                      {donor.age || '-'}
                    </td>
                    
                    {/* Gender */}
                    <td className="p-3 text-gray-600 capitalize">
                      {donor.gender || '-'}
                    </td>
                    
                    {/* Blood Group */}
                    <td className="p-3 text-gray-900 font-medium">
                      {donor.bloodGroup || '-'}
                    </td>
                    
                    {/* Contact */}
                    <td className="p-3 text-gray-600">
                      {donor.contactNumber || '-'}
                    </td>
                    
                    {/* Status */}
                    <td className="p-3">
                      <span className={`rounded-full px-2 py-1 text-xs font-medium ${getStatusBadgeColor(donor.status)}`}>
                        {donor.status || 'pending'}
                      </span>
                    </td>
                    
                    {/* Allotted Date */}
                    <td className="p-3 text-gray-600">
                      {donor.createdAt ? dayjs(donor.createdAt).format("DD/MM/YYYY") : '-'}
                    </td>
                    
                    {/* Actions */}
                    <td className="sticky right-0 z-20 bg-white p-3 shadow-sm">
                      <button 
                        onClick={() => handleViewDonor(donor._id)}
                        className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        <MdVisibility className="h-4 w-4" />
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Pagination
            currentPage={currentPage}
            totalItems={totalItems}
            itemsPerPage={itemsPerPage}
          />
        </div>
      )}
    </div>
  );
}