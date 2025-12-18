"use client";

import { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { MdCalendarToday } from "react-icons/md";

const DatePicker = ({ label, error, className, value, onChange, placeholder, ...props }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedDate, setSelectedDate] = useState(value || null);

    const handleDateChange = (date) => {
        setSelectedDate(date);
        onChange && onChange(date);
        setIsOpen(false);
    };

    const formatDate = (date) => {
        if (!date) return "";
        return date.toLocaleDateString("en-GB");
    };

    return (
        <div className={className}>
            {label && (
                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    {label}
                </label>
            )}
            <div className="relative">
                <input
                    type="text"
                    value={formatDate(selectedDate)}
                    placeholder={placeholder || "Select date"}
                    readOnly
                    onClick={() => setIsOpen(!isOpen)}
                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 pr-10 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white cursor-pointer"
                />
                <MdCalendarToday 
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 cursor-pointer" 
                    onClick={() => setIsOpen(!isOpen)}
                />
                {isOpen && (
                    <div className="absolute top-full left-0 z-50 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg">
                        <Calendar
                            onChange={handleDateChange}
                            value={selectedDate}
                            className="react-calendar-custom"
                            {...props}
                        />
                    </div>
                )}
            </div>
            {error && (
                <p className="mt-1 text-sm text-red-600">{error}</p>
            )}
            <style jsx global>{`
                .react-calendar-custom {
                    border: none;
                    font-family: inherit;
                }
                .react-calendar-custom .react-calendar__navigation {
                    display: flex;
                    height: 44px;
                    margin-bottom: 1em;
                }
                .react-calendar-custom .react-calendar__navigation button {
                    min-width: 44px;
                    background: none;
                    border: none;
                    font-size: 16px;
                    font-weight: 600;
                    color: #374151;
                }
                .react-calendar-custom .react-calendar__navigation button:hover {
                    background-color: #f3f4f6;
                }
                .react-calendar-custom .react-calendar__tile {
                    max-width: 100%;
                    padding: 10px 6px;
                    background: none;
                    border: none;
                    font-size: 14px;
                    color: #374151;
                }
                .react-calendar-custom .react-calendar__tile:hover {
                    background-color: #dbeafe;
                    color: #1d4ed8;
                }
                .react-calendar-custom .react-calendar__tile--active {
                    background: #3b82f6;
                    color: white;
                }
                .react-calendar-custom .react-calendar__tile--now {
                    background: #fef3c7;
                    color: #92400e;
                }
            `}</style>
        </div>
    );
};

export default DatePicker;