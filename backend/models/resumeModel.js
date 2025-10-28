import mongoose from "mongoose";

const ResumeSchema = new mongoose.Schema({
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User",
    },
    title: {
        type: String,
        required: true,
    },
    thumbnailLink: {
        type: String,
    },
    thumbnail: {
        data: Buffer,
        contentType: String,
    },
    "profileInfo.profileImage": {
    data: Buffer,
    contentType: String,
    },
    template: {
        theme: String,
        colorPalette: [String],
    },
    profileInfo: {
        profilePreviewUrl: String,
        fullName: String,
        designation: String,
        summary: String,
    },
    contactInfo: {
        email: String,
        phone: String,
        location: String,
        linkedin: [String],
        github: [String],
        website: [String],
    },
    // Work Experience
    workExperience: [
        {
            title: String,
            company: String,
            startDate: String,
            endDate: String,
            description: String,
            is_current: Boolean,
        },
    ],
    // Education school and degree
    education: [
        {
            institution: String,
            degree: String,
            year: String,
            gpa: String,
        },
    ],
    // Skills
    skills: [
        {
            name: String,
            progress: String,
        },
    ],
    // Projects
    projects: [
        {
            title: String,
            description: String,
            github: String,
            liveDemo: String,
        },
    ],
    // Certifications
    certifications: [
        {
            name: String,
            issuer: String,
            issueDate: String,
            description: String,
        },
    ],
    // Languages
    languages: [
        {
            name: String,
            progress: String,
        },
    ],
    // Interests
    interests: [
  { type: String }
]

},{timestamps: true});

export default mongoose.model("Resume", ResumeSchema);