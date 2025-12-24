import DonorRequest from "@/modals/donorRequestModal";
import Centre from "@/modals/centreModal";
import { User } from "@/modals/userModal";

export const getAllDonorRequestsController = async ({ search = "", skip = 0, limit = 10, status = "" }) => {
  try {
    let query = {};
    
    if (status) {
      query.status = status;
    }
    
    if (search) {
      query.$or = [
        { cast: { $regex: search, $options: "i" } },
        { nationality: { $regex: search, $options: "i" } },
        { donorEducation: { $regex: search, $options: "i" } },
      ];
    }

    const requests = await DonorRequest.find(query)
      .populate("hospitalId", "hospitalName city")
      .populate({
        path: "doctorId",
        select: "fullName email",
        model: "User"
      })
      .populate("createdBy", "fullName")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await DonorRequest.countDocuments(query);

    return {
      requests,
      total,
    };
  } catch (error) {
    console.error("Error in getAllDonorRequestsController:", error);
    throw error;
  }
};