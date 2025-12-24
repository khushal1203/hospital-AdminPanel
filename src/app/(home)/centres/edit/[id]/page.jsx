"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import InputGroup from "@/components/FormElements/InputGroup";
import ImageUpload from "@/components/FormElements/ImageUpload";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { MdArrowBack, MdBusiness, MdPerson } from "react-icons/md";
import { toast } from "@/utils/toast";

export default function EditCentrePage({ params }) {
  const router = useRouter();
  const [centreId, setCentreId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    hospitalName: "",
    phoneNumber: "",
    email: "",
    hospitalLicenseNumber: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    doctorImage: null,
    doctorName: "",
    doctorPhoneNumber: "",
    doctorEmail: "",
    medicalLicenseNumber: "",
  });

  useEffect(() => {
    params.then(p => {
      setCentreId(p.id);
      fetchCentre(p.id);
    });
  }, [params]);

  const fetchCentre = async (id) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_END_POINT}/centres/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (data.success) {
        setFormData(data.centre);
      } else {
        setError(data.message || "Failed to fetch centre");
      }
    } catch (err) {
      setError("Failed to fetch centre");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleImageUpload = async (file) => {
    if (!file) {
      setFormData({ ...formData, doctorImage: null });
      return;
    }

    try {
      const formDataUpload = new FormData();
      formDataUpload.append("file", file);

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_END_POINT}/upload`, {
        method: "POST",
        body: formDataUpload,
      });

      const result = await response.json();

      if (result.success) {
        setFormData({ ...formData, doctorImage: result.fileUrl });
        toast.success("Image uploaded successfully!");
      } else {
        toast.error("Failed to upload image");
      }
    } catch (error) {
      console.error("Image upload error:", error);
      toast.error("Failed to upload image");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_END_POINT}/centres/${centreId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (data.success) {
        toast.success("Centre updated successfully!");
        router.push("/centres");
      } else {
        toast.error(data.message || "Failed to update centre");
        setError(data.message);
      }
    } catch (err) {
      toast.error("Failed to update centre");
      setError("Failed to update centre");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <LoadingSpinner message="" />;
  }

  return (
    <div className="flex h-screen flex-col">
      {/* Fixed Header */}
      <div className="sticky top-0 z-10 flex-shrink-0 border-b border-gray-200 bg-white px-4 py-4 shadow-sm">
        <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.push("/centres")}
              className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-200 text-gray-500 hover:bg-gray-50 hover:text-purple-600"
            >
              <MdArrowBack className="h-4 w-4" />
            </button>
            <h1 className="text-xl font-bold text-gray-900 sm:text-2xl">
              Edit Centre
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
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Hospital Information */}
            <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-md">
              <div className="border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4">
                <div className="flex items-center gap-3">
                  <MdBusiness className="h-6 w-6 text-blue-600" />
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900">
                      Hospital/Clinic Information
                    </h2>
                    <p className="mt-1 text-sm text-gray-600">
                      Update the hospital or clinic details
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-6">
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                  <InputGroup
                    type="text"
                    label="Hospital Name"
                    placeholder="Enter hospital name"
                    name="hospitalName"
                    value={formData.hospitalName}
                    handleChange={handleChange}
                    required
                  />

                  <InputGroup
                    type="tel"
                    label="Phone Number"
                    placeholder="Enter phone number"
                    name="phoneNumber"
                    value={formData.phoneNumber}
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
                    required
                  />

                  <InputGroup
                    type="text"
                    label="Hospital License Number"
                    placeholder="Enter license number"
                    name="hospitalLicenseNumber"
                    value={formData.hospitalLicenseNumber}
                    handleChange={handleChange}
                    required
                  />

                  <div className="lg:col-span-2">
                    <InputGroup
                      type="text"
                      label="Address"
                      placeholder="Enter full address"
                      name="address"
                      value={formData.address}
                      handleChange={handleChange}
                      required
                    />
                  </div>

                  <InputGroup
                    type="text"
                    label="City"
                    placeholder="Enter city"
                    name="city"
                    value={formData.city}
                    handleChange={handleChange}
                    required
                  />

                  <InputGroup
                    type="text"
                    label="State"
                    placeholder="Enter state"
                    name="state"
                    value={formData.state}
                    handleChange={handleChange}
                    required
                  />

                  <InputGroup
                    type="text"
                    label="Pin Code"
                    placeholder="Enter pin code"
                    name="pincode"
                    value={formData.pincode}
                    handleChange={handleChange}
                    required
                  />
                </div>
              </div>
            </div>

            {/* Doctor Information */}
            <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-md">
              <div className="border-b border-gray-200 bg-gradient-to-r from-green-50 to-emerald-50 px-6 py-4">
                <div className="flex items-center gap-3">
                  <MdPerson className="h-6 w-6 text-green-600" />
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900">
                      Doctor Information
                    </h2>
                    <p className="mt-1 text-sm text-gray-600">
                      Update the primary doctor details
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-6">
                <div className="mb-6">
                  <ImageUpload
                    label="Doctor Photo"
                    onImageChange={handleImageUpload}
                    currentImage={formData.doctorImage}
                  />
                </div>

                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                  <InputGroup
                    type="text"
                    label="Doctor Name"
                    placeholder="Enter doctor name"
                    name="doctorName"
                    value={formData.doctorName}
                    handleChange={handleChange}
                    required
                  />

                  <InputGroup
                    type="tel"
                    label="Doctor Phone Number"
                    placeholder="Enter doctor phone"
                    name="doctorPhoneNumber"
                    value={formData.doctorPhoneNumber}
                    handleChange={handleChange}
                    required
                  />

                  <InputGroup
                    type="email"
                    label="Doctor Email"
                    placeholder="Enter doctor email"
                    name="doctorEmail"
                    value={formData.doctorEmail}
                    handleChange={handleChange}
                    required
                  />

                  <InputGroup
                    type="text"
                    label="Medical License Number"
                    placeholder="Enter medical license"
                    name="medicalLicenseNumber"
                    value={formData.medicalLicenseNumber}
                    handleChange={handleChange}
                    required
                  />
                </div>
              </div>
            </div>

            {/* Form Footer */}
            <div className="flex justify-end gap-3 rounded-2xl border border-gray-200 bg-white px-6 py-4 shadow-md">
              <button
                type="button"
                onClick={() => router.push("/centres")}
                className="rounded-lg border border-gray-300 bg-white px-6 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-blue-400"
              >
                {saving && (
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
                {saving ? "Updating..." : "Update Centre"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}