"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { MdArrowBack, MdBusiness, MdPerson, MdLocationOn, MdEmail, MdPhone, MdSecurity, MdEdit } from "react-icons/md";
import { toast } from "@/utils/toast";
import dayjs from "dayjs";
import CentreTimeline from "@/components/Centres/CentreTimeline";

export default function CentreDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const [centre, setCentre] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showEditModal, setShowEditModal] = useState(null);
  const [editData, setEditData] = useState({});

  useEffect(() => {
    if (params.id) {
      fetchCentre();
    }
  }, [params.id]);

  const fetchCentre = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_END_POINT}/centres/${params.id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (data.success) {
        setCentre(data.centre);
        setUser(data.user);
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError("Failed to fetch centre details");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (section) => {
    if (section === 'hospital') {
      setEditData({
        hospitalName: centre?.hospitalName || '',
        phoneNumber: centre?.phoneNumber || '',
        email: centre?.email || '',
        hospitalLicenseNumber: centre?.hospitalLicenseNumber || '',
        address: centre?.address || '',
        city: centre?.city || '',
        state: centre?.state || '',
        pincode: centre?.pincode || ''
      });
    } else if (section === 'doctor') {
      setEditData({
        doctorName: centre?.doctorName || '',
        doctorPhoneNumber: centre?.doctorPhoneNumber || '',
        doctorEmail: centre?.doctorEmail || '',
        medicalLicenseNumber: centre?.medicalLicenseNumber || '',
        doctorImage: centre?.doctorImage || null
      });
    } else if (section === 'user') {
      setEditData({
        email: user?.email || '',
        role: user?.role || 'doctor',
        isActive: user?.isActive || true
      });
    }
    setShowEditModal(section);
  };

  const handleImageUpload = async (file) => {
    if (!file) {
      setEditData({ ...editData, doctorImage: null });
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
        setEditData({ ...editData, doctorImage: result.fileUrl });
        toast.success("Image uploaded successfully!");
      } else {
        toast.error("Failed to upload image");
      }
    } catch (error) {
      console.error("Image upload error:", error);
      toast.error("Failed to upload image");
    }
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem("token");
      
      if (showEditModal === 'user') {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_END_POINT}/users/update-profile`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ userId: user._id, ...editData }),
        });
        const data = await res.json();
        if (data.success) {
          setUser({ ...user, ...editData });
          toast.success("User updated successfully!");
        } else {
          toast.error(data.message || "Failed to update user");
        }
      } else {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_END_POINT}/centres/${params.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(editData),
        });
        const data = await res.json();
        if (data.success) {
          setCentre({ ...centre, ...editData });
          toast.success("Centre updated successfully!");
        } else {
          toast.error(data.message || "Failed to update centre");
        }
      }
      setShowEditModal(null);
    } catch (err) {
      toast.error("Failed to update");
    }
  };

  if (loading) {
    return <LoadingSpinner message="" />;
  }

  if (error) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <p className="text-red-600">{error}</p>
          <button
            onClick={() => router.push("/centres")}
            className="mt-4 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
          >
            Back to Centres
          </button>
        </div>
      </div>
    );
  }

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
              Centre Details
            </h1>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-hidden bg-gray-50">
        <div className="h-full overflow-auto p-4">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
            <div className="lg:col-span-9">
              <div className="space-y-6">
            <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-md">
              <div className="border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <MdBusiness className="h-6 w-6 text-blue-600" />
                    <div>
                      <h2 className="text-lg font-semibold text-gray-900">
                        Hospital/Clinic Information
                      </h2>
                      <p className="mt-1 text-sm text-gray-600">
                        Hospital details and contact information
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleEdit('hospital')}
                    className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-50"
                    style={{ backgroundColor: '#ECE9F1' }}
                  >
                    <MdEdit className="h-4 w-4" />
                    Edit
                  </button>
                </div>
              </div>

              <div className="p-6">
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Hospital Name
                    </label>
                    <p className="text-gray-900">{centre?.hospitalName || "-"}</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone Number
                    </label>
                    <div className="flex items-center gap-2">
                      <MdPhone className="h-4 w-4 text-gray-400" />
                      <p className="text-gray-900">{centre?.phoneNumber || "-"}</p>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email Address
                    </label>
                    <div className="flex items-center gap-2">
                      <MdEmail className="h-4 w-4 text-gray-400" />
                      <p className="text-gray-900">{centre?.email || "-"}</p>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Hospital License Number
                    </label>
                    <p className="text-gray-900">{centre?.hospitalLicenseNumber || "-"}</p>
                  </div>

                  <div className="lg:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Address
                    </label>
                    <div className="flex items-start gap-2">
                      <MdLocationOn className="h-4 w-4 text-gray-400 mt-0.5" />
                      <div>
                        <p className="text-gray-900">{centre?.address || "-"}</p>
                        <p className="text-sm text-gray-600">
                          {centre?.city}, {centre?.state} - {centre?.pincode}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

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
                        Primary doctor details
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleEdit('doctor')}
                    className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-50"
                    style={{ backgroundColor: '#ECE9F1' }}
                  >
                    <MdEdit className="h-4 w-4" />
                    Edit
                  </button>
                </div>
              </div>

              <div className="p-6">
                <div className="mb-6 flex items-center gap-4">
                  <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-full bg-gray-200">
                    {centre?.doctorImage ? (
                      <img
                        src={centre.doctorImage}
                        alt={centre.doctorName}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-green-100 text-lg font-bold text-green-600">
                        <MdPerson className="h-8 w-8" />
                      </div>
                    )}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {centre?.doctorName || "-"}
                    </h3>
                    <p className="text-sm text-gray-600">Primary Doctor</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Doctor Phone Number
                    </label>
                    <div className="flex items-center gap-2">
                      <MdPhone className="h-4 w-4 text-gray-400" />
                      <p className="text-gray-900">{centre?.doctorPhoneNumber || "-"}</p>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Doctor Email
                    </label>
                    <div className="flex items-center gap-2">
                      <MdEmail className="h-4 w-4 text-gray-400" />
                      <p className="text-gray-900">{centre?.doctorEmail || "-"}</p>
                    </div>
                  </div>

                  <div className="lg:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Medical License Number
                    </label>
                    <p className="text-gray-900">{centre?.medicalLicenseNumber || "-"}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* User Credentials */}
            {user && (
              <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-md">
                <div className="border-b border-gray-200 bg-gradient-to-r from-purple-50 to-violet-50 px-6 py-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <MdSecurity className="h-6 w-6 text-purple-600" />
                      <div>
                        <h2 className="text-lg font-semibold text-gray-900">
                          User Credentials
                        </h2>
                        <p className="mt-1 text-sm text-gray-600">
                          Login credentials and access details
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleEdit('user')}
                      className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-50"
                      style={{ backgroundColor: '#ECE9F1' }}
                    >
                      <MdEdit className="h-4 w-4" />
                      Edit
                    </button>
                  </div>
                </div>

                <div className="p-6">
                  <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        User Email
                      </label>
                      <div className="flex items-center gap-2">
                        <MdEmail className="h-4 w-4 text-gray-400" />
                        <p className="text-gray-900">{user.email || "-"}</p>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Password
                      </label>
                      <p className="text-gray-900">••••••••</p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Role
                      </label>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        user.role === 'admin' ? 'bg-red-100 text-red-800' :
                        user.role === 'doctor' ? 'bg-blue-100 text-blue-800' :
                        user.role === 'receptionist' ? 'bg-green-100 text-green-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {user.role?.charAt(0).toUpperCase() + user.role?.slice(1) || "-"}
                      </span>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Status
                      </label>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        user.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {user.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-md">
              <div className="border-b border-gray-200 bg-gradient-to-r from-gray-50 to-slate-50 px-6 py-4">
                <div className="flex items-center gap-3">
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900">
                      Additional Information
                    </h2>
                    <p className="mt-1 text-sm text-gray-600">
                      Registration and system details
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-6">
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Registration Date
                    </label>
                    <p className="text-gray-900">
                      {centre?.createdAt ? dayjs(centre.createdAt).format("DD MMM YYYY, hh:mm A") : "-"}
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Last Updated
                    </label>
                    <p className="text-gray-900">
                      {centre?.updatedAt ? dayjs(centre.updatedAt).format("DD MMM YYYY, hh:mm A") : "-"}
                    </p>
                  </div>
                </div>
              </div>
                </div>
              </div>
            </div>
            <div className="hidden lg:col-span-3 lg:block">
              <CentreTimeline centre={centre} />
            </div>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      {showEditModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl bg-white shadow-2xl">
            {/* Modal Header */}
            <div className="border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4">
              <h3 className="text-xl font-semibold text-gray-900">
                Edit {showEditModal === 'hospital' ? 'Hospital/Clinic' : showEditModal === 'doctor' ? 'Doctor' : 'User Credentials'} Information
              </h3>
              <p className="mt-1 text-sm text-gray-600">
                Update the {showEditModal === 'hospital' ? 'hospital' : showEditModal === 'doctor' ? 'doctor' : 'user'} details below
              </p>
            </div>
            
            {/* Modal Body */}
            <div className="p-6">
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                {showEditModal === 'hospital' && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Hospital Name</label>
                      <input
                        type="text"
                        value={editData.hospitalName || ''}
                        onChange={(e) => setEditData({...editData, hospitalName: e.target.value})}
                        className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                        placeholder="Enter hospital name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                      <input
                        type="tel"
                        value={editData.phoneNumber || ''}
                        onChange={(e) => setEditData({...editData, phoneNumber: e.target.value})}
                        className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                        placeholder="Enter phone number"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                      <input
                        type="email"
                        value={editData.email || ''}
                        onChange={(e) => setEditData({...editData, email: e.target.value})}
                        className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                        placeholder="Enter email address"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Hospital License Number</label>
                      <input
                        type="text"
                        value={editData.hospitalLicenseNumber || ''}
                        onChange={(e) => setEditData({...editData, hospitalLicenseNumber: e.target.value})}
                        className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                        placeholder="Enter license number"
                      />
                    </div>
                    <div className="lg:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                      <input
                        type="text"
                        value={editData.address || ''}
                        onChange={(e) => setEditData({...editData, address: e.target.value})}
                        className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                        placeholder="Enter full address"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                      <input
                        type="text"
                        value={editData.city || ''}
                        onChange={(e) => setEditData({...editData, city: e.target.value})}
                        className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                        placeholder="Enter city"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">State</label>
                      <input
                        type="text"
                        value={editData.state || ''}
                        onChange={(e) => setEditData({...editData, state: e.target.value})}
                        className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                        placeholder="Enter state"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Pin Code</label>
                      <input
                        type="text"
                        value={editData.pincode || ''}
                        onChange={(e) => setEditData({...editData, pincode: e.target.value})}
                        className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                        placeholder="Enter pin code"
                      />
                    </div>
                  </>
                )}
                
                {showEditModal === 'doctor' && (
                  <>
                    <div className="lg:col-span-2 mb-6">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Doctor Photo</label>
                      <div className="flex items-center gap-4">
                        <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-full bg-gray-200">
                          {editData.doctorImage ? (
                            <img
                              src={editData.doctorImage}
                              alt="Doctor"
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center bg-green-100 text-lg font-bold text-green-600">
                              <MdPerson className="h-8 w-8" />
                            </div>
                          )}
                        </div>
                        <div>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleImageUpload(e.target.files[0])}
                            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                          />
                          <p className="mt-1 text-xs text-gray-500">PNG, JPG up to 10MB</p>
                        </div>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Doctor Name</label>
                      <input
                        type="text"
                        value={editData.doctorName || ''}
                        onChange={(e) => setEditData({...editData, doctorName: e.target.value})}
                        className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                        placeholder="Enter doctor name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Doctor Phone Number</label>
                      <input
                        type="tel"
                        value={editData.doctorPhoneNumber || ''}
                        onChange={(e) => setEditData({...editData, doctorPhoneNumber: e.target.value})}
                        className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                        placeholder="Enter doctor phone"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Doctor Email</label>
                      <input
                        type="email"
                        value={editData.doctorEmail || ''}
                        onChange={(e) => setEditData({...editData, doctorEmail: e.target.value})}
                        className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                        placeholder="Enter doctor email"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Medical License Number</label>
                      <input
                        type="text"
                        value={editData.medicalLicenseNumber || ''}
                        onChange={(e) => setEditData({...editData, medicalLicenseNumber: e.target.value})}
                        className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                        placeholder="Enter medical license"
                      />
                    </div>
                  </>
                )}
                
                {showEditModal === 'user' && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">User Email</label>
                      <input
                        type="email"
                        value={editData.email || ''}
                        onChange={(e) => setEditData({...editData, email: e.target.value})}
                        className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                        placeholder="Enter user email"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
                      <select
                        value={editData.role || 'doctor'}
                        onChange={(e) => setEditData({...editData, role: e.target.value})}
                        className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                      >
                        <option value="doctor">Doctor</option>
                        <option value="receptionist">Receptionist</option>
                        <option value="laboratory">Laboratory</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                      <select
                        value={editData.isActive ? 'active' : 'inactive'}
                        onChange={(e) => setEditData({...editData, isActive: e.target.value === 'active'})}
                        className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                      >
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                      </select>
                    </div>
                  </>
                )}
              </div>
            </div>
            
            {/* Modal Footer */}
            <div className="border-t border-gray-200 bg-gray-50 px-6 py-4">
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setShowEditModal(null)}
                  className="rounded-lg border border-gray-300 bg-white px-6 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}