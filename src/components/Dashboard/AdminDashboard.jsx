"use client";

import { useEffect, useState } from "react";
import StatsCard from "./StatsCard";
import { MdPeople, MdFolder, MdDescription, MdPersonAdd, MdChevronRight, MdMoreVert } from "react-icons/md";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import Link from "next/link";

/**
 * AdminDashboard - Dashboard for admin, doctor, and laboratory roles
 */
export default function AdminDashboard({ userRole }) {
    const [stats, setStats] = useState({
        todayFollowUps: 0,
        activeCases: 0,
        pendingDocuments: 0,
        totalDonors: 0,
    });
    const [todayRegistrations, setTodayRegistrations] = useState([]);
    const [activeDonors, setActiveDonors] = useState([]);
    const [bloodReportPending, setBloodReportPending] = useState([]);
    const [pendingDocuments, setPendingDocuments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem("token");
                if (!token) return;

                // Fetch stats
                const statsRes = await fetch(`/api/donors/stats?date=${selectedDate}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                const statsData = await statsRes.json();
                if (statsData.success) {
                    setStats(statsData.stats);
                }

                // Fetch all donors
                const donorsRes = await fetch(`/api/donors/all?date=${selectedDate}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                const donorsData = await donorsRes.json();
                if (donorsData.success) {
                    const allDonors = donorsData.donors;
                    const today = new Date(selectedDate);
                    today.setHours(0, 0, 0, 0);
                    const tomorrow = new Date(today);
                    tomorrow.setDate(tomorrow.getDate() + 1);

                    // Today's registrations
                    const todayRegs = allDonors.filter(d => {
                        const regDate = new Date(d.registrationDate || d.createdAt);
                        return regDate >= today && regDate < tomorrow;
                    });
                    setTodayRegistrations(todayRegs.slice(0, 5));

                    // Active donors
                    const active = allDonors.filter(d => d.status === 'active');
                    setActiveDonors(active.slice(0, 5));

                    // Blood report pending
                    const bloodPending = allDonors.filter(d => {
                        const reports = d.documents?.reports || [];
                        const bloodReport = reports.find(r => r.reportName === 'Blood Report');
                        return bloodReport && !bloodReport.hasFile;
                    });
                    setBloodReportPending(bloodPending.slice(0, 5));

                    // Pending documents
                    const docsPending = allDonors.filter(d => {
                        const docs = d.documents || {};
                        const allDocs = [
                            ...(docs.donorDocuments || []),
                            ...(docs.reports || []),
                            ...(docs.otherDocuments || [])
                        ];
                        return allDocs.some(doc => !doc.hasFile);
                    });
                    setPendingDocuments(docsPending.slice(0, 5));
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
        return <LoadingSpinner message="    " />;
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
                        {userRole !== 'laboratory' && (
                            <StatsCard
                                title="Today's Follow-Ups"
                                value={String(stats.todayFollowUps).padStart(2, "0")}
                                icon={MdPeople}
                                color="blue"
                            />
                        )}
                        {userRole !== 'laboratory' && (
                            <StatsCard
                                title="Active Donor Cases"
                                value={String(stats.activeCases).padStart(2, "0")}
                                icon={MdFolder}
                                color="purple"
                            />
                        )}
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
                        {/* Today's Registrations */}
                        {userRole !== 'laboratory' && (
                            <DonorTable 
                                title="Today's Registrations" 
                                donors={todayRegistrations} 
                            />
                        )}

                        {/* Active Donors */}
                        {userRole !== 'laboratory' && (
                            <DonorTable 
                                title="Active Donors" 
                                donors={activeDonors} 
                            />
                        )}
                    </div>

                    <div className="grid gap-6 lg:grid-cols-2">
                        {/* Blood Reports Pending */}
                        <DonorTable 
                            title="Blood Reports Pending" 
                            donors={bloodReportPending} 
                            showBloodReport
                        />

                        {/* Pending Documents */}
                        <DonorTable 
                            title="Overdue/Pending Documents" 
                            donors={pendingDocuments} 
                            showMissingFields
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

// Donor Table Component
function DonorTable({ title, donors, showBloodReport = false, showMissingFields = false }) {
    
    const getViewAllLink = (title) => {
        switch(title) {
            case "Today's Registrations":
                return "/donors/active";
            case "Active Donors":
                return "/donors/active";
            case "Blood Reports Pending":
                return "/donors/active";
            case "Overdue/Pending Documents":
                return "/donors/active";
            default:
                return "/donors/active";
        }
    };
    
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
                                ACTION
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {donors.length > 0 ? donors.map((donor, index) => (
                            <tr key={donor._id || index} className="border-b border-gray-100">
                                <td className="py-3 text-sm font-bold text-gray-900">
                                    {donor.donorId}
                                </td>
                                <td className="py-3 text-sm font-bold text-gray-900">
                                    {donor.fullName}
                                </td>
                                <td className="py-3">
                                    {(showBloodReport || showMissingFields) ? (
                                        // Blood Reports Pending & Overdue/Pending Documents - show pending status
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                                            pending
                                        </span>
                                    ) : (
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                            getStatusColor(donor.status)
                                        }`}>
                                            {donor.status || 'pending'}
                                        </span>
                                    )}
                                </td>
                                {showBloodReport && (
                                    <td className="py-3 text-sm text-gray-600">
                                        {donor.bloodGroup || '-'}
                                    </td>
                                )}
                                {showMissingFields && (
                                    <td className="py-3 text-sm text-gray-600">
                                        {getMissingFields(donor).slice(0, 2).join(', ')}
                                    </td>
                                )}
                                <td className="py-3 text-right">
                                    <div className="flex items-center justify-end gap-2">
                                        <Link
                                            href={`/donors/${donor._id}`}
                                            className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-200 text-gray-500 hover:bg-gray-50 hover:text-purple-600"
                                        >
                                            <MdChevronRight className="h-5 w-5" />
                                        </Link>
                                        <button className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-200 text-gray-500 hover:bg-gray-50 hover:text-purple-600">
                                            <MdMoreVert className="h-5 w-5" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        )) : (
                            <tr>
                                <td colSpan="6" className="py-8 text-center text-gray-500">
                                    No data available
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
            
            {/* View All Button */}
            <div className="mt-4">
                <Link 
                    href={getViewAllLink(title)}
                    className="text-sm text-purple-600 hover:text-purple-800 font-medium"
                >
                    View All
                </Link>
            </div>
        </div>
    );
}
