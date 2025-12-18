import { Donor } from "@/modals/donorModal";

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
    if (!donorType || !fullName || !dateOfBirth || !gender || !phoneNumber || !email) {
        throw new Error("Required fields are missing");
    }

    // Validate donor type
    if (!["oocyte", "semen"].includes(donorType)) {
        throw new Error("Invalid donor type");
    }

    // Generate donor ID
    const count = await Donor.countDocuments();
    const generatedDonorId = `#${String(count + 809776).padStart(6, "0")}`;

    // Create donor
    const donor = await Donor.create({
        donorId: generatedDonorId,
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
        contactNumber: phoneNumber,
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
        follicularDetails: {
            lmpDate,
            lmpDay,
            etValue,
            rightOvary,
            leftOvary,
            stimulationProcess,
            processStartDate,
        },
        height,
        weight,
        skinColor,
        hairColor,
        eyeColor,
        obstetricHistory: {
            numberOfDeliveries,
            numberOfAbortions,
            otherNotes,
        },
        menstrualHistory,
        contraceptives,
        medicalHistory,
        familyMedicalHistory,
        abnormalityInChild,
        bloodTransfusion,
        substanceAbuse,
        geneticAbnormality,
        physicalExamination: {
            pulse,
            bp,
            temperature,
            respiratorySystem,
            cardiovascularSystem,
            abdominalExamination,
            otherSystems,
        },
        documents,
        status: status || "active",
        createdBy: userId,
    });

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
        'fullName', 'dateOfBirth', 'gender', 'contactNumber', 'email'
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
    const { donorType, status, search } = filters;

    let query = {};

    if (donorType) {
        query.donorType = donorType;
    }

    if (status) {
        query.status = status;
    }

    if (search) {
        query.$or = [
            { fullName: { $regex: search, $options: "i" } },
            { donorId: { $regex: search, $options: "i" } },
            { email: { $regex: search, $options: "i" } },
        ];
    }

    const donors = await Donor.find(query)
        .sort({ createdAt: -1 })
        .select("-__v");

    // Auto-update status based on completeness
    const updatedDonors = donors.map(donor => {
        const isComplete = isDonorComplete(donor);
        const newStatus = isComplete ? 'active' : 'pending';
        
        // Only update if status has changed
        if (donor.status !== newStatus && ['pending', 'active'].includes(donor.status)) {
            donor.status = newStatus;
            donor.save(); // Save the updated status
        }
        
        return donor;
    });

    return {
        success: true,
        donors: updatedDonors,
        count: updatedDonors.length,
    };
};

/**
 * Update donor with next appointment
 */
export const updateDonorAppointmentController = async (donorId, appointmentDate, userId) => {
    const donor = await Donor.findByIdAndUpdate(
        donorId,
        {
            nextAppointment: appointmentDate,
            updatedBy: userId,
        },
        { new: true }
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
    const donor = await Donor.findById(donorId).select("-__v");

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
    const donor = await Donor.findByIdAndUpdate(
        donorId,
        {
            ...updates,
            updatedBy: userId,
        },
        { new: true, runValidators: true }
    );

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
export const getDonorStatsController = async () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [
        totalDonors,
        todayFollowUps,
        activeCases,
        pendingDocuments,
    ] = await Promise.all([
        Donor.countDocuments(),
        Donor.countDocuments({
            nextAppointment: {
                $gte: today,
                $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000),
            },
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
