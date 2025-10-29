import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Plus, Trash2 } from "lucide-react"
import { RatingInput } from "./ResumeSection"

// Validate field
const validateField = (name, value) => {

  const sanitized = value.replace(/<[^>]*>?/gm, "");

  let error = ""

  // Text fields
  if (
    ["fullName", "designation", "summary", "degree", "institution", "company", "description","issuer",
      "name","location"].includes(name)
  ) {
    if (!sanitized) error = "This field is required."
    else if (sanitized.length < 2) error = "Must be at least 2 characters."
  }

  // Email
  if (name === "email") {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!sanitized) error = "Email is required."
    else if (!emailRegex.test(sanitized)) error = "Invalid email format."
  }

  // Phone with country code (e.g., +91-9876543210 or +1 234567890)
  if (name === "phone") {
    const phoneRegex = /^\+[0-9]{1,3}[-\s]?[0-9]{6,14}$/
    if (!sanitized) error = "Phone number is required."
    else if (!phoneRegex.test(sanitized)) error = "Phone number should be in the format: +91-1234567890"
  }

  // URLs
  if (["linkedin", "github", "website", "liveDemo"].includes(name)) {
    const urlRegex = /^(https?:\/\/)?([\w\d-]+\.)+\w{2,}(\/.*)?$/
    if (sanitized && !urlRegex.test(sanitized)) error = "Invalid URL format."
  }

  // Year
  if (name === "year") {
    const yearRegex = /^(19|20)\d{2}$/
    if (sanitized && !yearRegex.test(sanitized)) error = "Enter a valid year."
  }

  // GPA (accepts formats like 3.5, 9.2, etc.)
  if (name === "gpa") {
    const gpaRegex = /^(\d{1,2}(\.\d{1,2})?)$/;
    const gpaValue = parseFloat(sanitized);
    if (sanitized && (!gpaRegex.test(sanitized) || gpaValue < 0 || gpaValue > 10))
      error = "Enter a valid GPA (0–10 scale).";
  }

  // Dates (startDate, endDate, issueDate)
  if (["startDate", "endDate", "issueDate"].includes(name)) {
    if (sanitized && !/^\d{4}-\d{2}$/.test(sanitized))
      error = "Enter a valid month and year.";
  }

  return { sanitized, error }
} 
// Profile Information Form
export const ProfileInfoForm = ({ profileData, updateSection }) => {
  const [errors, setErrors] = useState({})

  const handleChange = (field, value) => {
    const { sanitized, error } = validateField(field, value)
    updateSection(field, sanitized)
    setErrors((prev) => ({ ...prev, [field]: error }))
  }

  return (
    <div className="p-6 bg-blue-50 rounded-xl border border-blue-100 shadow-sm space-y-6">
      <h2 className="text-xl font-semibold text-blue-900">Personal Information</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label className="text-sm font-medium text-blue-800">Full Name</Label>
          <Input
            placeholder="John Doe"
            value={profileData.fullName || ""}
            onChange={(e) => handleChange("fullName", e.target.value)}
            className="bg-white border-blue-200 focus-visible:ring-blue-400"
          />
          {errors.fullName && <p className="text-red-600 text-sm mt-1">{errors.fullName}</p>}
        </div>
        <div className="space-y-2">
          <Label className="text-sm font-medium text-blue-800">Designation</Label>
          <Input
            placeholder="Full Stack Developer"
            value={profileData.designation || ""}
            onChange={(e) => handleChange("designation", e.target.value)}
            className="bg-white border-blue-200 focus-visible:ring-blue-400"
          />
          {errors.designation && <p className="text-red-600 text-sm mt-1">{errors.designation}</p>}
        </div>
        <div className="md:col-span-2 space-y-2">
          <Label className="text-sm font-medium text-blue-800">Summary</Label>
          <Textarea
            placeholder="Short introduction about yourself"
            rows={4}
            value={profileData.summary || ""}
            onChange={(e) => handleChange("summary", e.target.value)}
            className="bg-white border-blue-200 focus-visible:ring-blue-400"
          />
          {errors.summary && <p className="text-red-600 text-sm mt-1">{errors.summary}</p>}
        </div>
      </div>
    </div>
  )
}

// Contact Information Form
export const ContactInfoForm = ({ contactInfo, updateSection }) => {
  const [errors, setErrors] = useState({})

  const handleChange = (field, value) => {
    const { sanitized, error } = validateField(field, value)
    updateSection(field, sanitized)
    setErrors((prev) => ({ ...prev, [field]: error }))
  }

  const fields = [
    ["Address", "location", "Short Address"],
    ["Email", "email", "john@example.com"],
    ["Phone Number", "phone", "+91-9876543210"],
    ["LinkedIn", "linkedin", "https://linkedin.com/in/username"],
    ["GitHub", "github", "https://github.com/username"],
    ["Portfolio / Website", "website", "https://yourwebsite.com"],
  ]

  return (
    <div className="p-6 bg-blue-50 rounded-xl border border-blue-100 shadow-sm space-y-6">
      <h2 className="text-xl font-semibold text-blue-900">Contact Information</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {fields.map(([label, key, placeholder]) => (
          <div key={key} className="space-y-2">
            <Label className="text-sm font-medium text-blue-800">{label}</Label>
            <Input
              placeholder={placeholder}
              value={contactInfo[key] || ""}
              onChange={(e) => handleChange(key, e.target.value)}
              className="bg-white border-blue-200 focus-visible:ring-blue-400"
            />
            {errors[key] && <p className="text-red-600 text-sm mt-1">{errors[key]}</p>}
          </div>
        ))}
      </div>
    </div>
  )
}

// Education Details Form
export const EducationDetailsForm = ({
  educationInfo,
  updateArrayItem,
  addArrayItem,
  removeArrayItem,
}) => {
  const [errors, setErrors] = useState({});

  const handleChange = (index, field, value) => {
    const { sanitized, error } = validateField(field, value);
    updateArrayItem(index, field, sanitized);
    setErrors((prev) => ({
      ...prev,
      [index]: { ...(prev[index] || {}), [field]: error },
    }));
  };

  return (
    <div className="p-6 bg-blue-50 rounded-xl border border-blue-100 shadow-sm space-y-6">
      <h2 className="text-xl font-semibold text-blue-900">Education</h2>

      <div className="space-y-4">
        {educationInfo.map((edu, index) => (
          <div
            key={index}
            className="relative p-5 bg-white rounded-lg border border-blue-100 shadow-sm"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {["degree", "institution", "startDate", "endDate", "gpa"].map(
                (field) => (
                  <div key={field} className="space-y-2">
                    <Label className="font-medium text-blue-800 text-sm">
                      {field
                        .replace(/([A-Z])/g, " $1")
                        .replace(/^./, (s) => s.toUpperCase())}
                    </Label>
                    <Input
                      type={
                        field === "startDate" || field === "endDate"
                          ? "month"
                          : "text"
                      }
                      placeholder={
                        field === "degree"
                          ? "BTech in Computer Science"
                          : field === "institution"
                          ? "XYZ University"
                          : field === "gpa"
                          ? "e.g., 3.8 / 4.0"
                          : ""
                      }
                      value={edu[field] || ""}
                      onChange={(e) =>
                        handleChange(index, field, e.target.value)
                      }
                      className="bg-blue-50 border-blue-200 focus-visible:ring-blue-400"
                    />
                    {errors[index]?.[field] && (
                      <p className="text-red-600 text-sm mt-1">
                        {errors[index][field]}
                      </p>
                    )}
                  </div>
                )
              )}
            </div>

            {educationInfo.length > 1 && (
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-2 right-2 text-destructive"
                onClick={() => removeArrayItem(index)}
              >
                <Trash2 size={16} />
              </Button>
            )}
          </div>
        ))}

        <Button
          variant="secondary"
          onClick={() =>
            addArrayItem({
              degree: "",
              institution: "",
              startDate: "",
              endDate: "",
              gpa: "",
            })
          }
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          <Plus size={16} /> Add Education
        </Button>
      </div>
    </div>
  );
};

// Work Experience Form
export const WorkExperienceForm = ({ workExperience, updateArrayItem, addArrayItem, removeArrayItem }) => {
  const [errors, setErrors] = useState({});

  const handleChange = (index, field, value) => {
    const { sanitized, error } = validateField(field, value);
    updateArrayItem(index, field, sanitized);
    setErrors((prev) => ({
      ...prev,
      [index]: { ...(prev[index] || {}), [field]: error },
    }));
  };

  const handleCheckbox = (index, field, value) => {
    updateArrayItem(index, field, value);
  };

  return (
    <div className="p-6 bg-blue-50 rounded-xl border border-blue-100 shadow-sm space-y-6">
      <h2 className="text-xl font-semibold text-blue-900">Work Experience</h2>
      <div className="space-y-4">
        {workExperience.map((work, index) => (
          <div key={index} className="relative p-5 bg-white rounded-lg border border-blue-100 shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {["company", "title", "location", "startDate", "endDate"].map((field) => (
                <div key={field} className="space-y-2">
                  <Label className="text-sm font-medium text-blue-800 capitalize">
                    {field.replace(/([A-Z])/g, " $1")}
                  </Label>
                  <Input
                    type={field.includes("Date") ? "month" : "text"}
                    placeholder={
                      field === "company"
                        ? "ABC Corp"
                        : field === "title"
                        ? "Frontend Developer"
                        : field === "location"
                        ? "New Delhi, India"
                        : ""
                    }
                    value={work[field] || ""}
                    onChange={(e) => handleChange(index, field, e.target.value)}
                    className="bg-blue-50 border-blue-200 focus-visible:ring-blue-400"
                  />
                  {errors[index]?.[field] && (
                    <p className="text-red-600 text-sm mt-1">{errors[index][field]}</p>
                  )}
                </div>
              ))}
            </div>

            {/* Is Current Checkbox */}
            <div className="mt-3 flex items-center gap-2">
              <input
                type="checkbox"
                checked={!!work.is_current}
                onChange={(e) => handleCheckbox(index, "is_current", e.target.checked)}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-400"
              />
              <Label className="text-sm text-blue-800">Currently Working Here</Label>
            </div>
            {/* Point wise description */}
            <div className="mt-4 space-y-2">
              <Label className="text-sm font-medium text-blue-800">Description (Use Enter for new bullet)</Label>
              <Textarea
                placeholder="• Led a 5-member development team"                        
                rows={4}
                value={work.description || ""}
                onChange={(e) => handleChange(index, "description", e.target.value)}
                className="bg-blue-50 border-blue-200 focus-visible:ring-blue-400 font-mono whitespace-pre-wrap text-sm"
              />
              <p className="text-xs text-gray-500">
                Each line will appear as a separate bullet point in your resume.
              </p>
              {errors[index]?.description && (
                <p className="text-red-600 text-sm mt-1">{errors[index].description}</p>
              )}
            </div>


            {workExperience.length > 1 && (
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-2 right-2 text-destructive"
                onClick={() => removeArrayItem(index)}
              >
                <Trash2 size={16} />
              </Button>
            )}
          </div>
        ))}
        <Button
          onClick={() =>
            addArrayItem({
              company: "",
              title: "",
              location: "",
              startDate: "",
              endDate: "",
              is_current: false,
              description: "",
            })
          }
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          <Plus size={16} /> Add Work Experience
        </Button>
      </div>
    </div>
  );
};

// Project Detail Form
export const ProjectDetailForm = ({ projectInfo, updateArrayItem, addArrayItem, removeArrayItem }) => (
  <div className="p-6 bg-blue-50 rounded-xl border border-blue-100 shadow-sm space-y-6">
    <h2 className="text-xl font-semibold text-blue-900">Projects</h2>
    <div className="space-y-4">
      {projectInfo.map((proj, index) => (
        <div key={index} className="relative p-5 bg-white rounded-lg border border-blue-100 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2 space-y-2">
              <Label className="text-blue-800 text-sm font-medium">Project Title</Label>
              <Input
                placeholder="Portfolio Website"
                value={proj.title || ""}
                onChange={({ target }) => updateArrayItem(index, "title", target.value)}
                className="bg-blue-50 border-blue-200 focus-visible:ring-blue-400"
              />
            </div>
            <div className="md:col-span-2 space-y-2">
              <Label className="text-blue-800 text-sm font-medium">Description</Label>
              <Textarea
                placeholder="Short description about the project"
                rows={3}
                value={proj.description || ""}
                onChange={({ target }) => updateArrayItem(index, "description", target.value)}
                className="bg-blue-50 border-blue-200 focus-visible:ring-blue-400"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-blue-800 text-sm font-medium">GitHub Link</Label>
              <Input
                placeholder="https://github.com/username/project"
                value={proj.github || ""}
                onChange={({ target }) => updateArrayItem(index, "github", target.value)}
                className="bg-blue-50 border-blue-200 focus-visible:ring-blue-400"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-blue-800 text-sm font-medium">Live Demo URL</Label>
              <Input
                placeholder="https://yourproject.live"
                value={proj.liveDemo || ""}
                onChange={({ target }) => updateArrayItem(index, "liveDemo", target.value)}
                className="bg-blue-50 border-blue-200 focus-visible:ring-blue-400"
              />
            </div>
          </div>
          {projectInfo.length > 1 && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-2 right-2 text-destructive"
              onClick={() => removeArrayItem(index)}
            >
              <Trash2 size={16} />
            </Button>
          )}
        </div>
      ))}
      <Button variant="secondary" onClick={() => addArrayItem({ title: "", description: "", github: "", liveDemo: "" })}>
        <Plus size={16} /> Add Project
      </Button>
    </div>
  </div>
)

// Skills Info Form
export const SkillsInfoForm = ({ skillsInfo, updateArrayItem, addArrayItem, removeArrayItem }) => (
  <div className="p-6 bg-blue-50 rounded-xl border border-blue-100 shadow-sm space-y-6">
    <h2 className="text-xl font-semibold text-blue-900">Skills</h2>
    <div className="space-y-4">
      {skillsInfo.map((skill, index) => (
        <div key={index} className="relative p-5 bg-white rounded-lg border border-blue-100 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-blue-800 text-sm font-medium">Skill Name</Label>
              <Input
                placeholder="JavaScript"
                value={skill.name || ""}
                onChange={({ target }) => updateArrayItem(index, "name", target.value)}
                className="bg-blue-50 border-blue-200 focus-visible:ring-blue-400"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-blue-800 text-sm font-medium">
                Proficiency ({skill.progress ? Math.round(skill.progress / 20) : 0}/5)
              </Label>
              <RatingInput
                value={skill.progress || 0}
                total={5}
                color="#f59e0b"
                bgColor="#e5e7eb"
                onChange={(newValue) => updateArrayItem(index, "progress", newValue)}
              />
            </div>
          </div>
          {skillsInfo.length > 1 && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-2 right-2 text-destructive"
              onClick={() => removeArrayItem(index)}
            >
              <Trash2 size={16} />
            </Button>
          )}
        </div>
      ))}
      <Button variant="secondary" onClick={() => addArrayItem({ name: "", progress: 0 })}>
        <Plus size={16} /> Add Skill
      </Button>
    </div>
  </div>
)

// Certification Info Form
export const CertificationInfoForm = ({ certifications, updateArrayItem, addArrayItem, removeArrayItem }) => {
  const [errors, setErrors] = useState({});

  const handleChange = (index, field, value) => {
    const { sanitized, error } = validateField(field, value);
    updateArrayItem(index, field, sanitized);
    setErrors((prev) => ({
      ...prev,
      [index]: { ...(prev[index] || {}), [field]: error },
    }));
  };

  return (
    <div className="p-6 bg-blue-50 rounded-xl border border-blue-100 shadow-sm space-y-6">
      <h2 className="text-xl font-semibold text-blue-900">Certifications</h2>
      <div className="space-y-4">
        {certifications.map((cert, index) => (
          <div key={index} className="relative p-5 bg-white rounded-lg border border-blue-100 shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {["name", "issuer", "issueDate"].map((field) => (
                <div key={field} className="space-y-2">
                  <Label className="capitalize text-blue-800 text-sm">
                    {field === "issueDate" ? "Issue Date" : field}
                  </Label>
                  <Input
                    type={field === "issueDate" ? "month" : "text"}
                    placeholder={
                      field === "name"
                        ? "AWS Certified Developer"
                        : field === "issuer"
                        ? "Amazon Web Services"
                        : ""
                    }
                    value={cert[field] || ""}
                    onChange={(e) => handleChange(index, field, e.target.value)}
                    className="bg-blue-50 border-blue-200 focus-visible:ring-blue-400"
                  />
                  {errors[index]?.[field] && (
                    <p className="text-red-600 text-sm mt-1">{errors[index][field]}</p>
                  )}
                </div>
              ))}
            </div>

            {/* Description Textarea */}
            <div className="mt-4 space-y-2">
              <Label className="text-sm font-medium text-blue-800">Description</Label>
              <Textarea
                placeholder="Brief description of the certification"
                rows={3}
                value={cert.description || ""}
                onChange={(e) => handleChange(index, "description", e.target.value)}
                className="bg-blue-50 border-blue-200 focus-visible:ring-blue-400"
              />
              {errors[index]?.description && (
                <p className="text-red-600 text-sm mt-1">{errors[index].description}</p>
              )}
            </div>

            {certifications.length > 1 && (
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-2 right-2 text-destructive"
                onClick={() => removeArrayItem(index)}
              >
                <Trash2 size={16} />
              </Button>
            )}
          </div>
        ))}
        <Button
          onClick={() =>
            addArrayItem({
              name: "",
              issuer: "",
              issueDate: "",
              description: "",
            })
          }
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          <Plus size={16} /> Add Certification
        </Button>
      </div>
    </div>
  );
};

// Additional Info Form
export const AdditionalInfoForm = ({ languages, interests, updateArrayItem, addArrayItem, removeArrayItem }) => (
  <div className="p-6 bg-blue-50 rounded-xl border border-blue-100 shadow-sm space-y-8">
    <h2 className="text-xl font-semibold text-blue-900">Additional Information</h2>

    {/* Languages */}
    <section>
      <h3 className="flex items-center text-blue-800 font-medium mb-3">
        <span className="w-2 h-2 rounded-full bg-purple-500 mr-2"></span> Languages
      </h3>
      <div className="space-y-4">
        {languages?.map((lang, index) => (
          <div key={index} className="relative p-5 bg-white rounded-lg border border-blue-100 shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm text-blue-800 font-medium">Language</Label>
                <Input
                  placeholder="English"
                  value={lang.name || ""}
                  onChange={({ target }) => updateArrayItem("languages", index, "name", target.value)}
                  className="bg-blue-50 border-blue-200 focus-visible:ring-blue-400"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm text-blue-800 font-medium">Proficiency</Label>
                <RatingInput
                  value={lang.progress || 0}
                  total={5}
                  color="#8b5cf6"
                  bgColor="#e5e7eb"
                  onChange={(val) => updateArrayItem("languages", index, "progress", val)}
                />
              </div>
            </div>
            {languages.length > 1 && (
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-2 right-2 text-destructive"
                onClick={() => removeArrayItem("languages", index)}
              >
                <Trash2 size={16} />
              </Button>
            )}
          </div>
        ))}
        <Button variant="secondary" onClick={() => addArrayItem("languages", { name: "", progress: 0 })}>
          <Plus size={16} /> Add Language
        </Button>
      </div>
    </section>

    {/* Interests */}
    <section>
      <h3 className="flex items-center text-blue-800 font-medium mb-3">
        <span className="w-2 h-2 rounded-full bg-orange-500 mr-2"></span> Interests
      </h3>
      <div className="space-y-4">
        {interests?.map((interest, index) => (
          <div key={index} className="relative p-5 bg-white rounded-lg border border-blue-100 shadow-sm">
            <div className="space-y-2">
              <Label className="text-sm text-blue-800 font-medium">Interest</Label>
              <Input
                placeholder="Photography"
                value={interest.name || ""}
                onChange={({ target }) => updateArrayItem("interests", index, "name", target.value)}
                className="bg-blue-50 border-blue-200 focus-visible:ring-blue-400"
              />
            </div>
            {interests.length > 1 && (
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-2 right-2 text-destructive"
                onClick={() => removeArrayItem("interests", index)}
              >
                <Trash2 size={16} />
              </Button>
            )}
          </div>
        ))}
        <Button variant="secondary" onClick={() => addArrayItem("interests", { name: "" })}>
          <Plus size={16} /> Add Interest
        </Button>
      </div>
    </section>
  </div>
)
