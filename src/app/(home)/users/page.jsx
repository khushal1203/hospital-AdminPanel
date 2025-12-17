"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { isAdmin } from "@/utils/roleUtils";
import { EmailIcon, PasswordIcon } from "@/assets/icons";
import InputGroup from "@/components/FormElements/InputGroup";

export default function UserManagement() {
    const router = useRouter();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showAddForm, setShowAddForm] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        password: "",
        role: "receptionist",
    });

    useEffect(() => {
        // Check if user is admin
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

    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        try {
            const token = localStorage.getItem("token");
            const res = await fetch("/api/users/create", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(formData),
            });

            const data = await res.json();

            if (data.success) {
                setSuccess("User created successfully!");
                setFormData({
                    fullName: "",
                    email: "",
                    password: "",
                    role: "receptionist",
                });
                setShowAddForm(false);
                fetchUsers(); // Refresh user list
            } else {
                setError(data.message);
            }
        } catch (err) {
            setError("Failed to create user");
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
                    onClick={() => setShowAddForm(!showAddForm)}
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

            {/* Add User Form */}
            {showAddForm && (
                <div className="rounded-lg bg-white p-6 shadow-lg dark:bg-gray-dark">
                    <h2 className="mb-6 text-xl font-semibold text-dark dark:text-white">
                        Add New User
                    </h2>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <InputGroup
                            type="text"
                            label="Full Name"
                            placeholder="Enter full name"
                            name="fullName"
                            value={formData.fullName}
                            handleChange={handleInputChange}
                            required
                        />

                        <InputGroup
                            type="email"
                            label="Email"
                            placeholder="Enter email address"
                            name="email"
                            value={formData.email}
                            handleChange={handleInputChange}
                            icon={<EmailIcon />}
                            required
                        />

                        <InputGroup
                            type="password"
                            label="Password"
                            placeholder="Enter password"
                            name="password"
                            value={formData.password}
                            handleChange={handleInputChange}
                            icon={<PasswordIcon />}
                            required
                        />

                        <div>
                            <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
                                Role
                            </label>
                            <select
                                name="role"
                                value={formData.role}
                                onChange={handleInputChange}
                                className="w-full rounded-lg border border-stroke bg-transparent px-5 py-3 text-dark outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-gray-2 dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:focus:border-primary"
                                required
                            >
                                <option value="receptionist">Receptionist</option>
                                <option value="doctor">Doctor</option>
                                <option value="laboratory">Laboratory Admin</option>
                                <option value="admin">Admin</option>
                            </select>
                        </div>

                        <div className="flex gap-3">
                            <button
                                type="submit"
                                className="flex-1 rounded-lg bg-primary px-6 py-3 font-semibold text-white transition hover:bg-opacity-90"
                            >
                                Create User
                            </button>
                            <button
                                type="button"
                                onClick={() => setShowAddForm(false)}
                                className="rounded-lg border border-stroke px-6 py-3 font-semibold text-dark transition hover:bg-gray-2 dark:border-dark-3 dark:text-white dark:hover:bg-dark-3"
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
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
                                    <td className="px-6 py-4 text-sm text-dark dark:text-white">
                                        {user.fullName}
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
