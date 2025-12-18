import { MdEdit } from "react-icons/md";
import dayjs from "dayjs";

const InfoSection = ({ title, onEdit, children }) => (
    <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <div className="mb-6 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
            <button
                onClick={onEdit}
                className="flex items-center gap-2 rounded-lg bg-gray-50 px-3 py-1.5 text-sm font-medium text-purple-600 hover:bg-purple-50"
            >
                <MdEdit className="h-4 w-4" />
                Edit
            </button>
        </div>
        <div className="grid grid-cols-1 gap-y-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {children}
        </div>
    </div>
);

const InfoItem = ({ label, value }) => (
    <div className="flex flex-col gap-1">
        <span className="text-xs font-medium text-gray-500 uppercase">{label}</span>
        <span className="text-sm font-medium text-gray-900">{value || "-"}</span>
    </div>
);

export default function OverviewTab({ donor }) {
    return (
        <div className="flex flex-col gap-6">
            <InfoSection title="Personal information" onEdit={() => { }}>
                <InfoItem label="Full Name" value={donor.fullName} />
                <InfoItem label="Husband Name" value={donor.husbandName} />
                <InfoItem label="Aadhaar Card Number" value={donor.aadharNumber} />
                <InfoItem label="Date of Birth" value={donor.dateOfBirth ? dayjs(donor.dateOfBirth).format("DD MMM YYYY") : "-"} />
                <InfoItem label="Gender" value={donor.gender} />
                <InfoItem label="Place of Birth" value={donor.placeOfBirth} />
                <InfoItem label="Marital Status" value={donor.maritalStatus} />
                <InfoItem label="Age" value={donor.age ? `${donor.age} Years` : "-"} />
                <InfoItem label="Religion" value={donor.religion} />
                <InfoItem label="Cast" value={donor.cast} />
                <InfoItem label="Blood Group" value={donor.bloodGroup} />
            </InfoSection>

            <InfoSection title="Contact information" onEdit={() => { }}>
                <InfoItem label="Phone Number" value={donor.contactNumber} />
                <InfoItem label="Reference Name" value={donor.referenceName} />
                <InfoItem label="Email" value={donor.email} />
                <InfoItem label="Ref. Phone Number" value={donor.referenceNumber} />
                <InfoItem label="Address" value={donor.address} />
                <InfoItem label="City" value={donor.city} />
                <InfoItem label="State" value={donor.state} />
                <InfoItem label="Pin Code" value={donor.pincode} />
            </InfoSection>

            <InfoSection title="Physical Attributes" onEdit={() => { }}>
                <InfoItem label="Height" value={donor.height ? `${donor.height}` : "-"} />
                <InfoItem label="Skin Colour" value={donor.skinColor} />
                <InfoItem label="Weight" value={donor.weight ? `${donor.weight} kg` : "-"} />
                <InfoItem label="Hair Colour" value={donor.hairColor} />
                <InfoItem label="Eye Colour" value={donor.eyeColor} />
            </InfoSection>

            <InfoSection title="Professional Details" onEdit={() => { }}>
                <InfoItem label="Donor Education" value={donor.donorEducation} />
                <InfoItem label="Spouse Education" value={donor.spouseEducation} />
                <InfoItem label="Donor Occupation" value={donor.donorOccupation} />
                <InfoItem label="Spouse Occupation" value={donor.spouseOccupation} />
                <InfoItem label="Monthly Income" value={donor.monthlyIncome ? `₹${donor.monthlyIncome}` : "-"} />
            </InfoSection>
        </div>
    );
}
