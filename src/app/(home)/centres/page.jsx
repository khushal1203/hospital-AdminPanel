"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { isAdmin } from "@/utils/roleUtils";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { MdEdit, MdDelete, MdAdd, MdBusiness, MdPerson, MdChevronRight, MdMoreVert, MdSearch, MdFilterList, MdViewColumn } from "react-icons/md";
import dayjs from "dayjs";
import { toast } from "@/utils/toast";

export default function CentresPage() {
  const router = useRouter();
  const [centres, setCentres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [centreToDelete, setCentreToDelete] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (!isAdmin()) {
      router.push("/dashboard");
      return;
    }
    fetchCentres();
  }, [router]);

  const fetchCentres = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_END_POINT}/centres/all`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (data.success) {
        setCentres(data.centres);
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError("Failed to fetch centres");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (centreId) => {
    setCentreToDelete(centreId);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_END_POINT}/centres/${centreToDelete}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (data.success) {
        toast.success("Centre deleted successfully!");
        fetchCentres();
      } else {
        toast.error(data.message || "Failed to delete centre");
        setError(data.message);
      }
    } catch (err) {
      toast.error("Failed to delete centre");
      setError("Failed to delete centre");
    } finally {
      setShowDeleteModal(false);
      setCentreToDelete(null);
    }
  };

  if (loading) {
    return <LoadingSpinner message="" />;
  }

  return (
    <div className="flex h-screen flex-col">
      {/* Fixed Header */}
      <div className="sticky top-0 z-30 flex-shrink-0 border-b border-gray-200 bg-white px-4 py-4 shadow-sm">
        <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
          <h1 className="text-xl font-bold text-gray-900 sm:text-2xl">
            Centres & Doctors
          </h1>
          <div className="flex flex-wrap items-center gap-3">
            {/* Search */}
            <div className="relative">
              <img 
                src="/images/icon/searchIcon.svg" 
                alt="Search" 
                className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 filter brightness-0" 
              />
              <input
                type="text"
                placeholder="Search centres..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-64 rounded-lg border border-gray-300 pl-10 pr-4 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
            </div>
            
            {/* Filter */}
            <button className="flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
              <MdFilterList className="h-4 w-4" />
              Filter
            </button>
            
            {/* Customize Columns */}
            <button className="flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
              <MdViewColumn className="h-4 w-4" />
              Customize Columns
            </button>
            
            {/* Add New */}
            <button
              onClick={() => router.push("/centres/add")}
              className="inline-flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
              style={{ backgroundColor: '#ECE9F1', color: '#402575' }}
            >
              <MdAdd className="h-5 w-5" />
              Add New
            </button>
          </div>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-hidden bg-gray-50">
        <div className="h-full overflow-auto p-4">
          {/* Error Message */}
          {error && (
            <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4">
              <div className="flex items-center">
                <svg
                  className="mr-3 h-5 w-5 text-red-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <p className="font-medium text-red-800">{error}</p>
              </div>
            </div>
          )}

          {/* Centres Table */}
          {!centres || centres.length === 0 ? (
            <div className="rounded-xl border border-gray-200 bg-white p-12 text-center shadow-md">
              <p className="text-lg text-gray-500">No centres found.</p>
            </div>
          ) : (
            <div className="flex flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-md">
              <div className="custom-scrollbar flex-1 overflow-auto">
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
                <table className="w-full min-w-[1800px] table-auto text-left text-sm">
                  <thead className="sticky top-0 z-20 bg-gradient-to-r from-purple-50 to-pink-50">
                    <tr className="border-b border-gray-200">
                      <th className="p-3 text-xs font-semibold uppercase tracking-wide text-gray-700 min-w-[250px]">
                        Hospital
                      </th>
                      <th className="p-3 text-xs font-semibold uppercase tracking-wide text-gray-700 min-w-[200px]">
                        Doctor
                      </th>
                      <th className="p-3 text-xs font-semibold uppercase tracking-wide text-gray-700 min-w-[180px]">
                        Contact
                      </th>
                      <th className="p-3 text-xs font-semibold uppercase tracking-wide text-gray-700 min-w-[150px]">
                        Location
                      </th>
                      <th className="p-3 text-xs font-semibold uppercase tracking-wide text-gray-700 min-w-[120px]">
                        License
                      </th>
                      <th className="p-3 text-xs font-semibold uppercase tracking-wide text-gray-700 min-w-[120px]">
                        Status
                      </th>
                      <th className="p-3 text-xs font-semibold uppercase tracking-wide text-gray-700 min-w-[120px]">
                        Created
                      </th>
                      <th className="sticky right-0 top-0 z-30 bg-gradient-to-r from-purple-50 to-pink-50 p-3 text-xs font-semibold uppercase tracking-wide text-gray-700 shadow-sm min-w-[120px]">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {centres.map((centre) => (
                      <tr
                        key={centre._id}
                        className="transition-colors hover:bg-purple-50/30"
                      >
                        {/* Hospital Info */}
                        <td className="p-3">
                          <div className="flex items-center gap-3">
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100">
                              <MdBusiness className="h-4 w-4 text-blue-600" />
                            </div>
                            <div className="flex flex-col">
                              <span className="font-medium text-gray-900 text-sm">
                                {centre.hospitalName || '-'}
                              </span>
                              <span className="text-xs text-gray-500">
                                {centre._id.slice(-8)}
                              </span>
                            </div>
                          </div>
                        </td>
                        
                        {/* Doctor Info */}
                        <td className="p-3">
                          <div className="flex items-center gap-3">
                            <div className="h-8 w-8 flex-shrink-0 overflow-hidden rounded-full bg-gray-200">
                              <div className="flex h-full w-full items-center justify-center bg-green-100 text-xs font-bold text-green-600">
                                {centre.doctorCount > 0 ? centre.doctorCount : 'D'}
                              </div>
                            </div>
                            <div className="flex flex-col">
                              <span className="font-medium text-gray-900 text-sm">
                                {centre.doctorCount > 0 ? `${centre.doctorCount} Doctor${centre.doctorCount > 1 ? 's' : ''}` : 'No Doctors'}
                              </span>
                              <span className="text-xs text-gray-500">
                                {centre.doctorCount > 1 ? 'Multiple doctors' : centre.doctorCount === 1 ? 'Single doctor' : 'No doctors assigned'}
                              </span>
                            </div>
                          </div>
                        </td>
                        
                        {/* Contact */}
                        <td className="p-3">
                          <div className="flex flex-col">
                            <span className="text-gray-900 text-sm">{centre.phoneNumber || '-'}</span>
                            <span className="text-xs text-gray-500">{centre.email || '-'}</span>
                          </div>
                        </td>
                        
                        {/* Location */}
                        <td className="p-3">
                          <div className="flex flex-col">
                            <span className="text-gray-900 text-sm">{centre.city || '-'}</span>
                            <span className="text-xs text-gray-500">{centre.state || '-'}</span>
                          </div>
                        </td>
                        
                        {/* License */}
                        <td className="p-3 text-gray-600">
                          {centre.hospitalLicenseNumber || '-'}
                        </td>
                        
                        {/* Status */}
                        <td className="p-3">
                          <span className="rounded-full px-2 py-1 text-xs font-medium bg-green-100 text-green-700">
                            Active
                          </span>
                        </td>
                        
                        {/* Created */}
                        <td className="p-3 text-gray-600">
                          {centre.createdAt ? dayjs(centre.createdAt).format("DD/MM/YYYY") : '-'}
                        </td>
                        
                        {/* Actions - Sticky Right */}
                        <td className="sticky right-0 z-20 bg-white p-3 shadow-sm">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => router.push(`/centres/${centre._id}`)}
                              className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-200 text-gray-500 hover:bg-gray-50 hover:text-purple-600"
                            >
                              <MdChevronRight className="h-5 w-5" />
                            </button>
                            <button className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-200 text-gray-500 hover:bg-gray-50 hover:text-purple-600">
                              <MdMoreVert className="h-5 w-5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-96 rounded-lg bg-white p-6">
            <h3 className="mb-4 text-lg font-semibold text-gray-900">
              Confirm Delete
            </h3>
            <p className="mb-6 text-gray-600">
              Are you sure you want to delete this centre? This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 rounded-lg border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="flex-1 rounded-lg bg-red-600 px-4 py-2 text-white hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}