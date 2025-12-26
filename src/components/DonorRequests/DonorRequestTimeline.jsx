import { MdCheckCircle, MdLocalHospital, MdPerson, MdDateRange } from "react-icons/md";
import dayjs from "dayjs";
import { maskName } from "@/utils/privacy";
import { useState } from "react";
import { toast } from "@/utils/toast";

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
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejecting, setRejecting] = useState(false);
  const handleRejectDonor = async () => {
    try {
      setRejecting(true);
      const token = localStorage.getItem("token");
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_END_POINT}/donor-requests/${donorRequest._id}/reject-donor`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      if (data.success) {
        toast.success("Donor rejected successfully");
        setShowRejectModal(false);
        window.location.reload();
      } else {
        toast.error(data.message || "Failed to reject donor");
      }
    } catch (error) {
      toast.error("Failed to reject donor");
    } finally {
      setRejecting(false);
    }
  };

  const handleAcceptDonor = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_END_POINT}/donor-requests/${donorRequest._id}/accept-donor`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      if (data.success) {
        toast.success("Donor accepted");
        window.location.reload();
      } else {
        toast.error(data.message || "Failed to accept donor");
      }
    } catch (error) {
      toast.error("Failed to accept donor");
    }
  };
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
              {donorRequest.status === "accepted" ? "Accepted Donor" : "Allotted Donor"}
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              {donorRequest.status === "accepted" ? "Donor has been accepted" : "Please review the donor details below"}
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
                <h4 className="font-semibold text-gray-900">{maskName(donor.fullName)}</h4>
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
              {donorRequest.status === "accepted" ? (
                <div className="text-center py-2">
                  <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-green-100 text-green-800">
                    ✓ Accepted
                  </span>
                </div>
              ) : (
                <div className="flex gap-3">
                  <button 
                    onClick={handleAcceptDonor}
                    className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700 transition-colors"
                  >
                    Accept Donor
                  </button>
                  <button 
                    onClick={() => setShowRejectModal(true)}
                    className="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-700 transition-colors"
                  >
                    Reject Donor
                  </button>
                </div>
              )}
            </div>
          </div>
          
          <RejectModal 
            showRejectModal={showRejectModal}
            setShowRejectModal={setShowRejectModal}
            handleRejectDonor={handleRejectDonor}
            rejecting={rejecting}
          />
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

// Reject Modal Component - Outside the main component
const RejectModal = ({ showRejectModal, setShowRejectModal, handleRejectDonor, rejecting }) => {
  if (!showRejectModal) return null;
  
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white shadow-2xl">
        <div className="border-b border-gray-200 px-6 py-4">
          <h3 className="text-xl font-semibold text-gray-900">
            Reject Request?
          </h3>
        </div>

        <div className="p-6">
          <p className="text-gray-600 leading-relaxed">
            Are you sure you want to reject this donor request? Once rejected, it cannot be reversed. The bank will be notified of your decision.
          </p>
        </div>

        <div className="border-t border-gray-200 bg-gray-50 px-6 py-4 rounded-xl">
          <div className="flex justify-end gap-3">
            <button
              onClick={() => setShowRejectModal(false)}
              className="rounded-lg border border-gray-300 bg-white px-6 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleRejectDonor}
              disabled={rejecting}
              className="rounded-lg bg-red-600 px-6 py-2.5 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50"
            >
              {rejecting ? "Rejecting..." : "Reject Donor"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};