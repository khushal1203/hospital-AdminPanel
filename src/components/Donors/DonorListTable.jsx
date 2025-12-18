"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import dayjs from "dayjs";
import {
    MdCheckCircle,
    MdPending,
    MdChevronRight,
    MdMoreVert
} from "react-icons/md";

const StatusBadge = ({ status }) => {
    const isCompleted = status === "signed" || status === "uploaded";

    const getLabel = () => {
        if (status === "signed") return "Signed";
        if (status === "uploaded") return "Uploaded";
        return "Pending";
    };

    return (
        <div className={`flex w-fit items-center gap-1 rounded-full px-3 py-1 text-xs font-medium ${isCompleted
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

export default function DonorListTable({ donors }) {
    const [selectedDonors, setSelectedDonors] = useState([]);

    const toggleSelectAll = () => {
        if (selectedDonors.length === donors.length) {
            setSelectedDonors([]);
        } else {
            setSelectedDonors(donors.map(d => d._id));
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
        <div className="flex flex-col gap-4">
            <DonorTableToolbar />

            {(!donors || donors.length === 0) ? (
                <div className="rounded-lg border border-gray-200 bg-white p-8 text-center shadow-sm">
                    <p className="text-gray-500">No donors found.</p>
                </div>
            ) : (
                <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white shadow-sm">
                    <table className="w-full min-w-[1200px] table-auto text-left text-sm">
                        <thead className="bg-gray-50 text-gray-600 font-medium uppercase">
                            <tr>
                                <th className="p-4">
                                    <input
                                        type="checkbox"
                                        className="h-4 w-4 rounded border-gray-300"
                                        checked={donors.length > 0 && selectedDonors.length === donors.length}
                                        onChange={toggleSelectAll}
                                    />
                                </th>
                                <th className="p-4">Donor ID</th>
                                <th className="p-4">Registration Date</th>
                                <th className="p-4">Donor Name</th>
                                <th className="p-4">Next Appointment</th>
                                <th className="p-4">Aadhar Number</th>
                                <th className="p-4">Donor Consent<br />Form Status</th>
                                <th className="p-4">Affidavit Status</th>
                                <th className="p-4">Follicular Scan<br />Status</th>
                                <th className="p-4">Insurance Status</th>
                                <th className="p-4">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {donors.map((donor) => (
                                <tr key={donor._id} className="hover:bg-gray-50">
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
                                                    {/* Placeholder logic for tags until backend provides them */}
                                                    {donor.status === 'active' && !donor.tag && <Tag text="ALLOTTED" />}
                                                </span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-4 text-gray-600">
                                        {donor.nextAppointment ? dayjs(donor.nextAppointment).format("DD MMM, YYYY") : "-"}
                                    </td>
                                    <td className="p-4 text-gray-600">{donor.aadharNumber || "-"}</td>
                                    <td className="p-4"><StatusBadge status={donor.consentFormStatus} /></td>
                                    <td className="p-4"><StatusBadge status={donor.affidavitStatus} /></td>
                                    <td className="p-4"><StatusBadge status={donor.follicularScanStatus} /></td>
                                    <td className="p-4"><StatusBadge status={donor.insuranceStatus} /></td>
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
            )}
        </div>
    );
}
