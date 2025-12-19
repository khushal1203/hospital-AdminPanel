"use client";

import { useState } from "react";
import { MdClose } from "react-icons/md";
import { toast } from "@/utils/toast";

const FormField = ({ label, name, value, onChange, type = "text", options = null }) => (
    <div className="flex flex-col gap-1">
        <label className="text-xs font-medium text-gray-700 uppercase">{label}</label>
        {options ? (
            <select
                name={name}
                value={value || ""}
                onChange={onChange}
                className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-purple-500 focus:outline-none"
            >
                <option value="">Select {label}</option>
                {options.map(option => (
                    <option key={option} value={option}>{option}</option>
                ))}
            </select>
        ) : type === "textarea" ? (
            <textarea
                name={name}
                value={value || ""}
                onChange={onChange}
                rows={3}
                className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-purple-500 focus:outline-none"
            />
        ) : type === "checkbox" ? (
            <div className="flex items-center gap-3">
                <label className="flex items-center gap-2">
                    <input
                        type="checkbox"
                        name={name}
                        checked={value === true || value === "yes"}
                        onChange={(e) => onChange({ target: { name, value: e.target.checked } })}
                        className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                    />
                    <span className="text-sm text-gray-700">Yes</span>
                </label>
                <label className="flex items-center gap-2">
                    <input
                        type="checkbox"
                        name={name}
                        checked={value === false || value === "no"}
                        onChange={(e) => onChange({ target: { name, value: !e.target.checked } })}
                        className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                    />
                    <span className="text-sm text-gray-700">No</span>
                </label>
            </div>
        ) : (
            <input
                type={type}
                name={name}
                value={value || ""}
                onChange={onChange}
                className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-purple-500 focus:outline-none"
            />
        )}
    </div>
);

export default function EditMedicalModal({ isOpen, onClose, donor, section, onSave }) {
    const [formData, setFormData] = useState(donor);
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        
        if (name.includes('.')) {
            const [parent, child] = name.split('.');
            setFormData(prev => ({
                ...prev,
                [parent]: {
                    ...prev[parent],
                    [child]: value
                }
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            await onSave(formData);
            toast.success("Medical information updated successfully!");
            onClose();
        } catch (error) {
            console.error('Error saving data:', error);
            toast.error("Failed to update medical information");
        } finally {
            setIsLoading(false);
        }
    };

    if (!isOpen) return null;

    const renderFields = () => {
        switch (section) {
            case "Follicular Details":
                return (
                    <>
                        <FormField 
                            label="LMP Date" 
                            name="follicularDetails.lmpDate" 
                            value={formData.follicularDetails?.lmpDate?.split('T')[0]} 
                            onChange={handleChange} 
                            type="date" 
                        />
                        <FormField 
                            label="LMP Day" 
                            name="follicularDetails.lmpDay" 
                            value={formData.follicularDetails?.lmpDay} 
                            onChange={handleChange} 
                            type="number" 
                        />
                        <FormField 
                            label="ET Value" 
                            name="follicularDetails.etValue" 
                            value={formData.follicularDetails?.etValue} 
                            onChange={handleChange} 
                        />
                        <FormField 
                            label="Right Ovary" 
                            name="follicularDetails.rightOvary" 
                            value={formData.follicularDetails?.rightOvary} 
                            onChange={handleChange} 
                        />
                        <FormField 
                            label="Left Ovary" 
                            name="follicularDetails.leftOvary" 
                            value={formData.follicularDetails?.leftOvary} 
                            onChange={handleChange} 
                        />
                        <FormField 
                            label="Stimulation Process" 
                            name="follicularDetails.stimulationProcess" 
                            value={formData.follicularDetails?.stimulationProcess} 
                            onChange={handleChange} 
                        />
                        <FormField 
                            label="Process Start Date" 
                            name="follicularDetails.processStartDate" 
                            value={formData.follicularDetails?.processStartDate?.split('T')[0]} 
                            onChange={handleChange} 
                            type="date" 
                        />
                    </>
                );
            case "Menstrual & Contraceptive History":
                return (
                    <>
                        <FormField 
                            label="Menstrual History" 
                            name="menstrualHistory" 
                            value={formData.menstrualHistory} 
                            onChange={handleChange}
                            type="checkbox"
                        />
                        <FormField 
                            label="Use of Contraceptives" 
                            name="contraceptives" 
                            value={formData.contraceptives} 
                            onChange={handleChange}
                            type="checkbox"
                        />
                    </>
                );
            case "Obstetric History":
                return (
                    <>
                        <FormField 
                            label="Number of Deliveries" 
                            name="obstetricHistory.numberOfDeliveries" 
                            value={formData.obstetricHistory?.numberOfDeliveries} 
                            onChange={handleChange} 
                            type="number" 
                        />
                        <FormField 
                            label="Number of Abortions" 
                            name="obstetricHistory.numberOfAbortions" 
                            value={formData.obstetricHistory?.numberOfAbortions} 
                            onChange={handleChange} 
                            type="number" 
                        />
                        <FormField 
                            label="Other Notes" 
                            name="obstetricHistory.otherNotes" 
                            value={formData.obstetricHistory?.otherNotes} 
                            onChange={handleChange}
                            type="textarea"
                        />
                    </>
                );
            case "Medical & Family History":
                return (
                    <>
                        <FormField 
                            label="Medical History" 
                            name="medicalHistory" 
                            value={formData.medicalHistory} 
                            onChange={handleChange}
                            type="checkbox"
                        />
                        <FormField 
                            label="Family Medical History" 
                            name="familyMedicalHistory" 
                            value={formData.familyMedicalHistory} 
                            onChange={handleChange}
                            type="checkbox"
                        />
                        <FormField 
                            label="Abnormality in Child" 
                            name="abnormalityInChild" 
                            value={formData.abnormalityInChild} 
                            onChange={handleChange}
                            type="checkbox"
                        />
                        <FormField 
                            label="Blood Transfusion" 
                            name="bloodTransfusion" 
                            value={formData.bloodTransfusion} 
                            onChange={handleChange}
                            type="checkbox"
                        />
                        <FormField 
                            label="Substance Abuse" 
                            name="substanceAbuse" 
                            value={formData.substanceAbuse} 
                            onChange={handleChange}
                            type="checkbox"
                        />
                        <FormField 
                            label="Genetic Abnormality" 
                            name="geneticAbnormality" 
                            value={formData.geneticAbnormality} 
                            onChange={handleChange}
                            type="checkbox"
                        />
                    </>
                );
            case "Physical Examination":
                return (
                    <>
                        <FormField 
                            label="Pulse (bpm)" 
                            name="physicalExamination.pulse" 
                            value={formData.physicalExamination?.pulse} 
                            onChange={handleChange} 
                            type="number" 
                        />
                        <FormField 
                            label="Temperature (°F)" 
                            name="physicalExamination.temperature" 
                            value={formData.physicalExamination?.temperature} 
                            onChange={handleChange} 
                            type="number" 
                        />
                        <FormField 
                            label="BP (mmHg)" 
                            name="physicalExamination.bp" 
                            value={formData.physicalExamination?.bp} 
                            onChange={handleChange} 
                        />
                        <FormField 
                            label="Respiratory System" 
                            name="physicalExamination.respiratorySystem" 
                            value={formData.physicalExamination?.respiratorySystem} 
                            onChange={handleChange}
                            type="textarea"
                        />
                        <FormField 
                            label="Cardiovascular System" 
                            name="physicalExamination.cardiovascularSystem" 
                            value={formData.physicalExamination?.cardiovascularSystem} 
                            onChange={handleChange}
                            type="textarea"
                        />
                        <FormField 
                            label="Abdominal Examination" 
                            name="physicalExamination.abdominalExamination" 
                            value={formData.physicalExamination?.abdominalExamination} 
                            onChange={handleChange}
                            type="textarea"
                        />
                        <FormField 
                            label="Other Systems" 
                            name="physicalExamination.otherSystems" 
                            value={formData.physicalExamination?.otherSystems} 
                            onChange={handleChange}
                            type="textarea"
                        />
                    </>
                );
            default:
                return null;
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-lg bg-white p-6 shadow-xl">
                <div className="mb-6 flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-gray-900">Edit {section}</h2>
                    <button
                        onClick={onClose}
                        className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
                    >
                        <MdClose className="h-5 w-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {renderFields()}
                    </div>

                    <div className="mt-6 flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="rounded-lg bg-purple-600 px-4 py-2 text-sm font-medium text-white hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                        >
                            {isLoading && (
                                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                            )}
                            {isLoading ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}