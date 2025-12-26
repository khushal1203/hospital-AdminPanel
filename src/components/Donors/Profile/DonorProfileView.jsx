"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { MdEdit, MdMoreVert, MdPrint, MdCancel, MdCheckCircle } from "react-icons/md";
import { toast } from "@/utils/toast";
import { ButtonLoader } from "@/components/ui/LoadingSpinner";

import DonorTimeline from "./DonorTimeline";
import OverviewTab from "./OverviewTab";
import MedicalHistoryTab from "./MedicalHistoryTab";
import DocumentsTab from "./DocumentsTab";
import AllotmentTab from "./AllotmentTab";
import {
  MdOutlineDashboard,
  MdHistory,
  MdDescription,
  MdInfoOutline,
} from "react-icons/md";

const Tag = ({ text, type }) => {
  let bgClass = "bg-gray-100 text-gray-700";
  if (type === "ALLOTTED" || text === "ALLOTTED")
    bgClass = "bg-green-100 text-green-700";

  return (
    <span className={`ml-3 rounded px-2 py-0.5 text-xs font-bold ${bgClass}`}>
      {text}
    </span>
  );
};

export default function DonorProfileView({ donor: initialDonor }) {
  const [activeTab, setActiveTab] = useState("overview");
  const [donor, setDonor] = useState(initialDonor);
  const [donorImage, setDonorImage] = useState(initialDonor.donorImage);
  const [uploading, setUploading] = useState(false);
  const [cancellingAllotment, setCancellingAllotment] = useState(false);
  const fileInputRef = useRef(null);

  // Listen for donor updates
  useEffect(() => {
    const handleDonorUpdate = async (event) => {
      if (event.detail.donorId === donor._id) {
        try {
          const token = localStorage.getItem("token");
          const response = await fetch(`${process.env.NEXT_PUBLIC_API_END_POINT}/donors/${donor._id}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          const data = await response.json();
          if (data.success) {
            setDonor(data.donor);
          }
        } catch (error) {
          console.error("Error refreshing donor data:", error);
        }
      }
    };

    window.addEventListener('donorUpdated', handleDonorUpdate);
    return () => window.removeEventListener('donorUpdated', handleDonorUpdate);
  }, [donor._id]);

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("image", file);
    formData.append("donorId", donor._id);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_END_POINT}/donors/upload-image`, {
        method: "POST",
        body: formData,
      });

      const result = await response.json();
      if (result.success) {
        setDonorImage(result.imageUrl);
        toast.success("Photo uploaded successfully!");
      } else {
        toast.error(result.message || "Failed to upload photo");
      }
    } catch (error) {
      toast.error("Failed to upload photo");
    } finally {
      setUploading(false);
    }
  };

  const handleCancelAllotment = async () => {
    if (!confirm("Are you sure you want to cancel the allotment for this donor?")) {
      return;
    }

    setCancellingAllotment(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_END_POINT}/donors/cancel-allotment`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ donorId: donor._id }),
      });

      const result = await response.json();
      if (result.success) {
        toast.success("Allotment cancelled successfully!");
        window.location.reload();
      } else {
        toast.error(result.message || "Failed to cancel allotment");
      }
    } catch (error) {
      toast.error("Failed to cancel allotment");
    } finally {
      setCancellingAllotment(false);
    }
  };

  const tabs = [
    { id: "overview", label: "Overview", icon: MdOutlineDashboard },
    { id: "medical", label: "Medical History", icon: MdHistory },
    { id: "documents", label: "Documents", icon: MdDescription },
    { id: "allotment", label: "Allotment Details", icon: MdInfoOutline },
  ];

  return (
    <div className="flex h-full flex-col">
      {/* Sticky Profile Header */}
      <div className="sticky top-0 z-10 rounded-lg border-b border-gray-200 bg-white shadow-sm">
        <div className="p-4 sm:p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex flex-col gap-4 sm:flex-row sm:gap-6">
              <div className="group relative mx-auto h-20 w-20 overflow-hidden rounded-full border-4 border-gray-100 sm:mx-0 sm:h-24 sm:w-24">
                {donorImage ? (
                  <Image
                    src={donorImage}
                    alt={donor.fullName}
                    width={96}
                    height={96}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-purple-100 text-xl font-bold text-purple-600 sm:text-2xl">
                    {donor.fullName?.charAt(0)}
                  </div>
                )}

                {/* Upload Button */}
                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                  className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 transition-opacity duration-200 group-hover:opacity-100"
                >
                  <MdEdit className="h-5 w-5 text-white sm:h-6 sm:w-6" />
                </button>

                {/* Hidden File Input */}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />

                {/* Loading Overlay */}
                {uploading && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <ButtonLoader />
                  </div>
                )}
              </div>
              <div className="text-center sm:pt-2 sm:text-left">
                {donor.isAllotted && (
                  <div className="mb-1 flex items-center justify-center sm:justify-start">
                    <Tag text="ALLOTTED" />
                  </div>
                )}
                <h2 className="mb-1 text-xl font-bold text-gray-900 sm:text-2xl">
                  {donor.fullName}
                </h2>
                <div className="flex flex-col gap-2 text-sm text-gray-500 sm:flex-row sm:items-center sm:gap-4">
                  <span>Donor ID : {donor.donorId}</span>
                  <span className="hidden h-4 w-px bg-gray-300 sm:block"></span>
                  <span>
                    {donor.gender} ({donor.age || "-"})
                  </span>
                </div>
              </div>
            </div>

            <div className="flex justify-center gap-2 sm:justify-end">
              <button className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 sm:px-4">
                <MdPrint className="h-4 w-4" />
                <span className="hidden sm:inline">Print</span>
              </button>
              {donor.isAllotted && !donor.isCaseDone && (
                <button 
                  onClick={handleCancelAllotment}
                  disabled={cancellingAllotment}
                  className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm font-medium text-red-700 hover:bg-red-100 disabled:opacity-50 sm:px-4"
                >
                  {cancellingAllotment ? (
                    <ButtonLoader />
                  ) : (
                    <MdCancel className="h-4 w-4" />
                  )}
                  <span className="hidden sm:inline">
                    {cancellingAllotment ? "Cancelling..." : "Cancel Allotment"}
                  </span>
                </button>
              )}
              {donor.isCaseDone && (
                <div className="flex items-center gap-2 rounded-lg border-2 border-green-500 bg-gradient-to-r from-green-50 to-emerald-50 px-3 py-1.5 text-sm font-semibold text-green-700 shadow-sm">
                  <MdCheckCircle className="h-4 w-4 text-green-600" />
                  <span>Case Done</span>
                </div>
              )}
            </div>
          </div>

          {/* Mobile Tabs - Horizontal Scroll */}
          <div className="mt-6 sm:mt-8">
            <div className="scrollbar-hide flex overflow-x-auto border-b border-gray-100">
              <div className="flex min-w-max gap-1 px-1 sm:gap-8">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex flex-col items-center gap-1 whitespace-nowrap border-b-2 px-3 py-3 text-xs font-medium transition-colors sm:flex-row sm:gap-2 sm:px-1 sm:py-4 sm:text-sm ${
                        activeTab === tab.id
                          ? "border-purple-600 text-purple-600"
                          : "border-transparent text-gray-500 hover:text-gray-700"
                      }`}
                    >
                      <Icon className="h-4 w-4 sm:h-5 sm:w-5" />
                      <span className="text-center">{tab.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-auto p-3 sm:p-6">
        <div className="grid grid-cols-1 gap-4 sm:gap-6 lg:grid-cols-12">
          {/* Tab Content */}
          <div className="lg:col-span-9">
            {activeTab === "overview" && <OverviewTab donor={donor} />}
            {activeTab === "medical" && <MedicalHistoryTab donor={donor} />}
            {activeTab === "documents" && <DocumentsTab donor={donor} />}
            {activeTab === "allotment" && <AllotmentTab donor={donor} />}
          </div>

          {/* Timeline - Hidden on mobile, shown on desktop */}
          <div className="hidden lg:col-span-3 lg:block">
            <DonorTimeline donor={donor} />
          </div>
        </div>
      </div>
    </div>
  );
}
