"use client";

import StatsCard from "./StatsCard";
import { MdPeople, MdFolder, MdDescription, MdPersonAdd } from "react-icons/md";

/**
 * AdminDashboard - Dashboard for admin, doctor, and laboratory roles
 */
export default function AdminDashboard() {
    // Mock data - will be replaced with API calls
    const stats = {
        todayFollowUps: 2,
        activeCases: 12,
        pendingDocuments: 8,
        totalDonors: 245,
    };

    const todayFollowUps = [
        {
            id: "#809776",
            date: "Apr 12, 2025",
            name: "Manishaben Kantilalbhai Dave",
            status: "allotted",
            next: "20",
        },
        {
            id: "#809776",
            date: "Apr 12, 2025",
            name: "Poonamben Bharatbhai Vyas",
            status: "referred",
            next: "20",
        },
    ];

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-dark dark:text-white">Dashboard</h1>
                    <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                        Here's your Oocyte donor summary.
                    </p>
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                    📅 Fri 25 Apr, 2025
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                <StatsCard
                    title="Today's Follow-Ups"
                    value={String(stats.todayFollowUps).padStart(2, "0")}
                    icon={MdPeople}
                    color="blue"
                />
                <StatsCard
                    title="Active Donor Cases"
                    value={String(stats.activeCases).padStart(2, "0")}
                    icon={MdFolder}
                    color="purple"
                />
                <StatsCard
                    title="Documents Pending Submission"
                    value={String(stats.pendingDocuments).padStart(2, "0")}
                    icon={MdDescription}
                    color="orange"
                />
                <StatsCard
                    title="Total Donors"
                    value={stats.totalDonors}
                    icon={MdPersonAdd}
                    color="green"
                />
            </div>

            {/* Tables Grid */}
            <div className="grid gap-6 lg:grid-cols-2">
                {/* Today's Follow-Ups Table */}
                <DonorTable title="Today's Follow-Ups" donors={todayFollowUps} />

                {/* Active Donor Cases Table */}
                <DonorTable title="Active Donor Cases" donors={todayFollowUps} />
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
                {/* Pending Blood Collections Table */}
                <DonorTable title="Pending Blood Collections" donors={todayFollowUps} showBloodReport />

                {/* Overdue Donors/Pending Documents Table */}
                <DonorTable title="Overdue Donors/Pending Documents" donors={todayFollowUps} />
            </div>
        </div>
    );
}

// Donor Table Component
function DonorTable({ title, donors, showBloodReport = false }) {
    const getStatusColor = (status) => {
        const colors = {
            allotted: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
            referred: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
            pending: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300",
        };
        return colors[status] || "bg-gray-100 text-gray-800";
    };

    return (
        <div className="rounded-lg bg-white p-6 shadow-md dark:bg-gray-dark">
            <h3 className="mb-4 text-lg font-semibold text-dark dark:text-white">{title}</h3>

            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="border-b border-gray-200 dark:border-gray-700">
                            <th className="pb-3 text-left text-xs font-medium text-gray-600 dark:text-gray-400">
                                DONOR ID
                            </th>
                            <th className="pb-3 text-left text-xs font-medium text-gray-600 dark:text-gray-400">
                                REGISTRATION DATE
                            </th>
                            <th className="pb-3 text-left text-xs font-medium text-gray-600 dark:text-gray-400">
                                DONOR NAME
                            </th>
                            {showBloodReport && (
                                <th className="pb-3 text-left text-xs font-medium text-gray-600 dark:text-gray-400">
                                    BLOOD REPORT STATUS
                                </th>
                            )}
                            <th className="pb-3 text-right text-xs font-medium text-gray-600 dark:text-gray-400">
                                NEXT
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {donors.map((donor, index) => (
                            <tr key={index} className="border-b border-gray-100 dark:border-gray-800">
                                <td className="py-3 text-sm text-dark dark:text-white">{donor.id}</td>
                                <td className="py-3 text-sm text-gray-600 dark:text-gray-400">{donor.date}</td>
                                <td className="py-3">
                                    <div className="flex items-center gap-2">
                                        <div className="h-8 w-8 rounded-full bg-gray-300"></div>
                                        <div>
                                            <div className="text-sm font-medium text-dark dark:text-white">
                                                {donor.name}
                                            </div>
                                            <span
                                                className={`mt-1 inline-block rounded-full px-2 py-0.5 text-xs font-medium ${getStatusColor(
                                                    donor.status
                                                )}`}
                                            >
                                                {donor.status.toUpperCase()}
                                            </span>
                                        </div>
                                    </div>
                                </td>
                                {showBloodReport && (
                                    <td className="py-3">
                                        <span className="inline-flex items-center gap-1 rounded-full bg-orange-100 px-2 py-1 text-xs text-orange-800">
                                            <span className="text-orange-600">⏱</span> Pending
                                        </span>
                                    </td>
                                )}
                                <td className="py-3 text-right text-sm text-dark dark:text-white">{donor.next}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <button className="mt-4 text-sm font-medium text-primary hover:underline">
                View all →
            </button>
        </div>
    );
}
