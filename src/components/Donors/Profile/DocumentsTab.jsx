import { MdUpload, MdMoreHoriz, MdCheckCircle } from "react-icons/md";
import dayjs from "dayjs";

const DocumentRow = ({ name, status, uploadedBy, date, type }) => (
    <tr className="hover:bg-gray-50">
        <td className="p-4 font-medium text-gray-900">{name}</td>
        <td className="p-4">
            {status === 'uploaded' || status === 'signed' ? (
                <div className="h-8 w-12 rounded bg-gray-200"></div> /* Placeholder for thumbnail */
            ) : (
                <span className="text-gray-400 italic">No document</span>
            )}
        </td>
        <td className="p-4 text-gray-600">{uploadedBy || "-"}</td>
        <td className="p-4 text-gray-600">{date ? dayjs(date).format("DD MMM YYYY, h:mm a") : "-"}</td>
        <td className="p-4 text-right">
            {status === 'uploaded' || status === 'signed' ? (
                <button className="rounded-full p-2 hover:bg-gray-100">
                    <MdMoreHoriz className="h-5 w-5 text-gray-500" />
                </button>
            ) : (
                <button className="flex items-center gap-2 rounded-lg bg-purple-600 px-4 py-2 text-xs font-medium text-white hover:bg-purple-700">
                    <MdUpload className="h-4 w-4" />
                    Upload
                </button>
            )}
        </td>
    </tr>
);

export default function DocumentsTab({ donor }) {
    const documents = [
        { name: "Consent Form", status: donor.consentFormStatus, key: 'consent' },
        { name: "Affidavit Form", status: donor.affidavitStatus, key: 'affidavit' },
        // Mocking others as they are not explicitly in the main donor object top-level 
        // but maybe inside 'documents' array if implemented that way.
        // Based on controller, we have specific status fields.
        { name: "Insurance Documents", status: donor.insuranceStatus, key: 'insurance' },
    ];

    return (
        <div className="flex flex-col gap-6">
            <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
                <div className="border-b border-gray-200 px-6 py-4 flex justify-between items-center">
                    <h3 className="text-lg font-semibold text-gray-900">Donor Documents</h3>
                    <button className="flex items-center gap-2 text-sm font-medium text-purple-600 hover:text-purple-700">
                        <MdUpload className="h-4 w-4" />
                        Upload New
                    </button>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-gray-50 text-gray-500 font-medium">
                            <tr>
                                <th className="p-4">Reports Name</th>
                                <th className="p-4">Document</th>
                                <th className="p-4">Uploaded by</th>
                                <th className="p-4">Date</th>
                                <th className="p-4"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {documents.map((doc, index) => (
                                <DocumentRow
                                    key={index}
                                    name={doc.name}
                                    status={doc.status}
                                    uploadedBy="Amit Patel" // Mock data
                                    date={new Date()} // Mock data
                                />
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="rounded-lg border border-gray-200 bg-white shadow-sm p-6">
                <div className="flex items-center gap-4">
                    <div className="rounded-lg bg-blue-50 p-3">
                        <MdCheckCircle className="h-6 w-6 text-blue-500" />
                    </div>
                    <div>
                        <h4 className="font-semibold text-gray-900">Share Donor Documents</h4>
                        <p className="text-xs text-gray-500">Donor documents are now accessible</p>
                    </div>
                    <div className="ml-auto">
                        {/* Toggle Switch Placeholder */}
                        <div className="relative inline-flex h-6 w-11 items-center rounded-full bg-green-500">
                            <span className="translate-x-6 inline-block h-4 w-4 transform rounded-full bg-white transition" />
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
}
