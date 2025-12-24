"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { MdArrowBack, MdPerson, MdEmail, MdPhone, MdLocationOn, MdCalendarToday, MdSecurity, MdEdit, MdWork, MdSchool, MdDescription, MdDownload, MdDelete } from "react-icons/md";
import { toast } from "@/utils/toast";
import dayjs from "dayjs";
import UserTimeline from "@/components/Users/UserTimeline";

export default function UserDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showEditModal, setShowEditModal] = useState(null);
  const [editData, setEditData] = useState({});

  useEffect(() => {
    if (params.id) {
      fetchUser();
    }
  }, [params.id]);

  const fetchUser = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_END_POINT}/users/getUser/${params.id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (data.success) {
        setUser(data.user);
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError("Failed to fetch user details");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (section) => {
    if (section === 'profile') {
      setEditData({
        fullName: user?.fullName || '',
        email: user?.email || '',
        phoneNumber: user?.phoneNumber || '',
        address: user?.address || '',
        city: user?.city || '',
        state: user?.state || '',
        pincode: user?.pincode || '',
        gender: user?.gender || '',
        maritalStatus: user?.maritalStatus || '',
        dateOfBirth: user?.dateOfBirth ? dayjs(user.dateOfBirth).format('YYYY-MM-DD') : '',
        aadharCardNumber: user?.aadharCardNumber || '',
        profileImage: user?.profileImage || null
      });
    } else if (section === 'professional') {
      setEditData({
        department: user?.department || '',
        employeeId: user?.employeeId || '',
        experience: user?.experience || ''
      });
    } else if (section === 'educational') {
      setEditData({
        qualification: user?.qualification || '',
        fieldOfStudy: user?.fieldOfStudy || '',
        instituteName: user?.instituteName || '',
        passingYear: user?.passingYear || ''
      });
    } else if (section === 'documents') {
      setEditData({
        documents: user?.documents || []
      });
    } else if (section === 'credentials') {
      setEditData({
        role: user?.role || 'receptionist',
        isActive: user?.isActive || true
      });
    }
    setShowEditModal(section);
  };

  const handleDocumentUpload = async (file, documentName) => {
    if (!file) return;

    try {
      const formDataUpload = new FormData();
      formDataUpload.append("file", file);

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_END_POINT}/upload`, {
        method: "POST",
        body: formDataUpload,
      });

      const result = await response.json();

      if (result.success) {
        const newDocument = {
          documentName,
          documentUrl: result.fileUrl,
          uploadedAt: new Date()
        };
        const updatedDocuments = [...(editData.documents || []), newDocument];
        setEditData({ ...editData, documents: updatedDocuments });
        toast.success(`${documentName} uploaded successfully!`);
      } else {
        toast.error("Failed to upload document");
      }
    } catch (error) {
      console.error("Document upload error:", error);
      toast.error("Failed to upload document");
    }
  };

  const handleImageUpload = async (file) => {
    if (!file) {
      setEditData({ ...editData, profileImage: null });
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
        setEditData({ ...editData, profileImage: result.fileUrl });
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
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_END_POINT}/users/update-profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ id: user._id, ...editData }),
      });
      
      const data = await res.json();
      if (data.success) {
        setUser({ ...user, ...editData });
        toast.success("User updated successfully!");
      } else {
        toast.error(data.message || "Failed to update user");
      }
      setShowEditModal(null);
    } catch (err) {
      toast.error("Failed to update user");
    }
  };

  const getRoleBadgeColor = (role) => {
    const colors = {
      admin: "bg-purple-100 text-purple-700",
      receptionist: "bg-blue-100 text-blue-700",
      doctor: "bg-green-100 text-green-700",
      laboratory: "bg-orange-100 text-orange-700",
    };
    return colors[role] || "bg-gray-100 text-gray-700";
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
            onClick={() => router.push("/users")}
            className="mt-4 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
          >
            Back to Users
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
              onClick={() => router.push("/users")}
              className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-200 text-gray-500 hover:bg-gray-50 hover:text-purple-600"
            >
              <MdArrowBack className="h-4 w-4" />
            </button>
            <h1 className="text-xl font-bold text-gray-900 sm:text-2xl">
              User Details
            </h1>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-hidden bg-gray-50">
        <div className="h-full overflow-auto p-4">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
            <div className="lg:col-span-9">
              <div className="space-y-6">
            {/* Profile Information */}
            <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-md">
              <div className="border-b border-gray-200 bg-gradient-to-r from-purple-50 to-violet-50 px-6 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <MdPerson className="h-6 w-6 text-purple-600" />
                    <div>
                      <h2 className="text-lg font-semibold text-gray-900">
                        Profile Information
                      </h2>
                      <p className="mt-1 text-sm text-gray-600">
                        Personal details and contact information
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleEdit('profile')}
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
                  <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-full bg-gray-200">
                    {user?.profileImage ? (
                      <img
                        src={user.profileImage}
                        alt={user.fullName}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-purple-100 text-2xl font-bold text-purple-600">
                        {user?.fullName?.charAt(0)}
                      </div>
                    )}
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">
                      {user?.fullName || "-"}
                    </h3>
                    <div className="mt-2 flex items-center gap-3">
                      <span
                        className={`rounded-full px-3 py-1 text-sm font-medium ${getRoleBadgeColor(user?.role)}`}
                      >
                        {user?.role}
                      </span>
                      <div className="flex items-center gap-1">
                        <div className={`h-2 w-2 rounded-full ${user?.isActive ? 'bg-green-400' : 'bg-red-400'}`}></div>
                        <span className="text-sm text-gray-600">{user?.isActive ? 'Active' : 'Inactive'}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email Address
                    </label>
                    <div className="flex items-center gap-2">
                      <MdEmail className="h-4 w-4 text-gray-400" />
                      <p className="text-gray-900">{user?.email || "-"}</p>
                    </div>
                  </div>

                  {user?.phoneNumber && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Phone Number
                      </label>
                      <div className="flex items-center gap-2">
                        <MdPhone className="h-4 w-4 text-gray-400" />
                        <p className="text-gray-900">{user.phoneNumber}</p>
                      </div>
                    </div>
                  )}

                  {user?.gender && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Gender
                      </label>
                      <p className="text-gray-900 capitalize">{user.gender}</p>
                    </div>
                  )}

                  {user?.dateOfBirth && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Date of Birth
                      </label>
                      <p className="text-gray-900">{dayjs(user.dateOfBirth).format("DD MMM YYYY")}</p>
                    </div>
                  )}

                  {user?.aadharCardNumber && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Aadhar Card Number
                      </label>
                      <p className="text-gray-900">{user.aadharCardNumber}</p>
                    </div>
                  )}

                  {user?.maritalStatus && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Marital Status
                      </label>
                      <p className="text-gray-900 capitalize">{user.maritalStatus}</p>
                    </div>
                  )}

                  {user?.address && (
                    <div className="lg:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Address
                      </label>
                      <div className="flex items-start gap-2">
                        <MdLocationOn className="h-4 w-4 text-gray-400 mt-0.5" />
                        <div>
                          <p className="text-gray-900">{user.address}</p>
                          {(user.city || user.state || user.pincode) && (
                            <p className="text-sm text-gray-600">
                              {[user.city, user.state, user.pincode].filter(Boolean).join(', ')}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Professional Information */}
            <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-md">
              <div className="border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <MdWork className="h-6 w-6 text-blue-600" />
                    <div>
                      <h2 className="text-lg font-semibold text-gray-900">
                        Professional Information
                      </h2>
                      <p className="mt-1 text-sm text-gray-600">
                        Work experience and professional details
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleEdit('professional')}
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
                      Department
                    </label>
                    <p className="text-gray-900">{user?.department || "-"}</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Employee ID
                    </label>
                    <p className="text-gray-900">{user?.employeeId || "-"}</p>
                  </div>

                  <div className="lg:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Experience
                    </label>
                    <p className="text-gray-900">{user?.experience || "-"}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Educational Information */}
            <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-md">
              <div className="border-b border-gray-200 bg-gradient-to-r from-green-50 to-emerald-50 px-6 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <MdSchool className="h-6 w-6 text-green-600" />
                    <div>
                      <h2 className="text-lg font-semibold text-gray-900">
                        Educational Information
                      </h2>
                      <p className="mt-1 text-sm text-gray-600">
                        Academic qualifications and education details
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleEdit('educational')}
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
                      Qualification
                    </label>
                    <p className="text-gray-900">{user?.qualification || "-"}</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Field of Study
                    </label>
                    <p className="text-gray-900">{user?.fieldOfStudy || "-"}</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Institute Name
                    </label>
                    <p className="text-gray-900">{user?.instituteName || "-"}</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Passing Year
                    </label>
                    <p className="text-gray-900">{user?.passingYear || "-"}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Documents */}
            <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-md">
              <div className="border-b border-gray-200 bg-gradient-to-r from-orange-50 to-amber-50 px-6 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <MdDescription className="h-6 w-6 text-orange-600" />
                    <div>
                      <h2 className="text-lg font-semibold text-gray-900">
                        Documents
                      </h2>
                      <p className="mt-1 text-sm text-gray-600">
                        Uploaded documents and certificates
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleEdit('documents')}
                    className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-50"
                    style={{ backgroundColor: '#ECE9F1' }}
                  >
                    <MdEdit className="h-4 w-4" />
                    Edit
                  </button>
                </div>
              </div>

              <div className="p-6">
                {user?.documents && user.documents.length > 0 ? (
                  <div className="space-y-4">
                    {user.documents.map((doc, index) => (
                      <div key={index} className="flex items-center justify-between rounded-lg border border-gray-200 p-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-100">
                            <MdDescription className="h-5 w-5 text-orange-600" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{doc.documentName}</p>
                            <p className="text-sm text-gray-500">
                              Uploaded: {dayjs(doc.uploadedAt).format("DD MMM YYYY")}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => window.open(doc.documentUrl, '_blank')}
                            className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-200 text-gray-500 hover:bg-gray-50 hover:text-blue-600"
                            title="Download"
                          >
                            <MdDownload className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <MdDescription className="mx-auto h-12 w-12 text-gray-400" />
                    <p className="mt-2 text-gray-500">No documents uploaded</p>
                  </div>
                )}
              </div>
            </div>
            <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-md">
              <div className="border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <MdSecurity className="h-6 w-6 text-blue-600" />
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
                    onClick={() => handleEdit('credentials')}
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
                      <p className="text-gray-900">{user?.email || "-"}</p>
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
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleBadgeColor(user?.role)}`}>
                      {user?.role?.charAt(0).toUpperCase() + user?.role?.slice(1) || "-"}
                    </span>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Status
                    </label>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      user?.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {user?.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Additional Information */}
            <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-md">
              <div className="border-b border-gray-200 bg-gradient-to-r from-gray-50 to-slate-50 px-6 py-4">
                <div className="flex items-center gap-3">
                  <MdCalendarToday className="h-6 w-6 text-gray-600" />
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
                      {user?.createdAt ? dayjs(user.createdAt).format("DD MMM YYYY, hh:mm A") : "-"}
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Last Updated
                    </label>
                    <p className="text-gray-900">
                      {user?.updatedAt ? dayjs(user.updatedAt).format("DD MMM YYYY, hh:mm A") : "-"}
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      User ID
                    </label>
                    <p className="text-gray-900 font-mono text-sm">{user?._id || "-"}</p>
                  </div>
                </div>
              </div>
                </div>
              </div>
            </div>
            <div className="hidden lg:col-span-3 lg:block">
              <UserTimeline user={user} />
            </div>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      {showEditModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl bg-white shadow-2xl">
            <div className="border-b border-gray-200 bg-gradient-to-r from-purple-50 to-violet-50 px-6 py-4">
              <h3 className="text-xl font-semibold text-gray-900">
                Edit {showEditModal === 'profile' ? 'Profile' : 
                      showEditModal === 'professional' ? 'Professional' :
                      showEditModal === 'educational' ? 'Educational' : 'Credentials'} Information
              </h3>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                {showEditModal === 'profile' && (
                  <>
                    <div className="lg:col-span-2 mb-6">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Profile Photo</label>
                      <div className="flex items-center gap-4">
                        <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-full bg-gray-200">
                          {editData.profileImage ? (
                            <img
                              src={editData.profileImage}
                              alt="Profile"
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center bg-purple-100 text-lg font-bold text-purple-600">
                              <MdPerson className="h-8 w-8" />
                            </div>
                          )}
                        </div>
                        <div>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleImageUpload(e.target.files[0])}
                            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100"
                          />
                        </div>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                      <input
                        type="text"
                        value={editData.fullName || ''}
                        onChange={(e) => setEditData({...editData, fullName: e.target.value})}
                        className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                      <input
                        type="email"
                        value={editData.email || ''}
                        onChange={(e) => setEditData({...editData, email: e.target.value})}
                        className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                      <input
                        type="tel"
                        value={editData.phoneNumber || ''}
                        onChange={(e) => setEditData({...editData, phoneNumber: e.target.value})}
                        className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
                      <select
                        value={editData.gender || ''}
                        onChange={(e) => setEditData({...editData, gender: e.target.value})}
                        className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                      >
                        <option value="">Select Gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Date of Birth</label>
                      <input
                        type="date"
                        value={editData.dateOfBirth || ''}
                        onChange={(e) => setEditData({...editData, dateOfBirth: e.target.value})}
                        className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Marital Status</label>
                      <select
                        value={editData.maritalStatus || ''}
                        onChange={(e) => setEditData({...editData, maritalStatus: e.target.value})}
                        className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                      >
                        <option value="">Select Status</option>
                        <option value="single">Single</option>
                        <option value="married">Married</option>
                        <option value="divorced">Divorced</option>
                        <option value="widowed">Widowed</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Aadhar Card Number</label>
                      <input
                        type="text"
                        value={editData.aadharCardNumber || ''}
                        onChange={(e) => setEditData({...editData, aadharCardNumber: e.target.value})}
                        className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                      />
                    </div>
                    <div className="lg:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                      <input
                        type="text"
                        value={editData.address || ''}
                        onChange={(e) => setEditData({...editData, address: e.target.value})}
                        className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                      <input
                        type="text"
                        value={editData.city || ''}
                        onChange={(e) => setEditData({...editData, city: e.target.value})}
                        className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">State</label>
                      <input
                        type="text"
                        value={editData.state || ''}
                        onChange={(e) => setEditData({...editData, state: e.target.value})}
                        className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Pincode</label>
                      <input
                        type="text"
                        value={editData.pincode || ''}
                        onChange={(e) => setEditData({...editData, pincode: e.target.value})}
                        className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                      />
                    </div>
                  </>
                )}
                
                {showEditModal === 'professional' && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Department</label>
                      <input
                        type="text"
                        value={editData.department || ''}
                        onChange={(e) => setEditData({...editData, department: e.target.value})}
                        className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Employee ID</label>
                      <input
                        type="text"
                        value={editData.employeeId || ''}
                        onChange={(e) => setEditData({...editData, employeeId: e.target.value})}
                        className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                      />
                    </div>
                    <div className="lg:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Experience</label>
                      <textarea
                        value={editData.experience || ''}
                        onChange={(e) => setEditData({...editData, experience: e.target.value})}
                        rows={3}
                        className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                      />
                    </div>
                  </>
                )}
                
                {showEditModal === 'educational' && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Qualification</label>
                      <input
                        type="text"
                        value={editData.qualification || ''}
                        onChange={(e) => setEditData({...editData, qualification: e.target.value})}
                        className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Field of Study</label>
                      <input
                        type="text"
                        value={editData.fieldOfStudy || ''}
                        onChange={(e) => setEditData({...editData, fieldOfStudy: e.target.value})}
                        className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Institute Name</label>
                      <input
                        type="text"
                        value={editData.instituteName || ''}
                        onChange={(e) => setEditData({...editData, instituteName: e.target.value})}
                        className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Passing Year</label>
                      <input
                        type="text"
                        value={editData.passingYear || ''}
                        onChange={(e) => setEditData({...editData, passingYear: e.target.value})}
                        className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                      />
                    </div>
                  </>
                )}
                
                {showEditModal === 'documents' && (
                  <>
                    <div className="lg:col-span-2">
                      <h4 className="text-sm font-medium text-gray-700 mb-4">Upload Documents</h4>
                      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                        {["Resume/CV", "ID Proof", "Address Proof", "Educational Certificate"].map((docType) => (
                          <div key={docType}>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              {docType}
                            </label>
                            <input
                              type="file"
                              accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                              onChange={(e) => handleDocumentUpload(e.target.files[0], docType)}
                              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100"
                            />
                          </div>
                        ))}
                      </div>
                      
                      {editData.documents && editData.documents.length > 0 && (
                        <div className="mt-6">
                          <h5 className="text-sm font-medium text-gray-700 mb-3">Uploaded Documents:</h5>
                          <div className="space-y-2">
                            {editData.documents.map((doc, index) => (
                              <div key={index} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                                <span className="text-sm text-gray-700">{doc.documentName}</span>
                                <span className="text-xs text-green-600">Uploaded</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </>
                )}
                
                {showEditModal === 'credentials' && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
                      <select
                        value={editData.role || 'receptionist'}
                        onChange={(e) => setEditData({...editData, role: e.target.value})}
                        className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                      >
                        <option value="admin">Admin</option>
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
                        className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                      >
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                      </select>
                    </div>
                  </>
                )}
              </div>
            </div>
            
            <div className="border-t border-gray-200 bg-gray-50 px-6 py-4">
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setShowEditModal(null)}
                  className="rounded-lg border border-gray-300 bg-white px-6 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="rounded-lg px-6 py-2.5 text-sm font-medium text-white hover:opacity-90"
                  style={{ backgroundColor: '#402575' }}
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