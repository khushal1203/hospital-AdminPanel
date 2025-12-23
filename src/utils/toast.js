/**
 * Simple Toast Utility
 * Provides toast notifications without external dependencies
 */

let toastContainer = null;

// Create toast container if it doesn't exist
const createToastContainer = () => {
  if (toastContainer && document.body.contains(toastContainer)) {
    return toastContainer;
  }

  // Remove existing container if it exists but not in DOM
  if (toastContainer) {
    toastContainer = null;
  }

  toastContainer = document.createElement("div");
  toastContainer.id = "toast-container";
  toastContainer.className =
    "fixed right-4 z-[10001] space-y-2 pointer-events-none";
  toastContainer.style.top = "100px"; // Position below top navigation
  toastContainer.style.zIndex = "10001";
  document.body.appendChild(toastContainer);

  return toastContainer;
};

// Create individual toast element
const createToastElement = (message, type = "info") => {
  const toast = document.createElement("div");

  const typeStyles = {
    success: "bg-green-400 text-white",
    error: "bg-red-400 text-white",
    warning: "bg-yellow-400 text-black",
    info: "bg-blue-400 text-white",
  };

  toast.className = `
        ${typeStyles[type]} 
        px-6 py-3 rounded-lg shadow-lg 
        transform transition-all duration-300 ease-in-out
        translate-x-full opacity-0
        max-w-sm pointer-events-auto
    `;
  toast.style.zIndex = "10002";

  toast.innerHTML = `
        <div class="flex items-center justify-between">
            <span class="text-sm font-medium">${message}</span>
            <button class="ml-4 text-white hover:text-gray-200" onclick="this.parentElement.parentElement.remove()">
                ×
            </button>
        </div>
    `;

  return toast;
};

// Show toast notification
export const showToast = (message, type = "info", duration = 3000) => {
  if (typeof window === "undefined") return;

  // Ensure DOM is ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => {
      showToast(message, type, duration);
    });
    return;
  }

  const container = createToastContainer();
  const toast = createToastElement(message, type);

  container.appendChild(toast);

  // Force reflow and animate in immediately
  requestAnimationFrame(() => {
    toast.classList.remove("translate-x-full", "opacity-0");
    toast.classList.add("translate-x-0", "opacity-100");
  });

  // Auto remove after duration
  setTimeout(() => {
    if (toast.parentNode) {
      toast.classList.add("translate-x-full", "opacity-0");
      setTimeout(() => {
        if (toast.parentNode) {
          toast.parentNode.removeChild(toast);
        }
      }, 300);
    }
  }, duration);
};

// Convenience methods
export const toast = {
  success: (message, duration) => showToast(message, "success", duration),
  error: (message, duration) => showToast(message, "error", duration),
  warning: (message, duration) => showToast(message, "warning", duration),
  info: (message, duration) => showToast(message, "info", duration),
};
