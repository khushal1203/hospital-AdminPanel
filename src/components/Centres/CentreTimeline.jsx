import { MdCheckCircle, MdBusiness, MdPerson, MdLocationOn, MdSecurity } from "react-icons/md";
import dayjs from "dayjs";

const TimelineItem = ({ title, status, date, isLast, description }) => {
  const isCompleted = status === "completed";

  return (
    <div className="relative flex gap-4 pb-8">
      {!isLast && (
        <div className="absolute left-[15px] top-6 h-full w-0.5 bg-gray-100"></div>
      )}

      <div className="relative z-10 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full border border-gray-100 bg-white">
        <div
          className={`h-2 w-2 rounded-full ${isCompleted ? "bg-blue-600" : "bg-gray-300"}`}
        ></div>
      </div>

      <div className="flex flex-1 flex-col pt-1">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-semibold text-gray-900">{title}</h4>
        </div>

        <div className="mt-1 flex items-center gap-2">
          <span className={`text-[10px] font-bold ${isCompleted ? 'text-green-600' : 'text-orange-400'}`}>
            {isCompleted ? 'Completed' : 'Pending'}
          </span>
          {date && (
            <span className="text-[10px] text-gray-400">
              • {dayjs(date).format("DD MMM YYYY")}
            </span>
          )}
        </div>
        
        {description && (
          <p className="mt-1 text-xs text-gray-500">{description}</p>
        )}
      </div>
    </div>
  );
};

export default function CentreTimeline({ centre, doctors = [] }) {
  // Helper function to check if section is completed
  const getSectionStatus = (section) => {
    switch (section) {
      case 'hospital':
        return centre?.hospitalName && centre?.phoneNumber && centre?.email && centre?.hospitalLicenseNumber ? 'completed' : 'pending';
      case 'location':
        return centre?.address && centre?.city && centre?.state && centre?.pincode ? 'completed' : 'pending';
      case 'doctor':
        return doctors.length > 0 && doctors.some(doctor => doctor.role === 'doctor') ? 'completed' : 'pending';
      case 'verification':
        return centre?.isActive ? 'completed' : 'pending';
      default:
        return 'pending';
    }
  };

  const steps = [
    {
      title: "Centre Registered",
      status: "completed",
      date: centre?.createdAt,
      description: "Centre registration initiated"
    },
    {
      title: "Hospital Information",
      status: getSectionStatus('hospital'),
      date: centre?.updatedAt,
      description: "Hospital name, contact, license"
    },
    {
      title: "Location Details",
      status: getSectionStatus('location'),
      date: centre?.updatedAt,
      description: "Address, city, state, pincode"
    },
    {
      title: "Doctor Information",
      status: getSectionStatus('doctor'),
      date: centre?.updatedAt,
      description: `${doctors.filter(d => d.role === 'doctor').length} doctor${doctors.filter(d => d.role === 'doctor').length !== 1 ? 's' : ''} added`
    },
    {
      title: "Verification Complete",
      status: getSectionStatus('verification'),
      date: centre?.updatedAt,
      description: "Centre approved and activated"
    }
  ];

  // Calculate completion percentage
  const completedSteps = steps.filter(step => step.status === 'completed').length;
  const completionPercentage = Math.round((completedSteps / steps.length) * 100);

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900">
          Centre Registration Timeline
        </h3>
        <div className="mt-2 flex items-center gap-2">
          <div className="flex-1 bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${completionPercentage}%` }}
            ></div>
          </div>
          <span className="text-sm font-medium text-gray-700">
            {completionPercentage}%
          </span>
        </div>
      </div>
      
      <div className="flex flex-col">
        {steps.map((step, index) => (
          <TimelineItem
            key={index}
            {...step}
            isLast={index === steps.length - 1}
          />
        ))}
      </div>
    </div>
  );
}