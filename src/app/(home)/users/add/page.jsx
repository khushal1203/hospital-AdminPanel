"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import InputGroup from "@/components/FormElements/InputGroup";
import SelectField from "@/components/FormElements/SelectField";
import ImageUpload from "@/components/FormElements/ImageUpload";
import BackButton from "@/components/ui/BackButton";
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
        <div className="mb-6">
          <BackButton href="/users" label="Back to Users" />
        </div>
        {/* Header */}
        <div className="mb-8">
          <div className="mb-4 flex items-center gap-4">
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

        <form onSubmit={handleSubmit}>
          <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
            {/* Form Header */}
            <div className="border-b border-gray-200 bg-gray-50 px-6 py-4 dark:border-gray-700 dark:bg-gray-800/50">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                User Information
              </h2>
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                Fill in the details below to create a new user account
              </p>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
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
                    value={
                      formData.role
                        ? {
                            value: formData.role,
                            label:
                              formData.role.charAt(0).toUpperCase() +
                              formData.role.slice(1),
                          }
                        : null
                    }
                    onChange={(option) =>
                      handleChange({
                        target: { name: "role", value: option?.value || "" },
                      })
                    }
                    placeholder="Select role"
                    required
                  />
                </div>
              </div>

              {/* Profile Image Section */}
              <div className="mt-8 border-t border-gray-200 pt-6 dark:border-gray-700">
                <ImageUpload
                  label="Profile Picture"
                  onImageChange={(file) =>
                    setFormData({ ...formData, profileImage: file })
                  }
                />
              </div>

              {/* Active Status */}
              <div className="mt-6 border-t border-gray-200 pt-6 dark:border-gray-700">
                <div className="flex items-center justify-between rounded-lg bg-gray-50 p-4 dark:bg-gray-700/50">
                  <div>
                    <label className="text-sm font-medium text-gray-900 dark:text-white">
                      Account Status
                    </label>
                    <p className="mt-1 text-xs text-gray-600 dark:text-gray-400">
                      Enable or disable user account access
                    </p>
                  </div>
                  <label className="relative inline-flex cursor-pointer items-center">
                    <input
                      type="checkbox"
                      name="isActive"
                      checked={formData.isActive}
                      onChange={handleChange}
                      className="peer sr-only"
                    />
                    <div className="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-blue-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:border-gray-600 dark:bg-gray-700 dark:peer-focus:ring-blue-800"></div>
                    <span className="ml-3 text-sm font-medium text-gray-900 dark:text-gray-300">
                      {formData.isActive ? "Active" : "Inactive"}
                    </span>
                  </label>
                </div>
              </div>
            </div>

            {/* Form Footer */}
            <div className="flex justify-end gap-3 border-t border-gray-200 bg-gray-50 px-6 py-4 dark:border-gray-700 dark:bg-gray-800/50">
              <button
                type="button"
                onClick={() => router.back()}
                className="rounded-lg border border-gray-300 bg-white px-6 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-blue-400"
              >
                {loading && (
                  <svg
                    className="h-4 w-4 animate-spin"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                    />
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
