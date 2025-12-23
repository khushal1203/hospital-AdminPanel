"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { isAdmin } from "@/utils/roleUtils";
import BackButton from "@/components/ui/BackButton";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

export default function UserManagement() {
  const router = useRouter();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

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
    if (!confirm("Are you sure you want to delete this user?")) {
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`/api/users/delete/${userId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (data.success) {
        setSuccess("User deleted successfully!");
        fetchUsers(); // Refresh user list
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError("Failed to delete user");
    }
  };

  const getRoleBadgeColor = (role) => {
    const colors = {
      admin:
        "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
      receptionist:
        "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
      doctor:
        "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
      laboratory:
        "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300",
    };
    return colors[role] || "bg-gray-100 text-gray-800";
  };

  if (loading) {
    return <LoadingSpinner message="Loading users..." />;
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <BackButton href="/dashboard" label="Back to Dashboard" />
        </div>
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                User Management
              </h1>
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                Manage system users and their roles
              </p>
            </div>

            <button
              onClick={() => router.push("/users/add")}
              className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              <svg
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
              Add New User
            </button>
          </div>
        </div>

        {/* Messages */}
        {error && (
          <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-800 dark:bg-red-900/20">
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
              <p className="font-medium text-red-800 dark:text-red-200">
                {error}
              </p>
            </div>
          </div>
        )}

        {success && (
          <div className="mb-6 rounded-lg border border-green-200 bg-green-50 p-4 dark:border-green-800 dark:bg-green-900/20">
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
              <p className="font-medium text-green-800 dark:text-green-200">
                {success}
              </p>
            </div>
          </div>
        )}

        {/* Users Table */}
        <div className="flex flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-md">
          {/* Table Header */}
          <div className="border-b border-gray-200 bg-gradient-to-r from-purple-50 to-pink-50 px-6 py-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">All Users</h2>
              <div className="text-sm text-gray-600">
                {users.length} {users.length === 1 ? "user" : "users"} total
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-auto">
            <table className="w-full table-auto text-left text-sm">
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
                {users.map((user, index) => (
                  <tr
                    key={user._id}
                    className="transition-colors hover:bg-purple-50/30"
                  >
                    <td className="p-4">
                      <div className="flex items-center gap-4">
                        <div className="relative">
                          <img
                            src={
                              user.profileImage || "/images/user/user-03.png"
                            }
                            alt={user.fullName}
                            className="h-12 w-12 rounded-full object-cover ring-2 ring-gray-200"
                          />
                          <div className="absolute -bottom-0.5 -right-0.5 h-4 w-4 rounded-full bg-green-400 ring-2 ring-white"></div>
                        </div>
                        <div>
                          <div className="text-sm font-semibold text-gray-900">
                            {user.fullName}
                          </div>
                          <div className="text-xs text-gray-500">
                            ID: {user._id.slice(-8)}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="text-sm text-gray-900">{user.email}</div>
                    </td>
                    <td className="p-4">
                      <span
                        className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${getRoleBadgeColor(
                          user.role,
                        )}`}
                      >
                        <div
                          className={`mr-2 h-2 w-2 rounded-full ${
                            user.role === "admin"
                              ? "bg-purple-400"
                              : user.role === "doctor"
                                ? "bg-green-400"
                                : user.role === "receptionist"
                                  ? "bg-blue-400"
                                  : "bg-orange-400"
                          }`}
                        ></div>
                        {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-1 text-xs font-medium text-green-800">
                        <div className="mr-2 h-1.5 w-1.5 rounded-full bg-green-400"></div>
                        Active
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="text-sm text-gray-900">
                        {new Date(user.createdAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </div>
                      <div className="text-xs text-gray-500">
                        {new Date(user.createdAt).toLocaleTimeString("en-US", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <button
                          className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-200 text-gray-500 hover:bg-gray-50 hover:text-blue-600"
                          title="Edit user"
                        >
                          <svg
                            className="h-4 w-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                            />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleDelete(user._id)}
                          className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-200 text-gray-500 hover:bg-gray-50 hover:text-red-600"
                          title="Delete user"
                        >
                          <svg
                            className="h-4 w-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {users.length === 0 && (
              <div className="py-12 text-center">
                <svg
                  className="mx-auto h-12 w-12 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
                  />
                </svg>
                <h3 className="mt-4 text-lg font-medium text-gray-900">
                  No users found
                </h3>
                <p className="mt-2 text-sm text-gray-600">
                  Get started by creating your first user account.
                </p>
                <button
                  onClick={() => router.push("/users/add")}
                  className="mt-4 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
                >
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                  Add First User
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
