import express from "express";
import Resume from "../models/resumeModel.js";
import { protect } from "../middleware/authMiddleware.js";
import path from "path";
import fs from "fs";

// create resume
export const createResume = async (req, res) => {
    try {
        const { title } = req.body;

        // Default template
        const defaultResumeData = {
            profileInfo: {
                profileImg: null,
                previewUrl: '',
                fullName: '',
                designation: '',
                summary: '',
            },
            contactInfo: {
                email: '',
                phone: '',
                location: '',
                linkedin: '',
                github: '',
                website: '',
            },
            workExperience: [
                {
                    company: '',
                    role: '',
                    startDate: '',
                    endDate: '',
                    description: '',
                    is_current: false,
                },
            ],
            education: [
                {
                    degree: '',
                    institution: '',
                    startDate: '',
                    endDate: '',
                    gpa: '',
                },
            ],
            skills: [
                {
                    name: '',
                    progress: '',
                },
            ],
            projects: [
                {
                    title: '',
                    description: '',
                    github: '',
                    liveDemo: '',
                },
            ],
            certifications: [
                {
                    title: '',
                    issuer: '',
                    year: '',
                    description: '',
                },
            ],
            languages: [
                {
                    name: '',
                    progress: '',
                },
            ],
            interests: [''],
        };

        const newResume = await Resume.create({
            userId: req.user.id,
            title,
            ...defaultResumeData,
            ...req.body,
        });

        res.status(201).json(newResume);
    } catch (error) {
        res.status(500).json({ message: "Failed to create resume", error:error.message });
    }
};

// get user resume
export const getUserResume = async(req,res) =>{
    try {
        const resumes = await Resume.find({userId: req.user._id}).sort({updatedAt: -1});
        res.status(200).json(resumes);
    } catch (error) {
        res.status(500).json({ message:"Failed to get resume", error:error.message });
    }
}

// get resume by id
export const getResumeById = async(req,res) =>{
    try {
        const resume = await Resume.findOne({_id: req.params.id, userId: req.user._id });
        if(!resume){
            return res.status(404).json({message:"Resume not found"});
        }
        res.status(200).json(resume);
    } catch (error) {
        res.status(500).json({ message:"Failed to get resume", error:error.message });
    }
}

// update resume
export const updateResume = async(req,res) =>{
    try {
        const resume = await Resume.findOne({_id: req.params.id, userId: req.user._id });
        if(!resume){
            return res.status(404).json({message:"Resume not found or not authorized"});
        }
        // merge updated data with existing data
        Object.assign(resume, req.body);
        // save updated resume
        const savedResume = await resume.save();
        res.status(200).json(savedResume);
    } catch (error) {
        res.status(500).json({ message:"Failed to update resume", error:error.message });
    }
}

// delete resume
export const deleteResume = async(req,res) =>{
    try {
        const resume = await Resume.findOne({_id: req.params.id, userId: req.user._id });
        if(!resume){
            return res.status(404).json({message:"Resume not found or not authorized"});
        }
        // create a uploads folder and store resume 
        const uploadsFolder = path.join(process.cwd(), 'uploads');
        // delete thumbnail function
        if(resume.thumbnailLink){
            const oldThumbnail = path.join(uploadsFolder, path.basename(resume.thumbnailLink));
            if(fs.existsSync(oldThumbnail)){
                fs.unlinkSync(oldThumbnail);
            }
        }
        if(resume.profileInfo?.profilePreviewUrl){
            const oldProfile = path.join(uploadsFolder, path.basename(resume.profileInfo.profilePreviewUrl));
            if(fs.existsSync(oldProfile)){
                fs.unlinkSync(oldProfile);
            }
        }
        // delete resume doc
        const deleted = await Resume.findOneAndDelete({_id: req.params.id, userId: req.user._id });
        if(!deleted){
            return res.status(404).json({message:"Resume not found or not authorized"});
        }
        res.status(200).json({message:"Resume deleted successfully"});
    } catch (error) {
        res.status(500).json({ message:"Failed to delete resume", error:error.message });
    }
}