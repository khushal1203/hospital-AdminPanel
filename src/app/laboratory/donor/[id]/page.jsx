'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { fetchDonorById } from '@/lib/donorApi';
import dayjs from 'dayjs';
import { MdAdd, MdFileDownload } from 'react-icons/md';

const InfoItem = ({ label, value }) => (
    <div className="flex flex-col gap-1">
        <span className="text-xs font-medium text-gray-500 uppercase">{label}</span>
        <span className="text-sm font-medium text-gray-900">{value || "-"}</span>
    </div>
);

const Section = ({ title, children }) => (
    <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">{title}</h3>
        <div className="grid grid-cols-1 gap-y-6 md:grid-cols-2 lg:grid-cols-4">
            {children}
        </div>
    </div>
);

export default function LaboratoryDonorProfile() {
    const { id } = useParams();
    const [donor, setDonor] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('overview');
    const [showAddDocument, setShowAddDocument] = useState(false);

    useEffect(() => {
        const loadDonor = async () => {
            try {
                const data = await fetchDonorById(id);
                setDonor(data.donor);
            } catch (error) {
                console.error('Error loading donor:', error);
            } finally {
                setLoading(false);
            }
        };
        loadDonor();
    }, [id]);

    if (loading) return <div className="p-6">Loading...</div>;
    if (!donor) return <div className="p-6">Donor not found</div>;

    const OverviewTab = () => (
        <div className="flex flex-col gap-6">
            {/* Header with Registration Date */}
            <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                <h2 className="text-xl font-bold text-gray-900 mb-2">{donor.fullName}</h2>
                <p className="text-sm text-gray-600">
                    Registered on: {donor.createdAt ? dayjs(donor.createdAt).format("DD MMM YYYY") : "-"}
                </p>
            </div>

            {/* Personal Information */}
            <Section title="Personal Information">
                <InfoItem label="Full Name" value={donor.fullName} />
                <InfoItem label="Husband Name" value={donor.husbandName} />
                <InfoItem label="Aadhaar Card Number" value={donor.aadharNumber} />
                <InfoItem label="Gender" value={donor.gender} />
                <InfoItem label="Marital Status" value={donor.maritalStatus} />
                <InfoItem label="Religion" value={donor.religion} />
                <InfoItem label="Blood Group" value={donor.bloodGroup} />
                <InfoItem label="Date of Birth" value={donor.dateOfBirth ? dayjs(donor.dateOfBirth).format("DD MMM YYYY") : "-"} />
                <InfoItem label="Place of Birth" value={donor.placeOfBirth} />
                <InfoItem label="Age" value={donor.age ? `${donor.age} Years` : "-"} />
                <InfoItem label="Cast" value={donor.cast} />
            </Section>

            {/* Contact Information */}
            <Section title="Contact Information">
                <InfoItem label="Phone Number" value={donor.contactNumber} />
                <InfoItem label="Reference Name" value={donor.referenceName} />
                <InfoItem label="Email" value={donor.email} />
                <InfoItem label="Ref. Phone Number" value={donor.referenceNumber} />
                <InfoItem label="Address" value={donor.address} />
                <InfoItem label="City" value={donor.city} />
                <InfoItem label="State" value={donor.state} />
                <InfoItem label="Pin Code" value={donor.pincode} />
            </Section>

            {/* Physical Attributes */}
            <Section title="Physical Attributes">
                <InfoItem label="Height" value={donor.height} />
                <InfoItem label="Skin Colour" value={donor.skinColor} />
                <InfoItem label="Weight" value={donor.weight ? `${donor.weight} kg` : "-"} />
                <InfoItem label="Hair Colour" value={donor.hairColor} />
                <InfoItem label="Eye Colour" value={donor.eyeColor} />
            </Section>

            {/* Professional Details */}
            <Section title="Professional Details">
                <InfoItem label="Donor Education" value={donor.donorEducation} />
                <InfoItem label="Spouse Education" value={donor.spouseEducation} />
                <InfoItem label="Donor Occupation" value={donor.donorOccupation} />
                <InfoItem label="Spouse Occupation" value={donor.spouseOccupation} />
                <InfoItem label="Monthly Income" value={donor.monthlyIncome ? `₹${donor.monthlyIncome}` : "-"} />
            </Section>
        </div>
    );

    const MedicalHistoryTab = () => (
        <div className="flex flex-col gap-6">
            {/* Stimulation Process */}
            <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">Stimulation Process</h3>
                <div className="space-y-4">
                    <InfoItem label="Start Date?" value="-" />
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                        <p className="text-sm text-yellow-800">
                            <span className="font-medium">Reason:</span> Stimulation process not started yet due to pending prerequisite steps or documentation.
                        </p>
                    </div>
                </div>
            </div>

            {/* Follicular Details */}
            <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">Follicular Details</h3>
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-gray-50 text-gray-500 font-medium">
                            <tr>
                                <th className="p-3">Date</th>
                                <th className="p-3">Day of LMP</th>
                                <th className="p-3">ET</th>
                                <th className="p-3">Right Ovary</th>
                                <th className="p-3">Left Ovary</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            <tr>
                                <td className="p-3 text-gray-900">
                                    {donor.follicularDetails?.lmpDate ? dayjs(donor.follicularDetails.lmpDate).format("DD MMM YYYY") : "-"}
                                </td>
                                <td className="p-3 text-gray-900">{donor.follicularDetails?.lmpDay || "-"}</td>
                                <td className="p-3 text-gray-900">{donor.follicularDetails?.etValue || "-"}</td>
                                <td className="p-3 text-gray-900">{donor.follicularDetails?.rightOvary || "-"}</td>
                                <td className="p-3 text-gray-900">{donor.follicularDetails?.leftOvary || "-"}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Menstrual & Contraceptive History */}
            <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">Menstrual & Contraceptive History</h3>
                <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <span className="font-medium text-gray-900">Menstrual History</span>
                        <span className="px-3 py-1 text-xs font-medium bg-green-100 text-green-700 rounded-full">
                            Completed
                        </span>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <span className="font-medium text-gray-900">Contraceptive History</span>
                        <span className="px-3 py-1 text-xs font-medium bg-green-100 text-green-700 rounded-full">
                            Completed
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );

    const DocumentsTab = () => {
        const DocumentSection = ({ title, docs, type }) => (
            <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
                    <button
                        onClick={() => setShowAddDocument(type)}
                        className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 text-sm font-medium"
                    >
                        <MdAdd className="h-4 w-4" />
                        Add New
                    </button>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-gray-50 text-gray-500 font-medium">
                            <tr>
                                <th className="p-3">Report Name</th>
                                <th className="p-3">Document</th>
                                <th className="p-3">Upload By</th>
                                <th className="p-3">Date</th>
                                <th className="p-3">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {docs.length > 0 ? docs.map((doc, index) => (
                                <tr key={index}>
                                    <td className="p-3 text-gray-900">{doc.reportName}</td>
                                    <td className="p-3 text-gray-900">{doc.documentName}</td>
                                    <td className="p-3 text-gray-900">{doc.uploadBy}</td>
                                    <td className="p-3 text-gray-900">{dayjs(doc.uploadDate).format("DD MMM YYYY")}</td>
                                    <td className="p-3">
                                        <button className="text-purple-600 hover:text-purple-800">
                                            <MdFileDownload className="h-4 w-4" />
                                        </button>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan="5" className="p-8 text-center text-gray-500">
                                        No documents uploaded yet
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        );

        return (
            <div className="flex flex-col gap-6">
                <DocumentSection 
                    title="Donor Documents" 
                    docs={donor.donorDocuments || []} 
                    type="donor" 
                />
                <DocumentSection 
                    title="Reports" 
                    docs={donor.reports || []} 
                    type="reports" 
                />
                <DocumentSection 
                    title="Documents" 
                    docs={donor.otherDocuments || []} 
                    type="documents" 
                />
            </div>
        );
    };

    return (
        <div className="p-6 max-w-7xl mx-auto">
            {/* Navigation Tabs */}
            <div className="mb-6 border-b border-gray-200">
                <nav className="-mb-px flex space-x-8">
                    <button
                        onClick={() => setActiveTab('overview')}
                        className={`py-2 px-1 border-b-2 font-medium text-sm ${
                            activeTab === 'overview'
                                ? 'border-purple-500 text-purple-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                        }`}
                    >
                        Overview
                    </button>
                    <button
                        onClick={() => setActiveTab('medical')}
                        className={`py-2 px-1 border-b-2 font-medium text-sm ${
                            activeTab === 'medical'
                                ? 'border-purple-500 text-purple-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                        }`}
                    >
                        Medical History
                    </button>
                    <button
                        onClick={() => setActiveTab('documents')}
                        className={`py-2 px-1 border-b-2 font-medium text-sm ${
                            activeTab === 'documents'
                                ? 'border-purple-500 text-purple-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                        }`}
                    >
                        Documents
                    </button>
                </nav>
            </div>

            {/* Tab Content */}
            {activeTab === 'overview' && <OverviewTab />}
            {activeTab === 'medical' && <MedicalHistoryTab />}
            {activeTab === 'documents' && <DocumentsTab />}
        </div>
    );
}