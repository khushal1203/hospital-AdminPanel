"use client";

import { MdClose, MdPerson, MdScience } from "react-icons/md";

export default function DonorTypeModal({ isOpen, onClose, onSelectType }) {
  if (!isOpen) return null;

  const donorTypes = [
    {
      type: "oocyte",
      title: "Oocyte Donor",
      description: "Register a new oocyte donor for egg donation",
      icon: MdPerson,
      color: "from-purple-500 to-purple-600",
      bgColor: "bg-purple-50",
      iconColor: "text-purple-600",
    },
    {
      type: "semen",
      title: "Semen Donor",
      description: "Register a new semen donor for sperm donation",
      icon: MdScience,
      color: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-50",
      iconColor: "text-blue-600",
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              Select Donor Type
            </h2>
            <p className="mt-1 text-sm text-gray-600">
              Choose the type of donor you want to register
            </p>
          </div>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-600"
          >
            <MdClose className="h-5 w-5" />
          </button>
        </div>

        {/* Donor Type Options */}
        <div className="space-y-4">
          {donorTypes.map((donor) => {
            const IconComponent = donor.icon;
            return (
              <button
                key={donor.type}
                onClick={() => onSelectType(donor.type)}
                className="group w-full rounded-xl border border-gray-200 bg-white p-6 text-left transition-all hover:border-gray-300 hover:shadow-md"
              >
                <div className="flex items-center gap-4">
                  <div className={`flex h-12 w-12 items-center justify-center rounded-full ${donor.bgColor}`}>
                    <IconComponent className={`h-6 w-6 ${donor.iconColor}`} />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {donor.title}
                    </h3>
                    <p className="mt-1 text-sm text-gray-600">
                      {donor.description}
                    </p>
                  </div>
                  <svg
                    className="h-5 w-5 text-gray-400 transition-transform group-hover:translate-x-1 group-hover:text-gray-600"
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
            );
          })}
        </div>

        {/* Footer */}
        <div className="mt-6 text-center">
          <p className="text-xs text-gray-500">
            Select the appropriate donor type to continue with registration
          </p>
        </div>
      </div>
    </div>
  );
}
