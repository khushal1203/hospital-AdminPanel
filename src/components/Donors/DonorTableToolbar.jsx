"use client";

import { MdSearch, MdCalendarToday, MdFilterList } from "react-icons/md";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { useColumns } from "@/contexts/ColumnContext";

export default function DonorTableToolbar() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [searchTerm, setSearchTerm] = useState("");
    const [showFilter, setShowFilter] = useState(false);
    const [showColumns, setShowColumns] = useState(false);
    const [selectedStatus, setSelectedStatus] = useState("");
    const { visibleColumns, setVisibleColumns } = useColumns();

    // Load search term from URL on mount
    useEffect(() => {
        const search = searchParams.get('search') || '';
        const status = searchParams.get('status') || '';
        setSearchTerm(search);
        setSelectedStatus(status);
    }, [searchParams]);

    const handleSearch = (value) => {
        setSearchTerm(value);
        const params = new URLSearchParams(searchParams);
        
        if (value.trim()) {
            params.set('search', value.trim());
        } else {
            params.delete('search');
        }
        
        params.delete('page');
        router.push(`?${params.toString()}`);
    };

    const handleStatusFilter = (status) => {
        setSelectedStatus(status);
        const params = new URLSearchParams(searchParams);
        
        if (status) {
            params.set('status', status);
        } else {
            params.delete('status');
        }
        
        params.delete('page');
        router.push(`?${params.toString()}`);
        setShowFilter(false);
    };

    const toggleColumn = (column) => {
        setVisibleColumns(prev => ({
            ...prev,
            [column]: !prev[column]
        }));
    };

    return (
        <div className="flex flex-col gap-4 py-4 sm:flex-row sm:items-center sm:justify-between bg-white px-1">
            {/* Search Input */}
            <div className="relative w-full sm:w-72">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <MdSearch className="h-5 w-5 text-gray-400" />
                </div>
                <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => handleSearch(e.target.value)}
                    className="block w-full rounded-lg border border-gray-200 bg-white p-2.5 pl-10 text-sm text-gray-900 outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                    placeholder="Search by donor name..."
                />
            </div>

            {/* Actions */}
            <div className="flex flex-wrap items-center gap-2">
                {/* Date Picker Button */}
                <button className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
                    <MdCalendarToday className="h-4 w-4 text-gray-500" />
                    <span>Fri 25 Apr, 2025</span>
                </button>

                {/* Filter Button */}
                <div className="relative">
                    <button 
                        onClick={() => setShowFilter(!showFilter)}
                        className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                    >
                        <MdFilterList className="h-4 w-4 text-gray-500" />
                        <span>Filter</span>
                        {selectedStatus && <span className="ml-1 bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full">{selectedStatus}</span>}
                    </button>
                    
                    {showFilter && (
                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                            <div className="p-2">
                                <div className="text-xs font-medium text-gray-500 mb-2">Filter by Status</div>
                                <button
                                    onClick={() => handleStatusFilter('')}
                                    className={`w-full text-left px-3 py-2 text-sm rounded hover:bg-gray-50 ${!selectedStatus ? 'bg-purple-50 text-purple-700' : ''}`}
                                >
                                    All Status
                                </button>
                                <button
                                    onClick={() => handleStatusFilter('active')}
                                    className={`w-full text-left px-3 py-2 text-sm rounded hover:bg-gray-50 ${selectedStatus === 'active' ? 'bg-purple-50 text-purple-700' : ''}`}
                                >
                                    Active
                                </button>
                                <button
                                    onClick={() => handleStatusFilter('pending')}
                                    className={`w-full text-left px-3 py-2 text-sm rounded hover:bg-gray-50 ${selectedStatus === 'pending' ? 'bg-purple-50 text-purple-700' : ''}`}
                                >
                                    Pending
                                </button>
                                <button
                                    onClick={() => handleStatusFilter('completed')}
                                    className={`w-full text-left px-3 py-2 text-sm rounded hover:bg-gray-50 ${selectedStatus === 'completed' ? 'bg-purple-50 text-purple-700' : ''}`}
                                >
                                    Completed
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Customize Columns Button */}
                <div className="relative">
                    <button 
                        onClick={() => setShowColumns(!showColumns)}
                        className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                    >
                        <span>Customize Columns</span>
                        <svg className="h-4 w-4 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                    </button>
                    
                    {showColumns && (
                        <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                            <div className="p-3">
                                <div className="text-xs font-medium text-gray-500 mb-3">Show/Hide Columns</div>
                                {Object.entries(visibleColumns).map(([key, visible]) => (
                                    <label key={key} className="flex items-center gap-2 py-1 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={visible}
                                            onChange={() => toggleColumn(key)}
                                            className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                                        />
                                        <span className="text-sm text-gray-700 capitalize">
                                            {key.replace(/([A-Z])/g, ' $1').trim()}
                                        </span>
                                    </label>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
