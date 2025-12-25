"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import DonorTypeModal from "@/components/Donors/DonorTypeModal";
import { MdPersonAdd, MdArrowBack } from "react-icons/md";

export default function AddDonorPage() {
  const router = useRouter();
  const [showTypeModal, setShowTypeModal] = useState(true);
  const [selectedType, setSelectedType] = useState(null);

  const handleSelectType = (type) => {
    router.push(`/donors/add/${type}`);
  };

  return (
    <div className="flex h-screen flex-col">
      {/* Header */}
      <div className="sticky top-0 z-10 flex-shrink-0 border-b border-gray-200 bg-white px-4 py-4 shadow-sm">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push('/donors/active')}
            className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-200 text-gray-500 hover:bg-gray-50 hover:text-purple-600"
          >
            <MdArrowBack className="h-4 w-4" />
          </button>
          <h1 className="text-xl font-bold text-gray-900 sm:text-2xl">
            Add New Donor
          </h1>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-1 items-center justify-center bg-gray-50 p-4">
        {!showTypeModal && (
          <div className="text-center">
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-purple-100">
              <MdPersonAdd className="h-10 w-10 text-purple-600" />
            </div>
            <h2 className="mb-2 text-2xl font-bold text-gray-900">
              Select Donor Type
            </h2>
            <p className="mb-6 text-gray-600">
              Choose the type of donor you want to register
            </p>
            <button
              onClick={() => setShowTypeModal(true)}
              className="rounded-lg px-8 py-3 font-semibold text-white transition hover:opacity-90"
              style={{ backgroundColor: '#402575' }}
            >
              Select Donor Type
            </button>
          </div>
        )}

        {showTypeModal && (
          <DonorTypeModal
            isOpen={showTypeModal}
            onClose={() => router.push('/donors/active')}
            onSelectType={handleSelectType}
          />
        )}
      </div>
    </div>
  );
}
