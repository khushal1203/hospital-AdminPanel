"use client";
import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import InputGroup from "@/components/FormElements/InputGroup";
import { ButtonLoader } from "@/components/ui/LoadingSpinner";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { PasswordIcon } from "@/assets/icons";

function ResetPasswordForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const token = searchParams.get("token");
    const [formData, setFormData] = useState({
        password: "",
        confirmPassword: "",
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        if (!token) {
            setError("Invalid reset link");
        }
    }, [token]);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
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

        if (formData.password.length < 6) {
            setError("Password must be at least 6 characters long");
            setLoading(false);
            return;
        }

        try {
            const res = await fetch("/api/auth/reset-password", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    token,
                    password: formData.password,
                }),
            });

            const result = await res.json();

            if (result.success) {
                setSuccess(true);
                setTimeout(() => {
                    router.push("/auth/sign-in");
                }, 3000);
            } else {
                setError(result.message);
            }
        } catch (err) {
            setError("Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="min-h-screen from-purple-50 via-white to-pink-50 flex items-center justify-center p-4">
                <div className="w-full max-w-6xl min-h-[80vh] bg-white rounded-3xl shadow-2xl overflow-hidden">
                    <div className="flex flex-col xl:flex-row h-full gap-[60px]">
                        <div className="w-full xl:w-4/5 p-8 sm:p-12 xl:p-16 flex flex-col justify-center">
                            <div className="max-w-lg mx-auto w-full text-center">
                                <Link href="/" className="inline-block mb-8">
                                    <Image
                                        src="/images/logo/logosignin.svg"
                                        alt="Logo"
                                        width={60}
                                        height={40}
                                        className="mx-auto"
                                        priority
                                    />
                                </Link>
                                <div className="mb-4 text-2xl">✓</div>
                                <h1 className="text-2xl font-bold text-gray-900 mb-4">
                                    Password Updated!
                                </h1>
                                <p className="text-gray-600 mb-8">
                                    Your password has been changed successfully.
                                </p>
                            </div>
                        </div>
                        <div className="hidden xl:flex w-full xl:w-3/5 from-blue-50 to-indigo-100 items-center justify-center">
                            <Image
                                src="/images/cover/singinCover.svg"
                                alt="Success Cover"
                                width={450}
                                height={400}
                                className="object-contain max-w-full max-h-full"
                                priority
                            />
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen from-purple-50 via-white to-pink-50 flex items-center justify-center p-4">
            <div className="w-full max-w-6xl min-h-[80vh] bg-white rounded-3xl shadow-2xl overflow-hidden">
                <div className="flex flex-col xl:flex-row h-full gap-[60px]">
                    {/* Left Side - Form */}
                    <div className="w-full xl:w-4/5 p-8 sm:p-12 xl:p-16 flex flex-col justify-center">
                        <div className="max-w-lg mx-auto w-full">
                            <div className="text-center mb-8">
                                <Link href="/" className="inline-block mb-2">
                                    <Image
                                        src="/images/logo/logosignin.svg"
                                        alt="Logo"
                                        width={60}
                                        height={40}
                                        className="mx-auto"
                                        priority
                                    />
                                </Link>
                                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                                    Reset Password
                                </h1>
                                <p className="text-gray-600">
                                    Sign in to Seamlessly Manage Patient Profiles, Sample Collections, Blood Tests, and Consent Forms.
                                </p>
                            </div>

                            <form onSubmit={handleSubmit}>
                                {error && (
                                    <div className="mb-4 rounded-md bg-red-100 p-3 text-sm text-red-600">
                                        {error}
                                    </div>
                                )}

                                <InputGroup
                                    type="password"
                                    label="New Password"
                                    className="mb-4 [&_input]:py-[15px]"
                                    placeholder="Enter new password"
                                    name="password"
                                    handleChange={handleChange}
                                    value={formData.password}
                                    icon={<PasswordIcon />}
                                    required
                                />

                                <InputGroup
                                    type="password"
                                    label="Confirm Password"
                                    className="mb-6 [&_input]:py-[15px]"
                                    placeholder="Confirm new password"
                                    name="confirmPassword"
                                    handleChange={handleChange}
                                    value={formData.confirmPassword}
                                    icon={<PasswordIcon />}
                                    required
                                />

                                <div className="mb-4.5">
                                    <button
                                        type="submit"
                                        disabled={loading || !token}
                                        className="flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 p-4 font-medium text-white transition hover:from-purple-700 hover:to-pink-700 disabled:opacity-70"
                                    >
                                        Reset Password
                                        {loading && <ButtonLoader />}
                                    </button>
                                </div>

                                <div className="text-center">
                                    <Link
                                        href="/auth/sign-in"
                                        className="text-purple-600 hover:text-purple-700 hover:underline"
                                    >
                                        Back to Sign In
                                    </Link>
                                </div>
                            </form>
                        </div>
                    </div>

                    {/* Right Side - Image */}
                    <div className="hidden xl:flex w-full xl:w-3/5 from-blue-50 to-indigo-100 items-center justify-center">
                        <Image
                            src="/images/cover/singinCover.svg"
                            alt="Reset Password Cover"
                            width={450}
                            height={400}
                            className="object-contain max-w-full max-h-full"
                            priority
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function ResetPassword() {
    return (
        <Suspense fallback={<LoadingSpinner message="Loading reset form..." />}>
            <ResetPasswordForm />
        </Suspense>
    );
}