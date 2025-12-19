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

export default function EditDonorModal({ isOpen, onClose, donor, section, onSave }) {
    const [formData, setFormData] = useState(donor);
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            await onSave(formData);
            toast.success("Donor information updated successfully!");
            onClose();
        } catch (error) {
            console.error('Error saving data:', error);
            toast.error("Failed to update donor information");
        } finally {
            setIsLoading(false);
        }
    };

    if (!isOpen) return null;

    const renderFields = () => {
        switch (section) {
            case "Personal Information":
                return (
                    <>
                        <FormField label="Full Name" name="fullName" value={formData.fullName} onChange={handleChange} />
                        <FormField label="Husband Name" name="husbandName" value={formData.husbandName} onChange={handleChange} />
                        <FormField label="Aadhaar Number" name="aadharNumber" value={formData.aadharNumber} onChange={handleChange} />
                        <FormField 
                            label="Gender" 
                            name="gender" 
                            value={formData.gender} 
                            onChange={handleChange}
                            options={["Male", "Female", "Other"]}
                        />
                        <FormField 
                            label="Marital Status" 
                            name="maritalStatus" 
                            value={formData.maritalStatus} 
                            onChange={handleChange}
                            options={["Single", "Married", "Divorced", "Widowed"]}
                        />
                        <FormField label="Religion" name="religion" value={formData.religion} onChange={handleChange} />
                        <FormField 
                            label="Blood Group" 
                            name="bloodGroup" 
                            value={formData.bloodGroup} 
                            onChange={handleChange}
                            options={["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"]}
                        />
                        <FormField label="Date of Birth" name="dateOfBirth" value={formData.dateOfBirth?.split('T')[0]} onChange={handleChange} type="date" />
                        <FormField label="Place of Birth" name="placeOfBirth" value={formData.placeOfBirth} onChange={handleChange} />
                        <FormField label="Age" name="age" value={formData.age} onChange={handleChange} type="number" />
                        <FormField label="Cast" name="cast" value={formData.cast} onChange={handleChange} />
                    </>
                );
            case "Contact Information":
                return (
                    <>
                        <FormField label="Phone Number" name="contactNumber" value={formData.contactNumber} onChange={handleChange} />
                        <FormField label="Email" name="email" value={formData.email} onChange={handleChange} type="email" />
                        <FormField label="Address" name="address" value={formData.address} onChange={handleChange} />
                        <FormField label="City" name="city" value={formData.city} onChange={handleChange} />
                        <FormField label="State" name="state" value={formData.state} onChange={handleChange} />
                        <FormField label="Pin Code" name="pincode" value={formData.pincode} onChange={handleChange} />
                        <FormField label="Reference Name" name="referenceName" value={formData.referenceName} onChange={handleChange} />
                        <FormField label="Reference Number" name="referenceNumber" value={formData.referenceNumber} onChange={handleChange} />
                    </>
                );
            case "Physical Attributes":
                return (
                    <>
                        <FormField label="Height" name="height" value={formData.height} onChange={handleChange} />
                        <FormField label="Weight" name="weight" value={formData.weight} onChange={handleChange} type="number" />
                        <FormField label="Skin Colour" name="skinColor" value={formData.skinColor} onChange={handleChange} />
                        <FormField label="Hair Colour" name="hairColor" value={formData.hairColor} onChange={handleChange} />
                        <FormField label="Eye Colour" name="eyeColor" value={formData.eyeColor} onChange={handleChange} />
                    </>
                );
            case "Professional Details":
                return (
                    <>
                        <FormField label="Donor Education" name="donorEducation" value={formData.donorEducation} onChange={handleChange} />
                        <FormField label="Donor Occupation" name="donorOccupation" value={formData.donorOccupation} onChange={handleChange} />
                        <FormField label="Spouse Education" name="spouseEducation" value={formData.spouseEducation} onChange={handleChange} />
                        <FormField label="Spouse Occupation" name="spouseOccupation" value={formData.spouseOccupation} onChange={handleChange} />
                        <FormField label="Monthly Income" name="monthlyIncome" value={formData.monthlyIncome} onChange={handleChange} type="number" />
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
                            className="rounded-lg bg-purple-600 px-4 py-2 text-sm font-medium text-white hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}