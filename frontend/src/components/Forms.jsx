import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { RatingInput } from "./ResumeSection"
import { Plus, Trash2 } from "lucide-react"

// Profile Info Form
export const ProfileInfoForm = ({ profileData, updateSection }) => (
  <div className="p-6 bg-blue-50 rounded-xl border border-blue-100 shadow-sm space-y-6">
    <h2 className="text-xl font-semibold text-blue-900">Personal Information</h2>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="space-y-2">
        <Label className="text-sm font-medium text-blue-800">Full Name</Label>
        <Input
          placeholder="John Doe"
          value={profileData.fullName || ""}
          onChange={({ target }) => updateSection("fullName", target.value)}
          className="bg-white border-blue-200 focus-visible:ring-blue-400"
        />
      </div>
      <div className="space-y-2">
        <Label className="text-sm font-medium text-blue-800">Designation</Label>
        <Input
          placeholder="Full Stack Developer"
          value={profileData.designation || ""}
          onChange={({ target }) => updateSection("designation", target.value)}
          className="bg-white border-blue-200 focus-visible:ring-blue-400"
        />
      </div>
      <div className="md:col-span-2 space-y-2">
        <Label className="text-sm font-medium text-blue-800">Summary</Label>
        <Textarea
          placeholder="Short introduction about yourself"
          rows={4}
          value={profileData.summary || ""}
          onChange={({ target }) => updateSection("summary", target.value)}
          className="bg-white border-blue-200 focus-visible:ring-blue-400"
        />
      </div>
    </div>
  </div>
)

// Contact Info Form
export const ContactInfoForm = ({ contactInfo, updateSection }) => (
  <div className="p-6 bg-blue-50 rounded-xl border border-blue-100 shadow-sm space-y-6">
    <h2 className="text-xl font-semibold text-blue-900">Contact Information</h2>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {[
        ["Address", "location", "Short Address"],
        ["Email", "email", "john@example.com"],
        ["Phone Number", "phone", "1234567890"],
        ["LinkedIn", "linkedin", "https://linkedin.com/in/username"],
        ["GitHub", "github", "https://github.com/username"],
        ["Portfolio / Website", "website", "https://yourwebsite.com"],
      ].map(([label, key, placeholder]) => (
        <div key={key} className="space-y-2">
          <Label className="text-sm font-medium text-blue-800">{label}</Label>
          <Input
            placeholder={placeholder}
            value={contactInfo[key] || ""}
            onChange={({ target }) => updateSection(key, target.value)}
            className="bg-white border-blue-200 focus-visible:ring-blue-400"
          />
        </div>
      ))}
    </div>
  </div>
)

// Education Details Form
export const EducationDetailsForm = ({ educationInfo, updateArrayItem, addArrayItem, removeArrayItem }) => (
  <div className="p-6 bg-blue-50 rounded-xl border border-blue-100 shadow-sm space-y-6">
    <h2 className="text-xl font-semibold text-blue-900">Education</h2>
    <div className="space-y-4">
      {educationInfo.map((edu, index) => (
        <div key={index} className="relative p-5 bg-white rounded-lg border border-blue-100 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {["degree", "institution", "startDate", "endDate"].map((field) => (
              <div key={field} className="space-y-2">
                <Label className="capitalize text-blue-800 text-sm">{field.replace(/([A-Z])/g, " $1")}</Label>
                <Input
                  type={field.includes("Date") ? "month" : "text"}
                  placeholder={
                    field === "degree"
                      ? "BTech in Computer Science"
                      : field === "institution"
                      ? "XYZ University"
                      : ""
                  }
                  value={edu[field] || ""}
                  onChange={({ target }) => updateArrayItem(index, field, target.value)}
                  className="bg-blue-50 border-blue-200 focus-visible:ring-blue-400"
                />
              </div>
            ))}
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
      <Button variant="secondary" onClick={() => addArrayItem({ degree: "", institution: "", startDate: "", endDate: "" })}>
        <Plus size={16} /> Add Education
      </Button>
    </div>
  </div>
)

// Work Experience Form
export const WorkExperienceForm = ({ workExperience, updateArrayItem, addArrayItem, removeArrayItem }) => (
  <div className="p-6 bg-blue-50 rounded-xl border border-blue-100 shadow-sm space-y-6">
    <h2 className="text-xl font-semibold text-blue-900">Work Experience</h2>
    <div className="space-y-4">
      {workExperience.map((work, index) => (
        <div key={index} className="relative p-5 bg-white rounded-lg border border-blue-100 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {["company", "role", "startDate", "endDate"].map((field) => (
              <div key={field} className="space-y-2">
                <Label className="text-sm font-medium text-blue-800 capitalize">
                  {field.replace(/([A-Z])/g, " $1")}
                </Label>
                <Input
                  type={field.includes("Date") ? "month" : "text"}
                  placeholder={
                    field === "company"
                      ? "ABC Corp"
                      : field === "role"
                      ? "Frontend Developer"
                      : ""
                  }
                  value={work[field] || ""}
                  onChange={({ target }) => updateArrayItem(index, field, target.value)}
                  className="bg-blue-50 border-blue-200 focus-visible:ring-blue-400"
                />
              </div>
            ))}
          </div>
          <div className="mt-4 space-y-2">
            <Label className="text-sm font-medium text-blue-800">Description</Label>
            <Textarea
              placeholder="What did you do in this role?"
              rows={3}
              value={work.description || ""}
              onChange={({ target }) => updateArrayItem(index, "description", target.value)}
              className="bg-blue-50 border-blue-200 focus-visible:ring-blue-400"
            />
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
      <Button variant="" className="bg-gray-100 border-1 border-gray-600 text-gray-800 hover:text-white" onClick={() => addArrayItem({ company: "", role: "", startDate: "", endDate: "", description: "" })}>
        <Plus size={16} /> Add Work Experience
      </Button>
    </div>
  </div>
)

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
export const CertificationInfoForm = ({ certifications, updateArrayItem, addArrayItem, removeArrayItem }) => (
  <div className="p-6 bg-blue-50 rounded-xl border border-blue-100 shadow-sm space-y-6">
    <h2 className="text-xl font-semibold text-blue-900">Certifications</h2>
    <div className="space-y-4">
      {certifications.map((cert, index) => (
        <div key={index} className="relative p-5 bg-white rounded-lg border border-blue-100 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label className="text-sm text-blue-800 font-medium">Certificate Title</Label>
              <Input
                placeholder="Full Stack Web Developer"
                value={cert.title || ""}
                onChange={({ target }) => updateArrayItem(index, "title", target.value)}
                className="bg-blue-50 border-blue-200 focus-visible:ring-blue-400"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-sm text-blue-800 font-medium">Issuer</Label>
              <Input
                placeholder="Coursera / Google"
                value={cert.issuer || ""}
                onChange={({ target }) => updateArrayItem(index, "issuer", target.value)}
                className="bg-blue-50 border-blue-200 focus-visible:ring-blue-400"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-sm text-blue-800 font-medium">Year</Label>
              <Input
                placeholder="2024"
                value={cert.year || ""}
                onChange={({ target }) => updateArrayItem(index, "year", target.value)}
                className="bg-blue-50 border-blue-200 focus-visible:ring-blue-400"
              />
            </div>
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
      <Button variant="secondary" onClick={() => addArrayItem({ title: "", issuer: "", year: "" })}>
        <Plus size={16} /> Add Certification
      </Button>
    </div>
  </div>
)

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
