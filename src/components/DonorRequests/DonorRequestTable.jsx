"use client";

import { useState } from "react";
import { MdChevronRight, MdMoreVert, MdNavigateBefore, MdNavigateNext } from "react-icons/md";
import { useRouter, useSearchParams } from "next/navigation";
import dayjs from "dayjs";
import DoctorSelectionModal from "./DoctorSelectionModal";
import { toast } from "@/utils/toast";

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

export default function DonorRequestTable({ requests, currentPage, totalItems, itemsPerPage, hideActions = false }) {
  const [selectedRequests, setSelectedRequests] = useState([]);
  const [showDoctorModal, setShowDoctorModal] = useState(false);
  const [selectedRequestId, setSelectedRequestId] = useState(null);
  const router = useRouter();

  const handleDecline = (requestId, e) => {
    e.stopPropagation();
    // Add decline logic here
    console.log('Declining request:', requestId);
  };

  const handleAllot = (requestId, e) => {
    e.stopPropagation();
    setSelectedRequestId(requestId);
    setShowDoctorModal(true);
  };

  const handleDoctorSelect = async (requestId, doctor) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_END_POINT}/donor-requests/${requestId}/allot`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ doctorId: doctor._id }),
      });

      const data = await res.json();
      if (data.success) {
        toast.success(`Request allotted to Dr. ${doctor.fullName}`);
        // Refresh the page or update the state
        window.location.reload();
      } else {
        toast.error(data.message || "Failed to allot request");
      }
    } catch (error) {
      toast.error("Failed to allot request");
    }
  };

  const handleRowClick = (requestId) => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const isAdminUser = user.isAdmin;
    
    if (isAdminUser) {
      router.push(`/donor-requests/${requestId}`);
    } else {
      router.push(`/donors/allotted/${requestId}`);
    }
  };

  const getStatusBadgeColor = (status) => {
    const colors = {
      pending: "bg-yellow-100 text-yellow-700",
      approved: "bg-green-100 text-green-700", 
      rejected: "bg-red-100 text-red-700",
      fulfilled: "bg-blue-100 text-blue-700",
    };
    return colors[status] || "bg-gray-100 text-gray-700";
  };

  const toggleSelectAll = () => {
    if (selectedRequests.length === requests.length) {
      setSelectedRequests([]);
    } else {
      setSelectedRequests(requests.map((r) => r._id));
    }
  };

  const toggleSelect = (id) => {
    if (selectedRequests.includes(id)) {
      setSelectedRequests(selectedRequests.filter((r) => r !== id));
    } else {
      setSelectedRequests([...selectedRequests, id]);
    }
  };

  return (
    <div className="flex h-full flex-col">
      {!requests || requests.length === 0 ? (
        <div className="rounded-xl border border-gray-200 bg-white p-12 text-center shadow-md">
          <p className="text-lg text-gray-500">No donor requests found.</p>
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
            <table className="w-full min-w-[2200px] table-auto text-left text-sm">
              <thead className="sticky top-0 z-20 bg-gradient-to-r from-purple-50 to-pink-50">
                <tr className="border-b border-gray-200">
                  <th className="p-3 text-xs font-semibold uppercase tracking-wide text-gray-700 min-w-[50px]">
                    <input
                      type="checkbox"
                      className="h-4 w-4 rounded border-gray-300"
                      checked={requests.length > 0 && selectedRequests.length === requests.length}
                      onChange={toggleSelectAll}
                    />
                  </th>
                  <th className="p-3 text-xs font-semibold uppercase tracking-wide text-gray-700 min-w-[200px]">
                    Hospital Name
                  </th>
                  <th className="p-3 text-xs font-semibold uppercase tracking-wide text-gray-700 min-w-[150px]">
                    Doctor Name
                  </th>
                  <th className="p-3 text-xs font-semibold uppercase tracking-wide text-gray-700 min-w-[120px]">
                    Required By
                  </th>
                  <th className="p-3 text-xs font-semibold uppercase tracking-wide text-gray-700 min-w-[100px]">
                    Gender
                  </th>
                  <th className="p-3 text-xs font-semibold uppercase tracking-wide text-gray-700 min-w-[120px]">
                    Marital Status
                  </th>
                  <th className="p-3 text-xs font-semibold uppercase tracking-wide text-gray-700 min-w-[100px]">
                    Blood Group
                  </th>
                  <th className="p-3 text-xs font-semibold uppercase tracking-wide text-gray-700 min-w-[100px]">
                    Cast
                  </th>
                  <th className="p-3 text-xs font-semibold uppercase tracking-wide text-gray-700 min-w-[120px]">
                    Nationality
                  </th>
                  <th className="p-3 text-xs font-semibold uppercase tracking-wide text-gray-700 min-w-[100px]">
                    Age Range
                  </th>
                  <th className="p-3 text-xs font-semibold uppercase tracking-wide text-gray-700 min-w-[120px]">
                    Height Range
                  </th>
                  <th className="p-3 text-xs font-semibold uppercase tracking-wide text-gray-700 min-w-[120px]">
                    Weight Range
                  </th>
                  <th className="p-3 text-xs font-semibold uppercase tracking-wide text-gray-700 min-w-[100px]">
                    Skin Colour
                  </th>
                  <th className="p-3 text-xs font-semibold uppercase tracking-wide text-gray-700 min-w-[100px]">
                    Hair Colour
                  </th>
                  <th className="p-3 text-xs font-semibold uppercase tracking-wide text-gray-700 min-w-[100px]">
                    Eye Colour
                  </th>
                  <th className="p-3 text-xs font-semibold uppercase tracking-wide text-gray-700 min-w-[120px]">
                    Education
                  </th>
                  <th className="p-3 text-xs font-semibold uppercase tracking-wide text-gray-700 min-w-[100px]">
                    Status
                  </th>
                  {!hideActions && (
                    <th className="sticky right-0 top-0 z-30 bg-gradient-to-r from-purple-50 to-pink-50 p-3 text-xs font-semibold uppercase tracking-wide text-gray-700 shadow-sm min-w-[120px]">
                      Actions
                    </th>
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {requests.map((request) => (
                  <tr 
                    key={request._id} 
                    className="transition-colors hover:bg-purple-50/30 cursor-pointer"
                    onClick={() => handleRowClick(request._id)}
                  >
                    <td className="p-3" onClick={(e) => e.stopPropagation()}>
                      <input
                        type="checkbox"
                        className="h-4 w-4 rounded border-gray-300"
                        checked={selectedRequests.includes(request._id)}
                        onChange={() => toggleSelect(request._id)}
                      />
                    </td>
                    
                    {/* Hospital Name */}
                    <td className="p-3">
                      <span className="font-medium text-gray-900 text-sm">
                        {request.hospitalId?.hospitalName || 'N/A'}
                      </span>
                    </td>
                    
                    {/* Doctor Name */}
                    <td className="p-3">
                      <span className="text-sm text-gray-900">
                        {request.doctorId?.fullName ? `Dr. ${request.doctorId.fullName}` : 'Doctor not found'}
                      </span>
                    </td>
                    
                    {/* Required By */}
                    <td className="p-3 text-gray-600">
                      {request.requiredByDate ? dayjs(request.requiredByDate).format("DD/MM/YYYY") : '-'}
                    </td>
                    
                    {/* Gender */}
                    <td className="p-3 text-gray-900 capitalize">
                      {request.gender || '-'}
                    </td>
                    
                    {/* Marital Status */}
                    <td className="p-3 text-gray-900 capitalize">
                      {request.maritalStatus || '-'}
                    </td>
                    
                    {/* Blood Group */}
                    <td className="p-3 text-gray-900 font-medium">
                      {request.bloodGroup || '-'}
                    </td>
                    
                    {/* Cast */}
                    <td className="p-3 text-gray-900">
                      {request.cast || '-'}
                    </td>
                    
                    {/* Nationality */}
                    <td className="p-3 text-gray-900">
                      {request.nationality || '-'}
                    </td>
                    
                    {/* Age Range */}
                    <td className="p-3 text-gray-900">
                      {request.ageRange?.min && request.ageRange?.max ? `${request.ageRange.min}-${request.ageRange.max}` : '-'}
                    </td>
                    
                    {/* Height Range */}
                    <td className="p-3 text-gray-900">
                      {request.heightRange?.min && request.heightRange?.max ? `${request.heightRange.min}-${request.heightRange.max} cm` : '-'}
                    </td>
                    
                    {/* Weight Range */}
                    <td className="p-3 text-gray-900">
                      {request.weightRange?.min && request.weightRange?.max ? `${request.weightRange.min}-${request.weightRange.max} kg` : '-'}
                    </td>
                    
                    {/* Skin Colour */}
                    <td className="p-3 text-gray-900 capitalize">
                      {request.skinColour || '-'}
                    </td>
                    
                    {/* Hair Colour */}
                    <td className="p-3 text-gray-900 capitalize">
                      {request.hairColour || '-'}
                    </td>
                    
                    {/* Eye Colour */}
                    <td className="p-3 text-gray-900 capitalize">
                      {request.eyeColour || '-'}
                    </td>
                    
                    {/* Education */}
                    <td className="p-3 text-gray-900">
                      {request.donorEducation || '-'}
                    </td>
                    
                    {/* Status */}
                    <td className="p-3">
                      <span className={`rounded-full px-2 py-1 text-xs font-medium ${getStatusBadgeColor(request.status)}`}>
                        {request.status || 'pending'}
                      </span>
                    </td>
                    
                    {/* Actions - Sticky Right */}
                    {!hideActions && (
                      <td className="sticky right-0 z-20 bg-white p-3 shadow-sm">
                        <div className="flex items-center gap-3">
                          <button 
                            onClick={(e) => handleDecline(request._id, e)}
                            className="px-4 py-2 text-sm font-semibold text-white bg-red-500 rounded-lg hover:bg-red-600 active:bg-red-700 transition-all duration-200 shadow-sm hover:shadow-md"
                          >
                            Decline
                          </button>
                          <button 
                            onClick={(e) => handleAllot(request._id, e)}
                            className="px-4 py-2 text-sm font-semibold text-white bg-green-500 rounded-lg hover:bg-green-600 active:bg-green-700 transition-all duration-200 shadow-sm hover:shadow-md"
                          >
                            Allot
                          </button>
                        </div>
                      </td>
                    )}
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
      
      <DoctorSelectionModal
        isOpen={showDoctorModal}
        onClose={() => setShowDoctorModal(false)}
        onSelect={handleDoctorSelect}
        requestId={selectedRequestId}
      />
    </div>
  );
}