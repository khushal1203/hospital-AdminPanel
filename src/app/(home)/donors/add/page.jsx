"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import DonorTypeModal from "@/components/Donors/DonorTypeModal";
import { MdPersonAdd } from "react-icons/md";

export default function AddDonorPage() {
    const router = useRouter();
    const [showTypeModal, setShowTypeModal] = useState(true);
    const [selectedType, setSelectedType] = useState(null);

    const handleSelectType = (type) => {
        setShowTypeModal(false);
        setSelectedType(type);
        router.push(`/donors/add/${type}`);
    };

    return (
        <div className="flex min-h-[60vh] items-center justify-center">
            {!showTypeModal && (
                <div className="text-center">
                    <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
                        <MdPersonAdd className="h-10 w-10 text-primary" />
                    </div>
                    <h1 className="mb-2 text-3xl font-bold text-dark dark:text-white">
                        Add New Donor
                    </h1>
                    <p className="mb-6 text-gray-600 dark:text-gray-400">
                        Select the donor type to begin registration
                    </p>
                    <button
                        onClick={() => setShowTypeModal(true)}
                        className="rounded-lg bg-primary px-8 py-3 font-semibold text-white transition hover:bg-opacity-90"
                    >
                        Select Donor Type
                    </button>
                </div>
            )}

            {showTypeModal && (
                <DonorTypeModal
                    isOpen={showTypeModal}
                    onClose={() => {
                        setShowTypeModal(false);
                        router.back();
                    }}
                    onSelectType={handleSelectType}
                />
            )}
        </div>
    );
}
