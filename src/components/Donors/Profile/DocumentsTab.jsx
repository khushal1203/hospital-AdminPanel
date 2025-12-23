import { MdAdd, MdVisibility, MdClose, MdCloudUpload } from "react-icons/md";
import dayjs from "dayjs";
import { useState, useEffect, useRef } from "react";
import { toast } from "@/utils/toast";

export default function DocumentsTab({ donor }) {
  const [showModal, setShowModal] = useState(false);
  const [currentSection, setCurrentSection] = useState("");
  const [reportName, setReportName] = useState("");
  const [currentUser, setCurrentUser] = useState("");
  const fileInputRefs = useRef({});

  const defaultDocuments = {
    donorDocuments: [
      {
        reportName: "Consent Form",
        documentName: null,
        uploadBy: null,
        uploadDate: null,
        hasFile: false,
        isUploaded: false,
      },
      {
        reportName: "Affidavit Form",
        documentName: null,
        uploadBy: null,
        uploadDate: null,
        hasFile: false,
        isUploaded: false,
      },
    ],
    reports: [
      {
        reportName: "OvaCare Evaluation Report",
        documentName: null,
        uploadBy: null,
        uploadDate: null,
        hasFile: false,
        isUploaded: false,
      },
      {
        reportName: "Lumine Report",
        documentName: null,
        uploadBy: null,
        uploadDate: null,
        hasFile: false,
        isUploaded: false,
      },
      {
        reportName: "Blood Report",
        documentName: null,
        uploadBy: null,
        uploadDate: null,
        hasFile: false,
        isUploaded: false,
      },
      {
        reportName: "OPU Process",
        documentName: null,
        uploadBy: null,
        uploadDate: null,
        hasFile: false,
        isUploaded: false,
      },
    ],
    otherDocuments: [
      {
        reportName: "Aadhaar Card Front",
        documentName: null,
        uploadBy: null,
        uploadDate: null,
        hasFile: false,
        isUploaded: false,
      },
      {
        reportName: "Aadhaar Card Back",
        documentName: null,
        uploadBy: null,
        uploadDate: null,
        hasFile: false,
        isUploaded: false,
      },
      {
        reportName: "Husband/Nominee Aadhaar Card Front",
        documentName: null,
        uploadBy: null,
        uploadDate: null,
        hasFile: false,
        isUploaded: false,
      },
      {
        reportName: "Husband/Nominee Aadhaar Card Back",
        documentName: null,
        uploadBy: null,
        uploadDate: null,
        hasFile: false,
        isUploaded: false,
      },
      {
        reportName: "Health Insurance Document",
        documentName: null,
        uploadBy: null,
        uploadDate: null,
        hasFile: false,
        isUploaded: false,
      },
      {
        reportName: "Life Insurance Document",
        documentName: null,
        uploadBy: null,
        uploadDate: null,
        hasFile: false,
        isUploaded: false,
      },
    ],
  };

  const [documents, setDocuments] = useState(defaultDocuments);
  const [uploading, setUploading] = useState({});

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      const userData = JSON.parse(user);
      setCurrentUser(userData.name || userData.fullName || "Unknown User");
    }

    // Load documents from database and localStorage
    const uploadedDocs = JSON.parse(
      localStorage.getItem("uploadedDocs") || "{}",
    );

    const finalDocs = {
      donorDocuments: [],
      reports: [],
      otherDocuments: [],
    };

    // Merge database documents with defaults and localStorage
    ["donorDocuments", "reports", "otherDocuments"].forEach((section) => {
      const dbDocs = donor.documents?.[section] || [];
      const defaults = defaultDocuments[section];

      finalDocs[section] = defaults.map((defaultDoc, index) => {
        const docKey = `${donor._id}-${section}-${index}`;

        // Priority: localStorage > database > default
        if (uploadedDocs[docKey]) {
          return uploadedDocs[docKey];
        }

        const dbDoc = dbDocs.find(
          (doc) => doc.reportName === defaultDoc.reportName,
        );
        if (dbDoc) {
          return {
            ...dbDoc,
            isUploaded: dbDoc.hasFile || dbDoc.isUploaded || false,
          };
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
    setReportName("");
  };

  const handleSubmit = () => {
    if (!reportName.trim()) return;

    const newDoc = {
      reportName: reportName.trim(),
      documentName: null,
      uploadBy: null,
      uploadDate: new Date().toISOString(),
      hasFile: false,
    };

    const sectionKey =
      currentSection === "donor"
        ? "donorDocuments"
        : currentSection === "reports"
          ? "reports"
          : "otherDocuments";

    setDocuments((prev) => ({
      ...prev,
      [sectionKey]: [...prev[sectionKey], newDoc],
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
        isUploaded: false,
      };

      // Update state immediately
      setDocuments((prev) => ({
        ...prev,
        [sectionKey]: prev[sectionKey].map((doc, i) =>
          i === index ? updatedDoc : doc,
        ),
      }));

      // Remove from localStorage
      const uploadedDocs = JSON.parse(
        localStorage.getItem("uploadedDocs") || "{}",
      );
      const docKey = `${donor._id}-${sectionKey}-${index}`;
      delete uploadedDocs[docKey];
      localStorage.setItem("uploadedDocs", JSON.stringify(uploadedDocs));

      // Call API to delete document from server
      const token = localStorage.getItem("token");
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_END_POINT}/donors/delete-document`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          donorId: donor._id,
          sectionKey,
          index,
        }),
      });

      if (response.ok) {
        toast.success("Document deleted successfully!");
      } else {
        toast.error("Failed to delete document from server");
      }
    } catch (error) {
      console.error("Error deleting document:", error);
      toast.error("Failed to delete document");
    }
  };

  const handleUpload = async (sectionKey, index) => {
    const inputId = `${sectionKey}-${index}`;
    if (!fileInputRefs.current[inputId]) {
      fileInputRefs.current[inputId] = document.createElement("input");
      fileInputRefs.current[inputId].type = "file";
      fileInputRefs.current[inputId].onchange = async (e) => {
        const file = e.target.files[0];
        if (file) {
          setUploading((prev) => ({
            ...prev,
            [`${sectionKey}-${index}`]: true,
          }));

          const formData = new FormData();
          formData.append("document", file);
          formData.append("donorId", donor._id);
          formData.append("sectionKey", sectionKey);
          console.log("Upload params:", {
            sectionKey,
            index,
            reportName: documents[sectionKey][index].reportName,
          });
          formData.append("index", index);
          formData.append(
            "reportName",
            documents[sectionKey][index].reportName,
          );

          try {
            const token = localStorage.getItem("token");
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_END_POINT}/donors/upload-document`, {
              method: "POST",
              headers: {
                Authorization: `Bearer ${token}`,
              },
              body: formData,
            });

            const data = await response.json();
            console.log("Upload response:", data);
            if (data.success) {
              const updatedDoc = {
                reportName: documents[sectionKey][index].reportName,
                documentName: file.name,
                filePath: data.filePath,
                uploadBy: currentUser,
                uploadDate: new Date().toISOString(),
                hasFile: true,
                isUploaded: true,
              };

              // Update state
              setDocuments((prev) => ({
                ...prev,
                [sectionKey]: prev[sectionKey].map((doc, i) =>
                  i === index ? updatedDoc : doc,
                ),
              }));

              // Save to localStorage for persistence
              const uploadedDocs = JSON.parse(
                localStorage.getItem("uploadedDocs") || "{}",
              );
              const docKey = `${donor._id}-${sectionKey}-${index}`;
              uploadedDocs[docKey] = updatedDoc;
              localStorage.setItem(
                "uploadedDocs",
                JSON.stringify(uploadedDocs),
              );

              // Show success toast
              toast.success(
                `${documents[sectionKey][index].reportName} uploaded successfully!`,
              );
            }
          } catch (error) {
            console.error("Error uploading document:", error);
            console.error("Upload error details:", error.message);
            toast.error("Failed to upload document. Please try again.");
          } finally {
            setUploading((prev) => ({
              ...prev,
              [`${sectionKey}-${index}`]: false,
            }));
          }
        }
      };
    }
    fileInputRefs.current[inputId].click();
  };

  const DocumentSection = ({ title, docs, type }) => (
    <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
      <div className="mb-6 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        <button
          onClick={() => handleAddNew(type)}
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
            {docs.map((doc, index) => (
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
                  {doc.uploadDate
                    ? dayjs(doc.uploadDate).format("DD MMM YYYY")
                    : "-"}
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
                        onClick={() =>
                          handleDelete(
                            type === "donor"
                              ? "donorDocuments"
                              : type === "reports"
                                ? "reports"
                                : "otherDocuments",
                            index,
                          )
                        }
                        className="rounded-md p-1.5 text-red-600 transition-colors hover:bg-red-50 hover:text-red-800"
                        title="Delete document"
                      >
                        <MdClose className="h-5 w-5" />
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => {
                        const sectionKey =
                          type === "donor"
                            ? "donorDocuments"
                            : type === "reports"
                              ? "reports"
                              : "otherDocuments";
                        handleUpload(sectionKey, index);
                      }}
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-96 max-w-md rounded-lg bg-white p-6">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">
                Add New Report
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
                  Report Name *
                </label>
                <input
                  type="text"
                  value={reportName}
                  onChange={(e) => setReportName(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Enter report name"
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
