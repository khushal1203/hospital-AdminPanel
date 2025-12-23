import { useState } from "react";
import { MdEdit } from "react-icons/md";
import dayjs from "dayjs";
import EditDonorModal from "./EditDonorModal";

const InfoSection = ({ title, onEdit, children }) => (
  <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
    <div className="mb-6 flex items-center justify-between">
      <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
      <button
        onClick={onEdit}
        className="flex items-center gap-2 rounded-lg bg-gray-50 px-3 py-1.5 text-sm font-medium text-purple-600 hover:bg-purple-50"
      >
        <MdEdit className="h-4 w-4" />
        Edit
      </button>
    </div>
    <div className="grid grid-cols-1 gap-y-6 md:grid-cols-2 lg:grid-cols-4">
      {children}
    </div>
  </div>
);

const InfoItem = ({ label, value }) => (
  <div className="flex flex-col gap-1">
    <span className="text-xs font-medium uppercase text-gray-500">{label}</span>
    <span className="text-sm font-medium text-gray-900">{value || "-"}</span>
  </div>
);

export default function OverviewTab({ donor }) {
  const [donorData, setDonorData] = useState(donor);
  const [editModal, setEditModal] = useState({ isOpen: false, section: "" });

  const handleEdit = (section) => {
    setEditModal({ isOpen: true, section });
  };

  const handleSave = async (updatedData) => {
    try {
      const donorId = donor._id || donor.id;

      // Remove fields that shouldn't be updated or cause ObjectId issues
      const {
        _id,
        __v,
        createdAt,
        updatedAt,
        updatedBy,
        createdBy,
        ...cleanData
      } = updatedData;

      const response = await fetch(`/api/donors/${donorId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(cleanData),
      });

      if (response.ok) {
        const result = await response.json();
        setDonorData(result.data || updatedData);
      } else {
        throw new Error("Failed to update donor information");
      }
    } catch (error) {
      console.error("Error updating donor:", error);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Registration Info */}
      <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
        <p className="text-sm text-gray-600">
          Registered on:{" "}
          {donor.createdAt ? dayjs(donor.createdAt).format("DD MMM YYYY") : "-"}
        </p>
      </div>

      {/* Personal Information */}
      <InfoSection
        title="Personal Information"
        onEdit={() => handleEdit("Personal Information")}
      >
        <InfoItem label="Full Name" value={donorData.fullName} />
        <InfoItem label="Husband Name" value={donorData.husbandName} />
        <InfoItem label="Aadhaar Card Number" value={donorData.aadharNumber} />
        <InfoItem label="Gender" value={donorData.gender} />
        <InfoItem label="Marital Status" value={donorData.maritalStatus} />
        <InfoItem label="Religion" value={donorData.religion} />
        <InfoItem label="Blood Group" value={donorData.bloodGroup} />
        <InfoItem
          label="Date of Birth"
          value={
            donorData.dateOfBirth
              ? dayjs(donorData.dateOfBirth).format("DD MMM YYYY")
              : "-"
          }
        />
        <InfoItem label="Place of Birth" value={donorData.placeOfBirth} />
        <InfoItem
          label="Age"
          value={donorData.age ? `${donorData.age} Years` : "-"}
        />
        <InfoItem label="Cast" value={donorData.cast} />
      </InfoSection>

      {/* Contact Information */}
      <InfoSection
        title="Contact Information"
        onEdit={() => handleEdit("Contact Information")}
      >
        <InfoItem label="Phone Number" value={donorData.contactNumber} />
        <InfoItem label="Reference Name" value={donorData.referenceName} />
        <InfoItem label="Email" value={donorData.email} />
        <InfoItem label="Ref. Phone Number" value={donorData.referenceNumber} />
        <InfoItem label="Address" value={donorData.address} />
        <InfoItem label="City" value={donorData.city} />
        <InfoItem label="State" value={donorData.state} />
        <InfoItem label="Pin Code" value={donorData.pincode} />
      </InfoSection>

      {/* Physical Attributes */}
      <InfoSection
        title="Physical Attributes"
        onEdit={() => handleEdit("Physical Attributes")}
      >
        <InfoItem label="Height" value={donorData.height} />
        <InfoItem label="Skin Colour" value={donorData.skinColor} />
        <InfoItem
          label="Weight"
          value={donorData.weight ? `${donorData.weight} kg` : "-"}
        />
        <InfoItem label="Hair Colour" value={donorData.hairColor} />
        <InfoItem label="Eye Colour" value={donorData.eyeColor} />
      </InfoSection>

      {/* Professional Details */}
      <InfoSection
        title="Professional Details"
        onEdit={() => handleEdit("Professional Details")}
      >
        <InfoItem label="Donor Education" value={donorData.donorEducation} />
        <InfoItem label="Spouse Education" value={donorData.spouseEducation} />
        <InfoItem label="Donor Occupation" value={donorData.donorOccupation} />
        <InfoItem
          label="Spouse Occupation"
          value={donorData.spouseOccupation}
        />
        <InfoItem
          label="Monthly Income"
          value={donorData.monthlyIncome ? `₹${donorData.monthlyIncome}` : "-"}
        />
      </InfoSection>

      {/* Edit Modal */}
      <EditDonorModal
        isOpen={editModal.isOpen}
        onClose={() => setEditModal({ isOpen: false, section: "" })}
        donor={donorData}
        section={editModal.section}
        onSave={handleSave}
      />
    </div>
  );
}
