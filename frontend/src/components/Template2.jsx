import { ExternalLink, Github } from "lucide-react";
import moment from "moment";
import React, { useEffect, useRef, useState } from "react";

export function formatYearMonth(yearMonth) {
  return yearMonth ? moment(yearMonth, "YYYY-MM").format("MMM YYYY") : "";
}

const sectionTitleClass =
  "text-[12px] font-bold uppercase tracking-wide mb-1 pb-0.5 border-b border-gray-300 text-gray-800";

const Template2 = ({ resumeData = {}, containerWidth }) => {
  const {
    profileInfo = {},
    contactInfo = {},
    education = [],
    languages = [],
    workExperience = [],
    projects = [],
    skills = [],
    certifications = [],
    interests = [],
  } = resumeData;

  const resumeRef = useRef(null);
  const [baseWidth, setBaseWidth] = useState(794); // exact A4 width in px at 96dpi
  const [baseHeight] = useState(1123); // exact A4 height in px at 96dpi
  const [scale, setScale] = useState(1);

  useEffect(() => {
    if (resumeRef.current && containerWidth > 0) {
      const actualWidth = resumeRef.current.offsetWidth;
      setScale(containerWidth / actualWidth);
    }
  }, [containerWidth]);

  return (
    <div
      ref={resumeRef}
      className="bg-white text-black font-sans mx-auto shadow-sm print:shadow-none"
      style={{
        width: `${baseWidth}px`,
        height: `${baseHeight}px`,
        transform: containerWidth > 0 ? `scale(${scale})` : undefined,
        transformOrigin: "top left",
        overflow: "hidden",
        padding: "36px 42px",
        lineHeight: 1.4,
      }}
    >
      {/* ===== Header Section ===== */}
      <div className="text-center mb-4">
        <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 mb-1">
          {profileInfo.fullName}
        </h1>
        <p className="text-sm font-medium text-gray-600 mb-2">
          {profileInfo.designation}
        </p>
        <div className="flex flex-wrap justify-center gap-x-3 gap-y-1 text-[11px] text-gray-700">
          {contactInfo.phone && <span>{contactInfo.phone}</span>}
          {contactInfo.email && (
            <a
              href={`mailto:${contactInfo.email}`}
              className="hover:underline text-blue-600"
            >
              {contactInfo.email}
            </a>
          )}
          {contactInfo.linkedin && (
            <a
              href={contactInfo.linkedin}
              target="_blank"
              rel="noreferrer"
              className="hover:underline text-blue-600"
            >
              LinkedIn
            </a>
          )}
          {contactInfo.github && (
            <a
              href={contactInfo.github}
              target="_blank"
              rel="noreferrer"
              className="hover:underline text-blue-600"
            >
              GitHub
            </a>
          )}
          {contactInfo.website && (
            <a
              href={contactInfo.website}
              target="_blank"
              rel="noreferrer"
              className="hover:underline text-blue-600"
            >
              Portfolio
            </a>
          )}
        </div>
      </div>

      <hr className="border-gray-300 mb-3" />

      {/* ===== Summary ===== */}
      {profileInfo.summary && (
        <section className="mb-3">
          <h2 className={sectionTitleClass}>Summary</h2>
          <p className="text-[11px] text-gray-800 leading-snug">
            {profileInfo.summary}
          </p>
        </section>
      )}

      {/* ===== Experience ===== */}
      {workExperience.length > 0 && (
        <section className="mb-3">
          <h2 className={sectionTitleClass}>Experience</h2>
          <div className="space-y-3">
            {workExperience.map((exp, idx) => (
              <div key={idx}>
                <div className="flex justify-between items-start">
                  <div className="pr-2">
                    <h3 className="font-semibold text-[12px] text-gray-800">
                      {exp.title}
                    </h3>
                    <p className="italic text-[11px] text-gray-600">
                      {exp.company}
                    </p>
                  </div>
                  <div className="text-[11px] text-right text-gray-600">
                    <p className="italic">
                      {formatYearMonth(exp.startDate)} -{" "}
                      {formatYearMonth(exp.endDate)}
                    </p>
                    {exp.location && <p>{exp.location}</p>}
                  </div>
                </div>
                {exp.technologies && (
                  <p className="bg-gray-100 text-[10px] font-mono px-1.5 py-0.5 rounded inline-block mt-1">
                    {exp.technologies}
                  </p>
                )}
                {exp.description && (
                  <ul className="mt-1 text-[11px] text-gray-700 list-disc list-inside">
                    {exp.description.split("\n").map((line, i) => (
                      <li key={i} className="leading-tight">
                        {line}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ===== Projects ===== */}
      {projects.length > 0 && (
        <section className="mb-3">
          <h2 className={sectionTitleClass}>Projects</h2>
          <div className="space-y-2">
            {projects.map((proj, idx) => (
              <div key={idx}>
                <div className="flex justify-between items-start">
                  <h3 className="font-semibold text-[12px] text-gray-800">
                    {proj.title}
                  </h3>
                  {proj.link && (
                    <a
                      href={proj.link}
                      className="text-blue-600 text-[11px] hover:underline"
                    >
                      {proj.linkType || "Link"}
                    </a>
                  )}
                </div>
                {proj.technologies && (
                  <p className="bg-gray-100 text-[10px] font-mono px-1.5 py-0.5 rounded inline-block mt-1">
                    {proj.technologies}
                  </p>
                )}
                {proj.description && (
                  <p className="text-[11px] text-gray-700 mt-1 leading-snug">
                    {proj.description}
                  </p>
                )}
                <div className="flex gap-2 mt-1 text-[11px]">
                  {proj.github && (
                    <a
                      href={proj.github}
                      className="flex items-center gap-0.5 hover:underline text-blue-600"
                    >
                      <Github size={10} /> GitHub
                    </a>
                  )}
                  {proj.liveDemo && (
                    <a
                      href={proj.liveDemo}
                      className="flex items-center gap-0.5 hover:underline text-blue-600"
                    >
                      <ExternalLink size={10} /> Demo
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ===== Education ===== */}
      {education.length > 0 && (
        <section className="mb-3">
          <h2 className={sectionTitleClass}>Education</h2>
          <div className="space-y-1">
            {education.map((edu, idx) => (
              <div key={idx}>
                <div className="flex justify-between items-center">
                  <h3 className="font-semibold text-[12px] text-gray-800">
                    {edu.degree}
                  </h3>
                  <p className="italic text-[11px] text-gray-600">
                    {formatYearMonth(edu.startDate)} -{" "}
                    {formatYearMonth(edu.endDate)}
                  </p>
                </div>
                <p className="italic text-[11px] text-gray-700">
                  {edu.institution}
                </p>
                {edu.courses && (
                  <p className="text-[11px] leading-snug">
                    <strong>Courses:</strong> {edu.courses}
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ===== Skills ===== */}
      {skills.length > 0 && (
        <section className="mb-3">
          <h2 className={sectionTitleClass}>Skills</h2>
          <ul className="flex flex-wrap gap-1 text-[11px] text-gray-800">
            {skills.map((skill, idx) => (
              <li key={idx} className="bg-gray-100 px-1.5 py-0.5 rounded">
                {skill.name}
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* ===== Certifications ===== */}
      {certifications.length > 0 && (
        <section className="mb-3">
          <h2 className={sectionTitleClass}>Certifications</h2>
          <ul className="list-disc list-inside text-[11px] text-gray-700 leading-tight">
            {certifications.map((cert, idx) => (
              <li key={idx}>
                {cert.title} — {cert.issuer} ({cert.year})
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* ===== Languages & Interests ===== */}
      {(languages.length > 0 || interests.length > 0) && (
        <section className="grid grid-cols-1 ">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {languages.length > 0 && (
              <div>
                <h2 className={sectionTitleClass}>Languages</h2>
                <ul className="flex flex-wrap gap-1 text-[11px] text-gray-700">
                  {languages.map((lang, idx) => (
                    <li
                      key={idx}
                      className="bg-gray-100 px-1.5 py-0.5 rounded-full"
                    >
                      {lang.name}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {interests.length > 0 && interests.some(Boolean) && (
              <div className="">
                <h2 className={sectionTitleClass}>Interests</h2>
                <ul className="flex flex-wrap gap-1 text-[11px] text-gray-700">
                  {interests
                    .filter(Boolean)
                    .map((int, idx) => (
                      <li
                        key={idx}
                        className="bg-gray-100 px-1.5 py-0.5 rounded-full"
                      >
                        {int?.name || ''}
                      </li>
                    ))}
                </ul>
              </div>
            )}
          </div>
        </section>
      )}
    </div>
  );
};

export default Template2;
