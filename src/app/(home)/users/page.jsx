"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { isAdmin } from "@/utils/roleUtils";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import {
  MdEdit,
  MdDelete,
  MdAdd,
  MdFilterList,
  MdViewColumn,
  MdChevronRight,
  MdMoreVert,
  MdChevronLeft,
} from "react-icons/md";
import dayjs from "dayjs";
import { toast } from "@/utils/toast";

export default function UserManagement() {
  const router = useRouter();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Filter users based on search term
  useEffect(() => {
    if (!searchTerm) {
      setFilteredUsers(users);
    } else {
      const filtered = users.filter(
        (user) =>
          user.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.role?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.phoneNumber?.includes(searchTerm) ||
          user.employeeId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.department?.toLowerCase().includes(searchTerm.toLowerCase()),
      );
      setFilteredUsers(filtered);
    }
    setCurrentPage(1); // Reset to first page when filtering
  }, [users, searchTerm]);

  // Pagination logic
  const totalItems = filteredUsers.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentUsers = filteredUsers.slice(startIndex, endIndex);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  useEffect(() => {
    if (!isAdmin()) {
      router.push("/dashboard");
      return;
    }
    fetchUsers();
  }, [router]);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_END_POINT}/users/all`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const data = await res.json();

      if (data.success) {
        // Fetch hospital names for users with centreId
        const usersWithHospitals = await Promise.all(
          data.users.map(async (user) => {
            if (user.centreId) {
              try {
                const centreRes = await fetch(
                  `${process.env.NEXT_PUBLIC_API_END_POINT}/centres/${user.centreId}`,
                  {
                    headers: {
                      Authorization: `Bearer ${token}`,
                    },
                  },
                );
                const centreData = await centreRes.json();
                return {
                  ...user,
                  hospitalName: centreData.success ? centreData.centre.hospitalName : null,
                };
              } catch (error) {
                return { ...user, hospitalName: null };
              }
            }
            return { ...user, hospitalName: null };
          })
        );
        setUsers(usersWithHospitals);
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError("Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (userId) => {
    setUserToDelete(userId);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_END_POINT}/users/delete/${userToDelete}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const data = await res.json();

      if (data.success) {
        toast.success("User deleted successfully!");
        fetchUsers();
      } else {
        toast.error(data.message || "Failed to delete user");
        setError(data.message);
      }
    } catch (err) {
      toast.error("Failed to delete user");
      setError("Failed to delete user");
    } finally {
      setShowDeleteModal(false);
      setUserToDelete(null);
    }
  };

  const getRoleBadgeColor = (role) => {
    const colors = {
      admin: "bg-purple-100 text-purple-700",
      receptionist: "bg-blue-100 text-blue-700",
      doctor: "bg-green-100 text-green-700",
      laboratory: "bg-orange-100 text-orange-700",
    };
    return colors[role] || "bg-gray-100 text-gray-700";
  };

  if (loading) {
    return <LoadingSpinner message="" />;
  }

  return (
    <div className="flex h-screen flex-col">
      {/* Fixed Header with Toolbar */}
      <div className="sticky top-0 z-30 flex-shrink-0 border-b border-gray-200 bg-white px-4 py-4 shadow-sm">
        <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
          <h1 className="text-xl font-bold text-gray-900 sm:text-2xl">
            User Management
          </h1>
          <div className="flex flex-wrap items-center gap-3">
            {/* Search */}
            <div className="relative">
              <img
                src="/images/icon/searchIcon.svg"
                alt="Search"
                className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 brightness-0 filter"
              />
              <input
                type="text"
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-64 rounded-lg border border-gray-300 py-2 pl-10 pr-4 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
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

            {/* Add New User */}
            <button
              onClick={() => router.push("/users/add")}
              className="inline-flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
              style={{ backgroundColor: "#ECE9F1", color: "#402575" }}
            >
              <MdAdd className="h-5 w-5" />
              Add New User
            </button>
          </div>
        </div>
      </div>

      {/* Scrollable Table Content */}
      <div className="flex-1 overflow-hidden bg-gray-50">
        <div className="h-full overflow-auto p-4">
          {/* Messages */}
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

          {success && (
            <div className="mb-6 rounded-lg border border-green-200 bg-green-50 p-4">
              <div className="flex items-center">
                <svg
                  className="mr-3 h-5 w-5 text-green-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <p className="font-medium text-green-800">{success}</p>
              </div>
            </div>
          )}

          {/* Users Table */}
          {!currentUsers || currentUsers.length === 0 ? (
            <div className="rounded-xl border border-gray-200 bg-white p-12 text-center shadow-md">
              <p className="text-lg text-gray-500">No users found.</p>
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
                <table className="w-full min-w-[3200px] table-auto text-left text-sm">
                  <thead className="sticky top-0 z-20 bg-gradient-to-r from-purple-50 to-pink-50">
                    <tr className="border-b border-gray-200">
                      <th className="min-w-[180px] p-3 text-xs font-semibold uppercase tracking-wide text-gray-700">
                        User
                      </th>
                      <th className="min-w-[180px] p-3 text-xs font-semibold uppercase tracking-wide text-gray-700">
                        Hospital
                      </th>
                      <th className="min-w-[200px] p-3 text-xs font-semibold uppercase tracking-wide text-gray-700">
                        Email
                      </th>
                      <th className="min-w-[120px] p-3 text-xs font-semibold uppercase tracking-wide text-gray-700">
                        Phone
                      </th>
                      <th className="min-w-[140px] p-3 text-xs font-semibold uppercase tracking-wide text-gray-700">
                        Aadhar
                      </th>
                      <th className="min-w-[100px] p-3 text-xs font-semibold uppercase tracking-wide text-gray-700">
                        Gender
                      </th>
                      <th className="min-w-[120px] p-3 text-xs font-semibold uppercase tracking-wide text-gray-700">
                        Date of Birth
                      </th>
                      <th className="min-w-[120px] p-3 text-xs font-semibold uppercase tracking-wide text-gray-700">
                        Marital Status
                      </th>
                      <th className="min-w-[200px] p-3 text-xs font-semibold uppercase tracking-wide text-gray-700">
                        Address
                      </th>
                      <th className="min-w-[120px] p-3 text-xs font-semibold uppercase tracking-wide text-gray-700">
                        City
                      </th>
                      <th className="min-w-[120px] p-3 text-xs font-semibold uppercase tracking-wide text-gray-700">
                        State
                      </th>
                      <th className="min-w-[100px] p-3 text-xs font-semibold uppercase tracking-wide text-gray-700">
                        Pincode
                      </th>
                      <th className="min-w-[100px] p-3 text-xs font-semibold uppercase tracking-wide text-gray-700">
                        Role
                      </th>
                      <th className="min-w-[140px] p-3 text-xs font-semibold uppercase tracking-wide text-gray-700">
                        Department
                      </th>
                      <th className="min-w-[120px] p-3 text-xs font-semibold uppercase tracking-wide text-gray-700">
                        Employee ID
                      </th>
                      <th className="min-w-[120px] p-3 text-xs font-semibold uppercase tracking-wide text-gray-700">
                        Experience
                      </th>
                      <th className="min-w-[140px] p-3 text-xs font-semibold uppercase tracking-wide text-gray-700">
                        Qualification
                      </th>
                      <th className="min-w-[140px] p-3 text-xs font-semibold uppercase tracking-wide text-gray-700">
                        Field of Study
                      </th>
                      <th className="min-w-[160px] p-3 text-xs font-semibold uppercase tracking-wide text-gray-700">
                        Institute
                      </th>
                      <th className="min-w-[120px] p-3 text-xs font-semibold uppercase tracking-wide text-gray-700">
                        Passing Year
                      </th>
                      <th className="min-w-[100px] p-3 text-xs font-semibold uppercase tracking-wide text-gray-700">
                        Documents
                      </th>
                      <th className="min-w-[100px] p-3 text-xs font-semibold uppercase tracking-wide text-gray-700">
                        Status
                      </th>
                      <th className="min-w-[120px] p-3 text-xs font-semibold uppercase tracking-wide text-gray-700">
                        Created
                      </th>
                      <th className="sticky right-0 top-0 z-30 min-w-[120px] bg-gradient-to-r from-purple-50 to-pink-50 p-3 text-xs font-semibold uppercase tracking-wide text-gray-700 shadow-sm">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {currentUsers.map((user) => (
                      <tr
                        key={user._id}
                        className="transition-colors hover:bg-purple-50/30"
                      >
                        {/* User Info - Sticky Left */}
                        <td className="p-3">
                          <div className="flex items-center gap-3">
                            <div className="h-8 w-8 flex-shrink-0 overflow-hidden rounded-full bg-gray-200">
                              {user.doctorImage || user.profileImage ? (
                                <img
                                  src={user.doctorImage || user.profileImage}
                                  alt={user.fullName}
                                  className="h-full w-full object-cover"
                                />
                              ) : (
                                <div className="flex h-full w-full items-center justify-center bg-purple-100 text-xs font-bold text-purple-600">
                                  {user.fullName?.charAt(0)}
                                </div>
                              )}
                            </div>
                            <div className="flex flex-col">
                              <span className="text-sm font-medium text-gray-900">
                                {user.fullName || "-"}
                              </span>
                              <span className="text-xs text-gray-500">
                                {user._id.slice(-8)}
                              </span>
                            </div>
                          </div>
                        </td>

                        {/* Hospital Name */}
                        <td className="p-3 text-gray-900">
                          {user.hospitalName || "-"}
                        </td>

                        {/* Email */}
                        <td className="p-3 text-gray-900">
                          {user.email || "-"}
                        </td>

                        {/* Phone */}
                        <td className="p-3 text-gray-600">
                          {user.phoneNumber || "-"}
                        </td>

                        {/* Aadhar */}
                        <td className="p-3 text-gray-600">
                          {user.aadharCardNumber || "-"}
                        </td>

                        {/* Gender */}
                        <td className="p-3 capitalize text-gray-600">
                          {user.gender || "-"}
                        </td>

                        {/* Date of Birth */}
                        <td className="p-3 text-gray-600">
                          {user.dateOfBirth
                            ? dayjs(user.dateOfBirth).format("DD/MM/YYYY")
                            : "-"}
                        </td>

                        {/* Marital Status */}
                        <td className="p-3 capitalize text-gray-600">
                          {user.maritalStatus || "-"}
                        </td>

                        {/* Address */}
                        <td className="p-3 text-gray-600">
                          {user.address || "-"}
                        </td>

                        {/* City */}
                        <td className="p-3 text-gray-600">
                          {user.city || "-"}
                        </td>

                        {/* State */}
                        <td className="p-3 text-gray-600">
                          {user.state || "-"}
                        </td>

                        {/* Pincode */}
                        <td className="p-3 text-gray-600">
                          {user.pincode || "-"}
                        </td>

                        {/* Role */}
                        <td className="p-3">
                          <span
                            className={`rounded-full px-2 py-1 text-xs font-medium ${getRoleBadgeColor(
                              user.role,
                            )}`}
                          >
                            {user.role}
                          </span>
                        </td>

                        {/* Department */}
                        <td className="p-3 text-gray-600">
                          {user.department || "-"}
                        </td>

                        {/* Employee ID */}
                        <td className="p-3 text-gray-600">
                          {user.employeeId || "-"}
                        </td>

                        {/* Experience */}
                        <td className="p-3 text-gray-600">
                          {user.experience || "-"}
                        </td>

                        {/* Qualification */}
                        <td className="p-3 text-gray-600">
                          {user.qualification || "-"}
                        </td>

                        {/* Field of Study */}
                        <td className="p-3 text-gray-600">
                          {user.fieldOfStudy || "-"}
                        </td>

                        {/* Institute */}
                        <td className="p-3 text-gray-600">
                          {user.instituteName || "-"}
                        </td>

                        {/* Passing Year */}
                        <td className="p-3 text-gray-600">
                          {user.passingYear || "-"}
                        </td>

                        {/* Documents */}
                        <td className="p-3">
                          {user.documents && user.documents.length > 0 ? (
                            <span className="inline-flex items-center rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-700">
                              {user.documents.length}
                            </span>
                          ) : (
                            <span className="text-gray-400">0</span>
                          )}
                        </td>

                        {/* Status */}
                        <td className="p-3">
                          <div className="flex items-center gap-1">
                            <div
                              className={`h-2 w-2 rounded-full ${user.isActive ? "bg-green-400" : "bg-red-400"}`}
                            ></div>
                            <span className="text-xs text-gray-600">
                              {user.isActive ? "Active" : "Inactive"}
                            </span>
                          </div>
                          {user.isAdmin && (
                            <span className="mt-1 inline-flex items-center rounded-full bg-purple-100 px-2 py-1 text-xs font-medium text-purple-700">
                              Admin
                            </span>
                          )}
                        </td>

                        {/* Created */}
                        <td className="p-3 text-gray-600">
                          {user.createdAt
                            ? dayjs(user.createdAt).format("MMM DD, YYYY")
                            : "-"}
                        </td>

                        {/* Actions - Sticky Right */}
                        <td className="sticky right-0 z-10 bg-white p-3 shadow-sm">
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => router.push(`/users/${user._id}`)}
                              className="flex h-7 w-7 items-center justify-center rounded-full border border-gray-200 text-gray-500 hover:bg-gray-50 hover:text-purple-600"
                              title="View"
                            >
                              <MdChevronRight className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() =>
                                router.push(`/users/edit/${user._id}`)
                              }
                              className="flex h-7 w-7 items-center justify-center rounded-full border border-gray-200 text-gray-500 hover:bg-gray-50 hover:text-blue-600"
                              title="Edit"
                            >
                              <MdEdit className="h-3 w-3" />
                            </button>
                            <button
                              onClick={() => handleDelete(user._id)}
                              className="flex h-7 w-7 items-center justify-center rounded-full border border-gray-200 text-gray-500 hover:bg-gray-50 hover:text-red-600"
                              title="Delete"
                            >
                              <MdDelete className="h-3 w-3" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
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
                    <MdChevronLeft className="h-4 w-4 sm:h-5 sm:w-5" />
                    <span className="hidden sm:inline">Previous</span>
                  </button>
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="flex items-center gap-1 rounded-lg border border-gray-300 bg-white px-2 py-2 text-xs font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 sm:px-3 sm:text-sm"
                  >
                    <span className="hidden sm:inline">Next</span>
                    <MdChevronRight className="h-4 w-4 sm:h-5 sm:w-5" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="mx-4 w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <div className="mb-4 flex items-center justify-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
                <MdDelete className="h-6 w-6 text-red-600" />
              </div>
            </div>
            <h3 className="mb-2 text-center text-lg font-semibold text-gray-900">
              Delete User
            </h3>
            <p className="mb-6 text-center text-sm text-gray-600">
              Are you sure you want to delete this user? This action cannot be
              undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setUserToDelete(null);
                }}
                className="flex-1 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="flex-1 rounded-lg bg-red-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-red-700"
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
