import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { createResume, deleteResume, getResumeById, getUserResume, updateResume } from "../controllers/resumeController.js";
import { uploadResumeImage } from "../controllers/uploadController.js";
import upload from "../middleware/uploadMiddleware.js";

const resumeRouter = express.Router();

resumeRouter.post("/",protect, createResume);
resumeRouter.get("/",protect, getUserResume); 

resumeRouter.get("/:id",protect, getResumeById);
resumeRouter.put("/:id",protect, updateResume);

resumeRouter.put(
  "/:id/upload-images",
  protect,
  upload.fields([
    { name: "thumbnail", maxCount: 1 },
    { name: "profileImage", maxCount: 1 },
  ]),
  uploadResumeImage
);

resumeRouter.delete("/:id",protect, deleteResume);

export default resumeRouter