/**
 * Simple Toast Utility
 * Provides toast notifications without external dependencies
 */

let toastContainer = null;

// Create toast container if it doesn't exist
const createToastContainer = () => {
    if (toastContainer) return toastContainer;
    
    toastContainer = document.createElement('div');
    toastContainer.id = 'toast-container';
    toastContainer.className = 'fixed top-4 right-4 z-50 space-y-2';
    document.body.appendChild(toastContainer);
    
    return toastContainer;
};

// Create individual toast element
const createToastElement = (message, type = 'info') => {
    const toast = document.createElement('div');
    
    const typeStyles = {
        success: 'bg-green-500 text-white',
        error: 'bg-red-500 text-white',
        warning: 'bg-yellow-500 text-white',
        info: 'bg-blue-500 text-white'
    };
    
    toast.className = `
        ${typeStyles[type]} 
        px-6 py-3 rounded-lg shadow-lg 
        transform transition-all duration-300 ease-in-out
        translate-x-full opacity-0
        max-w-sm
    `;
    
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
export const showToast = (message, type = 'info', duration = 3000) => {
    if (typeof window === 'undefined') return;
    
    const container = createToastContainer();
    const toast = createToastElement(message, type);
    
    container.appendChild(toast);
    
    // Animate in
    setTimeout(() => {
        toast.classList.remove('translate-x-full', 'opacity-0');
        toast.classList.add('translate-x-0', 'opacity-100');
    }, 10);
    
    // Auto remove after duration
    setTimeout(() => {
        toast.classList.add('translate-x-full', 'opacity-0');
        setTimeout(() => {
            if (toast.parentNode) {
                toast.parentNode.removeChild(toast);
            }
        }, 300);
    }, duration);
};

// Convenience methods
export const toast = {
    success: (message, duration) => showToast(message, 'success', duration),
    error: (message, duration) => showToast(message, 'error', duration),
    warning: (message, duration) => showToast(message, 'warning', duration),
    info: (message, duration) => showToast(message, 'info', duration),
};