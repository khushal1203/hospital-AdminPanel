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
  
  // If this is a doctor viewing their request and no donor is allotted yet
  if (donorRequest && !donorRequest.isAlloted) {
    const user = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem("user") || "{}") : {};
    const isRequestCreator = (donorRequest.createdBy?._id || donorRequest.createdBy) === (user._id || user.id);
    
    if (isRequestCreator) {
      return (
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <div className="text-center">
            <div className="mx-auto mb-4">
              <img 
                src="/images/icon/donorhistory.svg" 
                alt="Donor History" 
                className="h-16 w-16 mx-auto filter brightness-0"
              />
            </div>
            <p className="text-sm text-gray-600 leading-relaxed">
              Thank you for your request. The bank is reviewing it, and once a donor is allotted, the information will be available here.
            </p>
          </div>
        </div>
      );
    }
  }
  
  // If this is a doctor viewing their request and donor is allotted
  if (donorRequest && donorRequest.isAlloted && donorRequest.allottedTo) {
    const user = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem("user") || "{}") : {};
    const isRequestCreator = (donorRequest.createdBy?._id || donorRequest.createdBy) === (user._id || user.id);
    
    if (isRequestCreator) {
      const donor = donorRequest.allottedTo;
      
      return (
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900">
              Allotted Donor
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              Please review the donor details below
            </p>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <img
                src={donor.donorImage || "/images/user/user-03.png"}
                alt="Donor"
                className="h-16 w-16 rounded-full object-cover border-2 border-gray-200"
              />
              <div>
                <h4 className="font-semibold text-gray-900">{donor.fullName || "N/A"}</h4>
                <p className="text-sm text-gray-600">{donor.age || "N/A"} years • {donor.gender || "N/A"}</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 gap-3 text-sm">
              <div>
                <span className="text-gray-600">Gender:</span>
                <span className="ml-2 font-medium capitalize">{donor.gender || "N/A"}</span>
              </div>
              <div>
                <span className="text-gray-600">Age:</span>
                <span className="ml-2 font-medium">{donor.age || "N/A"} years</span>
              </div>
              <div>
                <span className="text-gray-600">Marital Status:</span>
                <span className="ml-2 font-medium capitalize">{donor.maritalStatus || "N/A"}</span>
              </div>
              <div>
                <span className="text-gray-600">Religion:</span>
                <span className="ml-2 font-medium">{donor.religion || "N/A"}</span>
              </div>
              <div>
                <span className="text-gray-600">Blood Group:</span>
                <span className="ml-2 font-medium">{donor.bloodGroup || "N/A"}</span>
              </div>
              <div>
                <span className="text-gray-600">Date of Birth:</span>
                <span className="ml-2 font-medium">{donor.dateOfBirth ? dayjs(donor.dateOfBirth).format("DD MMM YYYY") : "N/A"}</span>
              </div>
              <div>
                <span className="text-gray-600">Place of Birth:</span>
                <span className="ml-2 font-medium">{donor.placeOfBirth || "N/A"}</span>
              </div>
              <div>
                <span className="text-gray-600">Cast:</span>
                <span className="ml-2 font-medium">{donor.cast || "N/A"}</span>
              </div>
            </div>
            
            <div className="pt-4 border-t border-gray-200">
              <div className="flex gap-3">
                <button className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700 transition-colors">
                  Accept Donor
                </button>
                <button className="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-700 transition-colors">
                  Reject Donor
                </button>
              </div>
            </div>
          </div>
        </div>
      );
    }
  }
  
  // Default timeline for admin view or add page
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