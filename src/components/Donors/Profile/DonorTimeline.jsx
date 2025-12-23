import { MdCheckCircle, MdUpload, MdPrint } from "react-icons/md";
import dayjs from "dayjs";
import { useRef } from "react";
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

  return (
    <div className="relative flex gap-4 pb-8">
      {/* Connector Line */}
      {!isLast && (
        <div className="absolute left-[15px] top-6 h-full w-0.5 bg-gray-100"></div>
      )}

      {/* Icon */}
      <div className="relative z-10 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full border border-gray-100 bg-white">
        <div
          className={`h-2 w-2 rounded-full ${isCompleted ? "bg-purple-600" : "bg-gray-300"}`}
        ></div>
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
            const response = await fetch("/api/donors/upload-document", {
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
        reportName === "life insurance document"
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
      title: "Case Registered on",
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
      title: "OPU Process",
      status: getDocumentStatus("opu"),
      date: null,
    },
  ];

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
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
    </div>
  );
}
