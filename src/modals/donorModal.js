import mongoose from "mongoose";

const DonorSchema = new mongoose.Schema(
    {
        donorId: {
            type: String,
            unique: true,
        },
        donorType: {
            type: String,
            enum: ["oocyte", "semen"],
        },

        // Donor Image
        donorImage: String,

        // Age Check
        dateOfBirth: {
            type: Date,
            required: true,
        },
        age: {
            type: Number,
        },

        // Personal Information
        fullName: {
            type: String,
            required: true,
            trim: true,
        },
        husbandName: {
            type: String,
            trim: true,
        },
        gender: {
            type: String,
            enum: ["male", "female", "other"],
            required: true,
        },
        aadharNumber: {
            type: String,
            required: true,
            unique: true,
        },
        maritalStatus: {
            type: String,
            enum: ["married", "single", "divorced"],
        },
        cast: String,
        contactNumber: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            lowercase: true,
            trim: true,
            required: true,
        },
        referenceName: String,
        referenceNumber: String,

        // Address
        address: String,
        city: String,
        state: String,
        pincode: String,

        // Other Information
        placeOfBirth: String,
        religion: String,
        bloodGroup: {
            type: String,
            enum: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
        },

        // Professional Details
        donorEducation: String,
        donorOccupation: String,
        monthlyIncome: Number,
        spouseEducation: String,
        spouseOccupation: String,

        // Follicular Details
        follicularDetails: {
            lmpDate: Date,
            lmpDay: Number,
            etValue: String,
            rightOvary: String,
            leftOvary: String,
            stimulationProcess: {
                type: Boolean,
                default: false,
            },
            processStartDate: Date,
        },

        // Physical Attributes
        height: Number, // in cm
        weight: Number, // in kg
        bmi: Number,
        skinColor: String,
        hairColor: String,
        eyeColor: String,

        // Obstetric History
        obstetricHistory: {
            numberOfDeliveries: Number,
            numberOfAbortions: Number,
            otherNotes: String,
        },

        // Menstrual & Contraceptive History
        menstrualHistory: Boolean,
        contraceptives: Boolean,

        // Medical & Family History
        medicalHistory: Boolean,
        familyMedicalHistory: Boolean,
        abnormalityInChild: Boolean,
        bloodTransfusion: Boolean,
        substanceAbuse: Boolean,
        geneticAbnormality: Boolean,

        // Physical Examination
        physicalExamination: {
            pulse: String,
            bp: String,
            temperature: String,
            respiratorySystem: String,
            cardiovascularSystem: String,
            abdominalExamination: String,
            otherSystems: String,
        },

        // Status & Tracking
        status: {
            type: String,
            enum: ["allotted", "referred", "s2s_accepted", "pending", "active", "inactive"],
            default: "pending",
        },
        registrationDate: {
            type: Date,
            default: Date.now,
        },
        nextAppointment: Date,

        // Documents Status
        consentFormStatus: {
            type: String,
            enum: ["uploaded", "pending", "signed"],
            default: "pending",
        },
        affidavitStatus: {
            type: String,
            enum: ["uploaded", "pending", "signed"],
            default: "pending",
        },
        follicularScanStatus: {
            type: String,
            enum: ["uploaded", "pending", "signed"],
            default: "pending",
        },
        insuranceStatus: {
            type: String,
            enum: ["uploaded", "pending", "unneeded"],
            default: "pending",
        },

        // Donation History
        previousDonations: {
            type: Number,
            default: 0,
        },
        lastDonationDate: Date,

        // Oocyte Specific Data
        oocyteData: {
            menstrualCycleLength: Number,
            lastPeriodDate: Date,
            hormoneLevels: {
                fsh: Number,
                lh: Number,
                estradiol: Number,
                amh: Number,
            },
            ovarianReserve: {
                antrialFollicleCount: Number,
                ovarianVolume: Number,
            },
        },

        // Semen Specific Data
        semenData: {
            spermCount: Number, // million/ml
            motility: Number, // percentage
            morphology: Number, // percentage
            collectionDate: Date,
            bloodReportStatus: {
                type: String,
                enum: ["uploaded", "pending", "signed"],
                default: "pending",
            },
            volume: Number, // ml
            ph: Number,
        },

        // Documents/Files (store file paths or URLs)
        documents: {
            donorAadharFront: String,
            donorAadharBack: String,
            healthInsurance: {
                file: String,
                description: String,
            },
            lifeInsurance: {
                file: String,
                description: String,
            },
            medicalReports: [{
                title: String,
                file: String,
                description: String,
            }],
        },

        // Metadata
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
        updatedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
        notes: String,
    },
    {
        timestamps: true,
    }
);

// Calculate age and BMI before saving
DonorSchema.pre("save", function (next) {
    // Calculate age from date of birth
    if (this.dateOfBirth) {
        const today = new Date();
        const birthDate = new Date(this.dateOfBirth);
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        this.age = age;
    }

    // Calculate BMI
    if (this.height && this.weight) {
        const heightInMeters = this.height / 100;
        this.bmi = Number((this.weight / (heightInMeters * heightInMeters)).toFixed(2));
    }

    next();
});

export const Donor = mongoose.models.Donor || mongoose.model("Donor", DonorSchema);
