"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import InputGroup from "@/components/FormElements/InputGroup";
import { MdArrowBack, MdBusiness, MdPerson, MdSecurity, MdAdd, MdDelete } from "react-icons/md";
import SelectField from "@/components/FormElements/SelectField";
import ImageUpload from "@/components/FormElements/ImageUpload";
import { toast } from "@/utils/toast";
import CentreTimeline from "@/components/Centres/CentreTimeline";

export default function AddCentrePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    // Hospital Details
    hospitalName: "",
    phoneNumber: "",
    email: "",
    hospitalLicenseNumber: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
  });

  const [doctors, setDoctors] = useState([
    {
      doctorImage: null,
      doctorName: "",
      doctorPhoneNumber: "",
      doctorEmail: "",
      medicalLicenseNumber: "",
      userEmail: "",
      userRole: "doctor",
      userPassword: "",
      userStatus: "active",
    }
  ]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleDoctorChange = (index, field, value) => {
    const updatedDoctors = [...doctors];
    updatedDoctors[index][field] = value;
    setDoctors(updatedDoctors);
  };

  const handleImageUpload = async (file, doctorIndex) => {
    if (!file) {
      handleDoctorChange(doctorIndex, 'doctorImage', null);
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
        handleDoctorChange(doctorIndex, 'doctorImage', result.fileUrl);
        toast.success("Image uploaded successfully!");
      } else {
        toast.error("Failed to upload image");
      }
    } catch (error) {
      console.error("Image upload error:", error);
      toast.error("Failed to upload image");
    }
  };

  const addDoctor = () => {
    setDoctors([...doctors, {
      doctorImage: null,
      doctorName: "",
      doctorPhoneNumber: "",
      doctorEmail: "",
      medicalLicenseNumber: "",
      userEmail: "",
      userRole: "doctor",
      userPassword: "",
      userStatus: "active",
    }]);
  };

  const removeDoctor = (index) => {
    if (doctors.length > 1) {
      const updatedDoctors = doctors.filter((_, i) => i !== index);
      setDoctors(updatedDoctors);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Basic validation
    const invalidDoctor = doctors.find(doctor => 
      !doctor.doctorName || 
      !doctor.doctorPhoneNumber || 
      !doctor.doctorEmail || 
      !doctor.medicalLicenseNumber || 
      !doctor.userEmail || 
      !doctor.userPassword
    );
    if (invalidDoctor) {
      toast.error("All doctor fields are required");
      setError("All doctor fields are required");
      setLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const payload = {
        ...formData,
        doctors: doctors
      };
      
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_END_POINT}/centres/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (data.success) {
        toast.success("Centre and doctors created successfully!");
        router.push("/centres");
      } else {
        toast.error(data.message || "Failed to add centre");
        setError(data.message);
      }
    } catch (err) {
      toast.error("Failed to add centre");
      setError("Failed to add centre");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen flex-col">
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
              Add New Centre
            </h1>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-hidden bg-gray-50">
        <div className="h-full overflow-auto p-4">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
            <div className="lg:col-span-9">
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
                      Enter the hospital or clinic details
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
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <MdPerson className="h-6 w-6 text-green-600" />
                    <div>
                      <h2 className="text-lg font-semibold text-gray-900">
                        Doctor Information
                      </h2>
                      <p className="mt-1 text-sm text-gray-600">
                        Add doctors for this centre
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={addDoctor}
                    className="flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700"
                  >
                    <MdAdd className="h-4 w-4" />
                    Add More
                  </button>
                </div>
              </div>

              <div className="p-6 space-y-8">
                {doctors.map((doctor, index) => (
                  <div key={index} className="border border-gray-200 rounded-xl p-6 relative">
                    {doctors.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeDoctor(index)}
                        className="absolute top-4 right-4 text-red-500 hover:text-red-700"
                      >
                        <MdDelete className="h-5 w-5" />
                      </button>
                    )}
                    
                    <h3 className="text-md font-semibold text-gray-800 mb-4">
                      Doctor {index + 1}
                    </h3>
                    
                    <div className="mb-6">
                      <ImageUpload
                        label="Doctor Photo"
                        onImageChange={(file) => handleImageUpload(file, index)}
                      />
                    </div>

                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                      <InputGroup
                        type="text"
                        label="Doctor Name"
                        placeholder="Enter doctor name"
                        name="doctorName"
                        value={doctor.doctorName}
                        handleChange={(e) => handleDoctorChange(index, 'doctorName', e.target.value)}
                        required
                      />

                      <InputGroup
                        type="tel"
                        label="Doctor Phone Number"
                        placeholder="Enter doctor phone"
                        name="doctorPhoneNumber"
                        value={doctor.doctorPhoneNumber}
                        handleChange={(e) => handleDoctorChange(index, 'doctorPhoneNumber', e.target.value)}
                        required
                      />

                      <InputGroup
                        type="email"
                        label="Doctor Email"
                        placeholder="Enter doctor email"
                        name="doctorEmail"
                        value={doctor.doctorEmail}
                        handleChange={(e) => handleDoctorChange(index, 'doctorEmail', e.target.value)}
                        required
                      />

                      <InputGroup
                        type="text"
                        label="Medical License Number"
                        placeholder="Enter medical license"
                        name="medicalLicenseNumber"
                        value={doctor.medicalLicenseNumber}
                        handleChange={(e) => handleDoctorChange(index, 'medicalLicenseNumber', e.target.value)}
                        required
                      />

                      <InputGroup
                        type="email"
                        label="User Email"
                        placeholder="Enter user email"
                        name="userEmail"
                        value={doctor.userEmail}
                        handleChange={(e) => handleDoctorChange(index, 'userEmail', e.target.value)}
                        required
                      />

                      <InputGroup
                        type="password"
                        label="Password"
                        placeholder="Enter password"
                        name="userPassword"
                        value={doctor.userPassword}
                        handleChange={(e) => handleDoctorChange(index, 'userPassword', e.target.value)}
                        required
                      />

                      <div className="relative z-30">
                        <SelectField
                          label="Role"
                          options={[
                            { value: "doctor", label: "Doctor" },
                            { value: "receptionist", label: "Receptionist" },
                            { value: "laboratory", label: "Laboratory" }
                          ]}
                          value={{ value: doctor.userRole, label: doctor.userRole.charAt(0).toUpperCase() + doctor.userRole.slice(1) } || null}
                          onChange={(selectedOption) => handleDoctorChange(index, 'userRole', selectedOption ? selectedOption.value : 'doctor')}
                          placeholder="Select Role"
                          required
                          instanceId={`role-${index}`}
                          menuPortalTarget={typeof document !== 'undefined' ? document.body : null}
                          styles={{
                            menuPortal: (base) => ({ ...base, zIndex: 9999 })
                          }}
                        />
                      </div>

                      <div className="relative z-20">
                        <SelectField
                          label="Status"
                          options={[
                            { value: "active", label: "Active" },
                            { value: "inactive", label: "Inactive" }
                          ]}
                          value={{ value: doctor.userStatus, label: doctor.userStatus.charAt(0).toUpperCase() + doctor.userStatus.slice(1) } || null}
                          onChange={(selectedOption) => handleDoctorChange(index, 'userStatus', selectedOption ? selectedOption.value : 'active')}
                          placeholder="Select Status"
                          required
                          instanceId={`status-${index}`}
                          menuPortalTarget={typeof document !== 'undefined' ? document.body : null}
                          styles={{
                            menuPortal: (base) => ({ ...base, zIndex: 9999 })
                          }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
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
                disabled={loading}
                className="flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-blue-400"
              >
                {loading && (
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                )}
                {loading ? "Adding..." : "Add Centre"}
              </button>
            </div>
            </form>
            </div>
            <div className="hidden lg:col-span-3 lg:block">
              <CentreTimeline centre={formData} doctors={doctors} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}