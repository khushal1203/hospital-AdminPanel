"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import InputGroup from "@/components/FormElements/InputGroup";
import SelectField from "@/components/FormElements/SelectField";
import ImageUpload from "@/components/FormElements/ImageUpload";
import { EmailIcon, PasswordIcon } from "@/assets/icons";


export default function AddUserPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        password: "",
        confirmPassword: "",
        role: "",
        contactNumber: "",
        isActive: true,
    });


    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === "checkbox" ? checked : value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        if (formData.password !== formData.confirmPassword) {
            setError("Passwords do not match");
            setLoading(false);
            return;
        }

        try {
            const token = localStorage.getItem("token");
            const res = await fetch("/api/users/create", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(formData),
            });

            const data = await res.json();

            if (data.success) {
                router.push("/users");
            } else {
                setError(data.message || "Failed to create user");
            }
        } catch (err) {
            setError("Failed to create user");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="mx-auto max-w-2xl">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-dark dark:text-white">
                    Add New User
                </h1>
                <p className="mt-2 text-gray-600 dark:text-gray-400">
                    Create a new user account with role assignment
                </p>
            </div>

            {error && (
                <div className="mb-6 rounded-lg bg-red-50 p-4 text-red-600 dark:bg-red-900/20">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit}>
                <div className="rounded-lg bg-white p-8 shadow-lg dark:bg-gray-dark">
                    <div className="space-y-6">
                        <InputGroup
                            type="text"
                            label="Full Name"
                            placeholder="Enter full name"
                            name="fullName"
                            value={formData.fullName}
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
                            required
                        />

                        <InputGroup
                            type="password"
                            label="Password"
                            placeholder="Enter password"
                            name="password"
                            value={formData.password}
                            handleChange={handleChange}
                            required
                        />

                        <InputGroup
                            type="password"
                            label="Confirm Password"
                            placeholder="Confirm password"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            handleChange={handleChange}
                            required
                        />

                        <InputGroup
                            type="tel"
                            label="Contact Number"
                            placeholder="Enter contact number"
                            name="contactNumber"
                            value={formData.contactNumber}
                            handleChange={handleChange}
                        />

                        <SelectField
                            label="Role"
                            options={[
                                { value: "receptionist", label: "Receptionist" },
                                { value: "doctor", label: "Doctor" },
                                { value: "laboratory", label: "Laboratory" },
                            ]}
                            value={formData.role ? { value: formData.role, label: formData.role.charAt(0).toUpperCase() + formData.role.slice(1) } : null}
                            onChange={(option) => handleChange({ target: { name: "role", value: option?.value || "" } })}
                            placeholder="Select role"
                            required
                        />

                        <ImageUpload
                            label="Profile Picture"
                            onImageChange={(file) => setFormData({ ...formData, profileImage: file })}
                        />

                        <div className="flex items-center">
                            <input
                                type="checkbox"
                                name="isActive"
                                checked={formData.isActive}
                                onChange={handleChange}
                                className="mr-2 h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                            />
                            <label className="text-sm font-medium text-dark dark:text-white">
                                Active User
                            </label>
                        </div>
                    </div>

                    <div className="mt-8 flex justify-between">
                        <button
                            type="button"
                            onClick={() => router.back()}
                            className="rounded-lg border border-stroke px-6 py-3 font-semibold transition hover:bg-gray-100 dark:border-dark-3 dark:hover:bg-gray-800"
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            disabled={loading}
                            className="rounded-lg bg-primary px-6 py-3 font-semibold text-white transition hover:bg-opacity-90 disabled:opacity-70"
                        >
                            {loading ? "Loading..." : "Create User"}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
}