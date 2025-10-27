// EditingResume.jsx
import React, { useState, useRef, useEffect, useCallback, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import html2pdf from "html2pdf.js";
import html2canvas from "html2canvas";

import Template1 from "./Template1";
import Template2 from "./Template2";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

import {
  ProfileInfoForm,
  ContactInfoForm,
  WorkExperienceForm,
  EducationDetailsForm,
  SkillsInfoForm,
  ProjectDetailForm,
  CertificationInfoForm,
  AdditionalInfoForm,
} from "./Forms";

import axiosInstance from "../utils/axiosInstance";
import { API_PATHS } from "../utils/apiPaths";
import { dataURLtoFile, fixTailwindColors } from "../utils/helper";
import { Progress } from "./ResumeSection";
import { UserContext } from "../context/UserContext"; // optional, keep if you have it
import "./A4.css";

/**
 * Resize observer hook (keeps preview width reactive)
 */
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

const colorThemes = {
  blue: "bg-blue-500",
  green: "bg-green-500",
  purple: "bg-purple-500",
};

const steps = [
  "Profile",
  "Contact",
  "Work Experience",
  "Education",
  "Skills",
  "Projects",
  "Certifications",
  "Additional Info",
];

const EditingResume = () => {
  const { resumeId } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(UserContext || React.createContext(null));

  // refs
  const resumeDownloadRef = useRef(null);
  const thumbnailRef = useRef(null); // used for thumbnail generation
  const previewContainerRef = useRef(null);

  // reactive resize observer for preview if needed
  const { width: previewWidth, ref: previewObserverRef } = useResizeObserver();

  // state
  const [currentStep, setCurrentStep] = useState(0);
  const [template, setTemplate] = useState("template1");
  const [theme, setTheme] = useState("blue");
  const [completionPercentage, setCompletionPercentage] = useState(0);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  const [resumeData, setResumeData] = useState({
    title: "Professional Resume",
    template: { theme: "modern", colorPalette: [] },
    profileInfo: { fullName: "", designation: "", summary: "" },
    contactInfo: { email: "", phone: "", location: "", linkedin: "", github: "", website: "" },
    workExperience: [{ company: "", role: "", startDate: "", endDate: "", description: "" }],
    education: [{ degree: "", institution: "", startDate: "", endDate: "" }],
    skills: [{ name: "", progress: 0 }],
    projects: [{ title: "", description: "", github: "", liveDemo: "" }],
    certifications: [{ title: "", issuer: "", year: "" }],
    languages: [{ name: "", progress: 0 }],
    interests: [""],
    thumbnailLink: "",
  });

  // ===== Helpers: array & section updates =====
  const handleChange = (section, field, value) =>
    setResumeData((prev) => ({ ...prev, [section]: { ...prev[section], [field]: value } }));

  const handleArrayUpdate = (section, index, field, value) => {
    setResumeData((prev) => {
      const updated = Array.isArray(prev[section]) ? [...prev[section]] : [];
      if (field === null) {
        // replace item
        updated[index] = value;
      } else {
        updated[index] = { ...updated[index], [field]: value };
      }
      return { ...prev, [section]: updated };
    });
  };

  const addArrayItem = (section, newItem) =>
    setResumeData((prev) => ({ ...prev, [section]: [...(prev[section] || []), newItem] }));

  const removeArrayItem = (section, index) =>
    setResumeData((prev) => ({ ...prev, [section]: prev[section].filter((_, i) => i !== index) }));

  // ===== Completion calculation (detailed) =====
  const calculateCompletion = () => {
    let completedFields = 0;
    let totalFields = 0;
    const checkFilled = (v) => (v && v.toString().trim() !== "" ? 1 : 0);

    const {
      profileInfo,
      contactInfo,
      workExperience,
      education,
      skills,
      projects,
      certifications,
      languages,
      interests,
    } = resumeData;

    // profile
    totalFields += 3;
    completedFields += checkFilled(profileInfo.fullName) + checkFilled(profileInfo.designation) + checkFilled(profileInfo.summary);

    // contact
    totalFields += 2;
    completedFields += checkFilled(contactInfo.email) + checkFilled(contactInfo.phone);

    // workExperience
    (workExperience || []).forEach((w) => {
      totalFields += 5;
      completedFields += checkFilled(w.company) + checkFilled(w.role) + checkFilled(w.startDate) + checkFilled(w.endDate) + checkFilled(w.description);
    });

    // education
    (education || []).forEach((e) => {
      totalFields += 4;
      completedFields += checkFilled(e.degree) + checkFilled(e.institution) + checkFilled(e.startDate) + checkFilled(e.endDate);
    });

    // skills
    (skills || []).forEach((s) => {
      totalFields += 2;
      completedFields += checkFilled(s.name) + (s.progress > 0 ? 1 : 0);
    });

    // projects
    (projects || []).forEach((p) => {
      totalFields += 4;
      completedFields += checkFilled(p.title) + checkFilled(p.description) + checkFilled(p.github) + checkFilled(p.liveDemo);
    });

    // certifications
    (certifications || []).forEach((c) => {
      totalFields += 3;
      completedFields += checkFilled(c.title) + checkFilled(c.issuer) + checkFilled(c.year);
    });

    // languages
    (languages || []).forEach((l) => {
      totalFields += 2;
      completedFields += checkFilled(l.name) + (l.progress > 0 ? 1 : 0);
    });

    // interests
    totalFields += (interests || []).length;
    completedFields += (interests || []).filter((i) => i && i.trim() !== "").length;

    const percent = totalFields === 0 ? 0 : Math.round((completedFields / totalFields) * 100);
    setCompletionPercentage(percent);
    return percent;
  };

  useEffect(() => {
    calculateCompletion();
  }, [resumeData]);

  // ===== Validation before advancing (from the first snippet) =====
  const validateAndNext = () => {
    const errors = [];

    switch (steps[currentStep]) {
      case "Profile": {
        const { fullName, designation, summary } = resumeData.profileInfo;
        if (!fullName || !fullName.trim()) errors.push("Full Name is required");
        if (!designation || !designation.trim()) errors.push("Designation is required");
        if (!summary || !summary.trim()) errors.push("Summary is required");
        break;
      }

      case "Contact": {
        const { email, phone } = resumeData.contactInfo;
        if (!email || !/^\S+@\S+\.\S+$/.test(email)) errors.push("Valid email is required.");
        if (!phone || !/^\d{10}$/.test(phone)) errors.push("Valid 10-digit phone number is required");
        break;
      }

      case "Work Experience": {
        (resumeData.workExperience || []).forEach(({ company, role, startDate, endDate }, idx) => {
          if (!company || !company.trim()) errors.push(`Company is required in experience ${idx + 1}`);
          if (!role || !role.trim()) errors.push(`Role is required in experience ${idx + 1}`);
          if (!startDate || !endDate) errors.push(`Start and End dates are required in experience ${idx + 1}`);
        });
        break;
      }

      case "Education": {
        (resumeData.education || []).forEach(({ degree, institution, startDate, endDate }, idx) => {
          if (!degree || !degree.trim()) errors.push(`Degree is required in education ${idx + 1}`);
          if (!institution || !institution.trim()) errors.push(`Institution is required in education ${idx + 1}`);
          if (!startDate || !endDate) errors.push(`Start and End dates are required in education ${idx + 1}`);
        });
        break;
      }

      case "Skills": {
        (resumeData.skills || []).forEach(({ name, progress }, idx) => {
          if (!name || !name.trim()) errors.push(`Skill name is required in skill ${idx + 1}`);
          if (progress < 1 || progress > 100) errors.push(`Skill progress must be between 1 and 100 in skill ${idx + 1}`);
        });
        break;
      }

      case "Projects": {
        (resumeData.projects || []).forEach(({ title, description }, idx) => {
          if (!title || !title.trim()) errors.push(`Project Title is required in project ${idx + 1}`);
          if (!description || !description.trim()) errors.push(`Project description is required in project ${idx + 1}`);
        });
        break;
      }

      case "Certifications": {
        (resumeData.certifications || []).forEach(({ title, issuer }, idx) => {
          if (!title || !title.trim()) errors.push(`Certification Title is required in certification ${idx + 1}`);
          if (!issuer || !issuer.trim()) errors.push(`Issuer is required in certification ${idx + 1}`);
        });
        break;
      }

      case "Additional Info": {
        if (!resumeData.languages || resumeData.languages.length === 0 || !resumeData.languages[0].name?.trim()) {
          errors.push("At least one language is required");
        }
        if (!resumeData.interests || resumeData.interests.length === 0 || !resumeData.interests[0]?.trim()) {
          errors.push("At least one interest is required");
        }
        break;
      }

      default:
        break;
    }

    if (errors.length > 0) {
      setErrorMsg(errors.join(", "));
      toast.error(errors[0]);
      return false;
    }

    setErrorMsg("");
    goToNextStep();
    return true;
  };

  // ===== Navigation =====
  const goToNextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep((s) => s + 1);
      const percent = Math.round(((currentStep + 1) / (steps.length - 1)) * 100);
      // progress bar is represented by completionPercentage; but keep UI-consistent percentage update
      setCompletionPercentage((p) => Math.max(p, percent));
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      // last step -> open preview
      setIsPreviewOpen(true);
    }
  };

  const goBack = () => {
    if (currentStep === 0) {
      navigate("/dashboard");
      return;
    }
    if (currentStep > 0) {
      setCurrentStep((s) => s - 1);
      const percent = Math.round(((currentStep - 1) / (steps.length - 1)) * 100);
      setCompletionPercentage((p) => Math.min(p, percent));
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  // ===== API interactions (fetch, save, update thumbnail, delete) =====
  const fetchResumeDetailsById = async () => {
    if (!resumeId) return;
    try {
      const response = await axiosInstance.get(API_PATHS.RESUME.GET_BY_ID(resumeId));
      if (response.data) {
        setResumeData((prev) => ({ ...prev, ...response.data }));
        // if server stores theme in template.theme
        if (response.data?.template?.theme) {
          setTheme(response.data.template.theme);
        }
      }
    } catch (err) {
      console.error("Error fetching resume:", err);
      toast.error("Failed to load resume data");
    }
  };

  useEffect(() => {
    if (resumeId) fetchResumeDetailsById();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resumeId]);

  const saveResume = async () => {
    if (!user) {
      toast.error("You must be logged in to save.");
      return;
    }
    try {
      setIsLoading(true);
      await axiosInstance.put(API_PATHS.RESUME.UPDATE(resumeId), {
        ...resumeData,
        completion: completionPercentage,
        userId: user?._id,
      });
      toast.success("Resume saved successfully!");
    } catch (err) {
      console.error("Save error:", err);
      toast.error("Failed to save resume.");
    } finally {
      setIsLoading(false);
    }
  };

  const saveAndExit = async () => {
    await saveResume();
    navigate("/dashboard");
  };

  const deleteResume = async () => {
    try {
      setIsLoading(true);
      await axiosInstance.delete(API_PATHS.RESUME.DELETE(resumeId));
      toast.success("Resume deleted!");
      navigate("/dashboard");
    } catch (err) {
      console.error("Delete error:", err);
      toast.error("Failed to delete resume.");
    } finally {
      setIsLoading(false);
    }
  };

  const updateResumeDetails = async (thumbnailLink) => {
    try {
      setIsLoading(true);
      await axiosInstance.put(API_PATHS.RESUME.UPDATE(resumeId), {
        ...resumeData,
        thumbnailLink: thumbnailLink || resumeData.thumbnailLink || "",
        completion: completionPercentage,
      });
    } catch (err) {
      console.error("Error updating resume details:", err);
      toast.error("Failed to update resume details");
    } finally {
      setIsLoading(false);
    }
  };

  const uploadResumeImages = async () => {
    try {
      setIsLoading(true);

      const thumbnailElement = thumbnailRef.current;
      if (!thumbnailElement) {
        throw new Error("Thumbnail element not found");
      }

      const fixedThumbnail = fixTailwindColors(thumbnailElement);

      const thumbnailCanvas = await html2canvas(fixedThumbnail, {
        scale: 0.5,
        backgroundColor: "#FFFFFF",
        logging: false,
      });

      // cleanup fixed element (helper returns a cloned node that we appended to body)
      try {
        document.body.removeChild(fixedThumbnail);
      } catch (e) {
        // ignore
      }

      const thumbnailDataUrl = thumbnailCanvas.toDataURL("image/png");
      const thumbnailFile = dataURLtoFile(thumbnailDataUrl, `thumbnail-${resumeId}.png`);

      const formData = new FormData();
      formData.append("thumbnail", thumbnailFile);

      const uploadResponse = await axiosInstance.put(API_PATHS.RESUME.UPLOAD_IMAGES(resumeId), formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const { thumbnailLink } = uploadResponse.data || {};
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

  // ===== Download PDF =====
  const downloadPDF = async () => {
    const element = resumeDownloadRef.current;
    if (!element) {
      toast.error("Failed to generate PDF. Please try again.");
      return;
    }

    setIsDownloading(true);
    setDownloadSuccess(false);
    const toastId = toast.loading("Generating PDF…");

    // create override css so colored text/backgrounds render black/white in PDF
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
          margin: 0,
          filename: `${(resumeData.title || "resume").replace(/[^a-z0-9]/gi, "_")}.pdf`,
          image: { type: "png", quality: 1.0 },
          html2canvas: {
            scale: 2,
            useCORS: true,
            backgroundColor: "#FFFFFF",
            logging: false,
            windowWidth: element.scrollWidth,
          },
          jsPDF: {
            unit: "mm",
            format: "a4",
            orientation: "portrait",
          },
          pagebreak: {
            mode: ["avoid-all", "css", "legacy"],
          },
        })
        .from(element)
        .save();

      toast.success("PDF downloaded successfully!", { id: toastId });
      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 3000);
    } catch (err) {
      console.error("PDF error:", err);
      toast.error(`Failed to generate PDF: ${err?.message || err}`, { id: toastId });
    } finally {
      document.getElementById("__pdf_color_override__")?.remove();
      setIsDownloading(false);
    }
  };

  // ===== Theme update (keeps template.template info) =====
  const updateTheme = (themeKey) => {
    setTheme(themeKey);
    setResumeData((prev) => ({
      ...prev,
      template: {
        ...(prev.template || {}),
        theme: themeKey,
        colorPalette: colorThemes[themeKey] || [],
      },
    }));
  };

  // =====: Render forms based on step (preserve existing UI layout) =====
  const renderStepForm = () => {
    switch (currentStep) {
      case 0:
        return <ProfileInfoForm profileData={resumeData.profileInfo} updateSection={(f, v) => handleChange("profileInfo", f, v)} />;
      case 1:
        return <ContactInfoForm contactInfo={resumeData.contactInfo} updateSection={(f, v) => handleChange("contactInfo", f, v)} />;
      case 2:
        return (
          <WorkExperienceForm
            workExperience={resumeData.workExperience}
            updateArrayItem={(index, field, value) => handleArrayUpdate("workExperience", index, field, value)}
            addArrayItem={() => addArrayItem("workExperience", { company: "", role: "", startDate: "", endDate: "", description: "" })}
            removeArrayItem={(index) => removeArrayItem("workExperience", index)}
          />
        );
      case 3:
        return (
          <EducationDetailsForm
            educationInfo={resumeData.education}
            updateArrayItem={(index, field, value) => handleArrayUpdate("education", index, field, value)}
            addArrayItem={() => addArrayItem("education", { degree: "", institution: "", startDate: "", endDate: "" })}
            removeArrayItem={(index) => removeArrayItem("education", index)}
          />
        );
      case 4:
        return (
          <SkillsInfoForm
            skillsInfo={resumeData.skills}
            updateArrayItem={(index, field, value) => handleArrayUpdate("skills", index, field, value)}
            addArrayItem={() => addArrayItem("skills", { name: "", progress: 0 })}
            removeArrayItem={(index) => removeArrayItem("skills", index)}
          />
        );
      case 5:
        return (
          <ProjectDetailForm
            projectInfo={resumeData.projects}
            updateArrayItem={(index, field, value) => handleArrayUpdate("projects", index, field, value)}
            addArrayItem={() => addArrayItem("projects", { title: "", description: "", github: "", liveDemo: "" })}
            removeArrayItem={(index) => removeArrayItem("projects", index)}
          />
        );
      case 6:
        return (
          <CertificationInfoForm
            certifications={resumeData.certifications}
            updateArrayItem={(index, field, value) => handleArrayUpdate("certifications", index, field, value)}
            addArrayItem={() => addArrayItem("certifications", { title: "", issuer: "", year: "" })}
            removeArrayItem={(index) => removeArrayItem("certifications", index)}
          />
        );
      case 7:
        return (
          <AdditionalInfoForm
            languages={resumeData.languages}
            interests={resumeData.interests}
            updateArrayItem={(sectionIndex, idx, field, value) => {
              /* AdditionalInfoForm might call updateArrayItem differently; adapt if needed */
              // if sectionIndex is a string 'languages' or 'interests' then pass through
            }}
            addArrayItem={addArrayItem}
            removeArrayItem={removeArrayItem}
          />
        );
      default:
        return null;
    }
  };

  // ===== Main render (UI preserved from given file) =====
  return (
    <div className="w-full min-h-screen bg-gray-50 p-4">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
        {/* Left Panel */}
        <div className="bg-white border rounded-md p-4 md:p-6 max-h-[80vh] overflow-y-auto flex flex-col">
          {/* Save & Exit */}
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">{steps[currentStep]}</h2>
            <Button onClick={saveAndExit} variant="outline" disabled={isLoading}>
              Save & Exit
            </Button>
          </div>

          {/* Step Forms */}
          <div className="flex-1">{renderStepForm()}</div>

          {/* Error message */}
          {errorMsg ? <div className="text-sm text-red-600 mt-2">{errorMsg}</div> : null}

          {/* Navigation */}
          <div className="flex flex-col sm:flex-row justify-between mt-6 gap-2 sm:gap-0">
            <Button variant="outline" onClick={goBack} disabled={currentStep === 0}>
              Back
            </Button>
            <div className="flex items-center gap-2">
              <Button onClick={validateAndNext} disabled={currentStep === steps.length - 1}>
                Next
              </Button>
              <Button variant="ghost" onClick={() => setIsPreviewOpen(true)}>
                Preview
              </Button>
            </div>
          </div>
        </div>

        {/* Right Panel */}
        <div className="flex flex-col gap-4 max-h-[80vh] overflow-y-auto">
          <div ref={previewObserverRef}>
            <Progress percentage={completionPercentage} className="mb-4" />
          </div>

          {/* Template + Theme */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-4">
            <Tabs value={template} onValueChange={setTemplate} className="flex-1">
              <TabsList className="flex gap-2">
                <TabsTrigger value="template1">Template 1</TabsTrigger>
                <TabsTrigger value="template2">Template 2</TabsTrigger>
              </TabsList>
            </Tabs>

            <div className="flex items-center gap-2">
              {Object.keys(colorThemes).map((clr) => (
                <button
                  key={clr}
                  onClick={() => updateTheme(clr)}
                  className={`w-5 h-5 sm:w-6 sm:h-6 rounded-full border-2 ${
                    theme === clr ? "border-black" : "border-transparent"
                  } ${colorThemes[clr]}`}
                />
              ))}
            </div>
          </div>

          {/* Preview & Download Buttons */}
          <div className="flex gap-2">
            <Button onClick={() => setIsPreviewOpen(true)} className="flex-1">
              Preview
            </Button>
            <Button onClick={downloadPDF} disabled={isDownloading} className="flex-1">
              {isDownloading ? "Generating..." : "Download"}
            </Button>
          </div>

          {/* Resume Preview (keeps same card UI) */}
          <div className="bg-white border shadow rounded-md p-4 w-full mx-auto" ref={resumeDownloadRef}>
            {template === "template1" ? (
              <Template1
                resumeData={resumeData}
                containerWidth={previewContainerRef.current?.offsetWidth || previewWidth || 900}
                ref={thumbnailRef} // note: Template1 must accept forwarded ref or we use another approach to get DOM snapshot
              />
            ) : (
              <Template2
                resumeData={resumeData}
                containerWidth={previewContainerRef.current?.offsetWidth || previewWidth || 900}
                ref={thumbnailRef}
              />
            )}
          </div>

          {/* Bottom Buttons */}
          <div className="flex gap-2 mt-2">
            <Button onClick={saveResume} disabled={isLoading} className="flex-1">
              Save
            </Button>
            <Button variant="destructive" onClick={deleteResume} disabled={isLoading} className="flex-1">
              Delete
            </Button>
            <Button variant="secondary" onClick={uploadResumeImages} disabled={isLoading} className="flex-1">
              Upload Images
            </Button>
          </div>
        </div>
      </div>

      {/* ===== Preview Modal ===== */}
      <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Resume Preview</DialogTitle>
          </DialogHeader>
          <div className="bg-white p-6 border rounded">
            {template === "template1" ? (
              <Template1 resumeData={resumeData} containerWidth={900} />
            ) : (
              <Template2 resumeData={resumeData} containerWidth={900} />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EditingResume;
