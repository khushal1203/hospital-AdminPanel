"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { isAdmin } from "@/utils/roleUtils";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { MdEdit, MdDelete, MdAdd } from "react-icons/md";
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
      const res = await fetch("/api/users/all", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (data.success) {
        setUsers(data.users);
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
      const res = await fetch(`/api/users/delete/${userToDelete}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

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
    return <LoadingSpinner message="Loading users..." />;
  }

  return (
    <div className="flex h-screen flex-col">
      {/* Fixed Header */}
      <div className="sticky top-0 z-10 flex-shrink-0 border-b border-gray-200 bg-white px-4 py-4 shadow-sm">
        <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
          <h1 className="text-xl font-bold text-gray-900 sm:text-2xl">
            User Management
          </h1>
          <div className="w-full sm:w-auto">
            <button
              onClick={() => router.push("/users/add")}
              className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              <MdAdd className="h-5 w-5" />
              Add New User
            </button>
          </div>
        </div>
      </div>

      {/* Scrollable Content */}
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
          {!users || users.length === 0 ? (
            <div className="rounded-xl border border-gray-200 bg-white p-12 text-center shadow-md">
              <p className="text-lg text-gray-500">No users found.</p>
            </div>
          ) : (
            <div className="flex flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-md">
              <div className="flex-1 overflow-auto">
                <table className="w-full min-w-[1200px] table-auto text-left text-sm">
                  <thead className="bg-gradient-to-r from-purple-50 to-pink-50">
                    <tr className="border-b border-gray-200">
                      <th className="p-4 text-xs font-semibold uppercase tracking-wide text-gray-700">
                        User
                      </th>
                      <th className="p-4 text-xs font-semibold uppercase tracking-wide text-gray-700">
                        Email
                      </th>
                      <th className="p-4 text-xs font-semibold uppercase tracking-wide text-gray-700">
                        Role
                      </th>
                      <th className="p-4 text-xs font-semibold uppercase tracking-wide text-gray-700">
                        Status
                      </th>
                      <th className="p-4 text-xs font-semibold uppercase tracking-wide text-gray-700">
                        Created
                      </th>
                      <th className="p-4 text-xs font-semibold uppercase tracking-wide text-gray-700">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {users.map((user) => (
                      <tr
                        key={user._id}
                        className="transition-colors hover:bg-purple-50/30"
                      >
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <div className="h-8 w-8 flex-shrink-0 overflow-hidden rounded-full bg-gray-200">
                              {user.profileImage ? (
                                <img
                                  src={user.profileImage}
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
                              <span className="font-medium text-gray-900">
                                {user.fullName}
                              </span>
                              <span className="text-xs text-gray-500">
                                ID: {user._id.slice(-8)}
                              </span>
                            </div>
                          </div>
                        </td>
                        <td className="p-4 text-gray-600">{user.email}</td>
                        <td className="p-4">
                          <span
                            className={`rounded-full px-3 py-1 text-xs font-medium ${getRoleBadgeColor(
                              user.role
                            )}`}
                          >
                            {user.role}
                          </span>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-1">
                            <div className={`h-2 w-2 rounded-full ${user.isActive ? 'bg-green-400' : 'bg-red-400'}`}></div>
                            <span className="text-xs text-gray-600">{user.isActive ? 'Active' : 'Inactive'}</span>
                          </div>
                        </td>
                        <td className="p-4 text-gray-600">
                          {user.createdAt
                            ? dayjs(user.createdAt).format("MMM DD, YYYY")
                            : "-"}
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => router.push(`/users/edit/${user._id}`)}
                              className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-200 text-gray-500 hover:bg-gray-50 hover:text-blue-600"
                              title="Edit user"
                            >
                              <MdEdit className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(user._id)}
                              className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-200 text-gray-500 hover:bg-gray-50 hover:text-red-600"
                              title="Delete user"
                            >
                              <MdDelete className="h-4 w-4" />
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
              Are you sure you want to delete this user? This action cannot be undone.
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