"use client";

import Select from "react-select";

const SelectField = ({ label, options, error, className, ...props }) => {
    const customStyles = {
        control: (provided, state) => ({
            ...provided,
            backgroundColor: 'transparent',
            border: `1px solid ${state.isFocused ? '#3C50E0' : '#E2E8F0'}`,
            borderRadius: '8px',
            padding: '8px 12px',
            minHeight: '48px',
            boxShadow: 'none',
            '&:hover': {
                borderColor: '#3C50E0',
            },
        }),
        option: (provided, state) => ({
            ...provided,
            backgroundColor: state.isSelected ? '#3C50E0' : state.isFocused ? '#F1F5F9' : 'white',
            color: state.isSelected ? 'white' : '#1C2434',
            '&:hover': {
                backgroundColor: state.isSelected ? '#3C50E0' : '#F1F5F9',
            },
        }),
        singleValue: (provided) => ({
            ...provided,
            color: '#1C2434',
        }),
        placeholder: (provided) => ({
            ...provided,
            color: '#64748B',
        }),
    };

    return (
        <div className={className}>
            {label && (
                <label className="mb-3 block text-sm font-medium text-dark dark:text-white">
                    {label}
                </label>
            )}
            <Select
                styles={customStyles}
                options={options}
                {...props}
            />
            {error && (
                <p className="mt-1 text-sm text-red-600">{error}</p>
            )}
        </div>
    );
};

export default SelectField;