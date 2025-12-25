"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import {
  MdArrowBack,
  MdLocalHospital,
  MdPerson,
  MdEdit,
  MdBloodtype,
  MdHeight,
  MdMonitorWeight,
  MdColorLens,
  MdSchool,
  MdCalendarToday,
} from "react-icons/md";
import { toast } from "@/utils/toast";
import dayjs from "dayjs";
import DonorRequestTimeline from "@/components/DonorRequests/DonorRequestTimeline";

export default function DonorRequestDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const [donorRequest, setDonorRequest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showEditModal, setShowEditModal] = useState(null);
  const [editData, setEditData] = useState({});

  useEffect(() => {
    if (params.id) {
      fetchDonorRequest();
    }
  }, [params.id]);

  const fetchDonorRequest = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_END_POINT}/donor-requests/${params.id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const data = await res.json();

      if (data.success) {
        setDonorRequest(data.donorRequest);
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError("Failed to fetch donor request details");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (section) => {
    if (section === "hospital") {
      setEditData({
        hospitalId: donorRequest?.hospitalId?._id || "",
        doctorId: donorRequest?.doctorId?._id || "",
      });
    } else if (section === "requirements") {
      setEditData({
        requiredByDate: donorRequest?.requiredByDate
          ? dayjs(donorRequest.requiredByDate).format("YYYY-MM-DD")
          : "",
        gender: donorRequest?.gender || "",
        ageRange: donorRequest?.ageRange || { min: "", max: "" },
        maritalStatus: donorRequest?.maritalStatus || "",
        bloodGroup: donorRequest?.bloodGroup || "",
      });
    } else if (section === "physical") {
      setEditData({
        heightRange: donorRequest?.heightRange || { min: "", max: "" },
        weightRange: donorRequest?.weightRange || { min: "", max: "" },
        skinColour: donorRequest?.skinColour || "",
        hairColour: donorRequest?.hairColour || "",
        eyeColour: donorRequest?.eyeColour || "",
      });
    } else if (section === "background") {
      setEditData({
        cast: donorRequest?.cast || "",
        nationality: donorRequest?.nationality || "",
        donorEducation: donorRequest?.donorEducation || "",
      });
    }
    setShowEditModal(section);
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_END_POINT}/donor-requests/${donorRequest._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(editData),
        },
      );

      const data = await res.json();
      if (data.success) {
        setDonorRequest({ ...donorRequest, ...editData });
        toast.success("Donor request updated successfully!");
      } else {
        toast.error(data.message || "Failed to update donor request");
      }
      setShowEditModal(null);
    } catch (err) {
      toast.error("Failed to update donor request");
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
            onClick={() => router.push("/donors/requests")}
            className="mt-4 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
          >
            Back to Donor Requests
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
              onClick={() => router.push("/donors/requests")}
              className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-200 text-gray-500 hover:bg-gray-50 hover:text-purple-600"
            >
              <MdArrowBack className="h-4 w-4" />
            </button>
            <h1 className="text-xl font-bold text-gray-900 sm:text-2xl">
              Donor Request Details
            </h1>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-hidden bg-gray-50">
        <div className="h-full overflow-auto p-4">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
            <div className="lg:col-span-9">
              <div className="space-y-6">
                {/* Request Information */}
                <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-md">
                  <div className="border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4">
                    <div className="flex items-center justify-between w-full">
                      <div className="flex items-center gap-3">
                        <MdLocalHospital className="h-6 w-6 text-blue-600" />
                        <h2 className="text-lg font-semibold text-gray-900">
                          Request sent by
                        </h2>
                      </div>
                      <span
                        className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-medium ${
                          donorRequest?.status === "pending"
                            ? "bg-yellow-100 text-yellow-800"
                            : donorRequest?.status === "approved" || donorRequest?.isAlloted
                              ? "bg-green-100 text-green-800"
                              : donorRequest?.status === "rejected" || donorRequest?.status === "declined"
                                ? "bg-red-100 text-red-800"
                                : donorRequest?.status === "fulfilled"
                                  ? "bg-blue-100 text-blue-800"
                                  : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {donorRequest?.isAlloted ? "allotted" : donorRequest?.status || "pending"}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 mt-3 ml-9">
                      <span className="text-base font-medium text-gray-900">
                        {donorRequest?.hospitalId?.hospitalName || "-"}
                      </span>
                      <span className="text-sm text-gray-600">
                        Request Date: {donorRequest?.createdAt
                          ? dayjs(donorRequest.createdAt).format("DD MMM YYYY")
                          : "-"}
                      </span>
                    </div>
                  </div>

                  <div className="p-6">
                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                      <div>
                        <label className="mb-1 block text-sm font-medium text-gray-700">
                          Hospital Name
                        </label>
                        <p className="text-gray-900 font-semibold">
                          {donorRequest?.hospitalId?.hospitalName || "-"}
                        </p>
                      </div>

                      <div>
                        <label className="mb-1 block text-sm font-medium text-gray-700">
                          Hospital Phone
                        </label>
                        <p className="text-gray-900">
                          {donorRequest?.hospitalId?.phoneNumber || "-"}
                        </p>
                      </div>

                      <div>
                        <label className="mb-1 block text-sm font-medium text-gray-700">
                          License Number
                        </label>
                        <p className="text-gray-900">
                          {donorRequest?.hospitalId?.hospitalLicenseNumber || "-"}
                        </p>
                      </div>

                      <div>
                        <label className="mb-1 block text-sm font-medium text-gray-700">
                          Email Address
                        </label>
                        <p className="text-gray-900">
                          {donorRequest?.hospitalId?.email || "-"}
                        </p>
                      </div>

                      <div>
                        <label className="mb-1 block text-sm font-medium text-gray-700">
                          State
                        </label>
                        <p className="text-gray-900">
                          {donorRequest?.hospitalId?.state || "-"}
                        </p>
                      </div>

                      <div>
                        <label className="mb-1 block text-sm font-medium text-gray-700">
                          Pincode
                        </label>
                        <p className="text-gray-900">
                          {donorRequest?.hospitalId?.pincode || "-"}
                        </p>
                      </div>
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
                          Requesting doctor details
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="p-6">
                    <div className="flex items-center gap-6">
                      <div className="flex-shrink-0">
                        <img
                          src={donorRequest?.doctorId?.doctorImage || donorRequest?.doctorId?.profileImage || "/images/user/user-03.png"}
                          alt="Doctor"
                          className="h-20 w-20 rounded-full object-cover border-2 border-gray-200"
                        />
                      </div>
                      <div className="flex-1 grid grid-cols-1 gap-4 lg:grid-cols-2">
                        <div>
                          <label className="mb-1 block text-sm font-medium text-gray-700">
                            Doctor Name
                          </label>
                          <p className="text-gray-900 font-semibold">
                            {donorRequest?.doctorId?.fullName || "-"}
                          </p>
                        </div>
                        <div>
                          <label className="mb-1 block text-sm font-medium text-gray-700">
                            Phone Number
                          </label>
                          <p className="text-gray-900">
                            {donorRequest?.doctorId?.phoneNumber || "-"}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Donor Preferences */}
                <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-md">
                  <div className="border-b border-gray-200 bg-gradient-to-r from-purple-50 to-violet-50 px-6 py-4">
                    <div className="flex items-center gap-3">
                      <MdPerson className="h-6 w-6 text-purple-600" />
                      <div>
                        <h2 className="text-lg font-semibold text-gray-900">
                          Donor Preferences
                        </h2>
                        <p className="mt-1 text-sm text-gray-600">
                          Doctor's requested donor requirements
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="p-6">
                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                      <div>
                        <label className="mb-1 block text-sm font-medium text-gray-700">
                          Required By Date
                        </label>
                        <div className="flex items-center gap-2">
                          <MdCalendarToday className="h-4 w-4 text-gray-400" />
                          <p className="text-gray-900">
                            {donorRequest?.requiredByDate
                              ? dayjs(donorRequest.requiredByDate).format(
                                  "DD MMM YYYY",
                                )
                              : "-"}
                          </p>
                        </div>
                      </div>

                      <div>
                        <label className="mb-1 block text-sm font-medium text-gray-700">
                          Gender
                        </label>
                        <p className="capitalize text-gray-900">
                          {donorRequest?.gender || "-"}
                        </p>
                      </div>

                      <div>
                        <label className="mb-1 block text-sm font-medium text-gray-700">
                          Age Range
                        </label>
                        <p className="text-gray-900">
                          {donorRequest?.ageRange?.min &&
                          donorRequest?.ageRange?.max
                            ? `${donorRequest.ageRange.min} - ${donorRequest.ageRange.max} years`
                            : "-"}
                        </p>
                      </div>

                      <div>
                        <label className="mb-1 block text-sm font-medium text-gray-700">
                          Marital Status
                        </label>
                        <p className="capitalize text-gray-900">
                          {donorRequest?.maritalStatus || "-"}
                        </p>
                      </div>

                      <div>
                        <label className="mb-1 block text-sm font-medium text-gray-700">
                          Blood Group
                        </label>
                        <div className="flex items-center gap-2">
                          <MdBloodtype className="h-4 w-4 text-red-500" />
                          <p className="font-semibold text-gray-900">
                            {donorRequest?.bloodGroup || "-"}
                          </p>
                        </div>
                      </div>

                      <div>
                        <label className="mb-1 block text-sm font-medium text-gray-700">
                          Cast
                        </label>
                        <p className="text-gray-900">
                          {donorRequest?.cast || "-"}
                        </p>
                      </div>

                      <div>
                        <label className="mb-1 block text-sm font-medium text-gray-700">
                          Nationality
                        </label>
                        <p className="text-gray-900">
                          {donorRequest?.nationality || "-"}
                        </p>
                      </div>

                      <div>
                        <label className="mb-1 block text-sm font-medium text-gray-700">
                          Height Range
                        </label>
                        <div className="flex items-center gap-2">
                          <MdHeight className="h-4 w-4 text-gray-400" />
                          <p className="text-gray-900">
                            {donorRequest?.heightRange?.min &&
                            donorRequest?.heightRange?.max
                              ? `${donorRequest.heightRange.min} - ${donorRequest.heightRange.max} cm`
                              : "-"}
                          </p>
                        </div>
                      </div>

                      <div>
                        <label className="mb-1 block text-sm font-medium text-gray-700">
                          Weight Range
                        </label>
                        <div className="flex items-center gap-2">
                          <MdMonitorWeight className="h-4 w-4 text-gray-400" />
                          <p className="text-gray-900">
                            {donorRequest?.weightRange?.min &&
                            donorRequest?.weightRange?.max
                              ? `${donorRequest.weightRange.min} - ${donorRequest.weightRange.max} kg`
                              : "-"}
                          </p>
                        </div>
                      </div>

                      <div>
                        <label className="mb-1 block text-sm font-medium text-gray-700">
                          Skin Colour
                        </label>
                        <div className="flex items-center gap-2">
                          <MdColorLens className="h-4 w-4 text-gray-400" />
                          <p className="capitalize text-gray-900">
                            {donorRequest?.skinColour || "-"}
                          </p>
                        </div>
                      </div>

                      <div>
                        <label className="mb-1 block text-sm font-medium text-gray-700">
                          Hair Colour
                        </label>
                        <p className="capitalize text-gray-900">
                          {donorRequest?.hairColour || "-"}
                        </p>
                      </div>

                      <div>
                        <label className="mb-1 block text-sm font-medium text-gray-700">
                          Eye Colour
                        </label>
                        <p className="capitalize text-gray-900">
                          {donorRequest?.eyeColour || "-"}
                        </p>
                      </div>

                      <div>
                        <label className="mb-1 block text-sm font-medium text-gray-700">
                          Education Requirement
                        </label>
                        <div className="flex items-center gap-2">
                          <MdSchool className="h-4 w-4 text-gray-400" />
                          <p className="text-gray-900">
                            {donorRequest?.donorEducation || "-"}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Additional Information */}

                {/* Allotted Donor Information - Show only if donor is allotted */}
                {donorRequest?.isAlloted && donorRequest?.allottedTo && (
                  <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-md">
                    <div className="border-b border-gray-200 bg-gradient-to-r from-emerald-50 to-teal-50 px-6 py-4">
                      <div className="flex items-center gap-3">
                        <MdPerson className="h-6 w-6 text-emerald-600" />
                        <div>
                          <h2 className="text-lg font-semibold text-gray-900">
                            Allotted Donor
                          </h2>
                          <p className="mt-1 text-sm text-gray-600">
                            Donor assigned to this request
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="p-6">
                      <div className="flex items-center gap-6">
                        <div className="flex-shrink-0">
                          <img
                            src={donorRequest?.allottedTo?.donorImage || "/images/user/user-03.png"}
                            alt="Donor"
                            className="h-24 w-24 rounded-full object-cover border-2 border-emerald-200"
                          />
                        </div>
                        <div className="flex-1 grid grid-cols-1 gap-4 lg:grid-cols-3">
                          <div>
                            <label className="mb-1 block text-sm font-medium text-gray-700">
                              Donor Name
                            </label>
                            <p className="text-gray-900 font-semibold">
                              {donorRequest?.allottedTo?.fullName || "-"}
                            </p>
                          </div>
                          <div>
                            <label className="mb-1 block text-sm font-medium text-gray-700">
                              Age
                            </label>
                            <p className="text-gray-900">
                              {donorRequest?.allottedTo?.age || "-"} years
                            </p>
                          </div>
                          <div>
                            <label className="mb-1 block text-sm font-medium text-gray-700">
                              Gender
                            </label>
                            <p className="text-gray-900 capitalize">
                              {donorRequest?.allottedTo?.gender || "-"}
                            </p>
                          </div>
                          <div>
                            <label className="mb-1 block text-sm font-medium text-gray-700">
                              Blood Group
                            </label>
                            <div className="flex items-center gap-2">
                              <MdBloodtype className="h-4 w-4 text-red-500" />
                              <p className="font-semibold text-gray-900">
                                {donorRequest?.allottedTo?.bloodGroup || "-"}
                              </p>
                            </div>
                          </div>
                          <div>
                            <label className="mb-1 block text-sm font-medium text-gray-700">
                              Contact Number
                            </label>
                            <p className="text-gray-900">
                              {donorRequest?.allottedTo?.contactNumber || "-"}
                            </p>
                          </div>
                          <div>
                            <label className="mb-1 block text-sm font-medium text-gray-700">
                              Height / Weight
                            </label>
                            <p className="text-gray-900">
                              {donorRequest?.allottedTo?.height || "-"} cm / {donorRequest?.allottedTo?.weight || "-"} kg
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              
              </div>
            </div>
            <div className="hidden lg:col-span-3 lg:block">
              <DonorRequestTimeline donorRequest={donorRequest} />
            </div>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      {showEditModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-2xl">
            <div className="border-b border-gray-200 bg-gradient-to-r from-purple-50 to-violet-50 px-6 py-4">
              <h3 className="text-xl font-semibold text-gray-900">
                Edit{" "}
                {showEditModal === "hospital"
                  ? "Hospital & Doctor Information"
                  : showEditModal === "requirements"
                    ? "Basic Requirements"
                    : showEditModal === "physical"
                      ? "Physical Requirements"
                      : "Background Requirements"}
              </h3>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                {showEditModal === "hospital" && (
                  <>
                    <div>
                      <label className="mb-2 block text-sm font-medium text-gray-700">
                        Hospital Name
                      </label>
                      <input
                        type="text"
                        value={donorRequest?.hospitalId?.hospitalName || ""}
                        readOnly
                        className="w-full rounded-lg border border-gray-300 bg-gray-50 px-3 py-2.5 text-sm text-gray-600"
                      />
                    </div>
                    <div>
                      <label className="mb-2 block text-sm font-medium text-gray-700">
                        Doctor Name
                      </label>
                      <input
                        type="text"
                        value={donorRequest?.doctorId?.doctorName || ""}
                        readOnly
                        className="w-full rounded-lg border border-gray-300 bg-gray-50 px-3 py-2.5 text-sm text-gray-600"
                      />
                    </div>
                  </>
                )}

                {showEditModal === "requirements" && (
                  <>
                    <div>
                      <label className="mb-2 block text-sm font-medium text-gray-700">
                        Required By Date
                      </label>
                      <input
                        type="date"
                        value={editData.requiredByDate || ""}
                        onChange={(e) =>
                          setEditData({
                            ...editData,
                            requiredByDate: e.target.value,
                          })
                        }
                        className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                      />
                    </div>
                    <div>
                      <label className="mb-2 block text-sm font-medium text-gray-700">
                        Gender
                      </label>
                      <select
                        value={editData.gender || ""}
                        onChange={(e) =>
                          setEditData({ ...editData, gender: e.target.value })
                        }
                        className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                      >
                        <option value="">Select Gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                      </select>
                    </div>
                    <div>
                      <label className="mb-2 block text-sm font-medium text-gray-700">
                        Min Age
                      </label>
                      <input
                        type="number"
                        value={editData.ageRange?.min || ""}
                        onChange={(e) =>
                          setEditData({
                            ...editData,
                            ageRange: {
                              ...editData.ageRange,
                              min: e.target.value,
                            },
                          })
                        }
                        className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                      />
                    </div>
                    <div>
                      <label className="mb-2 block text-sm font-medium text-gray-700">
                        Max Age
                      </label>
                      <input
                        type="number"
                        value={editData.ageRange?.max || ""}
                        onChange={(e) =>
                          setEditData({
                            ...editData,
                            ageRange: {
                              ...editData.ageRange,
                              max: e.target.value,
                            },
                          })
                        }
                        className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                      />
                    </div>
                    <div>
                      <label className="mb-2 block text-sm font-medium text-gray-700">
                        Marital Status
                      </label>
                      <select
                        value={editData.maritalStatus || ""}
                        onChange={(e) =>
                          setEditData({
                            ...editData,
                            maritalStatus: e.target.value,
                          })
                        }
                        className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                      >
                        <option value="">Select Status</option>
                        <option value="single">Single</option>
                        <option value="married">Married</option>
                      </select>
                    </div>
                    <div>
                      <label className="mb-2 block text-sm font-medium text-gray-700">
                        Blood Group
                      </label>
                      <select
                        value={editData.bloodGroup || ""}
                        onChange={(e) =>
                          setEditData({
                            ...editData,
                            bloodGroup: e.target.value,
                          })
                        }
                        className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                      >
                        <option value="">Select Blood Group</option>
                        <option value="A+">A+</option>
                        <option value="A-">A-</option>
                        <option value="B+">B+</option>
                        <option value="B-">B-</option>
                        <option value="AB+">AB+</option>
                        <option value="AB-">AB-</option>
                        <option value="O+">O+</option>
                        <option value="O-">O-</option>
                      </select>
                    </div>
                  </>
                )}

                {showEditModal === "physical" && (
                  <>
                    <div>
                      <label className="mb-2 block text-sm font-medium text-gray-700">
                        Min Height (cm)
                      </label>
                      <input
                        type="number"
                        value={editData.heightRange?.min || ""}
                        onChange={(e) =>
                          setEditData({
                            ...editData,
                            heightRange: {
                              ...editData.heightRange,
                              min: e.target.value,
                            },
                          })
                        }
                        className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                      />
                    </div>
                    <div>
                      <label className="mb-2 block text-sm font-medium text-gray-700">
                        Max Height (cm)
                      </label>
                      <input
                        type="number"
                        value={editData.heightRange?.max || ""}
                        onChange={(e) =>
                          setEditData({
                            ...editData,
                            heightRange: {
                              ...editData.heightRange,
                              max: e.target.value,
                            },
                          })
                        }
                        className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                      />
                    </div>
                    <div>
                      <label className="mb-2 block text-sm font-medium text-gray-700">
                        Min Weight (kg)
                      </label>
                      <input
                        type="number"
                        value={editData.weightRange?.min || ""}
                        onChange={(e) =>
                          setEditData({
                            ...editData,
                            weightRange: {
                              ...editData.weightRange,
                              min: e.target.value,
                            },
                          })
                        }
                        className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                      />
                    </div>
                    <div>
                      <label className="mb-2 block text-sm font-medium text-gray-700">
                        Max Weight (kg)
                      </label>
                      <input
                        type="number"
                        value={editData.weightRange?.max || ""}
                        onChange={(e) =>
                          setEditData({
                            ...editData,
                            weightRange: {
                              ...editData.weightRange,
                              max: e.target.value,
                            },
                          })
                        }
                        className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                      />
                    </div>
                    <div>
                      <label className="mb-2 block text-sm font-medium text-gray-700">
                        Skin Colour
                      </label>
                      <input
                        type="text"
                        value={editData.skinColour || ""}
                        onChange={(e) =>
                          setEditData({
                            ...editData,
                            skinColour: e.target.value,
                          })
                        }
                        className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                      />
                    </div>
                    <div>
                      <label className="mb-2 block text-sm font-medium text-gray-700">
                        Hair Colour
                      </label>
                      <input
                        type="text"
                        value={editData.hairColour || ""}
                        onChange={(e) =>
                          setEditData({
                            ...editData,
                            hairColour: e.target.value,
                          })
                        }
                        className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                      />
                    </div>
                    <div>
                      <label className="mb-2 block text-sm font-medium text-gray-700">
                        Eye Colour
                      </label>
                      <input
                        type="text"
                        value={editData.eyeColour || ""}
                        onChange={(e) =>
                          setEditData({
                            ...editData,
                            eyeColour: e.target.value,
                          })
                        }
                        className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                      />
                    </div>
                  </>
                )}

                {showEditModal === "background" && (
                  <>
                    <div>
                      <label className="mb-2 block text-sm font-medium text-gray-700">
                        Cast
                      </label>
                      <input
                        type="text"
                        value={editData.cast || ""}
                        onChange={(e) =>
                          setEditData({ ...editData, cast: e.target.value })
                        }
                        className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                      />
                    </div>
                    <div>
                      <label className="mb-2 block text-sm font-medium text-gray-700">
                        Nationality
                      </label>
                      <input
                        type="text"
                        value={editData.nationality || ""}
                        onChange={(e) =>
                          setEditData({
                            ...editData,
                            nationality: e.target.value,
                          })
                        }
                        className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                      />
                    </div>
                    <div>
                      <label className="mb-2 block text-sm font-medium text-gray-700">
                        Education Requirement
                      </label>
                      <input
                        type="text"
                        value={editData.donorEducation || ""}
                        onChange={(e) =>
                          setEditData({
                            ...editData,
                            donorEducation: e.target.value,
                          })
                        }
                        className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                      />
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
                  style={{ backgroundColor: "#402575" }}
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
