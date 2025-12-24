import { MdCheckCircle, MdLocalHospital, MdPerson, MdDateRange } from "react-icons/md";
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

export default function DonorRequestTimeline({ formData, donorRequest }) {
  // Use formData for add page, donorRequest for details page
  const data = formData || donorRequest;
  
  // Helper function to check if section is completed
  const getSectionStatus = (section) => {
    if (!data) return 'pending';
    
    switch (section) {
      case 'hospital':
        // For details page, check nested objects
        if (donorRequest) {
          return (donorRequest.hospitalId && donorRequest.doctorId) ? 'completed' : 'pending';
        }
        // For add page, check direct IDs
        return (data.hospitalId && data.doctorId) ? 'completed' : 'pending';
        
      case 'basic':
        return (data.requiredByDate && data.gender && data.maritalStatus) ? 'completed' : 'pending';
        
      case 'preferences':
        return (data.cast && data.bloodGroup && data.nationality) ? 'completed' : 'pending';
        
      case 'physical':
        return (data.ageRange?.min && data.ageRange?.max && 
               data.heightRange?.min && data.heightRange?.max &&
               data.weightRange?.min && data.weightRange?.max) ? 'completed' : 'pending';
               
      case 'appearance':
        return (data.skinColour && data.hairColour && data.eyeColour && data.donorEducation) ? 'completed' : 'pending';
        
      default:
        return 'pending';
    }
  };

  const steps = [
    {
      title: "Hospital & Doctor",
      status: getSectionStatus('hospital'),
      date: new Date(),
      description: "Select hospital and doctor"
    },
    {
      title: "Basic Requirements",
      status: getSectionStatus('basic'),
      date: new Date(),
      description: "Date, gender, marital status"
    },
    {
      title: "Personal Preferences",
      status: getSectionStatus('preferences'),
      date: new Date(),
      description: "Cast, blood group, nationality"
    },
    {
      title: "Physical Requirements",
      status: getSectionStatus('physical'),
      date: new Date(),
      description: "Age, height, weight ranges"
    },
    {
      title: "Appearance & Education",
      status: getSectionStatus('appearance'),
      date: new Date(),
      description: "Colors, education level"
    }
  ];

  // Calculate completion percentage
  const completedSteps = steps.filter(step => step.status === 'completed').length;
  const completionPercentage = Math.round((completedSteps / steps.length) * 100);

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900">
          Request Progress
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