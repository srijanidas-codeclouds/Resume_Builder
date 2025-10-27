import { useEffect, useRef, useState, useCallback } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { ArrowLeft, AlertCircle, Download, Palette, Save, Trash2, Check, Loader2, Eye } from "lucide-react"
import toast from "react-hot-toast"
import DashboardLayout from "../components/DashboardLayout"
import axiosInstance from "../utils/axiosInstance"
import { API_PATHS } from "../utils/apiPaths"
import * as htmlToImage from "html-to-image";

import html2pdf from "html2pdf.js"
import './A4.css'

import {
  AdditionalInfoForm,
  CertificationInfoForm,
  ContactInfoForm,
  EducationDetailsForm,
  ProfileInfoForm,
  ProjectDetailForm,
  SkillsInfoForm,
  WorkExperienceForm,
} from "../components/Forms"
import { captureElementAsImage, dataURLtoFile } from "../utils/helper"
import { fixTailwindColors } from "../utils/helper"
import { TitleInput } from "./Inputs"
import { Button } from "./ui/button"
import {  DownloadCloud } from "lucide-react"
import StepProgress from "./StepProgress"
import RenderResume from "./RenderResume"
import Modal from "./Modal"
import ThemeSelector from "./ThemeSelector"


// Resize observer hook
const useResizeObserver = () => {
  const [size, setSize] = useState({ width: 0, height: 0 });

  const ref = useCallback((node) => {
    if (node) {
      const resizeObserver = new ResizeObserver((entries) => {
        const { width, height } = entries[0].contentRect;
        setSize({ width, height });
      });

      resizeObserver.observe(node);
    }
  }, []);

  return { ...size, ref };
};

const EditResume = () => {
  const { resumeId } = useParams()
  const navigate = useNavigate()
  const resumeDownloadRef = useRef(null)
  const thumbnailRef = useRef(null)

  const [openTemplateSelector, setOpenTemplateSelector] = useState(false)
  const [openPreviewModal, setOpenPreviewModal] = useState(false)
  const [currentPage, setCurrentPage] = useState("profile-info")
  const [progress, setProgress] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [isDownloading, setIsDownloading] = useState(false)
  const [downloadSuccess, setDownloadSuccess] = useState(false)
  const [errorMsg, setErrorMsg] = useState("")
  const [completionPercentage, setCompletionPercentage] = useState(0)

  const { width: previewWidth, ref: previewContainerRef } = useResizeObserver();

  const [resumeData, setResumeData] = useState({
    title: "Professional Resume",
    thumbnailLink: "",
    profileInfo: {
      fullName: "",
      designation: "",
      summary: "",
    },
    template: {
      theme: "modern",
      colorPalette: []
    },
    contactInfo: {
      email: "",
      phone: "",
      location: "",
      linkedin: "",
      github: "",
      website: "",
    },
    workExperience: [
      {
        company: "",
        role: "",
        startDate: "",
        endDate: "",
        description: "",
      },
    ],
    education: [
      {
        degree: "",
        institution: "",
        startDate: "",
        endDate: "",
      },
    ],
    skills: [
      {
        name: "",
        progress: 0,
      },
    ],
    projects: [
      {
        title: "",
        description: "",
        github: "",
        liveDemo: "",
      },
    ],
    certifications: [
      {
        title: "",
        issuer: "",
        year: "",
      },
    ],
    languages: [
      {
        name: "",
        progress: 0,
      },
    ],
    interests: [""],
  })

  // Calculate completion percentage
  const calculateCompletion = () => {
    let completedFields = 0;
    let totalFields = 0;

    // Profile Info
    totalFields += 3;
    if (resumeData.profileInfo.fullName) completedFields++;
    if (resumeData.profileInfo.designation) completedFields++;
    if (resumeData.profileInfo.summary) completedFields++;

    // Contact Info
    totalFields += 2;
    if (resumeData.contactInfo.email) completedFields++;
    if (resumeData.contactInfo.phone) completedFields++;

    // Work Experience
    resumeData.workExperience.forEach(exp => {
      totalFields += 5;
      if (exp.company) completedFields++;
      if (exp.role) completedFields++;
      if (exp.startDate) completedFields++;
      if (exp.endDate) completedFields++;
      if (exp.description) completedFields++;
    });

    // Education
    resumeData.education.forEach(edu => {
      totalFields += 4;
      if (edu.degree) completedFields++;
      if (edu.institution) completedFields++;
      if (edu.startDate) completedFields++;
      if (edu.endDate) completedFields++;
    });

    // Skills
    resumeData.skills.forEach(skill => {
      totalFields += 2;
      if (skill.name) completedFields++;
      if (skill.progress > 0) completedFields++;
    });

    // Projects
    resumeData.projects.forEach(project => {
      totalFields += 4;
      if (project.title) completedFields++;
      if (project.description) completedFields++;
      if (project.github) completedFields++;
      if (project.liveDemo) completedFields++;
    });

    // Certifications
    resumeData.certifications.forEach(cert => {
      totalFields += 3;
      if (cert.title) completedFields++;
      if (cert.issuer) completedFields++;
      if (cert.year) completedFields++;
    });

    // Languages
    resumeData.languages.forEach(lang => {
      totalFields += 2;
      if (lang.name) completedFields++;
      if (lang.progress > 0) completedFields++;
    });

    // Interests
    totalFields += resumeData.interests.length;
    completedFields += resumeData.interests.filter(i => i.trim() !== "").length;

    const percentage = Math.round((completedFields / totalFields) * 100);
    setCompletionPercentage(percentage);
    return percentage;
  };

  useEffect(() => {
    calculateCompletion();
  }, [resumeData]);

  // Validate Inputs
  const validateAndNext = (e) => {
    const errors = []

    switch (currentPage) {
      case "profile-info":
        const { fullName, designation, summary } = resumeData.profileInfo
        if (!fullName.trim()) errors.push("Full Name is required")
        if (!designation.trim()) errors.push("Designation is required")
        if (!summary.trim()) errors.push("Summary is required")
        break

      case "contact-info":
        const { email, phone } = resumeData.contactInfo
        if (!email.trim() || !/^\S+@\S+\.\S+$/.test(email)) errors.push("Valid email is required.")
        if (!phone.trim() || !/^\d{10}$/.test(phone)) errors.push("Valid 10-digit phone number is required")
        break

      case "work-experience":
        resumeData.workExperience.forEach(({ company, role, startDate, endDate }, index) => {
          if (!company || !company.trim()) errors.push(`Company is required in experience ${index + 1}`)
          if (!role || !role.trim()) errors.push(`Role is required in experience ${index + 1}`)
          if (!startDate || !endDate) errors.push(`Start and End dates are required in experience ${index + 1}`)
        })
        break

      case "education-info":
        resumeData.education.forEach(({ degree, institution, startDate, endDate }, index) => {
          if (!degree.trim()) errors.push(`Degree is required in education ${index + 1}`)
          if (!institution.trim()) errors.push(`Institution is required in education ${index + 1}`)
          if (!startDate || !endDate) errors.push(`Start and End dates are required in education ${index + 1}`)
        })
        break

      case "skills":
        resumeData.skills.forEach(({ name, progress }, index) => {
          if (!name.trim()) errors.push(`Skill name is required in skill ${index + 1}`)
          if (progress < 1 || progress > 100)
            errors.push(`Skill progress must be between 1 and 100 in skill ${index + 1}`)
        })
        break

      case "projects":
        resumeData.projects.forEach(({ title, description }, index) => {
          if (!title.trim()) errors.push(`Project Title is required in project ${index + 1}`)
          if (!description.trim()) errors.push(`Project description is required in project ${index + 1}`)
        })
        break

      case "certifications":
        resumeData.certifications.forEach(({ title, issuer }, index) => {
          if (!title.trim()) errors.push(`Certification Title is required in certification ${index + 1}`)
          if (!issuer.trim()) errors.push(`Issuer is required in certification ${index + 1}`)
        })
        break

      case "additionalInfo":
        if (resumeData.languages.length === 0 || !resumeData.languages[0].name?.trim()) {
          errors.push("At least one language is required")
        }
        if (resumeData.interests.length === 0 || !resumeData.interests[0]?.trim()) {
          errors.push("At least one interest is required")
        }
        break

      default:
        break
    }

    if (errors.length > 0) {
      setErrorMsg(errors.join(", "))
      return
    }

    setErrorMsg("")
    goToNextStep()
  }

  const goToNextStep = () => {
    const pages = [
      "profile-info",
      "contact-info",
      "work-experience",
      "education-info",
      "skills",
      "projects",
      "certifications",
      "additionalInfo",
    ]

    if (currentPage === "additionalInfo") setOpenPreviewModal(true)

    const currentIndex = pages.indexOf(currentPage)
    if (currentIndex !== -1 && currentIndex < pages.length - 1) {
      const nextIndex = currentIndex + 1
      setCurrentPage(pages[nextIndex])

      const percent = Math.round((nextIndex / (pages.length - 1)) * 100)
      setProgress(percent)
      window.scrollTo({ top: 0, behavior: "smooth" })
    }
  }

  const goBack = () => {
    const pages = [
      "profile-info",
      "contact-info",
      "work-experience",
      "education-info",
      "skills",
      "projects",
      "certifications",
      "additionalInfo",
    ]

    if (currentPage === "profile-info") navigate("/dashboard")

    const currentIndex = pages.indexOf(currentPage)
    if (currentIndex > 0) {
      const prevIndex = currentIndex - 1
      setCurrentPage(pages[prevIndex])

      const percent = Math.round((prevIndex / (pages.length - 1)) * 100)
      setProgress(percent)
      window.scrollTo({ top: 0, behavior: "smooth" })
    }
  }

  const renderForm = () => {
    switch (currentPage) {
      case "profile-info":
        return (
          <ProfileInfoForm
            profileData={resumeData?.profileInfo}
            updateSection={(key, value) => updateSection("profileInfo", key, value)}
            onNext={validateAndNext}
          />
        )

      case "contact-info":
        return (
          <ContactInfoForm
            contactInfo={resumeData?.contactInfo}
            updateSection={(key, value) => updateSection("contactInfo", key, value)}
          />
        )

      case "work-experience":
        return (
          <WorkExperienceForm
            workExperience={resumeData?.workExperience}
            updateArrayItem={(index, key, value) => {
              updateArrayItem("workExperience", index, key, value)
            }}
            addArrayItem={(newItem) => addArrayItem("workExperience", newItem)}
            removeArrayItem={(index) => removeArrayItem("workExperience", index)}
          />
        )

      case "education-info":
        return (
          <EducationDetailsForm
            educationInfo={resumeData?.education}
            updateArrayItem={(index, key, value) => {
              updateArrayItem("education", index, key, value)
            }}
            addArrayItem={(newItem) => addArrayItem("education", newItem)}
            removeArrayItem={(index) => removeArrayItem("education", index)}
          />
        )

      case "skills":
        return (
          <SkillsInfoForm
            skillsInfo={resumeData?.skills}
            updateArrayItem={(index, key, value) => {
              updateArrayItem("skills", index, key, value)
            }}
            addArrayItem={(newItem) => addArrayItem("skills", newItem)}
            removeArrayItem={(index) => removeArrayItem("skills", index)}
          />
        )

      case "projects":
        return (
          <ProjectDetailForm
            projectInfo={resumeData?.projects}
            updateArrayItem={(index, key, value) => {
              updateArrayItem("projects", index, key, value)
            }}
            addArrayItem={(newItem) => addArrayItem("projects", newItem)}
            removeArrayItem={(index) => removeArrayItem("projects", index)}
          />
        )

      case "certifications":
        return (
          <CertificationInfoForm
            certifications={resumeData?.certifications}
            updateArrayItem={(index, key, value) => {
              updateArrayItem("certifications", index, key, value)
            }}
            addArrayItem={(newItem) => addArrayItem("certifications", newItem)}
            removeArrayItem={(index) => removeArrayItem("certifications", index)}
          />
        )

      case "additionalInfo":
        return (
          <AdditionalInfoForm
            languages={resumeData.languages}
            interests={resumeData.interests}
            updateArrayItem={(section, index, key, value) => updateArrayItem(section, index, key, value)}
            addArrayItem={(section, newItem) => addArrayItem(section, newItem)}
            removeArrayItem={(section, index) => removeArrayItem(section, index)}
          />
        )

      default:
        return null
    }
  }

  const updateSection = (section, key, value) => {
    setResumeData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [key]: value,
      },
    }))
  }

  const updateArrayItem = (section, index, key, value) => {
    setResumeData((prev) => {
      const updatedArray = [...prev[section]]

      if (key === null) {
        updatedArray[index] = value
      } else {
        updatedArray[index] = {
          ...updatedArray[index],
          [key]: value,
        }
      }

      return {
        ...prev,
        [section]: updatedArray,
      }
    })
  }

  const addArrayItem = (section, newItem) => {
    setResumeData((prev) => ({
      ...prev,
      [section]: [...prev[section], newItem],
    }))
  }

  const removeArrayItem = (section, index) => {
    setResumeData((prev) => {
      const updatedArray = [...prev[section]]
      updatedArray.splice(index, 1)
      return {
        ...prev,
        [section]: updatedArray,
      }
    })
  }

  const fetchResumeDetailsById = async () => {
    try {
      const response = await axiosInstance.get(API_PATHS.RESUME.GET_BY_ID(resumeId))

      if (response.data && response.data.profileInfo) {
        const resumeInfo = response.data

        setResumeData((prevState) => ({
          ...prevState,
          title: resumeInfo?.title || "Untitled",
          template: resumeInfo?.template || prevState?.template,
          profileInfo: resumeInfo?.profileInfo || prevState?.profileInfo,
          contactInfo: resumeInfo?.contactInfo || prevState?.contactInfo,
          workExperience: resumeInfo?.workExperience || prevState?.workExperience,
          education: resumeInfo?.education || prevState?.education,
          skills: resumeInfo?.skills || prevState?.skills,
          projects: resumeInfo?.projects || prevState?.projects,
          certifications: resumeInfo?.certifications || prevState?.certifications,
          languages: resumeInfo?.languages || prevState?.languages,
          interests: resumeInfo?.interests || prevState?.interests,
        }))
      }
    } catch (error) {
      console.error("Error fetching resume:", error)
      toast.error("Failed to load resume data")
    }
  }

  const uploadResumeImages = async () => {
    try {
      setIsLoading(true);

      const thumbnailElement = thumbnailRef.current;
      if (!thumbnailElement) throw new Error("Thumbnail element not found");

      // Clone and sanitize OKLCH colors if needed
      const fixedThumbnail = fixTailwindColors(thumbnailElement);

      // Use html-to-image to convert DOM → PNG
      const thumbnailDataUrl = await htmlToImage.toPng(fixedThumbnail, {
        quality: 1.0,
        backgroundColor: "#FFFFFF",
        pixelRatio: 2, // equivalent to scale
        skipFonts: false,
        cacheBust: true,
      });

      // Clean up cloned node
      document.body.removeChild(fixedThumbnail);

      const thumbnailFile = dataURLtoFile(
        thumbnailDataUrl,
        `thumbnail-${resumeId}.png`
      );

      const formData = new FormData();
      formData.append("thumbnail", thumbnailFile);

      const uploadResponse = await axiosInstance.put(
        API_PATHS.RESUME.UPLOAD_IMAGES(resumeId),
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      const { thumbnailLink } = uploadResponse.data;
      await updateResumeDetails(thumbnailLink);

      toast.success("Resume Updated Successfully");
      navigate("/dashboard");
    } catch (error) {
      console.error("Error Uploading Images:", error);
      toast.error("Failed to upload images");
    } finally {
      setIsLoading(false);
    }
  };

  const updateResumeDetails = async (thumbnailLink) => {
    try {
      setIsLoading(true)

      await axiosInstance.put(API_PATHS.RESUME.UPDATE(resumeId), {
        ...resumeData,
        thumbnailLink: thumbnailLink || "",
        completion: completionPercentage,
      })
    } catch (err) {
      console.error("Error updating resume:", err)
      toast.error("Failed to update resume details")
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteResume = async () => {
    try {
      setIsLoading(true)
      await axiosInstance.delete(API_PATHS.RESUME.DELETE(resumeId))
      toast.success("Resume deleted successfully")
      navigate("/dashboard")
    } catch (error) {
      console.error("Error deleting resume:", error)
      toast.error("Failed to delete resume")
    } finally {
      setIsLoading(false)
    }
  }

  const downloadPDF = async () => {
    const element = resumeDownloadRef.current;
    if (!element) {
      toast.error("Failed to generate PDF. Please try again.");
      return;
    }
  
    setIsDownloading(true);
    setDownloadSuccess(false);
    const toastId = toast.loading("Generating PDFâ€¦");
  
    const override = document.createElement("style");
    override.id = "__pdf_color_override__";
    override.textContent = `
      * {
        color: #000 !important;
        background-color: #fff !important;
        border-color: #000 !important;
      }
    `;
    document.head.appendChild(override);
  
    try {
      await html2pdf()
        .set({
          margin:       0,
          filename:     `${resumeData.title.replace(/[^a-z0-9]/gi, "_")}.pdf`,
          image:        { type: "png", quality: 1.0 },
          html2canvas:  {
            scale:           2,
            useCORS:         true,
            backgroundColor: "#FFFFFF",
            logging:         false,
            windowWidth:     element.scrollWidth,
          },
          jsPDF:        {
            unit:       "mm",
            format:     "a4",
            orientation:"portrait",
          },
          pagebreak: {
            mode: ['avoid-all', 'css', 'legacy']
          }
        })
        .from(element)
        .save();
  
      toast.success("PDF downloaded successfully!", { id: toastId });
      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 3000);
  
    } catch (err) {
      console.error("PDF error:", err);
      toast.error(`Failed to generate PDF: ${err.message}`, { id: toastId });
  
    } finally {
      document.getElementById("__pdf_color_override__")?.remove();
      setIsDownloading(false);
    }
  };

  const updateTheme = (theme) => {
    setResumeData(prev => ({
      ...prev,
      template: {
        theme: theme,
        colorPalette: []
      }
    }));
  }

  useEffect(() => {
    if (resumeId) {
      fetchResumeDetailsById()
    }
  }, [resumeId])

    return (
      <DashboardLayout className="bg-gray-50 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
          {/* ===== Top Header Section ===== */}
          <div className="text-center space-y-2 mb-10">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
              ATS Friendly Resume Builder
            </h1>
            <p className="text-gray-600 text-sm sm:text-base">
              Create a professional resume that gets noticed. Our resume builder
              helps optimize your content for ATS systems and hiring managers.
            </p>
          </div>
          {/* ===== Bottom Header Section ===== */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-gradient-to-br from-white to-blue-50 border border-blue-100 rounded-2xl py-4 px-6 shadow-sm">
            {/* Title Input */}
            <TitleInput
              title={resumeData.title}
              setTitle={(value) =>
                setResumeData((prev) => ({ ...prev, title: value }))
              }
            />

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3">
              <Button
                onClick={() => setOpenTemplateSelector(true)}
                className="flex items-center gap-2 px-4 py-2 border border-gray-700 bg-white text-gray-800 rounded-lg hover:bg-gray-100 transition-all"
              >
                Select Template
              </Button>

              <Button
                onClick={handleDeleteResume}
                disabled={isLoading}
                className="flex items-center gap-2 px-4 py-2 border border-red-600 bg-red-100 text-red-700 font-medium rounded-lg hover:bg-red-200 transition-all"
              >
                <Trash2 className="w-4 h-4" /> Delete
              </Button>

              <Button
                onClick={() => setOpenPreviewModal(true)}
                className="flex items-center gap-2 px-4 py-2 border border-gray-700 bg-white text-gray-800 rounded-lg hover:bg-gray-100 transition-all"
              >
                <DownloadCloud className="w-4 h-4" /> Preview
              </Button>
            </div>
          </div>

          {/* ===== Main Content Section ===== */}
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Left: Steps & Forms */}
            <div className="w-full lg:w-1/2 space-y-6">
              {/* Step Progress */}
              <div className="bg-white border border-blue-100 rounded-lg shadow-sm p-1 flex justify-center items-center">
                <StepProgress progress={progress} />
              </div>

              {/* Tabs */}
          <div className="flex justify-around text-sm font-medium border-b border-gray-200">
            <button className="py-2 px-4 text-blue-600 border-b-2 border-blue-600">
              Personal
            </button>
            <button className="py-2 px-4 text-gray-500 hover:text-blue-600 transition-colors">
              Contact
            </button>
            <button className="py-2 px-4 text-gray-500 hover:text-blue-600 transition-colors">
              Education
            </button>
            <button className="py-2 px-4 text-gray-500 hover:text-blue-600 transition-colors">
              Project
            </button>
            <button className="py-2 px-4 text-gray-500 hover:text-blue-600 transition-colors">
              Experience
            </button>
            <button className="py-2 px-4 text-gray-500 hover:text-blue-600 transition-colors">
              Skills
            </button>
            <button className="py-2 px-4 text-gray-500 hover:text-blue-600 transition-colors">
              Certifications
            </button>
            <button className="py-2 px-4 text-gray-500 hover:text-blue-600 transition-colors">
              Additional
            </button>
          </div>

              {/* Active Form */}
              <div className="">
                {renderForm()}
              </div>

              {/* Error Message */}
              {errorMsg && (
                <div className="flex items-start gap-3 bg-red-50 border border-red-200 text-red-800 p-4 rounded-xl shadow-sm">
                  <AlertCircle className="w-5 h-5 text-red-600 mt-1 shrink-0" />
                  <div>
                    <p className="font-semibold text-sm sm:text-base">Error:</p>
                    <p className="text-sm font-medium">{errorMsg}</p>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-end gap-3 pt-2">
                <Button
                  onClick={goBack}
                  disabled={isLoading}
                  className="flex items-center gap-2 border border-gray-300 bg-white text-gray-700 hover:bg-gray-100 rounded-lg px-4 py-2 transition-colors"
                >
                  <ArrowLeft size={14} /> Back
                </Button>

                <Button
                  onClick={uploadResumeImages}
                  disabled={isLoading}
                  className="flex items-center gap-2 border border-blue-600 bg-blue-100 text-blue-800 hover:bg-blue-200 rounded-lg px-4 py-2 transition-colors"
                >
                  {isLoading ? (
                    <Loader2 className="animate-spin w-4 h-4" />
                  ) : (
                    <Save className="w-4 h-4" />
                  )}
                  {isLoading ? "Saving..." : "Save"}
                </Button>

                <Button
                  onClick={validateAndNext}
                  disabled={isLoading}
                  className="flex items-center gap-2 border border-green-600 bg-green-100 text-green-800 hover:bg-green-200 rounded-lg px-4 py-2 transition-colors"
                >
                  {currentPage === "additionalInfo" ? (
                    <>
                      <DownloadCloud className="w-4 h-4" /> Review & Download
                      PDF
                    </>
                  ) : (
                    <>
                      Next <ArrowLeft className="rotate-180 w-4 h-4" />
                    </>
                  )}
                </Button>
              </div>
            </div>

            {/* ===== Right: Preview Section ===== */}
        <div className="w-full lg:w-1/2 bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-semibold text-lg">Resume Preview</h2>
            <div className="flex gap-2">
              <Button
                onClick={() => setOpenPreviewModal(true)}
                className="flex items-center gap-2 px-4 py-2 border border-gray-700 bg-white text-gray-800 rounded-lg hover:bg-gray-100 transition-all"
              >
                <Eye className="w-4 h-4" /> Preview
              </Button>

              <Button
                onClick={downloadPDF}
                disabled={isLoading}
                ref={resumeDownloadRef}
                className="flex items-center gap-2 px-4 py-2 border border-blue-600 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all"
              >
                <Download className="w-4 h-4" /> Download 
              </Button>
            </div>
          </div>

          <div
            className="preview-container relative rounded-lg overflow-hidden border border-gray-100"
            ref={previewContainerRef}
          >
            <RenderResume
              key={`preview-${resumeData?.template?.theme}`}
              resumeData={resumeData}
              templateId={resumeData?.template?.theme || ""}
              containerWidth={previewWidth}
            />
          </div>
        </div>
      </div>

          {/* ===== Template Selector Modal ===== */}
          <Modal
            isOpen={openTemplateSelector}
            onClose={() => setOpenTemplateSelector(false)}
            title="Select Template"
            maxWidth="max-w-6xl" // wider for template previews
          >
            {/* Outer wrapper handles modal scroll safely */}
            <div className="w-full h-[75vh] overflow-y-auto overflow-x-hidden rounded-md">
              <ThemeSelector
                selectedTheme={resumeData?.template?.theme}
                setSelectedTheme={updateTheme}
                onClose={() => setOpenTemplateSelector(false)}
              />
            </div>
          </Modal>

          {/* ===== Preview Modal ===== */}
          <Modal
            isOpen={openPreviewModal}
            onClose={() => setOpenPreviewModal(false)}
            title={resumeData.title}
            showActionBtn
            actionBtnText={
              isDownloading
                ? "Downloading..."
                : downloadSuccess
                ? "Downloaded"
                : "Download PDF"
            }
            actionBtnIcon={
              isDownloading ? (
                <Loader2 className="animate-spin" />
              ) : downloadSuccess ? (
                <Check className="w-5 h-5 text-white" />
              ) : (
                <Download className="w-5 h-5" />
              )
            }
            onActionClick={downloadPDF}
          >
            <div className="text-center mb-4">
              <div className="inline-flex items-center gap-2 bg-gray-100 px-3 py-1 rounded-full text-sm font-medium text-gray-700">
                <div className="w-2 h-2 bg-orange-600 rounded-full"></div>
                <span>{completionPercentage}% Complete</span>
              </div>
            </div>
            <div className="preview-container relative rounded-lg overflow-hidden border border-gray-100">
              <div ref={resumeDownloadRef} className="a4-wrapper">
                <RenderResume
                  key={`pdf-${resumeData?.template?.theme}`}
                  resumeData={resumeData}
                  templateId={resumeData?.template?.theme || ""}
                  containerWidth={null}
                />
              </div>
            </div>
          </Modal>

          <div style={{ display: "none" }} ref={thumbnailRef}>
            <div className="bg-white shadow-lg max-w-[400px] mx-auto">
              <RenderResume
                key={`thumbnail-${resumeData?.template?.theme}`}
                resumeData={resumeData}
                templateId={resumeData?.template?.theme || ""}
                containerWidth={null}
              />
            </div>
          </div>
        </div>
      </DashboardLayout>
    );

  }
  
  export default EditResume