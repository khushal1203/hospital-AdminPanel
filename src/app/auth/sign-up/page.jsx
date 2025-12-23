import Signup from "@/components/Auth/Signup";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import Image from "next/image";
import Link from "next/link";

export const metadata = {
  title: "Sign up",
};

export default function SignIn() {
  return (
    <div className="flex min-h-screen items-center justify-center from-purple-50 via-white to-pink-50 p-4">
      <div className="w-full max-w-6xl overflow-hidden rounded-3xl bg-white shadow-2xl">
        <div className="flex min-h-[700px] flex-col xl:flex-row">
          {/* Left Side - Form */}
          <div className="flex w-full flex-col justify-center p-8 sm:p-12 xl:w-1/2 xl:p-16">
            <div className="mx-auto w-full max-w-md">
              <div className="mb-8 text-center">
                <Link href="/" className="mb-6 inline-block">
                  <Image
                    src="/images/logo/logosignin.svg"
                    alt="Logo"
                    width={60}
                    height={40}
                    className="mx-auto"
                  />
                </Link>
                <h1 className="mb-2 text-3xl font-bold text-gray-900">
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
          <div className="relative hidden w-full overflow-hidden bg-gradient-to-br from-pink-600 via-purple-700 to-blue-600 xl:flex xl:w-1/2">
            <div className="absolute inset-0 bg-black/10"></div>
            <div className="relative z-10 flex flex-col justify-center p-12 text-white">
              <div className="mb-8">
                <h2 className="mb-4 text-4xl font-bold">Join Our Team</h2>
                <p className="mb-6 text-xl text-white/90">
                  Get access to powerful tools for managing hospital operations,
                  donor tracking, and administrative tasks.
                </p>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="h-2 w-2 rounded-full bg-white"></div>
                    <span className="text-white/90">Secure Access Control</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="h-2 w-2 rounded-full bg-white"></div>
                    <span className="text-white/90">Real-time Updates</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="h-2 w-2 rounded-full bg-white"></div>
                    <span className="text-white/90">Comprehensive Reports</span>
                  </div>
                </div>
              </div>

              {/* Decorative Elements */}
              <div className="absolute right-10 top-10 h-32 w-32 rounded-full bg-white/10 blur-xl"></div>
              <div className="absolute bottom-10 left-10 h-24 w-24 rounded-full bg-white/10 blur-lg"></div>
              <div className="absolute right-20 top-1/2 h-16 w-16 rounded-full bg-white/10 blur-md"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
