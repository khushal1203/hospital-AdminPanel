import { MdCheckCircle, MdUpload, MdPrint, MdDescription, MdComment, MdClose, MdPersonAdd, MdLocalHospital, MdAssignment, MdSecurity, MdHealthAndSafety, MdMedicalServices } from "react-icons/md";
import dayjs from "dayjs";
import { useRef, useState, useEffect } from "react";
import { toast } from "@/utils/toast";

const TimelineItem = ({
  title,
  status,
  date,
  isLast,
  donor,
  onDocumentUpload,
}) => {
  const isCompleted =
    status === "completed" ||
    status === "signed" ||
    status === "uploaded" ||
    status === "allotted";

  // Status badge styling
  let statusBadge = null;
  if (status === "uploaded" || status === "signed") {
    statusBadge = (
      <span className="text-[10px] font-bold text-green-600">Uploaded</span>
    );
  } else if (status === "pending") {
    statusBadge = (
      <span className="text-[10px] font-bold text-orange-400">Pending</span>
    );
  } else if (status === "allotted") {
    statusBadge = (
      <span className="text-[10px] font-bold text-green-600">Allotted</span>
    );
  } else if (status === "completed") {
    statusBadge = (
      <span className="text-[10px] font-bold text-green-600">Completed</span>
    );
  }

  // Special icon for different timeline items
  const getTimelineIcon = () => {
    if (title === "Case Registered") {
      return <MdPersonAdd className={`h-3 w-3 ${isCompleted ? "text-purple-600" : "text-gray-400"}`} />;
    }
    if (title === "Blood Report") {
      return <MdMedicalServices className={`h-3 w-3 ${isCompleted ? "text-purple-600" : "text-gray-400"}`} />;
    }
    if (title === "Allotted Donor") {
      return <MdLocalHospital className={`h-3 w-3 ${isCompleted ? "text-purple-600" : "text-gray-400"}`} />;
    }
    if (title === "Consent Form") {
      return <MdAssignment className={`h-3 w-3 ${isCompleted ? "text-purple-600" : "text-gray-400"}`} />;
    }
    if (title === "Affidavit Form") {
      return <MdSecurity className={`h-3 w-3 ${isCompleted ? "text-purple-600" : "text-gray-400"}`} />;
    }
    if (title === "Insurance Documents") {
      return <MdHealthAndSafety className={`h-3 w-3 ${isCompleted ? "text-purple-600" : "text-gray-400"}`} />;
    }
    if (title === "Allotment Documents") {
      return <MdDescription className={`h-3 w-3 ${isCompleted ? "text-purple-600" : "text-gray-400"}`} />;
    }
    if (title === "Allotment Remarks") {
      return <MdComment className={`h-3 w-3 ${isCompleted ? "text-purple-600" : "text-gray-400"}`} />;
    }
    if (title === "OPU Process") {
      return <MdMedicalServices className={`h-3 w-3 ${isCompleted ? "text-purple-600" : "text-gray-400"}`} />;
    }
    return (
      <div
        className={`h-2 w-2 rounded-full ${isCompleted ? "bg-purple-600" : "bg-gray-300"}`}
      ></div>
    );
  };

  return (
    <div className="relative flex gap-4 pb-8">
      {/* Connector Line */}
      {!isLast && (
        <div className="absolute left-[15px] top-6 h-full w-0.5 bg-gray-100"></div>
      )}

      {/* Icon */}
      <div className="relative z-10 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full border border-gray-100 bg-white">
        {getTimelineIcon()}
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col pt-1">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-semibold text-gray-900">{title}</h4>
          {status === "pending" &&
            [
              "Consent Form",
              "Affidavit Form",
              "Insurance Documents",
              "Blood Report",
              "OPU Process",
            ].includes(title) && (
              <button
                onClick={() => onDocumentUpload(title)}
                className="rounded-lg bg-purple-600 px-3 py-1 text-[10px] font-medium text-white hover:bg-purple-700"
              >
                Upload
              </button>
            )}
        </div>

        <div className="mt-1 flex items-center gap-2">
          {statusBadge}
          {date && (
            <span className="text-[10px] text-gray-400">
              • {dayjs(date).format("DD MMM YYYY")}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default function DonorTimeline({ donor }) {
  const fileInputRefs = useRef({});
  const [showCaseDoneModal, setShowCaseDoneModal] = useState(false);
  const [markingCaseDone, setMarkingCaseDone] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  // Listen for donor updates
  useEffect(() => {
    const handleDonorUpdate = (event) => {
      if (event.detail.donorId === donor._id) {
        setRefreshKey(prev => prev + 1);
      }
    };

    window.addEventListener('donorUpdated', handleDonorUpdate);
    return () => window.removeEventListener('donorUpdated', handleDonorUpdate);
  }, [donor._id]);

  const handleMarkCaseDone = async () => {
    setMarkingCaseDone(true);
    try {
      const token = localStorage.getItem("token");
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_END_POINT}/donors/${donor._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ 
          isCaseDone: true,
          caseDoneDate: new Date().toISOString(),
          caseDoneBy: user._id || user.id
        }),
      });

      const data = await response.json();
      if (data.success) {
        toast.success("Case marked as done successfully!");
        setShowCaseDoneModal(false);
        window.location.reload();
      } else {
        toast.error(data.message || "Failed to mark case as done");
      }
    } catch (error) {
      console.error("Error marking case as done:", error);
      toast.error("Failed to mark case as done. Please try again.");
    } finally {
      setMarkingCaseDone(false);
    }
  };

  const handleDocumentUpload = async (documentTitle) => {
    const docTypeMap = {
      "Consent Form": { sectionKey: "donorDocuments", index: 0 },
      "Affidavit Form": { sectionKey: "donorDocuments", index: 1 },
      "Blood Report": { sectionKey: "reports", index: 2 },
      "Insurance Documents": { sectionKey: "otherDocuments", index: 5 },
      "OPU Process": { sectionKey: "reports", index: 3 },
    };

    const docInfo = docTypeMap[documentTitle];
    const inputId = `timeline-${documentTitle}`;

    if (!fileInputRefs.current[inputId]) {
      fileInputRefs.current[inputId] = document.createElement("input");
      fileInputRefs.current[inputId].type = "file";
      fileInputRefs.current[inputId].onchange = async (e) => {
        const file = e.target.files[0];
        if (file) {
          const formData = new FormData();
          formData.append("document", file);
          formData.append("donorId", donor._id);
          formData.append("sectionKey", docInfo.sectionKey);
          formData.append("index", docInfo.index);
          formData.append("reportName", documentTitle);

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
            if (data.success) {
              toast.success(`${documentTitle} uploaded successfully!`);
              window.location.reload();
            } else {
              toast.error("Failed to upload document");
            }
          } catch (error) {
            toast.error("Failed to upload document");
          }
        }
      };
    }
    fileInputRefs.current[inputId].click();
  };
  // Helper function to check allotment document status
  const getAllotmentDocumentStatus = () => {
    if (donor?.documents?.allotmentDocuments) {
      const hasUploadedDocs = donor.documents.allotmentDocuments.some(doc => doc.hasFile === true);
      return hasUploadedDocs ? "uploaded" : "pending";
    }
    return "pending";
  };

  // Helper function to check remarks status
  const getRemarksStatus = () => {
    return donor?.allotmentRemarks ? "completed" : "pending";
  };

  // Helper function to check if document has file uploaded (same logic as DonorListTable)
  const getDocumentStatus = (docType) => {
    if (!donor?.documents) return "pending";

    // Check in all document arrays
    const allDocs = [
      ...(donor.documents.donorDocuments || []),
      ...(donor.documents.reports || []),
      ...(donor.documents.otherDocuments || []),
    ];

    // Find specific document type by exact reportName match
    const doc = allDocs.find((d) => {
      if (!d.reportName) return false;

      const reportName = d.reportName.toLowerCase();
      const searchTerm = docType.toLowerCase();

      // Match specific document types by exact reportName
      if (searchTerm === "consent" && reportName === "consent form")
        return true;
      if (searchTerm === "affidavit" && reportName === "affidavit form")
        return true;
      if (searchTerm === "blood" && reportName === "blood report") return true;
      if (
        searchTerm === "insurance" &&
        reportName === "insurance documents"
      )
        return true;
      if (searchTerm === "opu" && reportName === "opu process") return true;

      return false;
    });

    // Return uploaded only if specific document has hasFile true
    if (doc && doc.hasFile === true) {
      return "uploaded";
    }

    return "pending";
  };

  // Construct timeline steps based on donor data
  const steps = [
    {
      title: "Case Registered",
      status: "completed",
      date: donor.createdAt,
    },
    {
      title: "Blood Report",
      status: getDocumentStatus("blood"),
      date: donor.updatedAt,
    },
    {
      title: "Allotted Donor",
      status: donor.status === "active" ? "allotted" : "pending",
      date: donor.updatedAt,
    },
    {
      title: "Consent Form",
      status: getDocumentStatus("consent"),
      date: donor.updatedAt,
    },
    {
      title: "Affidavit Form",
      status: getDocumentStatus("affidavit"),
      date: donor.updatedAt,
    },
    {
      title: "Insurance Documents",
      status: getDocumentStatus("insurance"),
      date: donor.updatedAt,
    },
    {
      title: "Allotment Documents",
      status: getAllotmentDocumentStatus(),
      date: donor.updatedAt,
    },
    {
      title: "Allotment Remarks",
      status: getRemarksStatus(),
      date: donor?.allotmentRemarks?.addedAt || null,
    },
    {
      title: "OPU Process",
      status: getDocumentStatus("opu"),
      date: null,
    },
  ];

  // Check if all steps are completed
  const areAllStepsCompleted = () => {
    return steps.every(step => 
      step.status === "completed" || 
      step.status === "uploaded" || 
      step.status === "allotted"
    );
  };

  return (
    <div key={refreshKey} className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
      <h3 className="mb-6 text-lg font-semibold text-gray-900">
        Donor Case Timeline
      </h3>
      <div className="flex flex-col">
        {steps.map((step, index) => (
          <TimelineItem
            key={index}
            {...step}
            donor={donor}
            onDocumentUpload={handleDocumentUpload}
            isLast={index === steps.length - 1}
          />
        ))}
      </div>
      
      {/* Case Done Button */}
      {areAllStepsCompleted() && !donor.isCaseDone && (
        <div className="mt-6 pt-4 border-t border-gray-100">
          <button
            onClick={() => setShowCaseDoneModal(true)}
            className="w-full rounded-lg bg-green-600 px-4 py-3 text-sm font-medium text-white hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
          >
            <MdCheckCircle className="h-4 w-4" />
            Case Done
          </button>
        </div>
      )}
      
      {/* Case Done Status */}
      {donor.isCaseDone && (
        <div className="mt-6 pt-4 border-t border-gray-100">
          <div className="flex items-center justify-center gap-2 text-green-600">
            <MdCheckCircle className="h-5 w-5" />
            <span className="text-sm font-medium">Case Completed</span>
          </div>
          {donor.caseDoneDate && (
            <p className="text-center text-xs text-gray-500 mt-1">
              {dayjs(donor.caseDoneDate).format("DD MMM YYYY, HH:mm")}
            </p>
          )}
        </div>
      )}

      {/* Case Done Confirmation Modal */}
      {showCaseDoneModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-96 max-w-md rounded-lg bg-white p-6">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">
                Mark Case as Done?
              </h3>
              <button
                onClick={() => setShowCaseDoneModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <MdClose className="h-5 w-5" />
              </button>
            </div>

            <p className="text-sm text-gray-600 mb-6">
              Your action will be saved, and you can always check the history in the Alloted Donors tab.
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => setShowCaseDoneModal(false)}
                className="flex-1 rounded-lg border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleMarkCaseDone}
                disabled={markingCaseDone}
                className="flex-1 rounded-lg bg-green-600 px-4 py-2 text-white hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {markingCaseDone ? "Processing..." : "Yes, Done"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
