import { MdAdd, MdFileDownload, MdClose, MdUpload } from "react-icons/md";
import dayjs from "dayjs";
import { useState, useEffect, useRef } from "react";

export default function DocumentsTab({ donor }) {
    const [showModal, setShowModal] = useState(false);
    const [currentSection, setCurrentSection] = useState('');
    const [reportName, setReportName] = useState('');
    const [currentUser, setCurrentUser] = useState('');
    const fileInputRefs = useRef({});

    const defaultDocuments = {
        donorDocuments: [
            { reportName: 'Consent Form', documentName: null, uploadBy: null, uploadDate: null, hasFile: false },
            { reportName: 'Affidavit Form', documentName: null, uploadBy: null, uploadDate: null, hasFile: false }
        ],
        reports: [
            { reportName: 'OvaCare Evaluation Report', documentName: null, uploadBy: null, uploadDate: null, hasFile: false },
            { reportName: 'Lumine Report', documentName: null, uploadBy: null, uploadDate: null, hasFile: false },
            { reportName: 'Blood Report', documentName: null, uploadBy: null, uploadDate: null, hasFile: false }
        ],
        otherDocuments: [
            { reportName: 'Aadhaar Card Front', documentName: null, uploadBy: null, uploadDate: null, hasFile: false },
            { reportName: 'Aadhaar Card Back', documentName: null, uploadBy: null, uploadDate: null, hasFile: false },
            { reportName: 'Husband/Nominee Aadhaar Card Front', documentName: null, uploadBy: null, uploadDate: null, hasFile: false },
            { reportName: 'Husband/Nominee Aadhaar Card Back', documentName: null, uploadBy: null, uploadDate: null, hasFile: false },
            { reportName: 'Health Insurance Document', documentName: null, uploadBy: null, uploadDate: null, hasFile: false },
            { reportName: 'Life Insurance Document', documentName: null, uploadBy: null, uploadDate: null, hasFile: false }
        ]
    };

    const [documents, setDocuments] = useState(defaultDocuments);

    useEffect(() => {
        const user = localStorage.getItem('user');
        if (user) {
            const userData = JSON.parse(user);
            setCurrentUser(userData.name || userData.fullName || 'Unknown User');
        }
    }, []);

    const handleAddNew = (type) => {
        setCurrentSection(type);
        setShowModal(true);
        setReportName('');
    };

    const handleSubmit = () => {
        if (!reportName.trim()) return;
        
        const newDoc = {
            reportName: reportName.trim(),
            documentName: null,
            uploadBy: null,
            uploadDate: new Date().toISOString(),
            hasFile: false
        };

        const sectionKey = currentSection === 'donor' ? 'donorDocuments' : 
                          currentSection === 'reports' ? 'reports' : 'otherDocuments';
        
        setDocuments(prev => ({
            ...prev,
            [sectionKey]: [...prev[sectionKey], newDoc]
        }));
        
        setShowModal(false);
    };

    const handleUpload = (sectionKey, index) => {
        const inputId = `${sectionKey}-${index}`;
        if (!fileInputRefs.current[inputId]) {
            fileInputRefs.current[inputId] = document.createElement('input');
            fileInputRefs.current[inputId].type = 'file';
            fileInputRefs.current[inputId].onchange = (e) => {
                const file = e.target.files[0];
                if (file) {
                    setDocuments(prev => ({
                        ...prev,
                        [sectionKey]: prev[sectionKey].map((doc, i) => 
                            i === index ? {
                                ...doc,
                                documentName: file.name,
                                uploadBy: currentUser,
                                uploadDate: new Date().toISOString(),
                                hasFile: true
                            } : doc
                        )
                    }));
                }
            };
        }
        fileInputRefs.current[inputId].click();
    };

    const DocumentSection = ({ title, docs, type }) => (
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
                <button 
                    onClick={() => handleAddNew(type)}
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
                        {docs.map((doc, index) => (
                            <tr key={index}>
                                <td className="p-3 text-gray-900">{doc.reportName}</td>
                                <td className="p-3 text-gray-900">
                                    {doc.hasFile ? (
                                        <span className="text-green-600">{doc.documentName}</span>
                                    ) : (
                                        <button 
                                            onClick={() => handleUpload(type === 'donor' ? 'donorDocuments' : type === 'reports' ? 'reports' : 'otherDocuments', index)}
                                            className="flex items-center gap-1 text-purple-600 hover:text-purple-800 text-sm"
                                        >
                                            <MdUpload className="h-3 w-3" />
                                            Upload Document
                                        </button>
                                    )}
                                </td>
                                <td className="p-3 text-gray-900">{doc.uploadBy || '-'}</td>
                                <td className="p-3 text-gray-900">
                                    {doc.uploadDate ? dayjs(doc.uploadDate).format("DD MMM YYYY") : '-'}
                                </td>
                                <td className="p-3">
                                    {doc.hasFile ? (
                                        <button className="text-purple-600 hover:text-purple-800">
                                            <MdFileDownload className="h-4 w-4" />
                                        </button>
                                    ) : (
                                        <span className="text-gray-400">-</span>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );

    return (
        <div className="flex flex-col gap-6">
            <DocumentSection 
                title="Donor Documents" 
                docs={documents.donorDocuments} 
                type="donor" 
            />
            <DocumentSection 
                title="Medical Reports" 
                docs={documents.reports} 
                type="reports" 
            />
            <DocumentSection 
                title="Documents" 
                docs={documents.otherDocuments} 
                type="documents" 
            />

            {/* Add Report Name Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-96 max-w-md">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-gray-900">Add New Report</h3>
                            <button 
                                onClick={() => setShowModal(false)}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                <MdClose className="h-5 w-5" />
                            </button>
                        </div>
                        
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Report Name *
                                </label>
                                <input
                                    type="text"
                                    value={reportName}
                                    onChange={(e) => setReportName(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                                    placeholder="Enter report name"
                                />
                            </div>
                        </div>
                        
                        <div className="flex gap-3 mt-6">
                            <button
                                onClick={() => setShowModal(false)}
                                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSubmit}
                                disabled={!reportName.trim()}
                                className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Add
                            </button>
                        </div>
                    </div>
                </div>
            )}


        </div>
    );
}