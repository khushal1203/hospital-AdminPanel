"use client";

import { useState, useRef } from "react";
import { MdCloudUpload, MdDelete, MdImage } from "react-icons/md";

const ImageUpload = ({ label, onImageChange, error, className, accept = "image/*" }) => {
    const [preview, setPreview] = useState(null);
    const [dragActive, setDragActive] = useState(false);
    const fileInputRef = useRef(null);

    const handleFileChange = (file) => {
        if (file && file.type.startsWith('image/')) {
            // Validate file size (5MB max)
            if (file.size > 5 * 1024 * 1024) {
                alert('File size must be less than 5MB');
                return;
            }

            const reader = new FileReader();
            reader.onload = (e) => {
                setPreview(e.target.result);
            };
            reader.readAsDataURL(file);
            
            onImageChange?.(file);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        
        const file = e.dataTransfer.files[0];
        handleFileChange(file);
    };

    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const removeImage = () => {
        setPreview(null);
        onImageChange?.(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    return (
        <div className={className}>
            {label && (
                <label className="mb-3 block text-sm font-medium text-dark dark:text-white">
                    {label}
                </label>
            )}
            
            <div
                className={`relative rounded-lg border-2 border-dashed p-6 text-center transition-colors ${
                    dragActive
                        ? 'border-primary bg-primary/5'
                        : 'border-gray-300 hover:border-primary dark:border-gray-600'
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
            >
                <input
                    ref={fileInputRef}
                    type="file"
                    accept={accept}
                    onChange={(e) => handleFileChange(e.target.files[0])}
                    className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                />

                {preview ? (
                    <div className="relative">
                        <img
                            src={preview}
                            alt="Preview"
                            className="mx-auto h-32 w-32 rounded-lg object-cover"
                        />
                        <button
                            type="button"
                            onClick={removeImage}
                            className="absolute -right-2 -top-2 rounded-full bg-red-500 p-1 text-white hover:bg-red-600"
                        >
                            <MdDelete className="h-4 w-4" />
                        </button>
                        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                            Click to change image
                        </p>
                    </div>
                ) : (
                    <div>
                        <MdCloudUpload className="mx-auto h-12 w-12 text-gray-400" />
                        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                            <span className="font-semibold">Click to upload</span> or drag and drop
                        </p>
                        <p className="text-xs text-gray-500">PNG, JPG, GIF up to 5MB</p>
                    </div>
                )}
            </div>

            {error && (
                <p className="mt-1 text-sm text-red-600">{error}</p>
            )}
        </div>
    );
};

export default ImageUpload;