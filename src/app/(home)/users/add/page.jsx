"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import InputGroup from "@/components/FormElements/InputGroup";
import SelectField from "@/components/FormElements/SelectField";
import ImageUpload from "@/components/FormElements/ImageUpload";
import {
  MdArrowBack,
  MdPerson,
  MdWork,
  MdSchool,
  MdDescription,
  MdSecurity,
} from "react-icons/md";
import { toast } from "@/utils/toast";
import UserTimeline from "@/components/Users/UserTimeline";

export default function AddUserPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [documents, setDocuments] = useState([]);

  const [formData, setFormData] = useState({
    // Basic Information
    profileImage: null,
    fullName: "",
    aadharCardNumber: "",
    phoneNumber: "",
    email: "",
    gender: "",
    maritalStatus: "",
    dateOfBirth: "",

    // Address Information
    address: "",
    city: "",
    state: "",
    pincode: "",

    // Professional Information
    role: "receptionist",
    department: "",
    employeeId: "",
    experience: "",

    // Educational Information
    qualification: "",
    fieldOfStudy: "",
    instituteName: "",
    passingYear: "",

    // User Credentials
    userEmail: "",
    userStatus: "active",
    password: "",
    confirmPassword: "",
    isActive: true,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === "checkbox" ? checked : value;

    setFormData({
      ...formData,
      [name]: newValue,
    });

    // Auto-fill email in User Credentials when email is entered in Basic Information
    if (name === "email") {
      setFormData((prev) => ({
        ...prev,
        email: newValue,
        userEmail: newValue, // Auto-fill user credentials email
      }));
    }
  };

  const handleImageUpload = async (file) => {
    if (!file) {
      setFormData({ ...formData, profileImage: null });
      return;
    }

    try {
      const formDataUpload = new FormData();
      formDataUpload.append("file", file);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_END_POINT}/upload`,
        {
          method: "POST",
          body: formDataUpload,
        },
      );

      const result = await response.json();

      if (result.success) {
        setFormData({ ...formData, profileImage: result.fileUrl });
        toast.success("Image uploaded successfully!");
      } else {
        toast.error("Failed to upload image");
      }
    } catch (error) {
      console.error("Image upload error:", error);
      toast.error("Failed to upload image");
    }
  };

  const handleDocumentUpload = async (file, documentName) => {
    if (!file) return;

    try {
      const formDataUpload = new FormData();
      formDataUpload.append("file", file);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_END_POINT}/upload`,
        {
          method: "POST",
          body: formDataUpload,
        },
      );

      const result = await response.json();

      if (result.success) {
        const newDocument = {
          documentName,
          documentUrl: result.fileUrl,
        };
        setDocuments([...documents, newDocument]);
        toast.success(`${documentName} uploaded successfully!`);
      } else {
        toast.error("Failed to upload document");
      }
    } catch (error) {
      console.error("Document upload error:", error);
      toast.error("Failed to upload document");
    }
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
      const submitData = {
        ...formData,
        documents,
      };
      delete submitData.confirmPassword;

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_END_POINT}/users/create`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(submitData),
        },
      );

      const data = await res.json();

      if (data.success) {
        toast.success("User created successfully!");
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
      <div className="sticky top-0 z-[999999] flex-shrink-0 border-b border-gray-200 bg-white px-4 py-4 shadow-sm">
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
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
            <div className="lg:col-span-9">
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
                {/* Basic Information */}
                <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-md">
                  <div className="border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4">
                    <div className="flex items-center gap-3">
                      <MdPerson className="h-6 w-6 text-blue-600" />
                      <div>
                        <h2 className="text-lg font-semibold text-gray-900">
                          Basic Information
                        </h2>
                        <p className="mt-1 text-sm text-gray-600">
                          Personal details and contact information
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="p-6">
                    <div className="mb-6">
                      <ImageUpload
                        label="Profile Picture"
                        onImageChange={handleImageUpload}
                      />
                    </div>

                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
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
                        type="text"
                        label="Aadhar Card Number"
                        placeholder="Enter aadhar card number"
                        name="aadharCardNumber"
                        value={formData.aadharCardNumber}
                        handleChange={handleChange}
                      />

                      <InputGroup
                        type="tel"
                        label="Phone Number"
                        placeholder="Enter phone number"
                        name="phoneNumber"
                        value={formData.phoneNumber}
                        handleChange={handleChange}
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

                      <div className="relative">
                        <SelectField
                          label="Gender"
                          options={[
                            { value: "male", label: "Male" },
                            { value: "female", label: "Female" },
                            { value: "other", label: "Other" },
                          ]}
                          value={
                            formData.gender
                              ? {
                                  value: formData.gender,
                                  label:
                                    formData.gender.charAt(0).toUpperCase() +
                                    formData.gender.slice(1),
                                }
                              : null
                          }
                          onChange={(selectedOption) =>
                            handleChange({
                              target: {
                                name: "gender",
                                value: selectedOption
                                  ? selectedOption.value
                                  : "",
                              },
                            })
                          }
                          placeholder="Select gender"
                          menuPortalTarget={
                            typeof document !== "undefined"
                              ? document.body
                              : null
                          }
                        />
                      </div>

                      <div className="relative">
                        <SelectField
                          label="Marital Status"
                          options={[
                            { value: "single", label: "Single" },
                            { value: "married", label: "Married" },
                            { value: "divorced", label: "Divorced" },
                            { value: "widowed", label: "Widowed" },
                          ]}
                          value={
                            formData.maritalStatus
                              ? {
                                  value: formData.maritalStatus,
                                  label:
                                    formData.maritalStatus
                                      .charAt(0)
                                      .toUpperCase() +
                                    formData.maritalStatus.slice(1),
                                }
                              : null
                          }
                          onChange={(selectedOption) =>
                            handleChange({
                              target: {
                                name: "maritalStatus",
                                value: selectedOption
                                  ? selectedOption.value
                                  : "",
                              },
                            })
                          }
                          placeholder="Select marital status"
                          menuPortalTarget={
                            typeof document !== "undefined"
                              ? document.body
                              : null
                          }
                        />
                      </div>

                      <InputGroup
                        type="date"
                        label="Date of Birth"
                        name="dateOfBirth"
                        value={formData.dateOfBirth}
                        handleChange={handleChange}
                      />
                    </div>
                  </div>
                </div>

                {/* Address Information */}
                <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-md">
                  <div className="border-b border-gray-200 bg-gradient-to-r from-green-50 to-emerald-50 px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div>
                        <h2 className="text-lg font-semibold text-gray-900">
                          Address Information
                        </h2>
                        <p className="mt-1 text-sm text-gray-600">
                          Current residential address details
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="p-6">
                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                      <div className="lg:col-span-2">
                        <InputGroup
                          type="text"
                          label="Address"
                          placeholder="Enter full address"
                          name="address"
                          value={formData.address}
                          handleChange={handleChange}
                        />
                      </div>

                      <InputGroup
                        type="text"
                        label="City"
                        placeholder="Enter city"
                        name="city"
                        value={formData.city}
                        handleChange={handleChange}
                      />

                      <InputGroup
                        type="text"
                        label="State"
                        placeholder="Enter state"
                        name="state"
                        value={formData.state}
                        handleChange={handleChange}
                      />

                      <InputGroup
                        type="text"
                        label="Pin Code"
                        placeholder="Enter pin code"
                        name="pincode"
                        value={formData.pincode}
                        handleChange={handleChange}
                      />
                    </div>
                  </div>
                </div>

                {/* Professional Information */}
                <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-md">
                  <div className="border-b border-gray-200 bg-gradient-to-r from-purple-50 to-violet-50 px-6 py-4">
                    <div className="flex items-center gap-3">
                      <MdWork className="h-6 w-6 text-purple-600" />
                      <div>
                        <h2 className="text-lg font-semibold text-gray-900">
                          Professional Information
                        </h2>
                        <p className="mt-1 text-sm text-gray-600">
                          Work-related details and role information
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="p-6">
                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                      <div className="relative">
                        <SelectField
                          label="Role"
                          options={[
                            { value: "admin", label: "Admin" },
                            { value: "doctor", label: "Doctor" },
                            { value: "receptionist", label: "Receptionist" },
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
                          onChange={(selectedOption) =>
                            handleChange({
                              target: {
                                name: "role",
                                value: selectedOption
                                  ? selectedOption.value
                                  : "",
                              },
                            })
                          }
                          placeholder="Select role"
                          menuPortalTarget={
                            typeof document !== "undefined"
                              ? document.body
                              : null
                          }
                        />
                      </div>

                      <InputGroup
                        type="text"
                        label="Department"
                        placeholder="Enter department"
                        name="department"
                        value={formData.department}
                        handleChange={handleChange}
                      />

                      <InputGroup
                        type="text"
                        label="Employee ID"
                        placeholder="Enter employee ID"
                        name="employeeId"
                        value={formData.employeeId}
                        handleChange={handleChange}
                      />

                      <InputGroup
                        type="text"
                        label="Experience"
                        placeholder="Enter years of experience"
                        name="experience"
                        value={formData.experience}
                        handleChange={handleChange}
                      />
                    </div>
                  </div>
                </div>

                {/* Educational Information */}
                <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-md">
                  <div className="border-b border-gray-200 bg-gradient-to-r from-orange-50 to-amber-50 px-6 py-4">
                    <div className="flex items-center gap-3">
                      <MdSchool className="h-6 w-6 text-orange-600" />
                      <div>
                        <h2 className="text-lg font-semibold text-gray-900">
                          Educational Information
                        </h2>
                        <p className="mt-1 text-sm text-gray-600">
                          Academic qualifications and educational background
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="p-6">
                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                      <InputGroup
                        type="text"
                        label="Qualification"
                        placeholder="Enter highest qualification"
                        name="qualification"
                        value={formData.qualification}
                        handleChange={handleChange}
                      />

                      <InputGroup
                        type="text"
                        label="Field of Study"
                        placeholder="Enter field of study"
                        name="fieldOfStudy"
                        value={formData.fieldOfStudy}
                        handleChange={handleChange}
                      />

                      <InputGroup
                        type="text"
                        label="Institute Name"
                        placeholder="Enter institute name"
                        name="instituteName"
                        value={formData.instituteName}
                        handleChange={handleChange}
                      />

                      <InputGroup
                        type="text"
                        label="Passing Year"
                        placeholder="Enter passing year"
                        name="passingYear"
                        value={formData.passingYear}
                        handleChange={handleChange}
                      />
                    </div>
                  </div>
                </div>

                {/* Documents */}
                <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-md">
                  <div className="border-b border-gray-200 bg-gradient-to-r from-teal-50 to-cyan-50 px-6 py-4">
                    <div className="flex items-center gap-3">
                      <MdDescription className="h-6 w-6 text-teal-600" />
                      <div>
                        <h2 className="text-lg font-semibold text-gray-900">
                          Documents
                        </h2>
                        <p className="mt-1 text-sm text-gray-600">
                          Upload relevant documents and certificates
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="p-6">
                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                      {[
                        "Resume/CV",
                        "ID Proof",
                        "Address Proof",
                        "Educational Certificate",
                      ].map((docType) => (
                        <div key={docType}>
                          <label className="mb-2 block text-sm font-medium text-gray-700">
                            {docType}
                          </label>
                          <input
                            type="file"
                            accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                            onChange={(e) =>
                              handleDocumentUpload(e.target.files[0], docType)
                            }
                            className="block w-full text-sm text-gray-500 file:mr-4 file:rounded-lg file:border-0 file:bg-blue-50 file:px-4 file:py-2 file:text-sm file:font-medium file:text-blue-700 hover:file:bg-blue-100"
                          />
                        </div>
                      ))}
                    </div>

                    {documents.length > 0 && (
                      <div className="mt-6">
                        <h4 className="mb-3 text-sm font-medium text-gray-700">
                          Uploaded Documents:
                        </h4>
                        <div className="space-y-2">
                          {documents.map((doc, index) => (
                            <div
                              key={index}
                              className="flex items-center justify-between rounded-lg bg-gray-50 p-3"
                            >
                              <span className="text-sm text-gray-700">
                                {doc.documentName}
                              </span>
                              <span className="text-xs text-green-600">
                                Uploaded
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* User Credentials */}
                <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-md">
                  <div className="border-b border-gray-200 bg-gradient-to-r from-red-50 to-pink-50 px-6 py-4">
                    <div className="flex items-center gap-3">
                      <MdSecurity className="h-6 w-6 text-red-600" />
                      <div>
                        <h2 className="text-lg font-semibold text-gray-900">
                          User Credentials
                        </h2>
                        <p className="mt-1 text-sm text-gray-600">
                          Login credentials and account settings
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="p-6">
                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                      <InputGroup
                        type="email"
                        label="User Email"
                        placeholder="Enter user email"
                        name="userEmail"
                        value={formData.userEmail}
                        handleChange={handleChange}
                        required
                      />

                      <div className="relative">
                        <SelectField
                          label="Status"
                          options={[
                            { value: "active", label: "Active" },
                            { value: "inactive", label: "Inactive" },
                          ]}
                          value={
                            formData.userStatus
                              ? {
                                  value: formData.userStatus,
                                  label:
                                    formData.userStatus
                                      .charAt(0)
                                      .toUpperCase() +
                                    formData.userStatus.slice(1),
                                }
                              : null
                          }
                          onChange={(selectedOption) =>
                            handleChange({
                              target: {
                                name: "userStatus",
                                value: selectedOption
                                  ? selectedOption.value
                                  : "",
                              },
                            })
                          }
                          placeholder="Select status"
                          menuPortalTarget={
                            typeof document !== "undefined"
                              ? document.body
                              : null
                          }
                        />
                      </div>

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
                    </div>
                  </div>
                </div>

                {/* Form Footer */}
                <div className="flex justify-end gap-3 rounded-2xl border border-gray-200 bg-white px-6 py-4 shadow-md">
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
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                    )}
                    {loading ? "Creating..." : "Create User"}
                  </button>
                </div>
              </form>
            </div>
            <div className="hidden lg:col-span-3 lg:block">
              <UserTimeline user={formData} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
