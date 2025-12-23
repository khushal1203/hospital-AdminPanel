"use client";

import { useState } from "react";
import { MdClose } from "react-icons/md";
import { ButtonLoader } from "@/components/ui/LoadingSpinner";

export default function AddFollicularScanModal({ isOpen, onClose, onSave }) {
  const [formData, setFormData] = useState({
    scanDate: "",
    lmpDay: "",
    etValue: "",
    rightOvary: "",
    leftOvary: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await onSave(formData);
      setFormData({
        scanDate: "",
        lmpDay: "",
        etValue: "",
        rightOvary: "",
        leftOvary: "",
      });
      onClose();
    } catch (error) {
      console.error("Error saving scan:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-lg bg-white p-6 shadow-xl">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">
            Add Follicular Scan
          </h2>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
          >
            <MdClose className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium uppercase text-gray-700">
                Scan Date
              </label>
              <input
                type="date"
                name="scanDate"
                value={formData.scanDate}
                onChange={handleChange}
                required
                className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-purple-500 focus:outline-none"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium uppercase text-gray-700">
                Day of LMP
              </label>
              <input
                type="number"
                name="lmpDay"
                value={formData.lmpDay}
                onChange={handleChange}
                className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-purple-500 focus:outline-none"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium uppercase text-gray-700">
                ET Value
              </label>
              <input
                type="text"
                name="etValue"
                value={formData.etValue}
                onChange={handleChange}
                className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-purple-500 focus:outline-none"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium uppercase text-gray-700">
                Right Ovary
              </label>
              <input
                type="text"
                name="rightOvary"
                value={formData.rightOvary}
                onChange={handleChange}
                className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-purple-500 focus:outline-none"
              />
            </div>

            <div className="flex flex-col gap-1 md:col-span-2">
              <label className="text-xs font-medium uppercase text-gray-700">
                Left Ovary
              </label>
              <input
                type="text"
                name="leftOvary"
                value={formData.leftOvary}
                onChange={handleChange}
                className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-purple-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="mt-6 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex items-center gap-2 rounded-lg bg-purple-600 px-4 py-2 text-sm font-medium text-white hover:bg-purple-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isLoading && <ButtonLoader />}
              {isLoading ? "Adding..." : "Add Scan"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
