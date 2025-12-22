"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import dayjs from "dayjs";
import { toast } from "@/utils/toast";
import {
    MdCheckCircle,
    MdPending,
    MdChevronRight,
    MdMoreVert,
    MdNavigateBefore,
    MdNavigateNext,
    MdUpload,
    MdDelete
} from "react-icons/md";
import { useColumns } from "@/contexts/ColumnContext";
import { useSelector } from 'react-redux';
import { getUserRole } from "@/utils/roleUtils";

const StatusBadge = ({ status, donor, documentType }) => {
    const [currentStatus, setCurrentStatus] = useState(() => {
        if (!donor?.documents || !documentType) return status;
        
        const allDocs = [
            ...(donor.documents.donorDocuments || []),
            ...(donor.documents.reports || []),
            ...(donor.documents.otherDocuments || [])
        ];
        
        const doc = allDocs.find(d => {
            if (!d.reportName) return false;
            const reportName = d.reportName.toLowerCase();
            const searchTerm = documentType.toLowerCase();
            
            if (searchTerm === 'consent' && reportName === 'consent form') return true;
            if (searchTerm === 'affidavit' && reportName === 'affidavit form') return true;
            if (searchTerm === 'blood' && reportName === 'blood report') return true;
            if (searchTerm === 'insurance' && reportName === 'life insurance document') return true;
            if (searchTerm === 'opu' && reportName === 'opu process') return true;
            
            return false;
        });
        
        return (doc && doc.hasFile === true) ? 'uploaded' : 'pending';
    });

    const isCompleted = currentStatus === "signed" || currentStatus === "uploaded";

    const getLabel = () => {
        if (currentStatus === "signed") return "Signed";
        if (currentStatus === "uploaded") return "Uploaded";
        return "Pending";
    };

    const getDocumentMapping = (documentType) => {
        const mappings = {
            'consent': { sectionKey: 'donorDocuments', reportName: 'Consent Form', index: 0 },
            'affidavit': { sectionKey: 'donorDocuments', reportName: 'Affidavit Form', index: 1 },
            'blood': { sectionKey: 'reports', reportName: 'Blood Report', index: 2 },
            'insurance': { sectionKey: 'otherDocuments', reportName: 'Life Insurance Document', index: 5 },
            'opu': { sectionKey: 'reports', reportName: 'OPU Process', index: 3 }
        };
        return mappings[documentType] || { sectionKey: 'reports', reportName: documentType, index: 0 };
    };

    const handleUpload = async (donorId, documentType) => {
        const input = document.createElement('input');
        input.type = 'file';
        input.onchange = async (e) => {
            const file = e.target.files[0];
            if (file) {
                const mapping = getDocumentMapping(documentType);
                const formData = new FormData();
                formData.append('document', file);
                formData.append('donorId', donorId);
                formData.append('sectionKey', mapping.sectionKey);
                formData.append('index', mapping.index);
                formData.append('reportName', mapping.reportName);
                
                try {
                    const token = localStorage.getItem('token');
                    const response = await fetch('/api/donors/upload-document', {
                        method: 'POST',
                        headers: {
                            'Authorization': `Bearer ${token}`
                        },
                        body: formData
                    });
                    
                    const data = await response.json();
                    if (data.success) {
                        setCurrentStatus('uploaded');
                        toast.success('Document uploaded successfully!');
                    } else {
                        toast.error('Failed to upload document');
                    }
                } catch (error) {
                    console.error('Upload error:', error);
                    toast.error('Error uploading document');
                }
            }
        };
        input.click();
    };

    const handleDelete = async (donorId, documentType) => {
        try {
            const mapping = getDocumentMapping(documentType);
            const token = localStorage.getItem('token');
            const response = await fetch('/api/donors/delete-document', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    donorId,
                    sectionKey: mapping.sectionKey,
                    index: mapping.index
                })
            });
            
            if (response.ok) {
                setCurrentStatus('pending');
                toast.success('Document deleted successfully!');
            } else {
                toast.error('Failed to delete document');
            }
        } catch (error) {
            console.error('Delete error:', error);
            toast.error('Error deleting document');
        }
    };

    return (
        <div className="flex items-center gap-2">
            <div className={`flex w-20 items-center justify-center gap-1 rounded-full px-3 py-1 text-xs font-medium ${
                isCompleted
                    ? "bg-green-100 text-green-700"
                    : "bg-yellow-100 text-yellow-700"
            }`}>
                {isCompleted ? (
                    <MdCheckCircle className="h-3 w-3" />
                ) : (
                    <MdPending className="h-3 w-3" />
                )}
                <span>{getLabel()}</span>
            </div>
            
            {!isCompleted ? (
                <button
                    onClick={() => handleUpload(donor._id, documentType)}
                    className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 text-blue-600 hover:bg-blue-200"
                    title="Upload Document"
                >
                    <MdUpload className="h-3 w-3" />
                </button>
            ) : (
                <button
                    onClick={() => handleDelete(donor._id, documentType)}
                    className="flex h-6 w-6 items-center justify-center rounded-full bg-red-100 text-red-600 hover:bg-red-200"
                    title="Delete Document"
                >
                    <MdDelete className="h-3 w-3" />
                </button>
            )}
        </div>
    );
};

const Tag = ({ text, type }) => {
    let bgClass = "bg-gray-100 text-gray-700";
    if (type === "ALLOTTED" || text === "ALLOTTED") bgClass = "bg-green-100 text-green-700";
    if (type === "REFERRED" || text === "REFERRED") bgClass = "bg-purple-100 text-purple-700";
    if (type === "ACCEPTED" || text?.includes("ACCEPTED")) bgClass = "bg-blue-100 text-blue-700";

    return (
        <span className={`ml-2 rounded px-2 py-0.5 text-[10px] font-bold ${bgClass}`}>
            {text}
        </span>
    );
};

import DonorTableToolbar from "@/components/Donors/DonorTableToolbar";

const Pagination = ({ currentPage, totalItems, itemsPerPage }) => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const totalPages = Math.ceil(totalItems / itemsPerPage);

    const handlePageChange = (page) => {
        const params = new URLSearchParams(searchParams);
        params.set('page', page.toString());
        router.push(`?${params.toString()}`);
    };

    return (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-gray-200 bg-white px-3 sm:px-4 py-3">
            <div className="text-xs sm:text-sm text-gray-700">
                Showing <span className="font-medium">{(currentPage - 1) * itemsPerPage + 1}</span> to{" "}
                <span className="font-medium">{Math.min(currentPage * itemsPerPage, totalItems)}</span> of{" "}
                <span className="font-medium">{totalItems}</span> results
            </div>
            <div className="flex gap-2">
                <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="flex items-center gap-1 rounded-lg border border-gray-300 bg-white px-2 sm:px-3 py-2 text-xs sm:text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <MdNavigateBefore className="h-4 w-4 sm:h-5 sm:w-5" />
                    <span className="hidden sm:inline">Previous</span>
                </button>
                <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="flex items-center gap-1 rounded-lg border border-gray-300 bg-white px-2 sm:px-3 py-2 text-xs sm:text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <span className="hidden sm:inline">Next</span>
                    <MdNavigateNext className="h-4 w-4 sm:h-5 sm:w-5" />
                </button>
            </div>
        </div>
    );
};

export default function DonorListTable({ donors, currentPage = 1, totalItems = 0, itemsPerPage = 10 }) {
    const [selectedDonors, setSelectedDonors] = useState([]);
    const [isLaboratory, setIsLaboratory] = useState(null);
    const { visibleColumns } = useColumns();
    const documentFilter = useSelector((state) => state.filter.documentFilter);

    // Filter donors based on document filter
    const filteredDonors = donors.filter(donor => {
        if (documentFilter === 'all') return true;
        
        const userRole = getUserRole();
        
        if (userRole === 'laboratory') {
            // Laboratory: Only check blood report
            const bloodReport = donor.documents?.reports?.find(r => 
                r.reportName?.toLowerCase() === 'blood report'
            );
            
            if (documentFilter === 'pending') {
                return !bloodReport?.hasFile;
            } else if (documentFilter === 'uploaded') {
                return bloodReport?.hasFile;
            }
        } else {
            // Doctor/Receptionist: Check specific documents
            const targetDocs = [
                donor.documents?.donorDocuments?.find(d => d.reportName?.toLowerCase() === 'consent form'),
                donor.documents?.donorDocuments?.find(d => d.reportName?.toLowerCase() === 'affidavit form'),
                donor.documents?.reports?.find(d => d.reportName?.toLowerCase() === 'blood report'),
                donor.documents?.otherDocuments?.find(d => d.reportName?.toLowerCase() === 'life insurance document'),
                donor.documents?.reports?.find(d => d.reportName?.toLowerCase() === 'opu process')
            ].filter(Boolean); // Remove undefined documents
            
            if (documentFilter === 'pending') {
                // Show if any of the target documents has hasFile: false
                return targetDocs.some(doc => !doc.hasFile);
            } else if (documentFilter === 'uploaded') {
                // Show if any of the target documents has hasFile: true
                return targetDocs.some(doc => doc.hasFile);
            }
        }
        
        return true;
    });

    useEffect(() => {
        const userRole = getUserRole();
        setIsLaboratory(userRole === 'laboratory');
    }, []);

    if (isLaboratory === null) {
        return <div>Loading...</div>;
    }

    const toggleSelectAll = () => {
        if (selectedDonors.length === filteredDonors.length) {
            setSelectedDonors([]);
        } else {
            setSelectedDonors(filteredDonors.map(d => d._id));
        }
    };

    const toggleSelect = (id) => {
        if (selectedDonors.includes(id)) {
            setSelectedDonors(selectedDonors.filter(d => d !== id));
        } else {
            setSelectedDonors([...selectedDonors, id]);
        }
    };

    return (
        <div className="flex flex-col h-full">
            {(!filteredDonors || filteredDonors.length === 0) ? (
                <div className="rounded-xl border border-gray-200 bg-white p-12 text-center shadow-md">
                    <p className="text-lg text-gray-500">No active donors found.</p>
                </div>
            ) : (
                <div className="flex flex-col rounded-2xl border border-gray-200 bg-white shadow-md overflow-hidden">
                    <div className="overflow-auto flex-1">
                        <table className="w-full min-w-[1600px] sm:min-w-[1200px] table-auto text-left text-xs sm:text-sm">
                        <thead className="bg-gradient-to-r from-purple-50 to-pink-50">
                            <tr className="border-b border-gray-200">
                                <th className="p-4 text-xs font-semibold uppercase tracking-wide text-gray-700">
                                    <input
                                        type="checkbox"
                                        className="h-4 w-4 rounded border-gray-300"
                                        checked={filteredDonors.length > 0 && selectedDonors.length === filteredDonors.length}
                                        onChange={toggleSelectAll}
                                    />
                                </th>
                                {visibleColumns.donorId && (
                                    <th className="p-4 text-xs font-semibold uppercase tracking-wide text-gray-700">Donor ID</th>
                                )}
                                {visibleColumns.registrationDate && (
                                    <th className="p-4 text-xs font-semibold uppercase tracking-wide text-gray-700">Registration Date</th>
                                )}
                                {visibleColumns.donorName && (
                                    <th className="p-4 text-xs font-semibold uppercase tracking-wide text-gray-700">Donor Name</th>
                                )}
                                {visibleColumns.nextAppointment && (
                                    <th className="p-4 text-xs font-semibold uppercase tracking-wide text-gray-700">Next Appointment</th>
                                )}
                                {visibleColumns.aadharNumber && (
                                    <th className="p-4 text-xs font-semibold uppercase tracking-wide text-gray-700">Aadhar Number</th>
                                )}
                                {visibleColumns.consentForm && !isLaboratory && (
                                    <th className="p-4 text-xs font-semibold uppercase tracking-wide text-gray-700">Consent Form</th>
                                )}
                                {visibleColumns.affidavit && !isLaboratory && (
                                    <th className="p-4 text-xs font-semibold uppercase tracking-wide text-gray-700">Affidavit</th>
                                )}
                                {visibleColumns.bloodReport && (
                                    <th className="p-4 text-xs font-semibold uppercase tracking-wide text-gray-700">Blood Report</th>
                                )}
                                {visibleColumns.insurance && !isLaboratory && (
                                    <th className="p-4 text-xs font-semibold uppercase tracking-wide text-gray-700">Insurance</th>
                                )}
                                {visibleColumns.opuProcess && !isLaboratory && (
                                    <th className="p-4 text-xs font-semibold uppercase tracking-wide text-gray-700">OPU Process</th>
                                )}
                                <th className="p-4 text-xs font-semibold uppercase tracking-wide text-gray-700">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {filteredDonors.map((donor) => (
                                <tr key={donor._id} className="transition-colors hover:bg-purple-50/30">
                                    <td className="p-4">
                                        <input
                                            type="checkbox"
                                            className="h-4 w-4 rounded border-gray-300"
                                            checked={selectedDonors.includes(donor._id)}
                                            onChange={() => toggleSelect(donor._id)}  
                                        />
                                    </td>
                                    <td className="p-4 font-medium text-gray-900">{donor.donorId}</td>
                                    <td className="p-4 text-gray-600">
                                        {donor.createdAt ? dayjs(donor.createdAt).format("MMM DD, YYYY") : "-"}
                                    </td>
                                    <td className="p-4">
                                        <div className="flex items-center gap-3">
                                            <div className="h-8 w-8 flex-shrink-0 overflow-hidden rounded-full bg-gray-200">
                                                {donor.donorImage ? (
                                                    <Image
                                                        src={donor.donorImage}
                                                        alt={donor.fullName}
                                                        width={32}
                                                        height={32}
                                                        className="h-full w-full object-cover"
                                                    />
                                                ) : (
                                                    <div className="flex h-full w-full items-center justify-center bg-purple-100 text-purple-600 text-xs font-bold">
                                                        {donor.fullName?.charAt(0)}
                                                    </div>
                                                )}
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="font-medium text-gray-900 flex items-center">
                                                    {donor.fullName}
                                                    {donor.tag && <Tag text={donor.tag} type={donor.tagType} />}
                                                    {/* Show ALLOTTED tag only when isAllotted is true */}
                                                    {donor.isAllotted && <Tag text="ALLOTTED" />}
                                                </span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-4 text-gray-600">
                                        {donor.nextAppointment ? dayjs(donor.nextAppointment).format("DD MMM, YYYY") : "-"}
                                    </td>
                                    <td className="p-4 text-gray-600">{donor.aadharNumber || "-"}</td>
                                    {visibleColumns.consentForm && !isLaboratory && (
                                        <td className="p-4"><StatusBadge status={donor.consentFormStatus} donor={donor} documentType="consent" /></td>
                                    )}
                                    {visibleColumns.affidavit && !isLaboratory && (
                                        <td className="p-4"><StatusBadge status={donor.affidavitStatus} donor={donor} documentType="affidavit" /></td>
                                    )}
                                    {visibleColumns.bloodReport && (
                                        <td className="p-4"><StatusBadge status={donor.bloodReportStatus} donor={donor} documentType="blood" /></td>
                                    )}
                                    {visibleColumns.insurance && !isLaboratory && (
                                        <td className="p-4"><StatusBadge status={donor.insuranceStatus} donor={donor} documentType="insurance" /></td>
                                    )}
                                    {visibleColumns.opuProcess && !isLaboratory && (
                                        <td className="p-4"><StatusBadge status={donor.opuProcessStatus} donor={donor} documentType="opu" /></td>
                                    )}
                                    <td className="p-4">
                                        <div className="flex items-center gap-2">
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
                            ))}
                        </tbody>
                    </table>
                    </div>
                    <Pagination 
                        currentPage={currentPage} 
                        totalItems={totalItems} 
                        itemsPerPage={itemsPerPage} 
                    />
                </div>
            )}
        </div>
    );
}
