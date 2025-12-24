import { MdCheckCircle, MdPerson, MdWork, MdSchool, MdDescription } from "react-icons/md";
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
          className={`h-2 w-2 rounded-full ${isCompleted ? "bg-purple-600" : "bg-gray-300"}`}
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

export default function UserTimeline({ user }) {
  // Helper function to check if section is completed
  const getSectionStatus = (section) => {
    switch (section) {
      case 'basic':
        return user?.fullName && user?.email && user?.phoneNumber ? 'completed' : 'pending';
      case 'personal':
        return user?.gender && user?.dateOfBirth && user?.address ? 'completed' : 'pending';
      case 'professional':
        return user?.department && user?.employeeId ? 'completed' : 'pending';
      case 'educational':
        return user?.qualification && user?.instituteName ? 'completed' : 'pending';
      case 'documents':
        return user?.documents && user.documents.length > 0 ? 'completed' : 'pending';
      default:
        return 'pending';
    }
  };

  const steps = [
    {
      title: "User Registered",
      status: "completed",
      date: user?.createdAt,
      description: "Account created successfully"
    },
    {
      title: "Basic Information",
      status: getSectionStatus('basic'),
      date: user?.updatedAt,
      description: "Name, email, phone number"
    },
    {
      title: "Personal Details",
      status: getSectionStatus('personal'),
      date: user?.updatedAt,
      description: "Gender, DOB, address, Aadhar"
    },
    {
      title: "Professional Info",
      status: getSectionStatus('professional'),
      date: user?.updatedAt,
      description: "Department, employee ID, experience"
    },
    {
      title: "Educational Info",
      status: getSectionStatus('educational'),
      date: user?.updatedAt,
      description: "Qualification, institute, field of study"
    },
    {
      title: "Documents Upload",
      status: getSectionStatus('documents'),
      date: user?.updatedAt,
      description: "Certificates and required documents"
    }
  ];

  // Calculate completion percentage
  const completedSteps = steps.filter(step => step.status === 'completed').length;
  const completionPercentage = Math.round((completedSteps / steps.length) * 100);

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900">
          User Profile Timeline
        </h3>
        <div className="mt-2 flex items-center gap-2">
          <div className="flex-1 bg-gray-200 rounded-full h-2">
            <div 
              className="bg-purple-600 h-2 rounded-full transition-all duration-300"
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