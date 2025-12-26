import { Donor } from "@/modals/donorModal";
import mongoose from "mongoose";

/**
 * Create a new donor
 */
export const createDonorController = async (body, userId) => {
  const {
    donorType,
    donorImage,
    dateOfBirth,
    age,
    fullName,
    husbandName,
    gender,
    aadharNumber,
    maritalStatus,
    cast,
    phoneNumber,
    email,
    referenceName,
    referenceNumber,
    address,
    city,
    state,
    pincode,
    placeOfBirth,
    religion,
    bloodGroup,
    donorEducation,
    donorOccupation,
    monthlyIncome,
    spouseEducation,
    spouseOccupation,
    lmpDate,
    lmpDay,
    etValue,
    rightOvary,
    leftOvary,
    stimulationProcess,
    processStartDate,
    height,
    weight,
    skinColor,
    hairColor,
    eyeColor,
    numberOfDeliveries,
    numberOfAbortions,
    otherNotes,
    menstrualHistory,
    contraceptives,
    medicalHistory,
    familyMedicalHistory,
    abnormalityInChild,
    bloodTransfusion,
    substanceAbuse,
    geneticAbnormality,
    pulse,
    bp,
    temperature,
    respiratorySystem,
    cardiovascularSystem,
    abdominalExamination,
    otherSystems,
    documents,
    status,
  } = body;

  // Validate required fields
  if (!fullName || !dateOfBirth) {
    throw new Error("Required fields are missing: fullName, dateOfBirth");
  }

  // Generate donor ID
  const count = await Donor.countDocuments();
  const generatedDonorId = `#${String(count + 809776).padStart(6, "0")}`;

  // Create donor data with all fields (including null/empty values)
  const donorData = {
    donorId: generatedDonorId,
    donorType: donorType || null,
    donorImage: donorImage || null,
    dateOfBirth,
    age: age || null,
    fullName,
    husbandName: husbandName || null,
    gender: gender ? gender.toLowerCase() : null,
    aadharNumber: aadharNumber || null,
    maritalStatus: maritalStatus ? maritalStatus.toLowerCase() : null,
    cast: cast || null,
    contactNumber: phoneNumber || null,
    email: email || null,
    referenceName: referenceName || null,
    referenceNumber: referenceNumber || null,
    address: address || null,
    city: city || null,
    state: state || null,
    pincode: pincode || null,
    placeOfBirth: placeOfBirth || null,
    religion: religion || null,
    bloodGroup: bloodGroup || null,
    donorEducation: donorEducation || null,
    donorOccupation: donorOccupation || null,
    monthlyIncome: monthlyIncome || null,
    spouseEducation: spouseEducation || null,
    spouseOccupation: spouseOccupation || null,
    height: height || null,
    weight: weight || null,
    skinColor: skinColor || null,
    hairColor: hairColor || null,
    eyeColor: eyeColor || null,
    menstrualHistory: menstrualHistory !== undefined ? menstrualHistory : null,
    contraceptives: contraceptives !== undefined ? contraceptives : null,
    medicalHistory: medicalHistory !== undefined ? medicalHistory : null,
    familyMedicalHistory:
      familyMedicalHistory !== undefined ? familyMedicalHistory : null,
    abnormalityInChild:
      abnormalityInChild !== undefined ? abnormalityInChild : null,
    bloodTransfusion: bloodTransfusion !== undefined ? bloodTransfusion : null,
    substanceAbuse: substanceAbuse !== undefined ? substanceAbuse : null,
    geneticAbnormality:
      geneticAbnormality !== undefined ? geneticAbnormality : null,
    status: "active",
    bloodReportStatus: "pending",
    opuProcessStatus: "pending",
    createdBy: userId,
    allottedBy: userId,

    // Predefined documents structure
    documents: {
      donorDocuments: [
        {
          reportName: "Consent Form",
          documentName: null,
          filePath: null,
          uploadBy: null,
          uploadDate: null,
          hasFile: false,
          isUploaded: false,
        },
        {
          reportName: "Affidavit Form",
          documentName: null,
          filePath: null,
          uploadBy: null,
          uploadDate: null,
          hasFile: false,
          isUploaded: false,
        },
      ],
      reports: [
        {
          reportName: "OvaCare Evaluation Report",
          documentName: null,
          filePath: null,
          uploadBy: null,
          uploadDate: null,
          hasFile: false,
          isUploaded: false,
        },
        {
          reportName: "Lumine Report",
          documentName: null,
          filePath: null,
          uploadBy: null,
          uploadDate: null,
          hasFile: false,
          isUploaded: false,
        },
        {
          reportName: "Blood Report",
          documentName: null,
          filePath: null,
          uploadBy: null,
          uploadDate: null,
          hasFile: false,
          isUploaded: false,
        },
        {
          reportName: "OPU Process",
          documentName: null,
          filePath: null,
          uploadBy: null,
          uploadDate: null,
          hasFile: false,
          isUploaded: false,
        },
      ],
      otherDocuments: [
        {
          reportName: "Aadhaar Card Front",
          documentName: null,
          filePath: null,
          uploadBy: null,
          uploadDate: null,
          hasFile: false,
          isUploaded: false,
        },
        {
          reportName: "Aadhaar Card Back",
          documentName: null,
          filePath: null,
          uploadBy: null,
          uploadDate: null,
          hasFile: false,
          isUploaded: false,
        },
        {
          reportName: "Husband/Nominee Aadhaar Card Front",
          documentName: null,
          filePath: null,
          uploadBy: null,
          uploadDate: null,
          hasFile: false,
          isUploaded: false,
        },
        {
          reportName: "Husband/Nominee Aadhaar Card Back",
          documentName: null,
          filePath: null,
          uploadBy: null,
          uploadDate: null,
          hasFile: false,
          isUploaded: false,
        },
        {
          reportName: "Health Insurance Document",
          documentName: null,
          filePath: null,
          uploadBy: null,
          uploadDate: null,
          hasFile: false,
          isUploaded: false,
        },
        {
          reportName: "Life Insurance Document",
          documentName: null,
          filePath: null,
          uploadBy: null,
          uploadDate: null,
          hasFile: false,
          isUploaded: false,
        },
      ],
      allotmentDocuments: [
        {
          reportName: "Donor Agreement",
          documentName: null,
          filePath: null,
          uploadBy: null,
          uploadDate: null,
          hasFile: false,
          isUploaded: false,
        },
        {
          reportName: "Hospital Evaluation Report",
          documentName: null,
          filePath: null,
          uploadBy: null,
          uploadDate: null,
          hasFile: false,
          isUploaded: false,
        },
      ],
    },

    // Always include nested objects (even if empty)
    follicularDetails: {
      lmpDate: lmpDate || null,
      lmpDay: lmpDay || null,
      etValue: etValue || null,
      rightOvary: rightOvary || null,
      leftOvary: leftOvary || null,
      stimulationProcess:
        stimulationProcess !== undefined ? stimulationProcess : false,
      processStartDate: processStartDate || null,
    },

    obstetricHistory: {
      numberOfDeliveries: numberOfDeliveries || null,
      numberOfAbortions: numberOfAbortions || null,
      otherNotes: otherNotes || null,
    },

    physicalExamination: {
      pulse: pulse || null,
      bp: bp || null,
      temperature: temperature || null,
      respiratorySystem: respiratorySystem || null,
      cardiovascularSystem: cardiovascularSystem || null,
      abdominalExamination: abdominalExamination || null,
      otherSystems: otherSystems || null,
    },
  };


  // Create donor
  const donor = await Donor.create(donorData);
  return {
    success: true,
    message: "Donor created successfully",
    donor: {
      id: donor._id,
      donorId: donor.donorId,
      fullName: donor.fullName,
      donorType: donor.donorType,
    },
  };
};

/**
 * Check if donor has all required fields complete
 */
const isDonorComplete = (donor) => {
  const requiredFields = [
    "fullName",
    "email",
    "contactNumber",
    "dateOfBirth",
    "gender",
    "aadharNumber",
  ];

  // Check basic required fields
  for (const field of requiredFields) {
    if (!donor[field]) return false;
  }

  return true;
};

/**
 * Get all donors with optional filters
 */
export const getAllDonorsController = async (filters = {}) => {
  const { donorType, status, search, skip = 0, limit, createdBy, excludeCaseDone, isCaseDone } = filters;

  let query = {};

  if (donorType) {
    query.donorType = donorType;
  }

  if (status) {
    query.status = status;
  }

  if (excludeCaseDone) {
    query.isCaseDone = { $ne: true };
  }

  if (isCaseDone !== undefined) {
    query.isCaseDone = isCaseDone;
  }

  // Handle createdBy filter first
  if (createdBy) {
    const userObjectId = new mongoose.Types.ObjectId(createdBy);
    query.$or = [
      { createdBy: userObjectId },
      { allottedBy: userObjectId }
    ];
  }

  // Handle search - combine with existing $or if present
  if (search) {
    const searchQuery = {
      $or: [
        { fullName: { $regex: search, $options: "i" } },
        { donorId: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ]
    };
    
    if (createdBy) {
      // Use $and to combine both conditions
      const userObjectId = new mongoose.Types.ObjectId(createdBy);
      query = {
        ...query,
        $and: [
          {
            $or: [
              { createdBy: userObjectId },
              { allottedBy: userObjectId }
            ]
          },
          searchQuery
        ]
      };
      delete query.$or; // Remove the original $or since we're using $and now
    } else {
      query = { ...query, ...searchQuery };
    }
  }
  const total = await Donor.countDocuments(query);

  let donorQuery = Donor.find(query).sort({ createdAt: -1 }).select("-__v");

  if (limit) {
    donorQuery = donorQuery.skip(skip).limit(limit);
  }

  const donors = await donorQuery;

  return {
    success: true,
    donors,
    count: donors.length,
    total,
  };
};

/**
 * Update donor with next appointment
 */
export const updateDonorAppointmentController = async (
  donorId,
  appointmentDate,
  userId,
) => {
  const donor = await Donor.findByIdAndUpdate(
    donorId,
    {
      nextAppointment: appointmentDate,
      updatedBy: userId,
    },
    { new: true },
  );

  if (!donor) {
    throw new Error("Donor not found");
  }

  return {
    success: true,
    message: "Appointment updated successfully",
    donor,
  };
};

/**
 * Get donor by ID
 */
export const getDonorByIdController = async (donorId) => {
  // Validate MongoDB ObjectId format
  if (!donorId || !donorId.match(/^[0-9a-fA-F]{24}$/)) {
    throw new Error("Invalid donor ID format");
  }

  const donor = await Donor.findById(donorId)
    .populate({
      path: "documents.donorDocuments.uploadBy",
      select: "fullName name",
    })
    .populate({
      path: "documents.reports.uploadBy",
      select: "fullName name",
    })
    .populate({
      path: "documents.otherDocuments.uploadBy",
      select: "fullName name",
    })
    .populate({
      path: "documents.allotmentDocuments.uploadBy",
      select: "fullName name",
    })
    .select("-__v");

  if (!donor) {
    throw new Error("Donor not found");
  }

  return {
    success: true,
    donor,
  };
};

/**
 * Update donor
 */
export const updateDonorController = async (donorId, updates, userId) => {
  let updateData = { ...updates };

  // Handle nested structure from frontend
  if (updateData.follicularDetails && typeof updateData.follicularDetails === 'object') {
    // If follicularDetails contains nested follicularDetails, extract it
    if (updateData.follicularDetails.follicularDetails) {
      const nestedFollicularDetails = updateData.follicularDetails.follicularDetails;
      
      // Extract scans if they exist and keep them in follicularDetails
      if (nestedFollicularDetails.scans) {
        // Keep scans inside follicularDetails, don't move to root level
        // No action needed, scans will stay in follicularDetails.scans
      }
      
      // Replace the outer follicularDetails with the nested one
      updateData.follicularDetails = nestedFollicularDetails;
      
      // Extract other nested objects to root level
      if (updateData.follicularDetails.obstetricHistory) {
        updateData.obstetricHistory = updateData.follicularDetails.obstetricHistory;
        delete updateData.follicularDetails.obstetricHistory;
      }
      
      if (updateData.follicularDetails.physicalExamination) {
        updateData.physicalExamination = updateData.follicularDetails.physicalExamination;
        delete updateData.follicularDetails.physicalExamination;
      }
      
      // Extract other root level fields
      const rootFields = ['donorId', 'donorType', 'donorImage', 'dateOfBirth', 'age', 'fullName', 'husbandName', 'gender', 'aadharNumber', 'maritalStatus', 'cast', 'contactNumber', 'email', 'referenceName', 'referenceNumber', 'address', 'city', 'state', 'pincode', 'placeOfBirth', 'religion', 'bloodGroup', 'donorEducation', 'donorOccupation', 'monthlyIncome', 'spouseEducation', 'spouseOccupation', 'height', 'weight', 'skinColor', 'hairColor', 'eyeColor', 'menstrualHistory', 'contraceptives', 'medicalHistory', 'familyMedicalHistory', 'abnormalityInChild', 'bloodTransfusion', 'substanceAbuse', 'geneticAbnormality', 'status', 'isAllotted', 'allottedBy', 'consentFormStatus', 'affidavitStatus', 'follicularScanStatus', 'insuranceStatus', 'bloodReportStatus', 'opuProcessStatus', 'previousDonations', 'registrationDate', 'bmi', 'semenData', 'documents'];
      
      rootFields.forEach(field => {
        if (updateData.follicularDetails[field] !== undefined) {
          updateData[field] = updateData.follicularDetails[field];
          delete updateData.follicularDetails[field];
        }
      });
    }
    // Handle direct scans in follicularDetails
    else if (updateData.follicularDetails.scans) {
      // Keep scans inside follicularDetails, don't move to root level
      // No action needed, scans will stay in follicularDetails.scans
    }
  }

  // Convert enum values to lowercase
  if (updateData.gender) {
    updateData.gender = updateData.gender.toLowerCase();
  }
  if (updateData.maritalStatus) {
    updateData.maritalStatus = updateData.maritalStatus.toLowerCase();
  }
  if (updateData.donorType) {
    updateData.donorType = updateData.donorType.toLowerCase();
  }

  // Convert stimulationProcess to boolean if it exists in follicularDetails
  if (updateData.follicularDetails && updateData.follicularDetails.stimulationProcess !== undefined) {
    updateData.follicularDetails.stimulationProcess = Boolean(updateData.follicularDetails.stimulationProcess);
  }

  // Only add updatedBy if userId is provided and valid
  if (userId) {
    updateData.updatedBy = userId;
  }

  const donor = await Donor.findByIdAndUpdate(donorId, updateData, {
    new: true,
    runValidators: true,
  });

  if (!donor) {
    throw new Error("Donor not found");
  }

  return {
    success: true,
    message: "Donor updated successfully",
    donor,
  };
};

/**
 * Delete donor
 */
export const deleteDonorController = async (donorId) => {
  const donor = await Donor.findByIdAndDelete(donorId);

  if (!donor) {
    throw new Error("Donor not found");
  }

  return {
    success: true,
    message: "Donor deleted successfully",
  };
};

/**
 * Get dashboard statistics
 */
export const getDonorStatsController = async (selectedDate) => {
  const today = selectedDate ? new Date(selectedDate) : new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const [totalDonors, todayFollowUps, activeCases, pendingDocuments] =
    await Promise.all([
      Donor.countDocuments(),
      // Today's registrations count
      Donor.countDocuments({
        $or: [
          { registrationDate: { $gte: today, $lt: tomorrow } },
          { createdAt: { $gte: today, $lt: tomorrow } },
        ],
      }),
      Donor.countDocuments({ status: "active" }),
      Donor.countDocuments({
        $or: [
          { consentFormStatus: "pending" },
          { affidavitStatus: "pending" },
          { follicularScanStatus: "pending" },
          { insuranceStatus: "pending" },
        ],
      }),
    ]);

  return {
    success: true,
    stats: {
      totalDonors,
      todayFollowUps,
      activeCases,
      pendingDocuments,
    },
  };
};

/**
 * Get today's follow-ups
 */
export const getTodayFollowUpsController = async () => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const donors = await Donor.find({
    nextAppointment: {
      $gte: today,
      $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000),
    },
  })
    .sort({ nextAppointment: 1 })
    .select("-__v");

  return {
    success: true,
    donors,
  };
};

/**
 * Get donors with pending blood collections
 */
export const getPendingBloodCollectionsController = async () => {
  const donors = await Donor.find({
    $or: [
      { bloodGroup: { $exists: false } },
      { bloodGroup: null },
      { "semenData.bloodReportStatus": "pending" },
    ],
  })
    .sort({ createdAt: -1 })
    .select("-__v");

  return {
    success: true,
    donors,
  };
};

/**
 * Save donor remarks
 */
export const saveDonorRemarksController = async (donorId, remarksData) => {
  const donor = await Donor.findByIdAndUpdate(
    donorId,
    {
      $set: {
        "allotmentRemarks": remarksData
      }
    },
    { new: true, runValidators: true }
  );

  if (!donor) {
    throw new Error("Donor not found");
  }

  return {
    success: true,
    message: "Remarks saved successfully",
    donor,
  };
};
