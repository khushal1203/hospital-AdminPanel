"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import InputGroup from "@/components/FormElements/InputGroup";
import SelectField from "@/components/FormElements/SelectField";
import BackButton from "@/components/ui/BackButton";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { EmailIcon } from "@/assets/icons";

export default function EditUserPage({ params }) {
  const router = useRouter();
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    role: "",
    contactNumber: "",
    isActive: true,
  });

  useEffect(() => {
    params.then(p => {
      setUserId(p.id);
      fetchUser(p.id);
    });
  }, [params]);

  const fetchUser = async (id) => {
    const token = localStorage.getItem("token");
    const result = await apiCall(`/api/users/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (result.success) {
      const user = result.data.user;
      setFormData({
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        contactNumber: user.contactNumber || "",
        isActive: user.isActive !== false,
      });
    } else {
      if (result.type === 'auth' && result.redirect) {
        router.push(result.redirect);
      }
      setError(result.error);
    }
    setLoading(false);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    const token = localStorage.getItem("token");
    const result = await apiCall(`/api/users/update/${userId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(formData),
    });

    if (result.success) {
      router.push("/users");
    } else {
      if (result.type === 'auth' && result.redirect) {
        router.push(result.redirect);
      }
      setError(result.error);
    }
    setSaving(false);
  };

  if (loading) {
    return <LoadingSpinner message="Loading user..." />;
  }

  return (
    <div className="min-h-screen py-8">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <BackButton href="/users" label="Back to Users" />
        </div>
        
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Edit User</h1>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">Update user account information</p>
        </div>

        {error && (
          <div className="mb-6 rounded-lg bg-red-50 border border-red-200 p-4">
            <p className="text-red-800 font-medium">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
              <h2 className="text-lg font-semibold text-gray-900">User Information</h2>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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

              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <label className="text-sm font-medium text-gray-900">Account Status</label>
                    <p className="text-xs text-gray-600 mt-1">Enable or disable user account access</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      name="isActive"
                      checked={formData.isActive}
                      onChange={handleChange}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    <span className="ml-3 text-sm font-medium text-gray-900">
                      {formData.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </label>
                </div>
              </div>
            </div>

            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => router.back()}
                className="px-6 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="px-6 py-2.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 rounded-lg transition-colors"
              >
                {saving ? "Updating..." : "Update User"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}