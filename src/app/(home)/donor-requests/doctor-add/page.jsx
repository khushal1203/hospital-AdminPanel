"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "@/utils/toast";
import { MdArrowBack, MdDateRange, MdPerson } from "react-icons/md";
import InputGroup from "@/components/FormElements/InputGroup";
import SelectField from "@/components/FormElements/SelectField";
import BackButton from "@/components/ui/BackButton";

export default function DoctorAddDonorRequest() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    requiredByDate: "",
    gender: "",
    ageRange: { min: "", max: "" },     
    maritalStatus: "",
    cast: "",
    bloodGroup: "",
    nationality: "",
    heightRange: { min: "", max: "" },
    weightRange: { min: "", max: "" },
    skinColour: "",
    hairColour: "",
    eyeColour: "",
    donorEducation: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("token");
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      
      const requestData = {
        ...formData,
        createdBy: user._id || user.id,
        hospitalId: user.centreId || user.hospitalId || user.centre,
        doctorId: user._id || user.id,
        doctorName: user.fullName,
        hospitalName: user.centreName || user.hospitalName
      };
      
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_END_POINT}/donor-requests/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(requestData),
      });

      const data = await res.json();

      if (data.success) {
        toast.success("Donor request created successfully!");
        router.push("/donors/requests");
      } else {
        setError(data.message || "Failed to create request");
      }
    } catch (error) {
      setError("Failed to create request");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      setFormData(prev => ({
        ...prev,
        [parent]: { ...prev[parent], [child]: value }
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSelectChange = (selectedOption, name) => {
    setFormData(prev => ({
      ...prev,
      [name]: selectedOption ? selectedOption.value : ""
    }));
  };

  return (
    <div className="flex h-screen flex-col">
      {/* Fixed Header */}
      <div className="sticky top-0 z-50 flex-shrink-0 border-b border-gray-200 bg-white px-4 py-4 shadow-sm">
        <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
          <div className="flex items-center gap-3">
            <BackButton />
            <h1 className="text-xl font-bold text-gray-900 sm:text-2xl">
              Add Donor Request
            </h1>
          </div>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-hidden bg-gray-50">
        <div className="h-full overflow-auto p-4">
          <div className="mx-auto max-w-4xl">
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

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Requirements */}
              <div className="rounded-2xl border border-gray-200 bg-white shadow-md">
                <div className="border-b border-gray-200 bg-gradient-to-r from-purple-50 to-violet-50 px-6 py-4">
                  <div className="flex items-center gap-3">
                    <MdDateRange className="h-6 w-6 text-purple-600" />
                    <div>
                      <h2 className="text-lg font-semibold text-gray-900">
                        Basic Requirements
                      </h2>
                      <p className="mt-1 text-sm text-gray-600">
                        Essential donor requirements and timeline
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-6">
                  <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                    <InputGroup
                      type="date"
                      label="Required By Date"
                      name="requiredByDate"
                      value={formData.requiredByDate}
                      handleChange={handleChange}
                      required
                    />

                    <div className="relative z-30">
                      <SelectField
                        label="Gender"
                        options={[
                          { value: "male", label: "Male" },
                          { value: "female", label: "Female" }
                        ]}
                        value={formData.gender ? { value: formData.gender, label: formData.gender === "male" ? "Male" : "Female" } : null}
                        onChange={(selectedOption) => handleSelectChange(selectedOption, 'gender')}
                        placeholder="Select Gender"
                        required
                      />
                    </div>

                    <div className="relative z-20">
                      <SelectField
                        label="Marital Status"
                        options={[
                          { value: "single", label: "Single" },
                          { value: "married", label: "Married" },
                          { value: "divorced", label: "Divorced" },
                          { value: "widowed", label: "Widowed" }
                        ]}
                        value={formData.maritalStatus ? { value: formData.maritalStatus, label: formData.maritalStatus.charAt(0).toUpperCase() + formData.maritalStatus.slice(1) } : null}
                        onChange={(selectedOption) => handleSelectChange(selectedOption, 'maritalStatus')}
                        placeholder="Select Status"
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Donor Profile Preferences */}
              <div className="rounded-2xl border border-gray-200 bg-white shadow-md">
                <div className="border-b border-gray-200 bg-gradient-to-r from-green-50 to-emerald-50 px-6 py-4">
                  <div className="flex items-center gap-3">
                    <MdPerson className="h-6 w-6 text-green-600" />
                    <div>
                      <h2 className="text-lg font-semibold text-gray-900">
                        Donor Profile Preferences
                      </h2>
                      <p className="mt-1 text-sm text-gray-600">
                        Detailed preferences for donor characteristics
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-6">
                  <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                    <InputGroup
                      type="text"
                      label="Cast"
                      placeholder="Enter cast"
                      name="cast"
                      value={formData.cast}
                      handleChange={handleChange}
                      required
                    />

                    <div className="relative z-10">
                      <SelectField
                        label="Blood Group"
                        options={[
                          { value: "A+", label: "A+" },
                          { value: "A-", label: "A-" },
                          { value: "B+", label: "B+" },
                          { value: "B-", label: "B-" },
                          { value: "AB+", label: "AB+" },
                          { value: "AB-", label: "AB-" },
                          { value: "O+", label: "O+" },
                          { value: "O-", label: "O-" }
                        ]}
                        value={formData.bloodGroup ? { value: formData.bloodGroup, label: formData.bloodGroup } : null}
                        onChange={(selectedOption) => handleSelectChange(selectedOption, 'bloodGroup')}
                        placeholder="Select Blood Group"
                        required
                      />
                    </div>

                    <InputGroup
                      type="text"
                      label="Nationality"
                      placeholder="Enter nationality"
                      name="nationality"
                      value={formData.nationality}
                      handleChange={handleChange}
                      required
                    />

                    <InputGroup
                      type="text"
                      label="Skin Colour"
                      placeholder="Enter skin colour"
                      name="skinColour"
                      value={formData.skinColour}
                      handleChange={handleChange}
                      required
                    />

                    <InputGroup
                      type="text"
                      label="Hair Colour"
                      placeholder="Enter hair colour"
                      name="hairColour"
                      value={formData.hairColour}
                      handleChange={handleChange}
                      required
                    />

                    <InputGroup
                      type="text"
                      label="Eye Colour"
                      placeholder="Enter eye colour"
                      name="eyeColour"
                      value={formData.eyeColour}
                      handleChange={handleChange}
                      required
                    />

                    <InputGroup
                      type="text"
                      label="Donor Education"
                      placeholder="Enter education level"
                      name="donorEducation"
                      value={formData.donorEducation}
                      handleChange={handleChange}
                      required
                    />
                  </div>

                  {/* Range Fields */}
                  <div className="mt-6">
                    <h3 className="text-md font-medium text-gray-900 mb-4">Physical Requirements</h3>
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Age Range (years)
                        </label>
                        <div className="flex gap-2">
                          <input
                            type="number"
                            name="ageRange.min"
                            placeholder="Min"
                            value={formData.ageRange.min}
                            onChange={handleChange}
                            required
                            className="block w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                          />
                          <input
                            type="number"
                            name="ageRange.max"
                            placeholder="Max"
                            value={formData.ageRange.max}
                            onChange={handleChange}
                            required
                            className="block w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Height Range (cm)
                        </label>
                        <div className="flex gap-2">
                          <input
                            type="number"
                            name="heightRange.min"
                            placeholder="Min"
                            value={formData.heightRange.min}
                            onChange={handleChange}
                            required
                            className="block w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                          />
                          <input
                            type="number"
                            name="heightRange.max"
                            placeholder="Max"
                            value={formData.heightRange.max}
                            onChange={handleChange}
                            required
                            className="block w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Weight Range (kg)
                        </label>
                        <div className="flex gap-2">
                          <input
                            type="number"
                            name="weightRange.min"
                            placeholder="Min"
                            value={formData.weightRange.min}
                            onChange={handleChange}
                            required
                            className="block w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                          />
                          <input
                            type="number"
                            name="weightRange.max"
                            placeholder="Max"
                            value={formData.weightRange.max}
                            onChange={handleChange}
                            required
                            className="block w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Form Footer */}
              <div className="flex justify-end gap-3 rounded-2xl border border-gray-200 bg-white px-6 py-4 shadow-md">
                <button
                  type="button"
                  onClick={() => router.back()}
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
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                  )}
                  {loading ? "Creating..." : "Create Request"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}