import { MdEdit, MdAdd } from "react-icons/md";
import dayjs from "dayjs";

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
        <span className="text-xs font-medium text-gray-500 uppercase">{label}</span>
        <span className="text-sm font-medium text-gray-900">{value || "-"}</span>
    </div>
);

const BooleanItem = ({ label, value, reason }) => (
    <div className="col-span-full border-b border-gray-100 pb-4 last:border-0 last:pb-0">
        <div className="flex items-center gap-4 mb-2">
            <span className="text-sm font-semibold text-gray-900">{label}</span>
            <span className={`px-2 py-0.5 text-xs font-medium rounded ${value ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-700'}`}>
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
    const follicular = donor.follicularDetails || {};
    const obstetric = donor.obstetricHistory || {};
    const physical = donor.physicalExamination || {};

    return (
        <div className="flex flex-col gap-6">

            <Section title="Follicular Details" onEdit={() => { }}>
                {/* Hardcoded table structure for follicular details based on image if needed, or simple key-value */}
                {/* The image shows a table for follicular details with Date, Day of LMP, ET, Right Ovary, Left Ovary */}
                {/* Assuming single record for now based on data structure provided in controller */}
                <div className="col-span-full overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-gray-50 text-gray-500 font-medium">
                            <tr>
                                <th className="p-3">Date</th>
                                <th className="p-3">Day of LMP</th>
                                <th className="p-3">ET</th>
                                <th className="p-3">Right Ovary</th>
                                <th className="p-3">Left Ovary</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {/* Placeholder row since controller structure has single values */}
                            <tr>
                                <td className="p-3 text-gray-900">{follicular.lmpDate ? dayjs(follicular.lmpDate).format("DD MMM YYYY") : "-"}</td>
                                <td className="p-3 text-gray-900">{follicular.lmpDay || "-"}</td>
                                <td className="p-3 text-gray-900">{follicular.etValue || "-"}</td>
                                <td className="p-3 text-gray-900">{follicular.rightOvary || "-"}</td>
                                <td className="p-3 text-gray-900">{follicular.leftOvary || "-"}</td>
                            </tr>
                        </tbody>
                    </table>
                    <button className="mt-4 flex items-center gap-2 text-sm font-medium text-purple-600 hover:text-purple-700">
                        <MdAdd className="h-4 w-4" />
                        Add Follicular Scan
                    </button>
                </div>
            </Section>

            <Section title="Menstrual & Contraceptive History" onEdit={() => { }}>
                <BooleanItem label="Menstrual history" value={false} reason="Stimulation process not stated yet due to pending prerequisite steps or documentation." />
                <BooleanItem label="Use of contraceptives" value={donor.contraceptives === 'yes'} reason="Stimulation process not stated yet due to pending prerequisite steps or documentation." />
            </Section>

            <Section title="Obstetric History" onEdit={() => { }}>
                <InfoItem label="Number of deliveries" value={obstetric.numberOfDeliveries} />
                <InfoItem label="Number of abortions" value={obstetric.numberOfAbortions} />
                <InfoItem label="Delivery 1 Type" value="Normal" /> {/* Placeholder */}
                <InfoItem label="Delivery 2 Type" value="SC" /> {/* Placeholder */}
                <div className="col-span-full mt-4">
                    <span className="text-xs font-medium text-gray-500 uppercase">Other points of note</span>
                    <p className="mt-1 text-sm text-gray-900">{obstetric.otherNotes || "No notes available."}</p>
                </div>
            </Section>

            <Section title="Medical & Family History" onEdit={() => { }}>
                <BooleanItem label="Medical history?" value={!!donor.medicalHistory} reason={donor.medicalHistory} />
                <BooleanItem label="Family medical history?" value={!!donor.familyMedicalHistory} reason={donor.familyMedicalHistory} />
                <BooleanItem label="Abnormality in child?" value={donor.abnormalityInChild === 'yes'} />
                <BooleanItem label="History of blood transfusion" value={donor.bloodTransfusion === 'yes'} />
                <BooleanItem label="Substance abuse" value={donor.substanceAbuse === 'yes'} />
                <BooleanItem label="Genetic abnormality" value={donor.geneticAbnormality === 'yes'} />
            </Section>

            <Section title="Physical Examination" onEdit={() => { }}>
                <InfoItem label="Pulse" value={physical.pulse ? `${physical.pulse} bpm` : "-"} />
                <InfoItem label="Temperature" value={physical.temperature ? `${physical.temperature}°F` : "-"} />
                <InfoItem label="BP" value={physical.bp ? `${physical.bp} mmHg` : "-"} />
                <InfoItem label="Respiratory System" value={physical.respiratorySystem} />
                <InfoItem label="Cardiovascular System" value={physical.cardiovascularSystem} />
                <InfoItem label="Per Abdominal Examination" value={physical.abdominalExamination} />
                <div className="col-span-full">
                    <InfoItem label="Other Systems" value={physical.otherSystems} />
                </div>
            </Section>

        </div>
    );
}
