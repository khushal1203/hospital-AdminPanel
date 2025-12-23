"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import InputGroup from "@/components/FormElements/InputGroup";
import SelectField from "@/components/FormElements/SelectField";
import ImageUpload from "@/components/FormElements/ImageUpload";
import { EmailIcon, PasswordIcon } from "@/assets/icons";


export default function AddUserPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        password: "",
        confirmPassword: "",
        role: "",
        contactNumber: "",
        isActive: true,
    });


    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === "checkbox" ? checked : value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        if (formData.password !== formData.confirmPassword) {
            setError("Passwords do not match");
            setLoading(false);
            return;
        }

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
                router.push("/users");
            } else {
                setError(data.message || "Failed to create user");
            }
        } catch (err) {
            setError("Failed to create user");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen py-8">
            <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center gap-4 mb-4">
                        <button
                            onClick={() => router.back()}
                            className="flex items-center justify-center w-10 h-10 rounded-lg bg-white dark:bg-gray-800 shadow-sm border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                        >
                            <svg className="w-5 h-5 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                        </button>
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                                Add New User
                            </h1>
                            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                                Create a new user account with role assignment
                            </p>
                        </div>
                    </div>
                </div>

                {error && (
                    <div className="mb-6 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-4">
                        <div className="flex items-center">
                            <svg className="w-5 h-5 text-red-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <p className="text-red-800 dark:text-red-200 font-medium">{error}</p>
                        </div>
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                        {/* Form Header */}
                        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
                            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">User Information</h2>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Fill in the details below to create a new user account</p>
                        </div>

                        <div className="p-6">
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                {/* Left Column */}
                                <div className="space-y-6">
                                    <InputGroup
                                        type="text"
                                        label="Full Name"
                                        placeholder="Enter full name"
                                        name="fullName"
                                        value={formData.fullName}
                                        handleChange={handleChange}
                                        required
                                    />

                                    <InputGroup
                                        type="email"
                                        label="Email Address"
                                        placeholder="Enter email address"
                                        name="email"
                                        value={formData.email}
                                        handleChange={handleChange}
                                        icon={<EmailIcon />}
                                        required
                                    />

                                    <InputGroup
                                        type="tel"
                                        label="Contact Number"
                                        placeholder="Enter contact number"
                                        name="contactNumber"
                                        value={formData.contactNumber}
                                        handleChange={handleChange}
                                    />
                                </div>

                                {/* Right Column */}
                                <div className="space-y-6">
                                    <InputGroup
                                        type="password"
                                        label="Password"
                                        placeholder="Enter password"
                                        name="password"
                                        value={formData.password}
                                        handleChange={handleChange}
                                        required
                                    />

                                    <InputGroup
                                        type="password"
                                        label="Confirm Password"
                                        placeholder="Confirm password"
                                        name="confirmPassword"
                                        value={formData.confirmPassword}
                                        handleChange={handleChange}
                                        required
                                    />

                                    <SelectField
                                        label="Role"
                                        options={[
                                            { value: "admin", label: "Administrator" },
                                            { value: "receptionist", label: "Receptionist" },
                                            { value: "doctor", label: "Doctor" },
                                            { value: "laboratory", label: "Laboratory" },
                                        ]}
                                        value={formData.role ? { value: formData.role, label: formData.role.charAt(0).toUpperCase() + formData.role.slice(1) } : null}
                                        onChange={(option) => handleChange({ target: { name: "role", value: option?.value || "" } })}
                                        placeholder="Select role"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Profile Image Section */}
                            <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                                <ImageUpload
                                    label="Profile Picture"
                                    onImageChange={(file) => setFormData({ ...formData, profileImage: file })}
                                />
                            </div>

                            {/* Active Status */}
                            <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                                <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                                    <div>
                                        <label className="text-sm font-medium text-gray-900 dark:text-white">Account Status</label>
                                        <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">Enable or disable user account access</p>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input
                                            type="checkbox"
                                            name="isActive"
                                            checked={formData.isActive}
                                            onChange={handleChange}
                                            className="sr-only peer"
                                        />
                                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                                        <span className="ml-3 text-sm font-medium text-gray-900 dark:text-gray-300">
                                            {formData.isActive ? 'Active' : 'Inactive'}
                                        </span>
                                    </label>
                                </div>
                            </div>
                        </div>

                        {/* Form Footer */}
                        <div className="px-6 py-4 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-200 dark:border-gray-700 flex justify-end gap-3">
                            <button
                                type="button"
                                onClick={() => router.back()}
                                className="px-6 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={loading}
                                className="px-6 py-2.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors flex items-center gap-2"
                            >
                                {loading && (
                                    <svg className="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                    </svg>
                                )}
                                {loading ? "Creating..." : "Create User"}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}