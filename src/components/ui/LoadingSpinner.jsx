import Image from "next/image";

export default function LoadingSpinner({
  size = "default",
  message = "Loading...",
}) {
  const sizeClasses = {
    small: "h-40 w-40",
    default: "h-40 w-40",
    large: "h-40 w-40",
  };

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="flex flex-col items-center gap-6">
        {/* Brand image with floating animation */}
        <div className={`${sizeClasses[size]} relative animate-bounce`}>
          <Image
            src="/images/icon/brand-black.svg"
            alt="Loading"
            fill
            className="object-contain"
          />
        </div>

        {/* Animated dots */}
        {/* <div className="flex gap-2">
          <div
            className="h-3 w-3 animate-pulse rounded-full bg-purple-600"
            style={{ animationDelay: "0ms" }}
          ></div>
          <div
            className="h-3 w-3 animate-pulse rounded-full bg-purple-600"
            style={{ animationDelay: "150ms" }}
          ></div>
          <div
            className="h-3 w-3 animate-pulse rounded-full bg-purple-600"
            style={{ animationDelay: "300ms" }}
          ></div>
        </div> */}

        {/* Loading text */}
        <p className="text-sm font-medium text-gray-600">{message}</p>
      </div>
    </div>
  );
}

// Alternative compact version
export function CompactLoader({ message = "Loading..." }) {
  return (
    <div className="flex items-center justify-center gap-3 py-8">
      <div className="relative h-8 w-8 animate-pulse">
        <Image
          src="/images/icon/brand-black.svg"
          alt="Loading"
          fill
          className="object-contain"
        />
      </div>
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
