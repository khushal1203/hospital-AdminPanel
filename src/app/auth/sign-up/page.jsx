import Signup from "@/components/Auth/Signup";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import Image from "next/image";
import Link from "next/link";

export const metadata = {
    title: "Sign up",
};

export default function SignIn() {
    return (
        <div className="min-h-screen from-purple-50 via-white to-pink-50 flex items-center justify-center p-4">
            <div className="w-full max-w-6xl bg-white rounded-3xl shadow-2xl overflow-hidden">
                <div className="flex flex-col xl:flex-row min-h-[700px]">
                    {/* Left Side - Form */}
                    <div className="w-full xl:w-1/2 p-8 sm:p-12 xl:p-16 flex flex-col justify-center">
                        <div className="max-w-md mx-auto w-full">
                            <div className="text-center mb-8">
                                <Link href="/" className="inline-block mb-6">
                                    <Image
                                        src="/images/logo/logosignin.svg"
                                        alt="Logo"
                                        width={60}
                                        height={40}
                                        className="mx-auto"
                                    />
                                </Link>
                                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                                    Create Account
                                </h1>
                                <p className="text-gray-600">
                                    Join our hospital admin system today
                                </p>
                            </div>
                            <Signup />
                        </div>
                    </div>

                    {/* Right Side - Illustration */}
                    <div className="hidden xl:flex w-full xl:w-1/2 bg-gradient-to-br from-pink-600 via-purple-700 to-blue-600 relative overflow-hidden">
                        <div className="absolute inset-0 bg-black/10"></div>
                        <div className="relative z-10 p-12 flex flex-col justify-center text-white">
                            <div className="mb-8">
                                <h2 className="text-4xl font-bold mb-4">
                                    Join Our Team
                                </h2>
                                <p className="text-xl text-white/90 mb-6">
                                    Get access to powerful tools for managing hospital operations, donor tracking, and administrative tasks.
                                </p>
                                <div className="space-y-3">
                                    <div className="flex items-center gap-3">
                                        <div className="w-2 h-2 bg-white rounded-full"></div>
                                        <span className="text-white/90">Secure Access Control</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="w-2 h-2 bg-white rounded-full"></div>
                                        <span className="text-white/90">Real-time Updates</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="w-2 h-2 bg-white rounded-full"></div>
                                        <span className="text-white/90">Comprehensive Reports</span>
                                    </div>
                                </div>
                            </div>
                            
                            {/* Decorative Elements */}
                            <div className="absolute top-10 right-10 w-32 h-32 bg-white/10 rounded-full blur-xl"></div>
                            <div className="absolute bottom-10 left-10 w-24 h-24 bg-white/10 rounded-full blur-lg"></div>
                            <div className="absolute top-1/2 right-20 w-16 h-16 bg-white/10 rounded-full blur-md"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
