import { MdAdd, MdVisibility, MdClose, MdCloudUpload } from "react-icons/md";
import dayjs from "dayjs";
import { useState, useEffect, useRef } from "react";
import { toast } from "@/utils/toast";
import { CompactLoader } from "@/components/ui/LoadingSpinner";

export default function DocumentsTab({ donor }) {
    const [showModal, setShowModal] = useState(false);
    const [currentSection, setCurrentSection] = useState('');
    const [reportName, setReportName] = useState('');
    const [currentUser, setCurrentUser] = useState('');
    const fileInputRefs = useRef({});

    const defaultDocuments = {
        donorDocuments: [
            { reportName: 'Consent Form', documentName: null, uploadBy: null, uploadDate: null, hasFile: false, isUploaded: false },
            { reportName: 'Affidavit Form', documentName: null, uploadBy: null, uploadDate: null, hasFile: false, isUploaded: false }
        ],
        reports: [
            { reportName: 'OvaCare Evaluation Report', documentName: null, uploadBy: null, uploadDate: null, hasFile: false, isUploaded: false },
            { reportName: 'Lumine Report', documentName: null, uploadBy: null, uploadDate: null, hasFile: false, isUploaded: false },
            { reportName: 'Blood Report', documentName: null, uploadBy: null, uploadDate: null, hasFile: false, isUploaded: false },
            { reportName: 'OPU Process', documentName: null, uploadBy: null, uploadDate: null, hasFile: false, isUploaded: false }
        ],
        otherDocuments: [
            { reportName: 'Aadhaar Card Front', documentName: null, uploadBy: null, uploadDate: null, hasFile: false, isUploaded: false },
            { reportName: 'Aadhaar Card Back', documentName: null, uploadBy: null, uploadDate: null, hasFile: false, isUploaded: false },
            { reportName: 'Husband/Nominee Aadhaar Card Front', documentName: null, uploadBy: null, uploadDate: null, hasFile: false, isUploaded: false },
            { reportName: 'Husband/Nominee Aadhaar Card Back', documentName: null, uploadBy: null, uploadDate: null, hasFile: false, isUploaded: false },
            { reportName: 'Health Insurance Document', documentName: null, uploadBy: null, uploadDate: null, hasFile: false, isUploaded: false },
            { reportName: 'Life Insurance Document', documentName: null, uploadBy: null, uploadDate: null, hasFile: false, isUploaded: false }
        ]
    };

    const [documents, setDocuments] = useState(defaultDocuments);
    const [uploading, setUploading] = useState({});

    useEffect(() => {
        const user = localStorage.getItem('user');
        if (user) {
            const userData = JSON.parse(user);
            setCurrentUser(userData.name || userData.fullName || 'Unknown User');
        }
        
        // Load documents from database and localStorage
        const uploadedDocs = JSON.parse(localStorage.getItem('uploadedDocs') || '{}');
        
        const finalDocs = {
            donorDocuments: [],
            reports: [],
            otherDocuments: []
        };
        
        // Merge database documents with defaults and localStorage
        ['donorDocuments', 'reports', 'otherDocuments'].forEach(section => {
            const dbDocs = donor.documents?.[section] || [];
            const defaults = defaultDocuments[section];
            
            finalDocs[section] = defaults.map((defaultDoc, index) => {
                const docKey = `${donor._id}-${section}-${index}`;
                
                // Priority: localStorage > database > default
                if (uploadedDocs[docKey]) {
                    return uploadedDocs[docKey];
                }
                
                const dbDoc = dbDocs.find(doc => doc.reportName === defaultDoc.reportName);
                if (dbDoc) {
                    return { ...dbDoc, isUploaded: dbDoc.hasFile || dbDoc.isUploaded || false };
                }
                return defaultDoc;
            });
        });
        
        setDocuments(finalDocs);
    }, [donor]);
    
    // Clear localStorage on component unmount
    useEffect(() => {
        return () => {
            // Optional: Clear old entries to prevent memory buildup
        };
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

    const handleDelete = async (sectionKey, index) => {
        try {
            const updatedDoc = {
                reportName: documents[sectionKey][index].reportName,
                documentName: null,
                filePath: null,
                uploadBy: null,
                uploadDate: null,
                hasFile: false,
                isUploaded: false
            };
            
            // Update state immediately
            setDocuments(prev => ({
                ...prev,
                [sectionKey]: prev[sectionKey].map((doc, i) => 
                    i === index ? updatedDoc : doc
                )
            }));
            
            // Remove from localStorage
            const uploadedDocs = JSON.parse(localStorage.getItem('uploadedDocs') || '{}');
            const docKey = `${donor._id}-${sectionKey}-${index}`;
            delete uploadedDocs[docKey];
            localStorage.setItem('uploadedDocs', JSON.stringify(uploadedDocs));
            
            // Call API to delete document from server
            const token = localStorage.getItem('token');
            const response = await fetch('/api/donors/delete-document', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    donorId: donor._id,
                    sectionKey,
                    index
                })
            });
            
            if (response.ok) {
                toast.success('Document deleted successfully!');
            } else {
                toast.error('Failed to delete document from server');
            }
        } catch (error) {
            console.error('Error deleting document:', error);
            toast.error('Failed to delete document');
        }
    };

    const handleUpload = async (sectionKey, index) => {
        const inputId = `${sectionKey}-${index}`;
        if (!fileInputRefs.current[inputId]) {
            fileInputRefs.current[inputId] = document.createElement('input');
            fileInputRefs.current[inputId].type = 'file';
            fileInputRefs.current[inputId].onchange = async (e) => {
                const file = e.target.files[0];
                if (file) {
                    setUploading(prev => ({ ...prev, [`${sectionKey}-${index}`]: true }));
                    
                    const formData = new FormData();
                    formData.append('document', file);
                    formData.append('donorId', donor._id);
                    formData.append('sectionKey', sectionKey);
                    console.log('Upload params:', { sectionKey, index, reportName: documents[sectionKey][index].reportName });
                    formData.append('index', index);
                    formData.append('reportName', documents[sectionKey][index].reportName);
                    
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
                        console.log('Upload response:', data);
                        if (data.success) {
                            const updatedDoc = {
                                reportName: documents[sectionKey][index].reportName,
                                documentName: file.name,
                                filePath: data.filePath,
                                uploadBy: currentUser,
                                uploadDate: new Date().toISOString(),
                                hasFile: true,
                                isUploaded: true
                            };
                            
                            // Update state
                            setDocuments(prev => ({
                                ...prev,
                                [sectionKey]: prev[sectionKey].map((doc, i) => 
                                    i === index ? updatedDoc : doc
                                )
                            }));
                            
                            // Save to localStorage for persistence
                            const uploadedDocs = JSON.parse(localStorage.getItem('uploadedDocs') || '{}');
                            const docKey = `${donor._id}-${sectionKey}-${index}`;
                            uploadedDocs[docKey] = updatedDoc;
                            localStorage.setItem('uploadedDocs', JSON.stringify(uploadedDocs));
                            
                            // Show success toast
                            toast.success(`${documents[sectionKey][index].reportName} uploaded successfully!`);
                        }
                    } catch (error) {
                        console.error('Error uploading document:', error);
                        console.error('Upload error details:', error.message);
                        toast.error('Failed to upload document. Please try again.');
                    } finally {
                        setUploading(prev => ({ ...prev, [`${sectionKey}-${index}`]: false }));
                    }
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
                            <th className="p-3">Status</th>
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
                                    {doc.isUploaded ? (
                                        <span className="text-green-600 flex items-center gap-1">
                                            <span className="h-2 w-2 bg-green-500 rounded-full"></span>
                                            Uploaded
                                        </span>
                                    ) : uploading[`${type === 'donor' ? 'donorDocuments' : type === 'reports' ? 'reports' : 'otherDocuments'}-${index}`] ? (
                                        <span className="text-blue-600 flex items-center gap-1">
                                            <CompactLoader />
                                            Uploading...
                                        </span>
                                    ) : (
                                        <span className="text-orange-600 flex items-center gap-1">
                                            <span className="h-2 w-2 bg-orange-500 rounded-full"></span>
                                            Pending
                                        </span>
                                    )}
                                </td>
                                <td className="p-3 text-gray-900">{doc.uploadBy || '-'}</td>
                                <td className="p-3 text-gray-900">
                                    {doc.uploadDate ? dayjs(doc.uploadDate).format("DD MMM YYYY") : '-'}
                                </td>
                                <td className="p-3">
                                    {doc.isUploaded ? (
                                        <div className="flex items-center gap-3">
                                            <button 
                                                onClick={() => {
                                                    if (doc.filePath) {
                                                        window.open(doc.filePath, '_blank');
                                                    }
                                                }}
                                                className="p-1.5 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-md transition-colors"
                                                title="View document"
                                            >
                                                <MdVisibility className="h-5 w-5" />
                                            </button>
                                            <button 
                                                onClick={() => handleDelete(type === 'donor' ? 'donorDocuments' : type === 'reports' ? 'reports' : 'otherDocuments', index)}
                                                className="p-1.5 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-md transition-colors"
                                                title="Delete document"
                                            >
                                                <MdClose className="h-5 w-5" />
                                            </button>
                                        </div>
                                    ) : (
                                        <button 
                                            onClick={() => {
                                                const sectionKey = type === 'donor' ? 'donorDocuments' : type === 'reports' ? 'reports' : 'otherDocuments';
                                                handleUpload(sectionKey, index);
                                            }}
                                            className="p-1.5 text-purple-600 hover:text-purple-800 hover:bg-purple-50 rounded-md transition-colors"
                                            title="Upload document"
                                        >
                                            <MdCloudUpload className="h-5 w-5" />
                                        </button>
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