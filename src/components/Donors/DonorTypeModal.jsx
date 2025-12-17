"use client";

import { MdClose } from "react-icons/md";

export default function DonorTypeModal({ isOpen, onClose, onSelectType }) {
    if (!isOpen) return null;

    const donorTypes = [
        {
            type: "oocyte",
            title: "Oocyte Donor",
            description: "Register a new oocyte donor",
            color: "from-purple-500 to-purple-600",
        },
        {
            type: "semen",
            title: "Semen Donor",
            description: "Register a new semen donor",
            color: "from-blue-500 to-blue-600",
        },
    ];

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-2xl dark:bg-gray-dark">
                {/* Header */}
                <div className="mb-6 flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-dark dark:text-white">
                        Select Donor Type
                    </h2>
                    <button
                        onClick={onClose}
                        className="rounded-lg p-2 text-gray-500 transition hover:bg-gray-100 dark:hover:bg-gray-800"
                    >
                        <MdClose className="h-6 w-6" />
                    </button>
                </div>

                {/* Donor Type Options */}
                <div className="space-y-4">
                    {donorTypes.map((donor) => (
                        <button
                            key={donor.type}
                            onClick={() => onSelectType(donor.type)}
                            className="group w-full rounded-xl bg-gray-50 p-6 text-left transition hover:shadow-lg dark:bg-gray-800"
                        >
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="text-xl font-semibold text-dark dark:text-white">
                                        {donor.title}
                                    </h3>
                                    <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                                        {donor.description}
                                    </p>
                                </div>
                                <svg
                                    className="h-6 w-6 text-gray-400 transition group-hover:translate-x-1 group-hover:text-primary"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M9 5l7 7-7 7"
                                    />
                                </svg>
                            </div>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}
