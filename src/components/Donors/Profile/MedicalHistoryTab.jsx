import { useState } from "react";
import { MdEdit, MdAdd, MdDelete } from "react-icons/md";
import dayjs from "dayjs";
import EditMedicalModal from "./EditMedicalModal";
import AddFollicularScanModal from "./AddFollicularScanModal";

const Section = ({ title, onEdit, children, expanded = true }) => {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
      <div className="mb-6 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        {onEdit && (
          <button
            onClick={onEdit}
            className="flex items-center gap-2 rounded-lg bg-gray-50 px-3 py-1.5 text-sm font-medium text-purple-600 hover:bg-purple-50"
          >
            <MdEdit className="h-4 w-4" />
            Edit
          </button>
        )}
      </div>
      <div className="grid grid-cols-1 gap-y-6 md:grid-cols-2 lg:grid-cols-4">
        {children}
      </div>
    </div>
  );
};

const InfoItem = ({ label, value }) => (
  <div className="flex flex-col gap-1">
    <span className="text-xs font-medium uppercase text-gray-500">{label}</span>
    <span className="text-sm font-medium text-gray-900">{value || "-"}</span>
  </div>
);

const BooleanItem = ({ label, value, reason }) => (
  <div className="col-span-full border-b border-gray-100 pb-4 last:border-0 last:pb-0">
    <div className="mb-2 flex items-center gap-4">
      <span className="text-sm font-semibold text-gray-900">{label}</span>
      <span
        className={`rounded px-2 py-0.5 text-xs font-medium ${value ? "bg-red-100 text-red-700" : "bg-gray-100 text-gray-700"}`}
      >
        {value ? "Yes" : "No"}
      </span>
    </div>
    {reason && (
      <div className="text-xs text-gray-500">
        <span className="font-medium">Reason:</span> {reason}
      </div>
    )}
  </div>
);

export default function MedicalHistoryTab({ donor }) {
  const [donorData, setDonorData] = useState(donor);
  const [editModal, setEditModal] = useState({ isOpen: false, section: "" });
  const [scanModal, setScanModal] = useState(false);

  const follicular = donorData.follicularDetails || {};
  const obstetric = donorData.obstetricHistory || {};
  const physical = donorData.physicalExamination || {};
  const follicularScans = donorData.follicularDetails?.scans || [];
  
  // Check if we have individual follicular fields from the add form
  const hasIndividualFollicularData = donorData.follicularDetails?.lmpDate || donorData.follicularDetails?.lmpDay || donorData.follicularDetails?.etValue || donorData.follicularDetails?.rightOvary || donorData.follicularDetails?.leftOvary;
  
  // Create a combined follicular data array
  const combinedFollicularData = [...follicularScans];
  if (hasIndividualFollicularData) {
    combinedFollicularData.unshift({
      scanDate: donorData.follicularDetails?.lmpDate,
      lmpDay: donorData.follicularDetails?.lmpDay,
      etValue: donorData.follicularDetails?.etValue,
      rightOvary: donorData.follicularDetails?.rightOvary,
      leftOvary: donorData.follicularDetails?.leftOvary
    });
  }

  const handleEdit = (section) => {
    setEditModal({ isOpen: true, section });
  };

  const handleSave = async (updatedData) => {
    try {
      const donorId = donorData._id || donorData.id;

      const {
        _id,
        __v,
        createdAt,
        updatedAt,
        updatedBy,
        createdBy,
        ...cleanData
      } = updatedData;

      // If editing Follicular Details, merge with existing follicularDetails
      let dataToSave;
      if (editModal.section === "Follicular Details") {
        dataToSave = {
          follicularDetails: {
            ...donorData.follicularDetails,
            ...cleanData,
            // Always preserve the scans array
            scans: donorData.follicularDetails?.scans || []
          }
        };
      } else {
        // For other sections, preserve follicularDetails
        dataToSave = {
          ...cleanData,
          follicularDetails: donorData.follicularDetails || {}
        };
      }


      const token = localStorage.getItem("token");
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_END_POINT}/donors/${donorId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(dataToSave),
      });

      if (response.ok) {
        const result = await response.json();
        setDonorData(result.donor || updatedData);
      } else {
        throw new Error("Failed to update medical history");
      }
    } catch (error) {
      console.error("Error updating medical history:", error);
    }
  };

  const handleAddScan = async (scanData) => {
    try {
      const donorId = donorData._id || donorData.id;
      const currentFollicularDetails = donorData.follicularDetails || {};
      const currentScans = currentFollicularDetails.scans || [];
      const updatedScans = [...currentScans, scanData];

      const dataToSend = { 
        follicularDetails: {
          ...currentFollicularDetails,
          scans: updatedScans
        }
      };
      const token = localStorage.getItem("token");
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_END_POINT}/donors/${donorId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(dataToSend),
      });

      if (response.ok) {
        const result = await response.json();
        setDonorData(result.donor);
      } else {
        throw new Error("Failed to add scan");
      }
    } catch (error) {
      console.error("Error adding scan:", error);
    }
  };

  const handleDeleteScan = async (index) => {
    try {
      const donorId = donorData._id || donorData.id;
      const currentFollicularDetails = donorData.follicularDetails || {};
      const currentScans = currentFollicularDetails.scans || [];
      const updatedScans = currentScans.filter((_, i) => i !== index);

      const dataToSend = { 
        follicularDetails: {
          ...currentFollicularDetails,
          scans: updatedScans
        }
      };

      const token = localStorage.getItem("token");
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_END_POINT}/donors/${donorId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(dataToSend),
      });

      if (response.ok) {
        const result = await response.json();
        setDonorData(result.donor);
      } else {
        throw new Error("Failed to delete scan");
      }
    } catch (error) {
      console.error("Error deleting scan:", error);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <Section
        title="Follicular Details"
        onEdit={() => handleEdit("Follicular Details")}
      >
        <div className="col-span-full overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 font-medium text-gray-500">
              <tr>
                <th className="p-3">Date</th>
                <th className="p-3">Day of LMP</th>
                <th className="p-3">ET</th>
                <th className="p-3">Right Ovary</th>
                <th className="p-3">Left Ovary</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {combinedFollicularData.length > 0 ? (
                combinedFollicularData.map((scan, index) => (
                  <tr key={index}>
                    <td className="p-3 text-gray-900">
                      {scan.scanDate
                        ? dayjs(scan.scanDate).format("DD MMM YYYY")
                        : "-"}
                    </td>
                    <td className="p-3 text-gray-900">{scan.lmpDay || "-"}</td>
                    <td className="p-3 text-gray-900">{scan.etValue || "-"}</td>
                    <td className="p-3 text-gray-900">
                      {scan.rightOvary || "-"}
                    </td>
                    <td className="p-3 text-gray-900">
                      {scan.leftOvary || "-"}
                    </td>
                    <td className="p-3">
                      {index > 0 || !hasIndividualFollicularData ? (
                        <button
                          onClick={() => handleDeleteScan(index - (hasIndividualFollicularData ? 1 : 0))}
                          className="text-red-600 hover:text-red-700"
                        >
                          <MdDelete className="h-4 w-4" />
                        </button>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="p-3 text-center text-gray-500">
                    No follicular scans added yet
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          <button
            onClick={() => setScanModal(true)}
            className="mt-4 flex items-center gap-2 text-sm font-medium text-purple-600 hover:text-purple-700"
          >
            <MdAdd className="h-4 w-4" />
            Add Follicular Scan
          </button>
        </div>
      </Section>

      <Section
        title="Menstrual & Contraceptive History"
        onEdit={() => handleEdit("Menstrual & Contraceptive History")}
      >
        <BooleanItem
          label="Menstrual history"
          value={donorData.menstrualHistory === true}
        />
        <BooleanItem
          label="Use of contraceptives"
          value={donorData.contraceptives === true}
        />
      </Section>

      <Section
        title="Obstetric History"
        onEdit={() => handleEdit("Obstetric History")}
      >
        <InfoItem
          label="Number of deliveries"
          value={obstetric.numberOfDeliveries}
        />
        <InfoItem
          label="Number of abortions"
          value={obstetric.numberOfAbortions}
        />
        <InfoItem label="Delivery 1 Type" value="Normal" /> {/* Placeholder */}
        <InfoItem label="Delivery 2 Type" value="SC" /> {/* Placeholder */}
        <div className="col-span-full mt-4">
          <span className="text-xs font-medium uppercase text-gray-500">
            Other points of note
          </span>
          <p className="mt-1 text-sm text-gray-900">
            {obstetric.otherNotes || "No notes available."}
          </p>
        </div>
      </Section>

      <Section
        title="Medical & Family History"
        onEdit={() => handleEdit("Medical & Family History")}
      >
        <BooleanItem
          label="Medical history?"
          value={donorData.medicalHistory === true}
        />
        <BooleanItem
          label="Family medical history?"
          value={donorData.familyMedicalHistory === true}
        />
        <BooleanItem
          label="Abnormality in child?"
          value={donorData.abnormalityInChild === true}
        />
        <BooleanItem
          label="History of blood transfusion"
          value={donorData.bloodTransfusion === true}
        />
        <BooleanItem
          label="Substance abuse"
          value={donorData.substanceAbuse === true}
        />
        <BooleanItem
          label="Genetic abnormality"
          value={donorData.geneticAbnormality === true}
        />
      </Section>

      <Section
        title="Physical Examination"
        onEdit={() => handleEdit("Physical Examination")}
      >
        <InfoItem
          label="Pulse"
          value={physical.pulse ? `${physical.pulse} bpm` : "-"}
        />
        <InfoItem
          label="Temperature"
          value={physical.temperature ? `${physical.temperature}°F` : "-"}
        />
        <InfoItem
          label="BP"
          value={physical.bp ? `${physical.bp} mmHg` : "-"}
        />
        <InfoItem
          label="Respiratory System"
          value={physical.respiratorySystem}
        />
        <InfoItem
          label="Cardiovascular System"
          value={physical.cardiovascularSystem}
        />
        <InfoItem
          label="Per Abdominal Examination"
          value={physical.abdominalExamination}
        />
        <div className="col-span-full">
          <InfoItem label="Other Systems" value={physical.otherSystems} />
        </div>
      </Section>

      {/* Edit Modal */}
      <EditMedicalModal
        isOpen={editModal.isOpen}
        onClose={() => setEditModal({ isOpen: false, section: "" })}
        donor={donorData}
        section={editModal.section}
        onSave={handleSave}
      />

      {/* Add Follicular Scan Modal */}
      <AddFollicularScanModal
        isOpen={scanModal}
        onClose={() => setScanModal(false)}
        onSave={handleAddScan}
      />
    </div>
  );
}
