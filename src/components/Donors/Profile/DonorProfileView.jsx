"use client";

import { useState } from "react";
import Image from "next/image";
import { MdEdit, MdMoreVert, MdPrint } from "react-icons/md";

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

    const tabs = [
        { id: "overview", label: "Overview", icon: MdOutlineDashboard },
        { id: "medical", label: "Medical History", icon: MdHistory },
        { id: "documents", label: "Documents", icon: MdDescription },
        { id: "allotment", label: "Allotment Details", icon: MdInfoOutline },
    ];

    return (
        <div className="flex flex-col gap-6">
            {/* Header and Persistent Profile Card */}
            <div className="flex items-center justify-between mb-2">
                <h1 className="text-2xl font-bold text-gray-900">Donor Profile</h1>
            </div>

            <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                <div className="flex items-start justify-between">
                    <div className="flex gap-6">
                        <div className="h-24 w-24 overflow-hidden rounded-full border-4 border-gray-100">
                            {donor.donorImage ? (
                                <Image
                                    src={donor.donorImage}
                                    alt={donor.fullName}
                                    width={96}
                                    height={96}
                                    className="h-full w-full object-cover"
                                />
                            ) : (
                                <div className="flex h-full w-full items-center justify-center bg-purple-100 text-2xl font-bold text-purple-600">
                                    {donor.fullName?.charAt(0)}
                                </div>
                            )}
                        </div>
                        <div className="pt-2">
                            <div className="flex items-center mb-1">
                                <Tag text="ALLOTTED" /> {/* Mocking status for now */}
                            </div>
                            <h2 className="text-2xl font-bold text-gray-900 mb-1">{donor.fullName}</h2>
                            <div className="flex items-center gap-4 text-sm text-gray-500">
                                <span>Donor ID : {donor.donorId}</span>
                                <span className="h-4 w-px bg-gray-300"></span>
                                <span>{donor.gender} ({donor.age || "-"})</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-2">
                        <button className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
                            <MdPrint className="h-4 w-4" />
                            Print
                        </button>
                    </div>
                </div>

                {/* Tabs within Card */}
                <div className="mt-8 flex items-center gap-8 border-b border-gray-100">
                    {tabs.map((tab) => {
                        const Icon = tab.icon;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center gap-2 border-b-2 px-1 py-4 text-sm font-medium transition-colors ${activeTab === tab.id
                                        ? "border-purple-600 text-purple-600"
                                        : "border-transparent text-gray-500 hover:text-gray-700"
                                    }`}
                            >
                                <Icon className="h-5 w-5" />
                                {tab.label}
                            </button>
                        )
                    })}
                </div>
            </div>

            <div className="grid grid-cols-12 gap-6">
                {/* Left Column - Tab Content */}
                <div className="col-span-12 lg:col-span-9">
                    {activeTab === "overview" && <OverviewTab donor={donor} />}
                    {activeTab === "medical" && <MedicalHistoryTab donor={donor} />}
                    {activeTab === "documents" && <DocumentsTab donor={donor} />}
                    {activeTab === "allotment" && (
                        <div className="rounded-lg border border-gray-200 bg-white p-8 text-center text-gray-500 shadow-sm">
                            Allotment Details
                        </div>
                    )}
                </div>

                {/* Right Column - Timeline */}
                <div className="col-span-12 lg:col-span-3">
                    <DonorTimeline donor={donor} />
                </div>
            </div>
        </div>
    );
}
