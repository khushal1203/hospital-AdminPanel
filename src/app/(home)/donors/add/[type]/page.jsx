"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { MdPerson, MdPhone, MdEmail, MdLocationOn, MdLocalHospital, MdDescription, MdCheck, MdCheckCircle, MdUpload, MdDelete, MdAdd } from "react-icons/md";
import ImageUpload from "@/components/FormElements/ImageUpload";
import DatePicker from "@/components/FormElements/DatePicker";
import SelectField from "@/components/FormElements/SelectField";
import { toast } from "@/utils/toast";
import "react-calendar/dist/Calendar.css";

export default function DonorRegistrationForm({ params }) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [donorType, setDonorType] = useState(null);

    useEffect(() => {
        params.then(p => setDonorType(p.type));
    }, [params]);

    const [formData, setFormData] = useState({
        // Donor Image
        donorImage: null,
        
        // Age Check
        dateOfBirth: "",
        age: "",
        
        // Personal Information
        fullName: "",
        husbandName: "",
        gender: "",
        aadharNumber: "",
        maritalStatus: "",
        cast: "",
        phoneNumber: "",
        email: "",
        referenceName: "",
        referenceNumber: "",
        
        // Address
        address: "",
        city: "",
        state: "",
        pincode: "",
        
        // Other Information
        placeOfBirth: "",
        religion: "",
        bloodGroup: "",
        
        // Professional Details
        donorEducation: "",
        donorOccupation: "",
        monthlyIncome: "",
        spouseEducation: "",
        spouseOccupation: "",
        
        // Follicular Details
        lmpDate: "",
        lmpDay: "",
        etValue: "",
        rightOvary: "",
        leftOvary: "",
        stimulationProcess: false,
        processStartDate: "",
        
        // Physical Attributes
        height: "",
        weight: "",
        skinColor: "",
        hairColor: "",
        eyeColor: "",
        
        // Obstetric History
        numberOfDeliveries: "",
        numberOfAbortions: "",
        otherNotes: "",
        
        // Menstrual & Contraceptive History
        menstrualHistory: false,
        contraceptives: false,
        
        // Medical & Family History
        medicalHistory: false,
        familyMedicalHistory: false,
        abnormalityInChild: false,
        bloodTransfusion: false,
        substanceAbuse: false,
        geneticAbnormality: false,
        
        // Physical Examination
        pulse: "",
        bp: "",
        temperature: "",
        respiratorySystem: "",
        cardiovascularSystem: "",
        abdominalExamination: "",
        otherSystems: "",
    });

    const [documents, setDocuments] = useState({
        donorAadharFront: null,
        donorAadharBack: null,
        healthInsurance: { file: null, description: "" },
        lifeInsurance: { file: null, description: "" },
        medicalReports: [
            { title: "", file: null, description: "" },
            { title: "", file: null, description: "" }
        ]
    });

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const calculateAge = (birthDate) => {
        const today = new Date();
        const birth = new Date(birthDate);
        let age = today.getFullYear() - birth.getFullYear();
        const monthDiff = today.getMonth() - birth.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
            age--;
        }
        return age;
    };

    const handleDateOfBirthChange = (e) => {
        const birthDate = e.target.value;
        const age = calculateAge(birthDate);
        setFormData(prev => ({
            ...prev,
            dateOfBirth: birthDate,
            age: age.toString()
        }));
    };

    const handleFileUpload = async (field, file) => {
        if (!file) return;
        
        try {
            const formData = new FormData();
            formData.append('file', file);
            
            const response = await fetch('/api/upload', {
                method: 'POST',
                body: formData
            });
            
            const result = await response.json();
            
            if (result.success) {
                if (field === 'donorImage') {
                    setFormData(prev => ({ ...prev, donorImage: result.filePath }));
                } else if (field.includes('Aadhar')) {
                    setDocuments(prev => ({ ...prev, [field]: result.filePath }));
                } else if (field === 'healthInsurance' || field === 'lifeInsurance') {
                    setDocuments(prev => ({
                        ...prev,
                        [field]: { ...prev[field], file: result.filePath }
                    }));
                }
            } else {
                toast.error(result.message || "File upload failed");
                setError(result.message);
            }
        } catch (error) {
            toast.error('File upload failed');
            setError('File upload failed');
        }
    };

    const handleDocumentChange = async (field, value, index = null) => {
        if (index !== null) {
            if (field === 'file' && value) {
                // Handle file upload for medical reports
                try {
                    const formData = new FormData();
                    formData.append('file', value);
                    
                    const response = await fetch('/api/upload', {
                        method: 'POST',
                        body: formData
                    });
                    
                    const result = await response.json();
                    
                    if (result.success) {
                        setDocuments(prev => ({
                            ...prev,
                            medicalReports: prev.medicalReports.map((report, i) => 
                                i === index ? { ...report, file: result.filePath } : report
                            )
                        }));
                    } else {
                        toast.error(result.message || "File upload failed");
                        setError(result.message);
                    }
                } catch (error) {
                    toast.error('File upload failed');
                    setError('File upload failed');
                }
            } else {
                setDocuments(prev => ({
                    ...prev,
                    medicalReports: prev.medicalReports.map((report, i) => 
                        i === index ? { ...report, [field]: value } : report
                    )
                }));
            }
        } else {
            setDocuments(prev => ({
                ...prev,
                [field]: { ...prev[field], description: value }
            }));
        }
    };

    const addMedicalReport = () => {
        setDocuments(prev => ({
            ...prev,
            medicalReports: [...prev.medicalReports, { title: "", file: null, description: "" }]
        }));
    };

    const removeMedicalReport = (index) => {
        setDocuments(prev => ({
            ...prev,
            medicalReports: prev.medicalReports.filter((_, i) => i !== index)
        }));
    };

    const getFormSections = () => {
        return [
            { title: "Donor Image", fields: ["donorImage"], color: "indigo" },
            { title: "Age Check", fields: ["dateOfBirth", "age"], color: "blue" },
            { title: "Personal Information", fields: ["fullName", "husbandName", "gender", "aadharNumber", "maritalStatus", "cast", "phoneNumber", "email", "referenceName", "referenceNumber", "address", "city", "state", "pincode"], color: "green" },
            { title: "Other Information", fields: ["placeOfBirth", "religion", "bloodGroup"], color: "purple" },
            { title: "Professional Details", fields: ["donorEducation", "donorOccupation", "monthlyIncome", "spouseEducation", "spouseOccupation"], color: "orange" },
            { title: "Follicular Details", fields: ["lmpDate", "lmpDay", "etValue", "rightOvary", "leftOvary"], color: "pink" },
            { title: "Physical Attributes", fields: ["height", "weight", "skinColor", "hairColor", "eyeColor"], color: "cyan" },
            { title: "Obstetric History", fields: ["numberOfDeliveries", "numberOfAbortions", "otherNotes"], color: "teal" },
            { title: "Medical History", fields: ["pulse", "bp", "temperature", "respiratorySystem", "cardiovascularSystem", "abdominalExamination", "otherSystems"], color: "red" },
        ];
    };

    const getSectionProgress = (fields) => {
        const filledFields = fields.filter(field => {
            const value = formData[field];
            return value && value.toString().trim() !== "";
        });
        return {
            filled: filledFields.length,
            total: fields.length,
            percentage: Math.round((filledFields.length / fields.length) * 100)
        };
    };

    const getTotalProgress = () => {
        const allFields = Object.keys(formData).filter(key => key !== "stimulationProcess");
        const filledFields = allFields.filter(field => {
            const value = formData[field];
            return value && value.toString().trim() !== "";
        });
        return {
            filled: filledFields.length,
            total: allFields.length,
            percentage: Math.round((filledFields.length / allFields.length) * 100)
        };
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
                    documents: {
                        donorAadharFront: documents.donorAadharFront,
                        donorAadharBack: documents.donorAadharBack,
                        healthInsurance: documents.healthInsurance,
                        lifeInsurance: documents.lifeInsurance,
                        medicalReports: documents.medicalReports
                    }
                }),
            });

            const data = await res.json();

            if (data.success) {
                toast.success("Donor added successfully!");
                setTimeout(() => {
                    router.push("/dashboard");
                }, 2000);
            } else {
                toast.error(data.message || "Failed to add donor");
                setError(data.message);
            }
        } catch (err) {
            toast.error("Failed to create donor");
            setError("Failed to create donor");
        } finally {
            setLoading(false);
        }
    };

    if (!donorType) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    const totalProgress = getTotalProgress();

    return (
        <div className="min-h-screen bg-white  dark:bg-gray-900 p-6">
            <div className="mx-auto max-w-7xl">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                        {donorType === "oocyte" ? "Oocyte" : "Semen"} Donor Registration
                    </h1>
                    <p className="mt-2 text-gray-600 dark:text-gray-400">
                        Complete comprehensive donor registration form
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    <div className="lg:col-span-3">
                        {error && (
                            <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-800 dark:bg-red-900/20">
                                <p className="text-red-700 dark:text-red-300">{error}</p>
                            </div>
                        )}
                        
                        {success && (
                            <div className="mb-6 rounded-lg border border-green-200 bg-green-50 p-4 dark:border-green-800 dark:bg-green-900/20">
                                <p className="text-green-700 dark:text-green-300">{success}</p>
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-8">
                            {/* 1. Donor Image Upload */}
                            <div className="rounded-lg border border-gray-300 p-6 shadow-sm dark:bg-gray-800" style={{ backgroundColor: '#F9FAFB' }}>
                                <h2 className="mb-6 text-xl font-semibold text-gray-900 dark:text-white">Donor Image</h2>
                                <ImageUpload
                                    label="Upload Donor Photo"
                                    onImageChange={(file) => {
                                        if (file) {
                                            setFormData(prev => ({ ...prev, donorImage: file }));
                                            handleFileUpload('donorImage', file);
                                        } else {
                                            setFormData(prev => ({ ...prev, donorImage: null }));
                                        }
                                    }}
                                    className=""
                                />
                            </div>

                            {/* 2. Age Check */}
                            <div className="rounded-lg border border-gray-300 p-6 shadow-sm dark:bg-gray-800" style={{ backgroundColor: '#F9FAFB' }}>
                                <h2 className="mb-6 text-xl font-semibold text-gray-900 dark:text-white">Age Check</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <DatePicker
                                            label="Date of Birth *"
                                            selected={formData.dateOfBirth ? new Date(formData.dateOfBirth) : null}
                                            onChange={(date) => {
                                                const birthDate = date ? date.toISOString().split('T')[0] : '';
                                                const age = date ? calculateAge(birthDate) : '';
                                                setFormData(prev => ({
                                                    ...prev,
                                                    dateOfBirth: birthDate,
                                                    age: age.toString()
                                                }));
                                            }}
                                            dateFormat="dd/MM/yyyy"
                                            showYearDropdown
                                            showMonthDropdown
                                            dropdownMode="select"
                                            maxDate={new Date()}
                                            placeholderText="Select date of birth"
                                        />
                                    </div>
                                    <div>
                                        <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                                            Age
                                        </label>
                                        <input
                                            type="number"
                                            name="age"
                                            value={formData.age}
                                            readOnly
                                            className="w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-3 text-gray-900 dark:border-gray-600 dark:bg-gray-600 dark:text-white"
                                        />
                                        {formData.age && (
                                            <p className={`mt-1 text-sm ${parseInt(formData.age) >= 23 && parseInt(formData.age) <= 35 ? 'text-green-600' : 'text-red-600'}`}>
                                                {parseInt(formData.age) >= 23 && parseInt(formData.age) <= 35 ? '✓ Eligible (Age between 23 to 35 years)' : '✗ Not eligible'}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* 3. Personal Information */}
                            <div className="rounded-lg border border-gray-300 p-6 shadow-sm dark:bg-gray-800" style={{ backgroundColor: '#F9FAFB' }}>
                                <h2 className="mb-6 text-xl font-semibold text-gray-900 dark:text-white">Personal Information</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">Full Name *</label>
                                        <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white" required />
                                    </div>
                                    <div>
                                        <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">Husband Name</label>
                                        <input type="text" name="husbandName" value={formData.husbandName} onChange={handleChange} className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white" />
                                    </div>
                                    <div>
                                        <SelectField
                                            label="Gender *"
                                            options={[
                                                { value: 'female', label: 'Female' },
                                                { value: 'male', label: 'Male' }
                                            ]}
                                            value={formData.gender ? { value: formData.gender, label: formData.gender.charAt(0).toUpperCase() + formData.gender.slice(1) } : null}
                                            onChange={(option) => setFormData(prev => ({ ...prev, gender: option?.value || '' }))}
                                            placeholder="Select Gender"
                                            isSearchable={false}
                                        />
                                    </div>
                                    <div>
                                        <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">Aadhaar Number *</label>
                                        <input type="text" name="aadharNumber" value={formData.aadharNumber} onChange={handleChange} className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white" required />
                                    </div>
                                    <div>
                                        <SelectField
                                            label="Marital Status"
                                            options={[
                                                { value: 'married', label: 'Married' },
                                                { value: 'single', label: 'Single' },
                                                { value: 'divorced', label: 'Divorced' }
                                            ]}
                                            value={formData.maritalStatus ? { value: formData.maritalStatus, label: formData.maritalStatus.charAt(0).toUpperCase() + formData.maritalStatus.slice(1) } : null}
                                            onChange={(option) => setFormData(prev => ({ ...prev, maritalStatus: option?.value || '' }))}
                                            placeholder="Select Status"
                                            isSearchable={false}
                                        />
                                    </div>
                                    <div>
                                        <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">Cast</label>
                                        <input type="text" name="cast" value={formData.cast} onChange={handleChange} className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white" />
                                    </div>
                                    <div>
                                        <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">Phone Number *</label>
                                        <div className="flex">
                                            <span className="inline-flex items-center px-3 rounded-l-lg border border-r-0 border-gray-300 bg-gray-50 text-gray-500 dark:border-gray-600 dark:bg-gray-600 dark:text-gray-400">+91</span>
                                            <input type="tel" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} className="w-full rounded-r-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white" required />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">Email *</label>
                                        <input type="email" name="email" value={formData.email} onChange={handleChange} className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white" required />
                                    </div>
                                    <div>
                                        <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">Reference Name</label>
                                        <input type="text" name="referenceName" value={formData.referenceName} onChange={handleChange} className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white" />
                                    </div>
                                    <div>
                                        <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">Reference Number</label>
                                        <div className="flex">
                                            <span className="inline-flex items-center px-3 rounded-l-lg border border-r-0 border-gray-300 bg-gray-50 text-gray-500 dark:border-gray-600 dark:bg-gray-600 dark:text-gray-400">+91</span>
                                            <input type="tel" name="referenceNumber" value={formData.referenceNumber} onChange={handleChange} className="w-full rounded-r-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white" />
                                        </div>
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">Address</label>
                                        <input type="text" name="address" value={formData.address} onChange={handleChange} className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white" />
                                    </div>
                                    <div>
                                        <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">City</label>
                                        <input type="text" name="city" value={formData.city} onChange={handleChange} className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white" />
                                    </div>
                                    <div>
                                        <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">State</label>
                                        <input type="text" name="state" value={formData.state} onChange={handleChange} className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white" />
                                    </div>
                                    <div>
                                        <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">Pin Code</label>
                                        <input type="text" name="pincode" value={formData.pincode} onChange={handleChange} className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white" />
                                    </div>
                                </div>
                            </div>

                            {/* 4. Other Information */}
                            <div className="rounded-lg border border-gray-300 p-6 shadow-sm dark:bg-gray-800" style={{ backgroundColor: '#F9FAFB' }}>
                                <h2 className="mb-6 text-xl font-semibold text-gray-900 dark:text-white">Other Information</h2>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div>
                                        <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">Place of Birth</label>
                                        <input type="text" name="placeOfBirth" value={formData.placeOfBirth} onChange={handleChange} className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white" />
                                    </div>
                                    <div>
                                        <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">Religion</label>
                                        <input type="text" name="religion" value={formData.religion} onChange={handleChange} className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white" />
                                    </div>
                                    <div>
                                        <SelectField
                                            label="Blood Group"
                                            options={[
                                                { value: 'A+', label: 'A+' },
                                                { value: 'A-', label: 'A-' },
                                                { value: 'B+', label: 'B+' },
                                                { value: 'B-', label: 'B-' },
                                                { value: 'AB+', label: 'AB+' },
                                                { value: 'AB-', label: 'AB-' },
                                                { value: 'O+', label: 'O+' },
                                                { value: 'O-', label: 'O-' }
                                            ]}
                                            value={formData.bloodGroup ? { value: formData.bloodGroup, label: formData.bloodGroup } : null}
                                            onChange={(option) => setFormData(prev => ({ ...prev, bloodGroup: option?.value || '' }))}
                                            placeholder="Select Blood Group"
                                            isSearchable={false}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* 5. Professional Details */}
                            <div className="rounded-lg border border-gray-300 p-6 shadow-sm dark:bg-gray-800" style={{ backgroundColor: '#F9FAFB' }}>
                                <h2 className="mb-6 text-xl font-semibold text-gray-900 dark:text-white">Professional Details</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">Donor Education</label>
                                        <input type="text" name="donorEducation" value={formData.donorEducation} onChange={handleChange} className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white" />
                                    </div>
                                    <div>
                                        <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">Donor Occupation</label>
                                        <input type="text" name="donorOccupation" value={formData.donorOccupation} onChange={handleChange} className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white" />
                                    </div>
                                    <div>
                                        <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">Monthly Income</label>
                                        <input type="number" name="monthlyIncome" value={formData.monthlyIncome} onChange={handleChange} className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white" />
                                    </div>
                                    <div>
                                        <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">Spouse Education</label>
                                        <input type="text" name="spouseEducation" value={formData.spouseEducation} onChange={handleChange} className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white" />
                                    </div>
                                    <div>
                                        <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">Spouse Occupation</label>
                                        <input type="text" name="spouseOccupation" value={formData.spouseOccupation} onChange={handleChange} className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white" />
                                    </div>
                                </div>
                            </div>

                            {/* 6. Follicular Details */}
                            <div className="rounded-lg border border-gray-300 p-6 shadow-sm dark:bg-gray-800" style={{ backgroundColor: '#F9FAFB' }}>
                                <h2 className="mb-6 text-xl font-semibold text-gray-900 dark:text-white">Follicular Details</h2>
                                <div className="overflow-x-auto">
                                    <table className="w-full border-collapse border border-gray-300 dark:border-gray-600">
                                        <thead>
                                            <tr className="bg-gray-50 dark:bg-gray-700">
                                                <th className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-left">Date</th>
                                                <th className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-left">Day of LMP</th>
                                                <th className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-left">ET</th>
                                                <th className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-left">Right Ovary</th>
                                                <th className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-left">Left Ovary</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td className="border border-gray-300 dark:border-gray-600 px-4 py-2">
                                                    <DatePicker
                                                        selected={formData.lmpDate ? new Date(formData.lmpDate) : null}
                                                        onChange={(date) => setFormData(prev => ({ ...prev, lmpDate: date ? date.toISOString().split('T')[0] : '' }))}
                                                        dateFormat="dd/MM/yyyy"
                                                        placeholderText="Select date"
                                                        className="w-full"
                                                    />
                                                </td>
                                                <td className="border border-gray-300 dark:border-gray-600 px-4 py-2">
                                                    <SelectField
                                                        options={[...Array(31)].map((_, i) => ({ value: i+1, label: i+1 }))}
                                                        value={formData.lmpDay ? { value: formData.lmpDay, label: formData.lmpDay } : null}
                                                        onChange={(option) => setFormData(prev => ({ ...prev, lmpDay: option?.value || '' }))}
                                                        placeholder="Day"
                                                        isSearchable={false}
                                                        className="w-full"
                                                    />
                                                </td>
                                                <td className="border border-gray-300 dark:border-gray-600 px-4 py-2">
                                                    <input type="text" name="etValue" value={formData.etValue} onChange={handleChange} placeholder="-" className="w-full rounded border-0 bg-transparent focus:outline-none" />
                                                </td>
                                                <td className="border border-gray-300 dark:border-gray-600 px-4 py-2">
                                                    <textarea name="rightOvary" value={formData.rightOvary} onChange={handleChange} placeholder="Write here..." className="w-full rounded border-0 bg-transparent focus:outline-none resize-none" rows="2"></textarea>
                                                </td>
                                                <td className="border border-gray-300 dark:border-gray-600 px-4 py-2">
                                                    <textarea name="leftOvary" value={formData.leftOvary} onChange={handleChange} placeholder="Write here..." className="w-full rounded border-0 bg-transparent focus:outline-none resize-none" rows="2"></textarea>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                                <div className="mt-6">
                                    <label className="flex items-center space-x-3">
                                        <input type="checkbox" name="stimulationProcess" checked={formData.stimulationProcess} onChange={handleChange} className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Do you want to add the Stimulation Process Start Date?</span>
                                    </label>
                                    {formData.stimulationProcess && (
                                        <div className="mt-4">
                                            <DatePicker
                                                label="Process Start Date"
                                                selected={formData.processStartDate ? new Date(formData.processStartDate) : null}
                                                onChange={(date) => setFormData(prev => ({ ...prev, processStartDate: date ? date.toISOString().split('T')[0] : '' }))}
                                                dateFormat="dd/MM/yyyy"
                                                placeholderText="Select start date"
                                            />
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* 7. Physical Attributes */}
                            <div className="rounded-lg border border-gray-300 p-6 shadow-sm dark:bg-gray-800" style={{ backgroundColor: '#F9FAFB' }}>
                                <h2 className="mb-6 text-xl font-semibold text-gray-900 dark:text-white">Physical Attributes</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    <div>
                                        <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">Height (cm)</label>
                                        <input type="number" name="height" value={formData.height} onChange={handleChange} className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white" />
                                    </div>
                                    <div>
                                        <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">Weight (kg)</label>
                                        <input type="number" name="weight" value={formData.weight} onChange={handleChange} className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white" />
                                    </div>
                                    <div>
                                        <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">Skin Colour</label>
                                        <input type="text" name="skinColor" value={formData.skinColor} onChange={handleChange} className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white" />
                                    </div>
                                    <div>
                                        <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">Hair Colour</label>
                                        <input type="text" name="hairColor" value={formData.hairColor} onChange={handleChange} className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white" />
                                    </div>
                                    <div>
                                        <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">Eye Colour</label>
                                        <input type="text" name="eyeColor" value={formData.eyeColor} onChange={handleChange} className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white" />
                                    </div>
                                </div>
                            </div>

                            {/* 8. Obstetric History */}
                            <div className="rounded-lg border border-gray-300 p-6 shadow-sm dark:bg-gray-800" style={{ backgroundColor: '#F9FAFB' }}>
                                <h2 className="mb-6 text-xl font-semibold text-gray-900 dark:text-white">Obstetric History</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">Number of deliveries</label>
                                        <input type="number" name="numberOfDeliveries" value={formData.numberOfDeliveries} onChange={handleChange} className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white" />
                                    </div>
                                    <div>
                                        <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">Number of abortions</label>
                                        <input type="number" name="numberOfAbortions" value={formData.numberOfAbortions} onChange={handleChange} className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white" />
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">Other points of note</label>
                                        <textarea name="otherNotes" value={formData.otherNotes} onChange={handleChange} rows="3" className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"></textarea>
                                    </div>
                                </div>
                            </div>

                            {/* 9. Menstrual & Contraceptive History */}
                            <div className="rounded-lg border border-gray-300 p-6 shadow-sm dark:bg-gray-800" style={{ backgroundColor: '#F9FAFB' }}>
                                <h2 className="mb-6 text-xl font-semibold text-gray-900 dark:text-white">Menstrual & Contraceptive History</h2>
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Menstrual history</span>
                                        <div className="flex space-x-4">
                                            <label className="flex items-center">
                                                <input type="checkbox" checked={formData.menstrualHistory === true} onChange={() => setFormData(prev => ({...prev, menstrualHistory: formData.menstrualHistory === true ? null : true}))} className="rounded border-gray-300 focus:ring-2 focus:ring-[#402575] text-[#402575] mr-2" />
                                                <span>Yes</span>
                                            </label>
                                            <label className="flex items-center">
                                                <input type="checkbox" checked={formData.menstrualHistory === false} onChange={() => setFormData(prev => ({...prev, menstrualHistory: formData.menstrualHistory === false ? null : false}))} className="rounded border-gray-300 focus:ring-2 focus:ring-[#402575] text-[#402575] mr-2" />
                                                <span>No</span>
                                            </label>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Use of contraceptives</span>
                                        <div className="flex space-x-4">
                                            <label className="flex items-center">
                                                <input type="checkbox" checked={formData.contraceptives === true} onChange={() => setFormData(prev => ({...prev, contraceptives: formData.contraceptives === true ? null : true}))} className="rounded border-gray-300 focus:ring-2 focus:ring-[#402575] text-[#402575] mr-2" />
                                                <span>Yes</span>
                                            </label>
                                            <label className="flex items-center">
                                                <input type="checkbox" checked={formData.contraceptives === false} onChange={() => setFormData(prev => ({...prev, contraceptives: formData.contraceptives === false ? null : false}))} className="rounded border-gray-300 focus:ring-2 focus:ring-[#402575] text-[#402575] mr-2" />
                                                <span>No</span>
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* 10. Medical & Family History */}
                            <div className="rounded-lg border border-gray-300 p-6 shadow-sm dark:bg-gray-800" style={{ backgroundColor: '#F9FAFB' }}>
                                <h2 className="mb-6 text-xl font-semibold text-gray-900 dark:text-white">Medical & Family History</h2>
                                <div className="space-y-4">
                                    {[
                                        { key: 'medicalHistory', label: 'Medical history' },
                                        { key: 'familyMedicalHistory', label: 'Family medical history' },
                                        { key: 'abnormalityInChild', label: 'Abnormality in child' },
                                        { key: 'bloodTransfusion', label: 'History of blood transfusion' },
                                        { key: 'substanceAbuse', label: 'Substance abuse' },
                                        { key: 'geneticAbnormality', label: 'Genetic abnormality' }
                                    ].map((item) => (
                                        <div key={item.key} className="flex items-center justify-between">
                                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{item.label}</span>
                                            <div className="flex space-x-4">
                                                <label className="flex items-center">
                                                    <input type="checkbox" checked={formData[item.key] === true} onChange={() => setFormData(prev => ({...prev, [item.key]: formData[item.key] === true ? null : true}))} className="rounded border-gray-300 focus:ring-2 focus:ring-[#402575] text-[#402575] mr-2" />
                                                    <span>Yes</span>
                                                </label>
                                                <label className="flex items-center">
                                                    <input type="checkbox" checked={formData[item.key] === false} onChange={() => setFormData(prev => ({...prev, [item.key]: formData[item.key] === false ? null : false}))} className="rounded border-gray-300 focus:ring-2 focus:ring-[#402575] text-[#402575] mr-2" />
                                                    <span>No</span>
                                                </label>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* 11. Physical Examination */}
                            <div className="rounded-lg border border-gray-300 p-6 shadow-sm dark:bg-gray-800" style={{ backgroundColor: '#F9FAFB' }}>
                                <h2 className="mb-6 text-xl font-semibold text-gray-900 dark:text-white">Physical Examination</h2>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div>
                                        <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">Pulse</label>
                                        <input type="text" name="pulse" value={formData.pulse} onChange={handleChange} className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white" />
                                    </div>
                                    <div>
                                        <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">BP</label>
                                        <input type="text" name="bp" value={formData.bp} onChange={handleChange} className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white" />
                                    </div>
                                    <div>
                                        <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">Temperature</label>
                                        <input type="text" name="temperature" value={formData.temperature} onChange={handleChange} className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white" />
                                    </div>
                                    <div>
                                        <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">Respiratory System</label>
                                        <textarea name="respiratorySystem" value={formData.respiratorySystem} onChange={handleChange} rows="3" className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"></textarea>
                                    </div>
                                    <div>
                                        <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">Cardiovascular System</label>
                                        <textarea name="cardiovascularSystem" value={formData.cardiovascularSystem} onChange={handleChange} rows="3" className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"></textarea>
                                    </div>
                                    <div>
                                        <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">Per Abdominal Examination</label>
                                        <textarea name="abdominalExamination" value={formData.abdominalExamination} onChange={handleChange} rows="3" className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"></textarea>
                                    </div>
                                    <div className="md:col-span-3">
                                        <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">Other Systems</label>
                                        <textarea name="otherSystems" value={formData.otherSystems} onChange={handleChange} rows="3" className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"></textarea>
                                    </div>
                                </div>
                            </div>

                            {/* 12. Documents Upload */}
                            <div className="rounded-lg border border-gray-300 p-6 shadow-sm dark:bg-gray-800" style={{ backgroundColor: '#F9FAFB' }}>
                                <h2 className="mb-6 text-xl font-semibold text-gray-900 dark:text-white">Documents</h2>
                                
                                {/* Donor Aadhaar Card */}
                                <div className="mb-8">
                                    <h3 className="mb-4 text-lg font-medium text-gray-900 dark:text-white">Donor Aadhaar Card</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <ImageUpload
                                            label="Upload Aadhaar – Front"
                                            onImageChange={(file) => {
                                                if (file) {
                                                    handleFileUpload('donorAadharFront', file);
                                                }
                                            }}
                                        />
                                        <ImageUpload
                                            label="Upload Aadhaar – Back"
                                            onImageChange={(file) => {
                                                if (file) {
                                                    handleFileUpload('donorAadharBack', file);
                                                }
                                            }}
                                        />
                                    </div>
                                </div>

                                {/* Health Insurance */}
                                <div className="mb-8">
                                    <h3 className="mb-4 text-lg font-medium text-gray-900 dark:text-white">Health Insurance Document</h3>
                                    <div className="space-y-4">
                                        <textarea 
                                            placeholder="Description..." 
                                            value={documents.healthInsurance.description}
                                            onChange={(e) => handleDocumentChange('healthInsurance', e.target.value)}
                                            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white" 
                                            rows="3"
                                        ></textarea>
                                        <ImageUpload
                                            label=""
                                            onImageChange={(file) => {
                                                if (file) {
                                                    handleFileUpload('healthInsurance', file);
                                                }
                                            }}
                                        />
                                    </div>
                                </div>

                                {/* Life Insurance */}
                                <div className="mb-8">
                                    <h3 className="mb-4 text-lg font-medium text-gray-900 dark:text-white">Life Insurance Document</h3>
                                    <div className="space-y-4">
                                        <textarea 
                                            placeholder="Description..." 
                                            value={documents.lifeInsurance.description}
                                            onChange={(e) => handleDocumentChange('lifeInsurance', e.target.value)}
                                            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white" 
                                            rows="3"
                                        ></textarea>
                                        <ImageUpload
                                            label=""
                                            onImageChange={(file) => {
                                                if (file) {
                                                    handleFileUpload('lifeInsurance', file);
                                                }
                                            }}
                                        />
                                    </div>
                                </div>

                                {/* Medical Reports */}
                                <div>
                                    <h3 className="mb-4 text-lg font-medium text-gray-900 dark:text-white">Medical Reports</h3>
                                    {documents.medicalReports.map((report, index) => (
                                        <div key={index} className="mb-6 p-4 border border-gray-200 rounded-lg">
                                            <div className="flex justify-between items-center mb-4">
                                                <h4 className="font-medium">Document {index + 1}</h4>
                                                {documents.medicalReports.length > 2 && (
                                                    <button type="button" onClick={() => removeMedicalReport(index)} className="text-red-600 hover:text-red-800">
                                                        <MdDelete className="h-5 w-5" />
                                                    </button>
                                                )}
                                            </div>
                                            <div className="space-y-4">
                                                <input 
                                                    type="text" 
                                                    placeholder="Document title" 
                                                    value={report.title}
                                                    onChange={(e) => handleDocumentChange('title', e.target.value, index)}
                                                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                                                />
                                                <textarea 
                                                    placeholder="Description..." 
                                                    value={report.description}
                                                    onChange={(e) => handleDocumentChange('description', e.target.value, index)}
                                                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white" 
                                                    rows="3"
                                                ></textarea>
                                                <ImageUpload
                                                    label=""
                                                    onImageChange={(file) => {
                                                        if (file) {
                                                            handleDocumentChange('file', file, index);
                                                        }
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    ))}
                                    <button 
                                        type="button" 
                                        onClick={addMedicalReport}
                                        className="flex items-center space-x-2 text-blue-600 hover:text-blue-800"
                                    >
                                        <MdAdd className="h-5 w-5" />
                                        <span>Add New Document</span>
                                    </button>
                                </div>
                            </div>

                            {/* Submit Button */}
                            <div className="flex justify-end">
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="flex items-center space-x-2 rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white shadow-sm transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
                                >
                                    <MdCheck className="h-5 w-5" />
                                    <span>{loading ? "Loading..." : "Submit Registration"}</span>
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* Progress Sidebar */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-20 mt-4 max-h-[calc(100vh-3rem)] overflow-y-auto">
                            <div className="rounded-lg border border-gray-300 p-6 shadow-sm dark:bg-gray-800" style={{ backgroundColor: '#F9FAFB' }}>
                                <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">Form Progress</h3>
                                
                                {/* Overall Progress */}
                                <div className="mb-6">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Overall Completion</span>
                                        <span className="text-sm font-medium text-blue-600 dark:text-blue-400">{totalProgress.percentage}%</span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-3 dark:bg-gray-700">
                                        <div className="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full transition-all duration-500" style={{ width: `${totalProgress.percentage}%` }}></div>
                                    </div>
                                    <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">{totalProgress.filled} of {totalProgress.total} fields completed</p>
                                </div>

                                {/* Step Progress */}
                                <div className="space-y-1">
                                    <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Form Steps</h4>
                                    {getFormSections().map((section, index) => {
                                        const progress = getSectionProgress(section.fields);
                                        const isComplete = progress.percentage === 100;
                                        const isInProgress = progress.percentage > 0 && progress.percentage < 100;
                                        const isNotStarted = progress.percentage === 0;
                                        
                                        return (
                                            <div key={index} className="relative">
                                                {/* Connector Line */}
                                                {index < getFormSections().length - 1 && (
                                                    <div className="absolute top-8 w-0.5 h-10 bg-gray-200 dark:bg-gray-600" style={{ left: '22px' }}></div>
                                                )}
                                                
                                                <div className="flex items-start space-x-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                                                    {/* Step Number/Status */}
                                                    <div className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-medium relative z-10 ${
                                                        isComplete 
                                                            ? 'text-white' 
                                                            : isInProgress 
                                                                ? 'bg-blue-500 text-white' 
                                                                : 'bg-gray-200 text-gray-600 dark:bg-gray-600 dark:text-gray-300'
                                                    }`} style={isComplete ? { backgroundColor: '#402575' } : {}}>
                                                        {isComplete ? (
                                                            <MdCheckCircle className="h-5 w-5" />
                                                        ) : (
                                                            <span>{index + 1}</span>
                                                        )}
                                                    </div>
                                                    
                                                    {/* Step Details */}
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-center justify-between">
                                                            <p className={`text-sm font-medium truncate ${
                                                                isComplete 
                                                                    ? 'dark:text-gray-300' 
                                                                    : isInProgress 
                                                                        ? 'text-blue-700 dark:text-blue-400' 
                                                                        : 'text-gray-600 dark:text-gray-400'
                                                            }`} style={isComplete ? { color: '#402575' } : {}}>
                                                                {section.title}
                                                            </p>
                                                            <span className={`text-xs font-medium ml-2 ${
                                                                isComplete 
                                                                    ? 'dark:text-gray-400' 
                                                                    : isInProgress 
                                                                        ? 'text-blue-600 dark:text-blue-400' 
                                                                        : 'text-gray-500 dark:text-gray-500'
                                                            }`} style={isComplete ? { color: '#402575' } : {}}>
                                                                {progress.percentage}%
                                                            </span>
                                                        </div>
                                                        
                                                        {/* Progress Bar */}
                                                        <div className="mt-1 w-full bg-gray-200 rounded-full h-1.5 dark:bg-gray-700">
                                                            <div 
                                                                className={`h-1.5 rounded-full transition-all duration-300 ${
                                                                    isComplete 
                                                                        ? '' 
                                                                        : isInProgress 
                                                                            ? 'bg-blue-500' 
                                                                            : 'bg-gray-300'
                                                                }`}
                                                                style={isComplete ? { width: `${progress.percentage}%`, backgroundColor: '#402575' } : { width: `${progress.percentage}%` }}
                                                            ></div>
                                                        </div>
                                                        
                                                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                                            {progress.filled}/{progress.total} fields
                                                            {isComplete && <span className="ml-1" style={{ color: '#402575' }}>✓ Complete</span>}
                                                            {isInProgress && <span className="text-blue-600 dark:text-blue-400 ml-1">• In Progress</span>}
                                                            {isNotStarted && <span className="text-gray-500 dark:text-gray-500 ml-1">• Not Started</span>}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}