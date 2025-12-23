"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import InputGroup from "@/components/FormElements/InputGroup";
import SelectField from "@/components/FormElements/SelectField";
import ImageUpload from "@/components/FormElements/ImageUpload";
import { EmailIcon, PasswordIcon } from "@/assets/icons";
import { MdArrowBack } from "react-icons/md";

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
    <div className="flex h-screen flex-col">
      {/* Fixed Header */}
      <div className="sticky top-0 z-10 flex-shrink-0 border-b border-gray-200 bg-white px-4 py-4 shadow-sm">
        <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.push("/users")}
              className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-200 text-gray-500 hover:bg-gray-50 hover:text-purple-600"
            >
              <MdArrowBack className="h-4 w-4" />
            </button>
            <h1 className="text-xl font-bold text-gray-900 sm:text-2xl">
              Add New User
            </h1>
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

          {/* Form */}
          <form onSubmit={handleSubmit}>
            <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-md">
              {/* Form Header */}
              <div className="border-b border-gray-200 bg-gradient-to-r from-purple-50 to-pink-50 px-6 py-4">
                <h2 className="text-lg font-semibold text-gray-900">
                  User Information
                </h2>
                <p className="mt-1 text-sm text-gray-600">
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
                <div className="mt-8 border-t border-gray-200 pt-6">
                  <ImageUpload
                    label="Profile Picture"
                    onImageChange={(file) =>
                      setFormData({ ...formData, profileImage: file })
                    }
                  />
                </div>

                {/* Active Status */}
                <div className="mt-6 border-t border-gray-200 pt-6">
                  <div className="flex items-center justify-between rounded-lg bg-gray-50 p-4">
                    <div>
                      <label className="text-sm font-medium text-gray-900">
                        Account Status
                      </label>
                      <p className="mt-1 text-xs text-gray-600">
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
                      <div className="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-blue-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300"></div>
                      <span className="ml-3 text-sm font-medium text-gray-900">
                        {formData.isActive ? "Active" : "Inactive"}
                      </span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Form Footer */}
              <div className="flex justify-end gap-3 border-t border-gray-200 bg-gradient-to-r from-purple-50 to-pink-50 px-6 py-4">
                <button
                  type="button"
                  onClick={() => router.push("/users")}
                  className="rounded-lg border border-gray-300 bg-white px-6 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
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
    </div>
  );
}
