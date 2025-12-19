"use client";

import { useEffect, useState } from "react";
import StatsCard from "./StatsCard";
import { MdPeople, MdFolder, MdDescription, MdPersonAdd } from "react-icons/md";

/**
 * AdminDashboard - Dashboard for admin, doctor, and laboratory roles
 */
export default function AdminDashboard() {
    const [stats, setStats] = useState({
        todayFollowUps: 0,
        activeCases: 0,
        pendingDocuments: 0,
        totalDonors: 0,
    });
    const [donors, setDonors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem("token");
                if (!token) return;

                // Fetch stats with date filter
                const statsRes = await fetch(`/api/donors/stats?date=${selectedDate}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                const statsData = await statsRes.json();
                if (statsData.success) {
                    setStats(statsData.stats);
                }

                // Fetch donors with date filter
                const donorsRes = await fetch(`/api/donors/all?date=${selectedDate}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                const donorsData = await donorsRes.json();
                if (donorsData.success) {
                    setDonors(donorsData.donors.slice(0, 10)); // Show only first 10
                }
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [selectedDate]);

    if (loading) {
        return (
            <div className="flex min-h-[400px] items-center justify-center">
                <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col">
            {/* Page Header */}
            <div className="bg-white px-4 py-3 shadow-sm flex-shrink-0">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                        <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Dashboard</h1>
                        <p className="mt-1 text-sm text-gray-600">
                            Here's your Oocyte donor summary.
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        <input
                            type="date"
                            value={selectedDate}
                            onChange={(e) => setSelectedDate(e.target.value)}
                            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        />
                        {/* <div className="text-sm text-gray-600">
                            📅 {new Date(selectedDate).toLocaleDateString('en-US', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })}
                        </div> */}
                    </div>
                </div>
            </div>

            {/* Content Area */}
            <div className="bg-gray-100 flex-1 flex flex-col overflow-hidden">
                <div className="flex-1 overflow-auto p-3 sm:p-6">
                    {/* Stats Cards */}
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-6">
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
                    <div className="grid gap-6 lg:grid-cols-2 mb-6">
                        {/* Active Donors Table */}
                        <DonorTable 
                            title="Active Donors" 
                            donors={donors.slice(0, 5)} 
                        />

                        {/* Recent Registrations Table */}
                        <DonorTable 
                            title="Recent Registrations" 
                            donors={donors.slice(0, 5)} 
                        />
                    </div>

                    <div className="grid gap-6 lg:grid-cols-2">
                        {/* Pending Documents Table */}
                        <DonorTable 
                            title="Pending Documents" 
                            donors={donors.slice(0, 5)} 
                            showMissingFields
                        />

                        {/* Blood Reports Table */}
                        <DonorTable 
                            title="Blood Reports" 
                            donors={donors.slice(0, 5)} 
                            showBloodReport 
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

// Donor Table Component
function DonorTable({ title, donors, showBloodReport = false, showMissingFields = false }) {
    
    const getMissingFields = (donor) => {
        const missing = ['Consent Form', 'Blood Report', 'Medical History'];
        return missing;
    };
    
    const getStatusColor = (status) => {
        const colors = {
            allotted: "bg-green-100 text-green-800",
            referred: "bg-purple-100 text-purple-800",
            pending: "bg-orange-100 text-orange-800",
            active: "bg-blue-100 text-blue-800",
        };
        return colors[status] || "bg-gray-100 text-gray-800";
    };

    return (
        <div className="rounded-lg bg-white p-6 shadow-sm border border-gray-200">
            <h3 className="mb-4 text-lg font-semibold text-gray-900">{title}</h3>

            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="border-b border-gray-200">
                            <th className="pb-3 text-left text-xs font-medium text-gray-500 uppercase">
                                DONOR ID
                            </th>
                            <th className="pb-3 text-left text-xs font-medium text-gray-500 uppercase">
                                NAME
                            </th>
                            <th className="pb-3 text-left text-xs font-medium text-gray-500 uppercase">
                                STATUS
                            </th>
                            {showBloodReport && (
                                <th className="pb-3 text-left text-xs font-medium text-gray-500 uppercase">
                                    BLOOD GROUP
                                </th>
                            )}
                            {showMissingFields && (
                                <th className="pb-3 text-left text-xs font-medium text-gray-500 uppercase">
                                    MISSING
                                </th>
                            )}
                            <th className="pb-3 text-right text-xs font-medium text-gray-500 uppercase">
                                DATE
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {donors.length > 0 ? donors.map((donor, index) => (
                            <tr key={donor._id || index} className="border-b border-gray-100">
                                <td className="py-3 text-sm font-medium text-gray-900">
                                    #{donor._id?.slice(-6) || `D00${index + 1}`}
                                </td>
                                <td className="py-3">
                                    <div className="flex items-center gap-3">
                                        <div className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center text-xs font-medium text-purple-600">
                                            {donor.fullName?.charAt(0)?.toUpperCase() || 'D'}
                                        </div>
                                        <div className="text-sm font-medium text-gray-900">
                                            {donor.fullName || `Donor ${index + 1}`}
                                        </div>
                                    </div>
                                </td>
                                <td className="py-3">
                                    <span className={`inline-block rounded-full px-2 py-1 text-xs font-medium ${getStatusColor(donor.status || 'active')}`}>
                                        {(donor.status || 'Active').toUpperCase()}
                                    </span>
                                </td>
                                {showBloodReport && (
                                    <td className="py-3 text-sm text-gray-900">
                                        {donor.bloodGroup || 'O+'}
                                    </td>
                                )}
                                {showMissingFields && (
                                    <td className="py-3">
                                        <div className="flex flex-wrap gap-1">
                                            {getMissingFields(donor).slice(0, 2).map((field, idx) => (
                                                <span key={idx} className="inline-block rounded bg-red-100 px-2 py-1 text-xs text-red-800">
                                                    {field}
                                                </span>
                                            ))}
                                        </div>
                                    </td>
                                )}
                                <td className="py-3 text-right text-sm text-gray-600">
                                    {new Date(donor.createdAt || Date.now()).toLocaleDateString()}
                                </td>
                            </tr>
                        )) : (
                            <tr>
                                <td colSpan="6" className="py-8 text-center text-gray-500">
                                    No donors found
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            <button className="mt-4 text-sm font-medium text-purple-600 hover:text-purple-800">
                View all →
            </button>
        </div>
    );
}
