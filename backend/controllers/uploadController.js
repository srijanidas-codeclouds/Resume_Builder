import Resume from "../models/resumeModel.js";

/**
 * Upload and store resume images (thumbnail + profileImage) in MongoDB
 */
export const uploadResumeImage = async (req, res) => {
  try {
    const resumeId = req.params.id;
    const resume = await Resume.findOne({
      _id: resumeId,
      userId: req.user._id,
    });

    if (!resume) {
      return res.status(404).json({ message: "Resume not found or not authorized" });
    }

    const baseUrl = `${req.protocol}://${req.get("host")}`;

    const newThumbnail = req.files?.thumbnail?.[0];
    const newProfileImage = req.files?.profileImage?.[0];

    // Thumbnail 
    if (newThumbnail) {
      resume.thumbnail = {
        data: newThumbnail.buffer,
        contentType: newThumbnail.mimetype,
      };
      // backward compatibility
      resume.thumbnailLink = `${baseUrl}/api/resumes/${resumeId}/thumbnail`;
    }

    // Profile Image
    if (newProfileImage) {
      resume.profileInfo = resume.profileInfo || {};
      resume.profileInfo.profileImage = {
        data: newProfileImage.buffer,
        contentType: newProfileImage.mimetype,
      };
      //backward compatibility 
      resume.profileInfo.profilePreviewUrl = `${baseUrl}/api/resumes/${resumeId}/profile-image`;
    }

    const savedResume = await resume.save();
    res.status(200).json(savedResume);
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({
      message: "Failed to upload resume image",
      error: error.message,
    });
  }
};

// Fetch stored thumbnail from MongoDB

export const getResumeThumbnail = async (req, res) => {
  try {
    const resume = await Resume.findById(req.params.id);
    if (!resume || !resume.thumbnail?.data) {
      return res.status(404).json({ message: "Thumbnail not found" });
    }
    res.set("Content-Type", resume.thumbnail.contentType);
    res.send(resume.thumbnail.data);
  } catch (error) {
    console.error("Thumbnail fetch error:", error);
    res.status(500).json({ message: "Failed to fetch thumbnail" });
  }
};

// Fetch stored profile image from MongoDB

export const getProfileImage = async (req, res) => {
  try {
    const resume = await Resume.findById(req.params.id);
    if (!resume || !resume.profileInfo?.profileImage?.data) {
      return res.status(404).json({ message: "Profile image not found" });
    }
    res.set("Content-Type", resume.profileInfo.profileImage.contentType);
    res.send(resume.profileInfo.profileImage.data);
  } catch (error) {
    console.error("Profile image fetch error:", error);
    res.status(500).json({ message: "Failed to fetch profile image" });
  }
};

export default {
  uploadResumeImage,
  getResumeThumbnail,
  getProfileImage,
};