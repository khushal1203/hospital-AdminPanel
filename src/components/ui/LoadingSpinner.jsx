import Image from "next/image";

export default function LoadingSpinner({ size = "default", message = "Loading..." }) {
    const sizeClasses = {
        small: "h-16 w-16",
        default: "h-24 w-24", 
        large: "h-32 w-32"
    };

    return (
        <div className="flex min-h-[400px] items-center justify-center">
            <div className="flex flex-col items-center gap-4">
                {/* Logo with pulse animation */}
                <div className={`${sizeClasses[size]} relative animate-pulse`}>
                    <Image
                        src="/images/logo/logo.svg"
                        alt="Hospital Logo"
                        fill
                        className="object-contain"
                    />
                </div>
                
                {/* Spinning ring */}
                <div className="relative">
                    <div className="h-12 w-12 animate-spin rounded-full border-4 border-purple-200 border-t-purple-600"></div>
                </div>
                
                {/* Loading text */}
                <p className="text-sm font-medium text-gray-600 animate-pulse">
                    {message}
                </p>
            </div>
        </div>
    );
}

// Alternative compact version
export function CompactLoader({ message = "Loading..." }) {
    return (
        <div className="flex items-center justify-center gap-3 py-8">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-purple-200 border-t-purple-600"></div>
            <span className="text-sm text-gray-600">{message}</span>
        </div>
    );
}

// Inline loader for buttons
export function ButtonLoader() {
    return (
        <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
    );
}