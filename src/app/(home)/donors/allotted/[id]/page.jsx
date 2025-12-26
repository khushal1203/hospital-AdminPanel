"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import {
  MdArrowBack,
  MdLocalHospital,
  MdPerson,
  MdBloodtype,
  MdHeight,
  MdMonitorWeight,
  MdColorLens,
  MdSchool,
  MdCalendarToday,
} from "react-icons/md";
import dayjs from "dayjs";
import DonorRequestTimeline from "@/components/DonorRequests/DonorRequestTimeline";

export default function DoctorDonorRequestView() {
  const router = useRouter();
  const params = useParams();
  const [donorRequest, setDonorRequest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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

  if (loading) {
    return <LoadingSpinner message="" />;
  }

  if (error) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <p className="text-red-600">{error}</p>
          <button
            onClick={() => router.push("/donors/allotted")}
            className="mt-4 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
          >
            Back to Allotted Donors
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
              {/* Hospital & Doctor Information */}
              <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-md">
                <div className="border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4">
                  <div className="flex items-center gap-3">
                    <MdLocalHospital className="h-6 w-6 text-blue-600" />
                    <div>
                      <h2 className="text-lg font-semibold text-gray-900">
                        Hospital & Doctor Information
                      </h2>
                      <p className="mt-1 text-sm text-gray-600">
                        Request submitted by hospital and doctor
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-6">
                  <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                    <div>
                      <label className="mb-1 block text-sm font-medium text-gray-700">
                        Hospital Name
                      </label>
                      <p className="text-gray-900">
                        {donorRequest?.hospitalId?.hospitalName || "-"}
                      </p>
                    </div>

                    <div>
                      <label className="mb-1 block text-sm font-medium text-gray-700">
                        Doctor Name
                      </label>
                      <p className="text-gray-900">
                        {donorRequest?.doctorId?.fullName ? `Dr. ${donorRequest.doctorId.fullName}` : "-"}
                      </p>
                    </div>

                    <div>
                      <label className="mb-1 block text-sm font-medium text-gray-700">
                        Hospital City
                      </label>
                      <p className="text-gray-900">
                        {donorRequest?.hospitalId?.city || "-"}
                      </p>
                    </div>

                    <div>
                      <label className="mb-1 block text-sm font-medium text-gray-700">
                        Request Status
                      </label>
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          donorRequest?.status === "pending"
                            ? "bg-yellow-100 text-yellow-800"
                            : donorRequest?.status === "approved"
                              ? "bg-green-100 text-green-800"
                              : donorRequest?.status === "rejected"
                                ? "bg-red-100 text-red-800"
                                : donorRequest?.status === "fulfilled"
                                  ? "bg-blue-100 text-blue-800"
                                  : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {donorRequest?.status || "pending"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Basic Requirements */}
              <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-md">
                <div className="border-b border-gray-200 bg-gradient-to-r from-purple-50 to-violet-50 px-6 py-4">
                  <div className="flex items-center gap-3">
                    <MdPerson className="h-6 w-6 text-purple-600" />
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
                  <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                    <div>
                      <label className="mb-1 block text-sm font-medium text-gray-700">
                        Required By Date
                      </label>
                      <div className="flex items-center gap-2">
                        <MdCalendarToday className="h-4 w-4 text-gray-400" />
                        <p className="text-gray-900">
                          {donorRequest?.requiredByDate
                            ? dayjs(donorRequest.requiredByDate).format("DD MMM YYYY")
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
                        {donorRequest?.ageRange?.min && donorRequest?.ageRange?.max
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
                  </div>
                </div>
              </div>

              {/* Physical Requirements */}
              <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-md">
                <div className="border-b border-gray-200 bg-gradient-to-r from-green-50 to-emerald-50 px-6 py-4">
                  <div className="flex items-center gap-3">
                    <MdHeight className="h-6 w-6 text-green-600" />
                    <div>
                      <h2 className="text-lg font-semibold text-gray-900">
                        Physical Requirements
                      </h2>
                      <p className="mt-1 text-sm text-gray-600">
                        Physical characteristics requirements
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-6">
                  <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                    <div>
                      <label className="mb-1 block text-sm font-medium text-gray-700">
                        Height Range
                      </label>
                      <div className="flex items-center gap-2">
                        <MdHeight className="h-4 w-4 text-gray-400" />
                        <p className="text-gray-900">
                          {donorRequest?.heightRange?.min && donorRequest?.heightRange?.max
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
                          {donorRequest?.weightRange?.min && donorRequest?.weightRange?.max
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
                  </div>
                </div>
              </div>

              {/* Background Requirements */}
              <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-md">
                <div className="border-b border-gray-200 bg-gradient-to-r from-orange-50 to-amber-50 px-6 py-4">
                  <div className="flex items-center gap-3">
                    <MdSchool className="h-6 w-6 text-orange-600" />
                    <div>
                      <h2 className="text-lg font-semibold text-gray-900">
                        Background Requirements
                      </h2>
                      <p className="mt-1 text-sm text-gray-600">
                        Cultural and educational requirements
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-6">
                  <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
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
                        Education Requirement
                      </label>
                      <p className="text-gray-900">
                        {donorRequest?.donorEducation || "-"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              </div>
            </div>
            <div className="hidden lg:col-span-3 lg:block">
              <div className="sticky top-4">
                <DonorRequestTimeline donorRequest={donorRequest} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}