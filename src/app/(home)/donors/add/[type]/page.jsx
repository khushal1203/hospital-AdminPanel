"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import InputGroup from "@/components/FormElements/InputGroup";
import { EmailIcon } from "@/assets/icons";

export default function DonorRegistrationForm({ params }) {
    const router = useRouter();
    const [currentStep, setCurrentStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [donorType, setDonorType] = useState(null);

    // Unwrap params for Next.js 15
    useEffect(() => {
        params.then(p => setDonorType(p.type));
    }, [params]);

    const [formData, setFormData] = useState({
        // Basic Information
        fullName: "",
        dateOfBirth: "",
        gender: "",
        bloodGroup: "",
        contactNumber: "",
        email: "",

        // Address
        street: "",
        city: "",
        state: "",
        pincode: "",

        // Medical Information
        height: "",
        weight: "",
        medicalHistory: "",
        currentMedications: "",
        allergies: "",

        // Documents
        aadharNumber: "",

        // Status
        status: "pending",
    });

    const totalSteps = 5;

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleNext = () => {
        if (currentStep < totalSteps) {
            setCurrentStep(currentStep + 1);
        }
    };

    const handlePrevious = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const token = localStorage.getItem("token");
            const res = await fetch("/api/donors/create", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    ...formData,
                    donorType,
                    address: {
                        street: formData.street,
                        city: formData.city,
                        state: formData.state,
                        pincode: formData.pincode,
                    },
                }),
            });

            const data = await res.json();

            if (data.success) {
                router.push("/dashboard");
            } else {
                setError(data.message);
            }
        } catch (err) {
            setError("Failed to create donor");
        } finally {
            setLoading(false);
        }
    };

    if (!donorType) {
        return <div>Loading...</div>;
    }

    return (
        <div className="mx-auto max-w-4xl">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-dark dark:text-white">
                    {donorType === "oocyte" ? "Oocyte" : "Semen"} Donor Registration
                </h1>
                <p className="mt-2 text-gray-600 dark:text-gray-400">
                    Complete all steps to register a new donor
                </p>
            </div>

            {/* Progress Bar */}
            <div className="mb-8">
                <div className="flex items-center justify-between">
                    {[1, 2, 3, 4, 5].map((step) => (
                        <div key={step} className="flex flex-1 items-center">
                            <div
                                className={`flex h-10 w-10 items-center justify-center rounded-full ${step <= currentStep
                                    ? "bg-primary text-white"
                                    : "bg-gray-200 text-gray-600 dark:bg-gray-700"
                                    }`}
                            >
                                {step}
                            </div>
                            {step < 5 && (
                                <div
                                    className={`h-1 flex-1 ${step < currentStep
                                        ? "bg-primary"
                                        : "bg-gray-200 dark:bg-gray-700"
                                        }`}
                                ></div>
                            )}
                        </div>
                    ))}
                </div>
                <div className="mt-2 flex justify-between text-xs text-gray-600 dark:text-gray-400">
                    <span>Basic Info</span>
                    <span>Contact</span>
                    <span>Medical</span>
                    <span>Documents</span>
                    <span>Review</span>
                </div>
            </div>

            {/* Error Message */}
            {error && (
                <div className="mb-6 rounded-lg bg-red-50 p-4 text-red-600 dark:bg-red-900/20">
                    {error}
                </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit}>
                <div className="rounded-lg bg-white p-8 shadow-lg dark:bg-gray-dark">
                    {/* Step 1: Basic Information */}
                    {currentStep === 1 && (
                        <div className="space-y-4">
                            <h2 className="mb-4 text-xl font-semibold text-dark dark:text-white">
                                Basic Information
                            </h2>

                            <InputGroup
                                type="text"
                                label="Full Name"
                                placeholder="Enter full name"
                                name="fullName"
                                value={formData.fullName}
                                handleChange={handleChange}
                                required
                            />

                            <div className="grid gap-4 md:grid-cols-2">
                                <InputGroup
                                    type="date"
                                    label="Date of Birth"
                                    name="dateOfBirth"
                                    value={formData.dateOfBirth}
                                    handleChange={handleChange}
                                    required
                                />

                                <div>
                                    <label className="mb-3 block text-sm font-medium text-dark dark:text-white">
                                        Gender
                                    </label>
                                    <select
                                        name="gender"
                                        value={formData.gender}
                                        onChange={handleChange}
                                        className="w-full rounded-lg border border-stroke bg-transparent px-5 py-3 outline-none transition focus:border-primary dark:border-dark-3 dark:bg-dark-2"
                                        required
                                    >
                                        <option value="">Select gender</option>
                                        <option value="male">Male</option>
                                        <option value="female">Female</option>
                                        <option value="other">Other</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="mb-3 block text-sm font-medium text-dark dark:text-white">
                                    Blood Group
                                </label>
                                <select
                                    name="bloodGroup"
                                    value={formData.bloodGroup}
                                    onChange={handleChange}
                                    className="w-full rounded-lg border border-stroke bg-transparent px-5 py-3 outline-none transition focus:border-primary dark:border-dark-3 dark:bg-dark-2"
                                >
                                    <option value="">Select blood group</option>
                                    <option value="A+">A+</option>
                                    <option value="A-">A-</option>
                                    <option value="B+">B+</option>
                                    <option value="B-">B-</option>
                                    <option value="AB+">AB+</option>
                                    <option value="AB-">AB-</option>
                                    <option value="O+">O+</option>
                                    <option value="O-">O-</option>
                                </select>
                            </div>
                        </div>
                    )}

                    {/* Step 2: Contact Details */}
                    {currentStep === 2 && (
                        <div className="space-y-4">
                            <h2 className="mb-4 text-xl font-semibold text-dark dark:text-white">
                                Contact Details
                            </h2>

                            <InputGroup
                                type="tel"
                                label="Contact Number"
                                placeholder="Enter contact number"
                                name="contactNumber"
                                value={formData.contactNumber}
                                handleChange={handleChange}
                                required
                            />

                            <InputGroup
                                type="email"
                                label="Email"
                                placeholder="Enter email address"
                                name="email"
                                value={formData.email}
                                handleChange={handleChange}
                                icon={<EmailIcon />}
                            />

                            <InputGroup
                                type="text"
                                label="Street Address"
                                placeholder="Enter street address"
                                name="street"
                                value={formData.street}
                                handleChange={handleChange}
                            />

                            <div className="grid gap-4 md:grid-cols-3">
                                <InputGroup
                                    type="text"
                                    label="City"
                                    placeholder="City"
                                    name="city"
                                    value={formData.city}
                                    handleChange={handleChange}
                                />

                                <InputGroup
                                    type="text"
                                    label="State"
                                    placeholder="State"
                                    name="state"
                                    value={formData.state}
                                    handleChange={handleChange}
                                />

                                <InputGroup
                                    type="text"
                                    label="Pincode"
                                    placeholder="Pincode"
                                    name="pincode"
                                    value={formData.pincode}
                                    handleChange={handleChange}
                                />
                            </div>
                        </div>
                    )}

                    {/* Step 3: Medical Information */}
                    {currentStep === 3 && (
                        <div className="space-y-4">
                            <h2 className="mb-4 text-xl font-semibold text-dark dark:text-white">
                                Medical Information
                            </h2>

                            <div className="grid gap-4 md:grid-cols-2">
                                <InputGroup
                                    type="number"
                                    label="Height (cm)"
                                    placeholder="Enter height in cm"
                                    name="height"
                                    value={formData.height}
                                    handleChange={handleChange}
                                />

                                <InputGroup
                                    type="number"
                                    label="Weight (kg)"
                                    placeholder="Enter weight in kg"
                                    name="weight"
                                    value={formData.weight}
                                    handleChange={handleChange}
                                />
                            </div>

                            <div>
                                <label className="mb-3 block text-sm font-medium text-dark dark:text-white">
                                    Medical History
                                </label>
                                <textarea
                                    name="medicalHistory"
                                    value={formData.medicalHistory}
                                    onChange={handleChange}
                                    rows={4}
                                    className="w-full rounded-lg border border-stroke bg-transparent px-5 py-3 outline-none transition focus:border-primary dark:border-dark-3 dark:bg-dark-2"
                                    placeholder="Enter medical history"
                                ></textarea>
                            </div>

                            <InputGroup
                                type="text"
                                label="Current Medications"
                                placeholder="Enter current medications (comma separated)"
                                name="currentMedications"
                                value={formData.currentMedications}
                                handleChange={handleChange}
                            />

                            <InputGroup
                                type="text"
                                label="Allergies"
                                placeholder="Enter allergies (comma separated)"
                                name="allergies"
                                value={formData.allergies}
                                handleChange={handleChange}
                            />
                        </div>
                    )}

                    {/* Step 4: Documents */}
                    {currentStep === 4 && (
                        <div className="space-y-4">
                            <h2 className="mb-4 text-xl font-semibold text-dark dark:text-white">
                                Documents & Identification
                            </h2>

                            <InputGroup
                                type="text"
                                label="Aadhar Number"
                                placeholder="Enter Aadhar number"
                                name="aadharNumber"
                                value={formData.aadharNumber}
                                handleChange={handleChange}
                            />

                            <div>
                                <label className="mb-3 block text-sm font-medium text-dark dark:text-white">
                                    Upload Documents
                                </label>
                                <div className="rounded-lg border-2 border-dashed border-gray-300 p-8 text-center dark:border-gray-700">
                                    <p className="text-gray-600 dark:text-gray-400">
                                        Document upload functionality will be added
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Step 5: Review */}
                    {currentStep === 5 && (
                        <div className="space-y-4">
                            <h2 className="mb-4 text-xl font-semibold text-dark dark:text-white">
                                Review & Submit
                            </h2>

                            <div className="rounded-lg bg-gray-50 p-6 dark:bg-gray-800">
                                <h3 className="mb-4 font-semibold">Donor Information Summary</h3>
                                <dl className="grid gap-4 md:grid-cols-2">
                                    <div>
                                        <dt className="text-sm text-gray-600 dark:text-gray-400">Full Name</dt>
                                        <dd className="font-medium">{formData.fullName}</dd>
                                    </div>
                                    <div>
                                        <dt className="text-sm text-gray-600 dark:text-gray-400">Date of Birth</dt>
                                        <dd className="font-medium">{formData.dateOfBirth}</dd>
                                    </div>
                                    <div>
                                        <dt className="text-sm text-gray-600 dark:text-gray-400">Contact</dt>
                                        <dd className="font-medium">{formData.contactNumber}</dd>
                                    </div>
                                    <div>
                                        <dt className="text-sm text-gray-600 dark:text-gray-400">Email</dt>
                                        <dd className="font-medium">{formData.email}</dd>
                                    </div>
                                </dl>
                            </div>
                        </div>
                    )}

                    {/* Navigation Buttons */}
                    <div className="mt-8 flex justify-between">
                        <button
                            type="button"
                            onClick={handlePrevious}
                            disabled={currentStep === 1}
                            className="rounded-lg border border-stroke px-6 py-3 font-semibold transition hover:bg-gray-100 disabled:opacity-50 dark:border-dark-3 dark:hover:bg-gray-800"
                        >
                            Previous
                        </button>

                        {currentStep < totalSteps ? (
                            <button
                                type="button"
                                onClick={handleNext}
                                className="rounded-lg bg-primary px-6 py-3 font-semibold text-white transition hover:bg-opacity-90"
                            >
                                Next
                            </button>
                        ) : (
                            <button
                                type="submit"
                                disabled={loading}
                                className="rounded-lg bg-primary px-6 py-3 font-semibold text-white transition hover:bg-opacity-90 disabled:opacity-70"
                            >
                                {loading ? "Submitting..." : "Submit"}
                            </button>
                        )}
                    </div>
                </div>
            </form>
        </div>
    );
}
