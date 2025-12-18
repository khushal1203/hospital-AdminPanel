import { MdSearch, MdCalendarToday, MdFilterList, MdViewColumn } from "react-icons/md";

export default function DonorTableToolbar() {
    return (
        <div className="flex flex-col gap-4 py-4 sm:flex-row sm:items-center sm:justify-between bg-white px-1">
            {/* Search Input */}
            <div className="relative w-full sm:w-72">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <MdSearch className="h-5 w-5 text-gray-400" />
                </div>
                <input
                    type="text"
                    className="block w-full rounded-lg border border-gray-200 bg-white p-2.5 pl-10 text-sm text-gray-900 outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                    placeholder="Search donors..."
                />
            </div>

            {/* Actions */}
            <div className="flex flex-wrap items-center gap-2">
                {/* Date Picker Button */}
                <button className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
                    <MdCalendarToday className="h-4 w-4 text-gray-500" />
                    <span>Fri 25 Apr, 2025</span> {/* Mock Date */}
                </button>

                {/* Filter Button */}
                <button className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
                    <MdFilterList className="h-4 w-4 text-gray-500" />
                    <span>Filter</span>
                </button>

                {/* Customize Columns Button */}
                <button className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
                    <span>Customize Columns</span>
                    <svg className="h-4 w-4 text-gray-500" /* Chevron Down */ viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                </button>
            </div>
        </div>
    );
}
