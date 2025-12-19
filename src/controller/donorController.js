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
    if (!fullName || !email || !phoneNumber || !dateOfBirth || !gender || !aadharNumber) {
        throw new Error("Required fields are missing: fullName, email, phoneNumber, dateOfBirth, gender, aadharNumber");
    }

    // Generate donor ID
    const count = await Donor.countDocuments();
    const generatedDonorId = `#${String(count + 809776).padStart(6, "0")}`;

    // Create donor data with only non-empty values
    const donorData = {
        donorId: generatedDonorId,
        fullName,
        email,
        contactNumber: phoneNumber,
        dateOfBirth,
        gender,
        aadharNumber,
        status: "active",
        createdBy: userId,
    };

    // Add optional fields only if they have values
    if (donorType) donorData.donorType = donorType;
    if (donorImage) donorData.donorImage = donorImage;
    if (age) donorData.age = age;
    if (husbandName) donorData.husbandName = husbandName;
    if (maritalStatus) donorData.maritalStatus = maritalStatus;
    if (cast) donorData.cast = cast;
    if (referenceName) donorData.referenceName = referenceName;
    if (referenceNumber) donorData.referenceNumber = referenceNumber;
    if (address) donorData.address = address;
    if (city) donorData.city = city;
    if (state) donorData.state = state;
    if (pincode) donorData.pincode = pincode;
    if (placeOfBirth) donorData.placeOfBirth = placeOfBirth;
    if (religion) donorData.religion = religion;
    if (bloodGroup && bloodGroup.trim()) donorData.bloodGroup = bloodGroup;
    if (donorEducation) donorData.donorEducation = donorEducation;
    if (donorOccupation) donorData.donorOccupation = donorOccupation;
    if (monthlyIncome) donorData.monthlyIncome = monthlyIncome;
    if (spouseEducation) donorData.spouseEducation = spouseEducation;
    if (spouseOccupation) donorData.spouseOccupation = spouseOccupation;
    if (height) donorData.height = height;
    if (weight) donorData.weight = weight;
    if (skinColor) donorData.skinColor = skinColor;
    if (hairColor) donorData.hairColor = hairColor;
    if (eyeColor) donorData.eyeColor = eyeColor;
    if (menstrualHistory !== undefined) donorData.menstrualHistory = menstrualHistory;
    if (contraceptives !== undefined) donorData.contraceptives = contraceptives;
    if (medicalHistory !== undefined) donorData.medicalHistory = medicalHistory;
    if (familyMedicalHistory !== undefined) donorData.familyMedicalHistory = familyMedicalHistory;
    if (abnormalityInChild !== undefined) donorData.abnormalityInChild = abnormalityInChild;
    if (bloodTransfusion !== undefined) donorData.bloodTransfusion = bloodTransfusion;
    if (substanceAbuse !== undefined) donorData.substanceAbuse = substanceAbuse;
    if (geneticAbnormality !== undefined) donorData.geneticAbnormality = geneticAbnormality;
    if (documents) donorData.documents = documents;

    // Add nested objects only if they have data
    if (lmpDate || lmpDay || etValue || rightOvary || leftOvary || stimulationProcess || processStartDate) {
        donorData.follicularDetails = {
            lmpDate,
            lmpDay,
            etValue,
            rightOvary,
            leftOvary,
            stimulationProcess,
            processStartDate,
        };
    }

    if (numberOfDeliveries || numberOfAbortions || otherNotes) {
        donorData.obstetricHistory = {
            numberOfDeliveries,
            numberOfAbortions,
            otherNotes,
        };
    }

    if (pulse || bp || temperature || respiratorySystem || cardiovascularSystem || abdominalExamination || otherSystems) {
        donorData.physicalExamination = {
            pulse,
            bp,
            temperature,
            respiratorySystem,
            cardiovascularSystem,
            abdominalExamination,
            otherSystems,
        };
    }

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
        'fullName', 'email', 'contactNumber', 'dateOfBirth', 'gender', 'aadharNumber'
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
    const { donorType, status, search, skip = 0, limit } = filters;

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

    const total = await Donor.countDocuments(query);

    let donorQuery = Donor.find(query)
        .sort({ createdAt: -1 })
        .select("-__v");

    if (limit) {
        donorQuery = donorQuery.skip(skip).limit(limit);
    }

    const donors = await donorQuery;

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
        total,
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
    const updateData = { ...updates };
    
    // Only add updatedBy if userId is provided and valid
    if (userId) {
        updateData.updatedBy = userId;
    }
    
    const donor = await Donor.findByIdAndUpdate(
        donorId,
        updateData,
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
