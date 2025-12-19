"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { isAdmin } from "@/utils/roleUtils";

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
            admin: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
            receptionist: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
            doctor: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
            laboratory: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300",
        };
        return colors[role] || "bg-gray-100 text-gray-800";
    };

    if (loading) {
        return (
            <div className="flex min-h-[400px] items-center justify-center">
                <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-dark dark:text-white">
                        User Management
                    </h1>
                    <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                        Manage system users and their roles
                    </p>
                </div>

                <button
                    onClick={() => router.push('/users/add')}
                    className="flex items-center gap-2 rounded-lg bg-primary px-6 py-3 font-semibold text-white transition hover:bg-opacity-90"
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

            {/* Messages */}
            {error && (
                <div className="rounded-lg bg-red-50 p-4 text-red-600 dark:bg-red-900/20">
                    {error}
                </div>
            )}

            {success && (
                <div className="rounded-lg bg-green-50 p-4 text-green-600 dark:bg-green-900/20">
                    {success}
                </div>
            )}



            {/* Users Table */}
            <div className="rounded-lg bg-white shadow-lg dark:bg-gray-dark">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-stroke dark:border-dark-3">
                                <th className="px-6 py-4 text-left text-sm font-semibold text-dark dark:text-white">
                                    Name
                                </th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-dark dark:text-white">
                                    Email
                                </th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-dark dark:text-white">
                                    Role
                                </th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-dark dark:text-white">
                                    Created
                                </th>
                                <th className="px-6 py-4 text-right text-sm font-semibold text-dark dark:text-white">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((user) => (
                                <tr
                                    key={user._id}
                                    className="border-b border-stroke dark:border-dark-3"
                                >
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <img
                                                src={user.profileImage || "/images/user/user-03.png"}
                                                alt={user.fullName}
                                                className="h-10 w-10 rounded-full object-cover"
                                            />
                                            <span className="text-sm text-dark dark:text-white">
                                                {user.fullName}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                                        {user.email}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span
                                            className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${getRoleBadgeColor(
                                                user.role
                                            )}`}
                                        >
                                            {user.role}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                                        {new Date(user.createdAt).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button
                                            onClick={() => handleDelete(user._id)}
                                            className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
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
                                                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                                />
                                            </svg>
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {users.length === 0 && (
                        <div className="py-12 text-center text-gray-600 dark:text-gray-400">
                            No users found. Create your first user to get started.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
