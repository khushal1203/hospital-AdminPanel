"use client";

import { useState, useRef, useEffect } from "react";
import { MdAdd, MdClose, MdCloudUpload, MdVisibility, MdEdit } from "react-icons/md";
import { toast } from "@/utils/toast";
import dayjs from "dayjs";

export default function AllotmentTab({ donor }) {
  const [documents, setDocuments] = useState({
    allotmentDocuments: [
      {
        reportName: "Donor Agreement",
        documentName: null,
        filePath: null,
        uploadBy: null,
        uploadDate: null,
        hasFile: false,
        isUploaded: false,
      },
      {
        reportName: "Hospital Evaluation Report",
        documentName: null,
        filePath: null,
        uploadBy: null,
        uploadDate: null,
        hasFile: false,
        isUploaded: false,
      },
    ],
  });

  const [remarks, setRemarks] = useState({
    oocyteRetrievalDate: "",
    numberOfOocytes: "",
    oocyteQuality: "",
    fertilizationOutcome: "",
    remarksAddedBy: "",
    remarks: "",
  });

  const [showModal, setShowModal] = useState(false);
  const [reportName, setReportName] = useState("");
  const [uploading, setUploading] = useState({});
  const [savingRemarks, setSavingRemarks] = useState(false);
  const fileInputRefs = useRef({});

  const [isEditingRemarks, setIsEditingRemarks] = useState(false);

  // Load existing remarks when component mounts or donor changes
  useEffect(() => {
    if (donor?.allotmentRemarks) {
      setRemarks({
        oocyteRetrievalDate: donor.allotmentRemarks.oocyteRetrievalDate || "",
        numberOfOocytes: donor.allotmentRemarks.numberOfOocytes || "",
        oocyteQuality: donor.allotmentRemarks.oocyteQuality || "",
        fertilizationOutcome: donor.allotmentRemarks.fertilizationOutcome || "",
        remarksAddedBy: donor.allotmentRemarks.remarksAddedBy || "",
        remarks: donor.allotmentRemarks.remarks || "",
      });
    }
    
    // Load existing allotment documents
    if (donor?.documents?.allotmentDocuments) {
      setDocuments(prev => ({
        ...prev,
        allotmentDocuments: donor.documents.allotmentDocuments.map(doc => ({
          ...doc,
          isUploaded: doc.hasFile || false
        }))
      }));
    }
  }, [donor]);

  const handleAddNew = () => {
    setShowModal(true);
  };

  const handleSubmit = () => {
    if (!reportName.trim()) return;

    const newDoc = {
      reportName: reportName.trim(),
      documentName: null,
      filePath: null,
      uploadBy: null,
      uploadDate: null,
      hasFile: false,
      isUploaded: false,
    };

    setDocuments(prev => ({
      ...prev,
      allotmentDocuments: [...prev.allotmentDocuments, newDoc]
    }));

    setReportName("");
    setShowModal(false);
    toast.success("Document added successfully!");
  };

  const handleUpload = (index) => {
    const inputId = `allotmentDocuments-${index}`;
    if (!fileInputRefs.current[inputId]) {
      fileInputRefs.current[inputId] = document.createElement("input");
      fileInputRefs.current[inputId].type = "file";
      fileInputRefs.current[inputId].accept = ".pdf,.doc,.docx,.jpg,.jpeg,.png";
      fileInputRefs.current[inputId].onchange = async (e) => {
        const file = e.target.files[0];
        if (file) {
          setUploading(prev => ({ ...prev, [`allotmentDocuments-${index}`]: true }));
          
          try {
            const formData = new FormData();
            formData.append("document", file);
            formData.append("donorId", donor._id);
            formData.append("sectionKey", "allotmentDocuments");
            formData.append("index", index);
            formData.append("reportName", documents.allotmentDocuments[index].reportName);

            const token = localStorage.getItem("token");
            const currentUser = JSON.parse(localStorage.getItem("user") || "{}").fullName || "Unknown";

            const response = await fetch(`${process.env.NEXT_PUBLIC_API_END_POINT}/donors/upload-document`, {
              method: "POST",
              headers: {
                Authorization: `Bearer ${token}`,
              },
              body: formData,
            });

            const data = await response.json();
            if (data.success) {
              const updatedDoc = {
                reportName: documents.allotmentDocuments[index].reportName,
                documentName: file.name,
                filePath: data.filePath,
                uploadBy: currentUser,
                uploadDate: new Date().toISOString(),
                hasFile: true,
                isUploaded: true,
              };

              setDocuments(prev => ({
                ...prev,
                allotmentDocuments: prev.allotmentDocuments.map((doc, i) =>
                  i === index ? updatedDoc : doc
                )
              }));

              toast.success(`${documents.allotmentDocuments[index].reportName} uploaded successfully!`);
              
              // Trigger parent component refresh
              if (typeof window !== 'undefined') {
                window.dispatchEvent(new CustomEvent('donorUpdated', { detail: { donorId: donor._id } }));
              }
            }
          } catch (error) {
            console.error("Error uploading document:", error);
            toast.error("Failed to upload document. Please try again.");
          } finally {
            setUploading(prev => ({ ...prev, [`allotmentDocuments-${index}`]: false }));
          }
        }
      };
    }
    fileInputRefs.current[inputId].click();
  };

  const handleDelete = (index) => {
    if (confirm("Are you sure you want to delete this document?")) {
      setDocuments(prev => ({
        ...prev,
        allotmentDocuments: prev.allotmentDocuments.filter((_, i) => i !== index)
      }));
      toast.success("Document deleted successfully!");
    }
  };

  const handleRemarksChange = (field, value) => {
    setRemarks(prev => ({ ...prev, [field]: value }));
  };

  const handleSaveRemarks = async () => {
    setSavingRemarks(true);
    try {
      const token = localStorage.getItem("token");
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      
      const remarksData = {
        ...remarks,
        addedBy: user.fullName || user.name || "Unknown",
        addedAt: new Date().toISOString()
      };

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_END_POINT}/donors/${donor._id}/remarks`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ remarks: remarksData }),
      });

      const data = await response.json();
      if (data.success) {
        toast.success("Remarks saved successfully!");
        setIsEditingRemarks(false);
        // Trigger parent component refresh if callback provided
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('donorUpdated', { detail: { donorId: donor._id } }));
        }
      } else {
        toast.error(data.message || "Failed to save remarks");
      }
    } catch (error) {
      console.error("Error saving remarks:", error);
      toast.error("Failed to save remarks. Please try again.");
    } finally {
      setSavingRemarks(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Allotment Documents Section */}
      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <div className="mb-6 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">Allotment Documents</h3>
          <button
            onClick={handleAddNew}
            className="flex items-center gap-2 rounded-lg bg-purple-600 px-4 py-2 text-sm font-medium text-white hover:bg-purple-700"
          >
            <MdAdd className="h-4 w-4" />
            Add New
          </button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 font-medium text-gray-500">
              <tr>
                <th className="p-3">Report Name</th>
                <th className="p-3">Status</th>
                <th className="p-3">Upload By</th>
                <th className="p-3">Date</th>
                <th className="p-3">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {documents.allotmentDocuments.map((doc, index) => (
                <tr key={index}>
                  <td className="p-3 text-gray-900">{doc.reportName}</td>
                  <td className="p-3 text-gray-900">
                    {doc.isUploaded ? (
                      <span className="flex items-center gap-1 text-green-600">
                        <span className="h-2 w-2 rounded-full bg-green-500"></span>
                        Uploaded
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-orange-600">
                        <span className="h-2 w-2 rounded-full bg-orange-500"></span>
                        Pending
                      </span>
                    )}
                  </td>
                  <td className="p-3 text-gray-900">{doc.uploadBy || "-"}</td>
                  <td className="p-3 text-gray-900">
                    {doc.uploadDate ? dayjs(doc.uploadDate).format("DD MMM YYYY") : "-"}
                  </td>
                  <td className="p-3">
                    {doc.isUploaded ? (
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => {
                            if (doc.filePath) {
                              window.open(doc.filePath, "_blank");
                            }
                          }}
                          className="rounded-md p-1.5 text-blue-600 transition-colors hover:bg-blue-50 hover:text-blue-800"
                          title="View document"
                        >
                          <MdVisibility className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => handleDelete(index)}
                          className="rounded-md p-1.5 text-red-600 transition-colors hover:bg-red-50 hover:text-red-800"
                          title="Delete document"
                        >
                          <MdClose className="h-5 w-5" />
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => handleUpload(index)}
                        className="rounded-md p-1.5 text-purple-600 transition-colors hover:bg-purple-50 hover:text-purple-800"
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

      {/* Remarks Section */}
      <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900">Allotment Remarks</h3>
          {donor?.allotmentRemarks && !isEditingRemarks && (
            <button
              onClick={() => setIsEditingRemarks(true)}
              className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
            >
              <MdEdit className="h-4 w-4" />
              Edit Remarks
            </button>
          )}
        </div>

        <div className="p-6">
          {/* Display existing remarks if available and not editing */}
          {donor?.allotmentRemarks && !isEditingRemarks ? (
            <div className="space-y-6">
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                {donor.allotmentRemarks.oocyteRetrievalDate && (
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-gray-600 mb-1">Oocyte Retrieval Date</span>
                    <span className="text-gray-900 bg-gray-50 px-3 py-2 rounded-md">
                      {dayjs(donor.allotmentRemarks.oocyteRetrievalDate).format("DD MMM YYYY")}
                    </span>
                  </div>
                )}
                {donor.allotmentRemarks.numberOfOocytes && (
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-gray-600 mb-1">Number of Oocytes Retrieved</span>
                    <span className="text-gray-900 bg-gray-50 px-3 py-2 rounded-md">
                      {donor.allotmentRemarks.numberOfOocytes}
                    </span>
                  </div>
                )}
                {donor.allotmentRemarks.oocyteQuality && (
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-gray-600 mb-1">Oocyte Quality</span>
                    <span className="text-gray-900 bg-gray-50 px-3 py-2 rounded-md">
                      {donor.allotmentRemarks.oocyteQuality}
                    </span>
                  </div>
                )}
                {donor.allotmentRemarks.fertilizationOutcome && (
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-gray-600 mb-1">Fertilization Outcome</span>
                    <span className="text-gray-900 bg-gray-50 px-3 py-2 rounded-md">
                      {donor.allotmentRemarks.fertilizationOutcome}
                    </span>
                  </div>
                )}
                {donor.allotmentRemarks.remarksAddedBy && (
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-gray-600 mb-1">Added By</span>
                    <span className="text-gray-900 bg-gray-50 px-3 py-2 rounded-md">
                      {donor.allotmentRemarks.remarksAddedBy}
                    </span>
                  </div>
                )}
                {donor.allotmentRemarks.addedAt && (
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-gray-600 mb-1">Last Updated</span>
                    <span className="text-gray-900 bg-gray-50 px-3 py-2 rounded-md">
                      {dayjs(donor.allotmentRemarks.addedAt).format("DD MMM YYYY, HH:mm")}
                    </span>
                  </div>
                )}
              </div>
              {donor.allotmentRemarks.remarks && (
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-gray-600 mb-1">Additional Remarks</span>
                  <div className="text-gray-900 bg-gray-50 px-3 py-3 rounded-md">
                    {donor.allotmentRemarks.remarks}
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* Edit/Add form */
            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Oocyte Retrieval Date
                  </label>
                  <input
                    type="date"
                    value={remarks.oocyteRetrievalDate}
                    onChange={(e) => handleRemarksChange('oocyteRetrievalDate', e.target.value)}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Number of Oocytes Retrieved
                  </label>
                  <input
                    type="number"
                    value={remarks.numberOfOocytes}
                    onChange={(e) => handleRemarksChange('numberOfOocytes', e.target.value)}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    placeholder="Enter number"
                  />
                </div>
                
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Oocyte Quality
                  </label>
                  <input
                    type="text"
                    value={remarks.oocyteQuality}
                    onChange={(e) => handleRemarksChange('oocyteQuality', e.target.value)}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    placeholder="Enter quality details"
                  />
                </div>
                
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Fertilization Outcome
                  </label>
                  <input
                    type="text"
                    value={remarks.fertilizationOutcome}
                    onChange={(e) => handleRemarksChange('fertilizationOutcome', e.target.value)}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    placeholder="Enter outcome details"
                  />
                </div>
                
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Remarks Added By
                  </label>
                  <input
                    type="text"
                    value={remarks.remarksAddedBy}
                    onChange={(e) => handleRemarksChange('remarksAddedBy', e.target.value)}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    placeholder="Enter name"
                  />
                </div>
              </div>
              
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Additional Remarks
                </label>
                <textarea
                  value={remarks.remarks}
                  onChange={(e) => handleRemarksChange('remarks', e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="Enter additional remarks..."
                  rows="4"
                />
              </div>
              
              {/* Action Buttons */}
              <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                {isEditingRemarks && (
                  <button
                    onClick={() => setIsEditingRemarks(false)}
                    className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                )}
                <button
                  onClick={handleSaveRemarks}
                  disabled={savingRemarks}
                  className="flex items-center gap-2 rounded-lg bg-green-600 px-6 py-2 text-sm font-medium text-white hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {savingRemarks ? (
                    <>
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                      Saving...
                    </>
                  ) : (
                    <>
                      <MdEdit className="h-4 w-4" />
                      {donor?.allotmentRemarks ? "Update Remarks" : "Save Remarks"}
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Add Report Name Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-96 max-w-md rounded-lg bg-white p-6">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">
                Add New Document
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <MdClose className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Document Name *
                </label>
                <input
                  type="text"
                  value={reportName}
                  onChange={(e) => setReportName(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Enter document name"
                />
              </div>
            </div>

            <div className="mt-6 flex gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 rounded-lg border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={!reportName.trim()}
                className="flex-1 rounded-lg bg-purple-600 px-4 py-2 text-white hover:bg-purple-700 disabled:cursor-not-allowed disabled:opacity-50"
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