import { MdCheckCircle, MdUpload, MdPrint } from "react-icons/md";
import dayjs from "dayjs";

const TimelineItem = ({ title, status, date, isLast }) => {
    const isCompleted = status === "completed" || status === "signed" || status === "uploaded" || status === "allotted";
    const isPending = status === "pending";

    // Status badge styling
    let statusBadge = null;
    if (status === 'uploaded' || status === 'signed') {
        statusBadge = <span className="text-[10px] font-bold text-green-600">Uploaded</span>
    } else if (status === 'pending') {
        statusBadge = <span className="text-[10px] font-bold text-orange-400">Pending</span>
    } else if (status === 'allotted') {
        statusBadge = <span className="text-[10px] font-bold text-green-600">Allotted</span>
    }

    return (
        <div className="relative flex gap-4 pb-8">
            {/* Connector Line */}
            {!isLast && (
                <div className="absolute left-[15px] top-6 h-full w-0.5 bg-gray-100"></div>
            )}

            {/* Icon */}
            <div className="relative z-10 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-white border border-gray-100">
                {/* Simple icons based on title for now */}
                <div className={`h-2 w-2 rounded-full ${isCompleted ? 'bg-purple-600' : 'bg-gray-300'}`}></div>
            </div>

            {/* Content */}
            <div className="flex flex-1 flex-col pt-1">
                <div className="flex items-center justify-between">
                    <h4 className="text-sm font-semibold text-gray-900">{title}</h4>
                    {status === 'pending' && ["Consent Form", "Affidavit Form", "Insurance Documents"].includes(title) && (
                        <button className="rounded-lg bg-purple-600 px-3 py-1 text-[10px] font-medium text-white hover:bg-purple-700">
                            Upload
                        </button>
                    )}
                    {/* Print button logic placeholder */}
                    {status === 'signed' && (
                        <button class="rounded-full p-1 text-gray-400 hover:text-gray-600">
                            <MdPrint className="h-4 w-4" />
                        </button>
                    )}
                </div>

                <div className="flex items-center gap-2 mt-1">
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
    // Construct timeline steps based on donor data
    const steps = [
        {
            title: "Case Registered on",
            status: "completed", // Always completed if profile exists
            date: donor.createdAt
        },
        {
            title: "Blood Report",
            status: donor.semenData?.bloodReportStatus === 'signed' ? 'uploaded' : 'pending',
            date: donor.updatedAt // Placeholder
        },
        {
            title: "Allotted Donor",
            status: donor.status === 'active' ? 'allotted' : 'pending',
            date: donor.updatedAt // Placeholder
        },
        {
            title: "Consent Form",
            status: donor.consentFormStatus,
            date: donor.updatedAt // Placeholder
        },
        {
            title: "Affidavit Form",
            status: donor.affidavitStatus,
            date: donor.updatedAt
        },
        {
            title: "Insurance Documents",
            status: donor.insuranceStatus,
            date: donor.updatedAt
        },
        {
            title: "OPU Process",
            status: "pending", // Not in schema explicitly yet?
            date: null
        }
    ];

    return (
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <h3 className="mb-6 text-lg font-semibold text-gray-900">Donor Case Timeline</h3>
            <div className="flex flex-col">
                {steps.map((step, index) => (
                    <TimelineItem
                        key={index}
                        {...step}
                        isLast={index === steps.length - 1}
                    />
                ))}
            </div>
        </div>
    );
}
