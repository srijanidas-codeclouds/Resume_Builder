import React from 'react';
import { ExternalLink, Github } from 'lucide-react';

// Progress Bar
export const Progress = ({ progress, color }) => (
  <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
    <div
      className="h-full rounded-full transition-all duration-300"
      style={{ width: `${progress * 20}%`, backgroundColor: color }}
    />
  </div>
);

// Action Link
export const ActionLink = ({ icon, link, bgColor }) => (
  <div className="flex items-center gap-3 p-2 rounded-md hover:bg-gray-100 transition-colors">
    <div className="w-8 h-8 flex items-center justify-center rounded-full" style={{ backgroundColor: bgColor }}>
      {icon}
    </div>
    <p className="text-gray-700 font-medium truncate">{link}</p>
  </div>
);

// Certification Info
export const CertificationInfo = ({ title, issuer, year, bgColor }) => (
  <div className="border-l-4 border-gray-300 pl-3 mb-4">
    <h3 className="text-md font-semibold text-gray-800">{title}</h3>
    <div className="flex items-center gap-2 mt-1 flex-wrap">
      {year && (
        <span
          className="text-xs font-medium px-2 py-0.5 rounded"
          style={{ backgroundColor: bgColor }}
        >
          {year}
        </span>
      )}
      <p className="text-gray-500 text-sm">{issuer}</p>
    </div>
  </div>
);

// Contact Info
export const ContactInfo = ({ icon, iconBG, value }) => (
  <div className="flex items-center gap-3 mb-2">
    <div
      className="w-8 h-8 flex items-center justify-center rounded-full text-white"
      style={{ backgroundColor: iconBG }}
    >
      {icon}
    </div>
    <p className="text-gray-700 text-sm">{value}</p>
  </div>
);

// Education Info
export const EducationInfo = ({ degree, institution, duration }) => (
  <div className="mb-4">
    <h3 className="text-md font-semibold text-gray-800">{degree}</h3>
    <p className="text-gray-600 text-sm">{institution}</p>
    <p className="text-gray-400 text-xs">{duration}</p>
  </div>
);

// Info Block (Skills / Languages)
const InfoBlock = ({ label, progress, accentColor }) => (
  <div className="mb-3">
    <p className="text-gray-700 font-medium mb-1">{label}</p>
    {progress > 0 && <Progress progress={(progress / 100) * 5} color={accentColor} />}
  </div>
);

// Language Section
export const LanguageSection = ({ languages, accentColor }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
    {languages.map((lang, idx) => (
      <InfoBlock key={idx} label={lang.name} progress={lang.progress} accentColor={accentColor} />
    ))}
  </div>
);

// Skill Section
export const SkillSection = ({ skills, accentColor }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
    {skills.map((skill, idx) => (
      <InfoBlock key={idx} label={skill.name} progress={skill.progress} accentColor={accentColor} />
    ))}
  </div>
);

// Project Info
export const ProjectInfo = ({ title, description, githubLink, liveDemoUrl, isPreview }) => (
  <div className="border rounded-md p-4 mb-4 hover:shadow-lg transition-shadow">
    <h3 className={`text-gray-800 font-semibold ${isPreview ? "text-lg" : "text-md"}`}>{title}</h3>
    <p className="text-gray-600 mt-1">{description}</p>
    <div className="flex gap-4 mt-3">
      {githubLink && (
        <a
          href={githubLink}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 text-blue-600 hover:underline text-sm"
        >
          <Github size={16} /> GitHub
        </a>
      )}
      {liveDemoUrl && (
        <a
          href={liveDemoUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 text-green-600 hover:underline text-sm"
        >
          <ExternalLink size={16} /> Live Demo
        </a>
      )}
    </div>
  </div>
);

// Rating Input
export const RatingInput = ({ value = 0, total = 5, onChange = () => {}, color = '#10b981', bgColor = '#e5e7eb' }) => {
  const displayValue = Math.round((value / 100) * total);
  return (
    <div className="flex gap-1">
      {[...Array(total)].map((_, idx) => (
        <div
          key={idx}
          onClick={() => onChange(Math.round(((idx + 1) / total) * 100))}
          className="w-4 h-4 rounded-full cursor-pointer transition-colors"
          style={{ backgroundColor: idx < displayValue ? color : bgColor }}
        />
      ))}
    </div>
  );
};

// Work Experience
export const WorkExperience = ({ company, role, duration, durationColor, description }) => (
  <div className="mb-4">
    <div className="flex justify-between items-start flex-wrap">
      <div>
        <h3 className="text-gray-800 font-semibold">{company}</h3>
        <p className="text-gray-600 text-sm">{role}</p>
      </div>
      <p className="text-sm font-medium" style={{ color: durationColor }}>{duration}</p>
    </div>
    <p className="text-gray-500 mt-1 text-sm">{description}</p>
  </div>
);
