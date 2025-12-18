import Signup from "@/components/Auth/Signup";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import Image from "next/image";
import Link from "next/link";

export const metadata = {
    title: "Sign up",
};

export default function SignIn() {
    return (
        <>

            <div className="rounded-[10px] bg-white shadow-1 dark:bg-gray-dark dark:shadow-card">
                <div className="flex flex-wrap items-center">
                    <div className="w-full xl:w-1/2">
                        <div className="w-full p-4 sm:p-12.5 xl:p-15">
                            <Signup />
                        </div>
                    </div>

                    <div className="hidden w-full p-7.5 xl:block xl:w-1/2">
                        <div className="bg-gradient-to-br from-blue-600 to-purple-700 overflow-hidden rounded-2xl px-12.5 pt-12.5">
                            <Link className="mb-10 inline-block" href="/">
                                <Image
                                    src="/images/icon/brand.svg"
                                    alt="Logo"
                                    width={176}
                                    height={32}
                                />
                            </Link>

                            <p className="mb-3 text-xl font-medium text-white">
                                Create your account
                            </p>

                            <h1 className="mb-4 text-2xl font-bold text-white sm:text-heading-3">
                                Join Us Today!
                            </h1>

                            <p className="w-full max-w-[375px] font-medium text-white/80">
                                Please create your account by completing the necessary
                                fields below
                            </p>

                            <div className="mt-31">
                                <Image
                                    src="/images/grids/grid-02.svg"
                                    alt="Grid"
                                    width={405}
                                    height={325}
                                    className="mx-auto dark:opacity-30"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
