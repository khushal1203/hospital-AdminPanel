"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { MdEdit, MdMoreVert, MdPrint } from "react-icons/md";
import { toast } from "@/utils/toast";

import DonorTimeline from "./DonorTimeline";
import OverviewTab from "./OverviewTab";
import MedicalHistoryTab from "./MedicalHistoryTab";
import DocumentsTab from "./DocumentsTab";
import { MdOutlineDashboard, MdHistory, MdDescription, MdInfoOutline } from "react-icons/md";

const Tag = ({ text, type }) => {
    let bgClass = "bg-gray-100 text-gray-700";
    if (type === "ALLOTTED" || text === "ALLOTTED") bgClass = "bg-green-100 text-green-700";

    return (
        <span className={`ml-3 rounded px-2 py-0.5 text-xs font-bold ${bgClass}`}>
            {text}
        </span>
    );
};

export default function DonorProfileView({ donor }) {
    const [activeTab, setActiveTab] = useState("overview");
    const [donorImage, setDonorImage] = useState(donor.donorImage);
    const [uploading, setUploading] = useState(false);
    const fileInputRef = useRef(null);

    const handleImageUpload = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        setUploading(true);
        const formData = new FormData();
        formData.append('image', file);
        formData.append('donorId', donor._id);

        try {
            const response = await fetch('/api/donors/upload-image', {
                method: 'POST',
                body: formData,
            });

            const result = await response.json();
            if (result.success) {
                setDonorImage(result.imageUrl);
                toast.success('Photo uploaded successfully!');
            } else {
                toast.error(result.message || 'Failed to upload photo');
            }
        } catch (error) {
            toast.error('Failed to upload photo');
        } finally {
            setUploading(false);
        }
    };

    const tabs = [
        { id: "overview", label: "Overview", icon: MdOutlineDashboard },
        { id: "medical", label: "Medical History", icon: MdHistory },
        { id: "documents", label: "Documents", icon: MdDescription },
        { id: "allotment", label: "Allotment Details", icon: MdInfoOutline },
    ];

    return (
        <div className="flex flex-col h-full">
            {/* Sticky Profile Header */}
            <div className="bg-white sticky top-0 z-10 border-b border-gray-200">
                <div className="p-4 sm:p-6">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                        <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
                            <div className="relative h-20 w-20 sm:h-24 sm:w-24 overflow-hidden rounded-full border-4 border-gray-100 group mx-auto sm:mx-0">
                                {donorImage ? (
                                    <Image
                                        src={donorImage}
                                        alt={donor.fullName}
                                        width={96}
                                        height={96}
                                        className="h-full w-full object-cover"
                                    />
                                ) : (
                                    <div className="flex h-full w-full items-center justify-center bg-purple-100 text-xl sm:text-2xl font-bold text-purple-600">
                                        {donor.fullName?.charAt(0)}
                                    </div>
                                )}
                                
                                {/* Upload Button */}
                                <button
                                    onClick={() => fileInputRef.current?.click()}
                                    disabled={uploading}
                                    className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                                >
                                    <MdEdit className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
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
                                        <div className="animate-spin rounded-full h-5 w-5 sm:h-6 sm:w-6 border-2 border-white border-t-transparent"></div>
                                    </div>
                                )}
                            </div>
                            <div className="text-center sm:text-left sm:pt-2">
                                <div className="flex items-center justify-center sm:justify-start mb-1">
                                    <Tag text="ALLOTTED" />
                                </div>
                                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1">{donor.fullName}</h2>
                                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-sm text-gray-500">
                                    <span>Donor ID : {donor.donorId}</span>
                                    <span className="hidden sm:block h-4 w-px bg-gray-300"></span>
                                    <span>{donor.gender} ({donor.age || "-"})</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-center sm:justify-end">
                            <button className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 sm:px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
                                <MdPrint className="h-4 w-4" />
                                <span className="hidden sm:inline">Print</span>
                            </button>
                        </div>
                    </div>

                    {/* Mobile Tabs - Horizontal Scroll */}
                    <div className="mt-6 sm:mt-8">
                        <div className="flex overflow-x-auto border-b border-gray-100 scrollbar-hide">
                            <div className="flex gap-1 sm:gap-8 min-w-max px-1">
                                {tabs.map((tab) => {
                                    const Icon = tab.icon;
                                    return (
                                        <button
                                            key={tab.id}
                                            onClick={() => setActiveTab(tab.id)}
                                            className={`flex flex-col sm:flex-row items-center gap-1 sm:gap-2 border-b-2 px-3 sm:px-1 py-3 sm:py-4 text-xs sm:text-sm font-medium transition-colors whitespace-nowrap ${
                                                activeTab === tab.id
                                                    ? "border-purple-600 text-purple-600"
                                                    : "border-transparent text-gray-500 hover:text-gray-700"
                                                }`}
                                        >
                                            <Icon className="h-4 w-4 sm:h-5 sm:w-5" />
                                            <span className="text-center">{tab.label}</span>
                                        </button>
                                    )
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-auto p-3 sm:p-6">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6">
                    {/* Tab Content */}
                    <div className="lg:col-span-9">
                        {activeTab === "overview" && <OverviewTab donor={donor} />}
                        {activeTab === "medical" && <MedicalHistoryTab donor={donor} />}
                        {activeTab === "documents" && <DocumentsTab donor={donor} />}
                        {activeTab === "allotment" && (
                            <div className="rounded-lg border border-gray-200 bg-white p-6 sm:p-8 text-center text-gray-500 shadow-sm">
                                Allotment Details
                            </div>
                        )}
                    </div>

                    {/* Timeline - Hidden on mobile, shown on desktop */}
                    <div className="hidden lg:block lg:col-span-3">
                        <DonorTimeline donor={donor} />
                    </div>
                </div>
            </div>
        </div>
    );
}
