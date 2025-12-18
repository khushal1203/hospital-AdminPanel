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

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem("token");
                if (!token) return;

                // Fetch stats
                const statsRes = await fetch('/api/donors/stats', {
                    headers: { Authorization: `Bearer ${token}` },
                });
                const statsData = await statsRes.json();
                if (statsData.success) {
                    setStats(statsData.stats);
                }

                // Fetch all donors
                const donorsRes = await fetch('/api/donors/all', {
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
    }, []);

    if (loading) {
        return (
            <div className="flex min-h-[400px] items-center justify-center">
                <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
            </div>
        );
    }

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
                <DonorTable 
                    title="Today's Follow-Ups" 
                    donors={donors.filter(d => {
                        const today = new Date().toDateString();
                        return new Date(d.createdAt).toDateString() === today;
                    }).slice(0, 5)} 
                />

                {/* Active Donor Cases Table */}
                <DonorTable 
                    title="Active Donor Cases" 
                    donors={donors.filter(d => d.status === 'active').slice(0, 5)} 
                />
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
                {/* Pending Blood Collections Table */}
                <DonorTable 
                    title="Pending Blood Collections" 
                    donors={donors.filter(d => 
                        !d.bloodGroup || 
                        !d.donorEducation || 
                        !d.donorOccupation
                    ).slice(0, 5)} 
                    showBloodReport 
                />

                {/* Overdue Donors/Pending Documents Table */}
                <DonorTable 
                    title="Overdue Donors/Pending Documents" 
                    donors={donors.filter(d => 
                        d.consentFormStatus === 'pending' || 
                        d.affidavitStatus === 'pending' || 
                        d.follicularScanStatus === 'pending'
                    ).slice(0, 5)} 
                    showMissingFields
                />
            </div>
        </div>
    );
}

// Donor Table Component
function DonorTable({ title, donors, showBloodReport = false, showMissingFields = false }) {
    
    const getMissingFields = (donor) => {
        const missing = [];
        
        // Check document status
        if (donor.consentFormStatus === 'pending') missing.push('Consent Form');
        if (donor.affidavitStatus === 'pending') missing.push('Affidavit');
        if (donor.follicularScanStatus === 'pending') missing.push('Scan Report');
        if (donor.insuranceStatus === 'pending') missing.push('Insurance');
        
        // Check type-specific documents
        if (donor.donorType === 'semen' && donor.semenData?.bloodReportStatus === 'pending') {
            missing.push('Blood Report');
        }
        
        return missing;
    };
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
                            {showMissingFields && (
                                <th className="pb-3 text-left text-xs font-medium text-gray-600 dark:text-gray-400">
                                    MISSING FIELDS
                                </th>
                            )}
                            <th className="pb-3 text-right text-xs font-medium text-gray-600 dark:text-gray-400">
                                TYPE
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {donors.map((donor, index) => (
                            <tr key={donor._id || index} className="border-b border-gray-100 dark:border-gray-800">
                                <td className="py-3 text-sm text-dark dark:text-white">{donor.donorId}</td>
                                <td className="py-3 text-sm text-gray-600 dark:text-gray-400">
                                    {new Date(donor.createdAt || donor.registrationDate).toLocaleDateString()}
                                </td>
                                <td className="py-3">
                                    <div className="flex items-center gap-2">
                                        <div className="h-8 w-8 rounded-full bg-gray-300 flex items-center justify-center text-xs font-medium text-gray-600">
                                            {donor.fullName?.charAt(0)?.toUpperCase()}
                                        </div>
                                        <div>
                                            <div className="text-sm font-medium text-dark dark:text-white">
                                                {donor.fullName}
                                            </div>
                                            <span
                                                className={`mt-1 inline-block rounded-full px-2 py-0.5 text-xs font-medium ${getStatusColor(
                                                    donor.status
                                                )}`}
                                            >
                                                {donor.status?.toUpperCase()}
                                            </span>
                                        </div>
                                    </div>
                                </td>
                                {showBloodReport && (
                                    <td className="py-3">
                                        <span className="inline-flex items-center gap-1 rounded-full bg-orange-100 px-2 py-1 text-xs text-orange-800">
                                            <span className="text-orange-600">⏱</span> {donor.bloodGroup || 'Pending'}
                                        </span>
                                    </td>
                                )}
                                {showMissingFields && (
                                    <td className="py-3">
                                        <div className="flex flex-wrap gap-1">
                                            {getMissingFields(donor).slice(0, 3).map((field, idx) => (
                                                <span key={idx} className="inline-block rounded bg-red-100 px-1 py-0.5 text-xs text-red-800">
                                                    {field}
                                                </span>
                                            ))}
                                            {getMissingFields(donor).length > 3 && (
                                                <span className="text-xs text-gray-500">+{getMissingFields(donor).length - 3}</span>
                                            )}
                                        </div>
                                    </td>
                                )}
                                <td className="py-3 text-right text-sm text-dark dark:text-white">
                                    {donor.donorType?.charAt(0)?.toUpperCase()}
                                </td>
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
