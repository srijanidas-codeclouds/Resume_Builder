import moment from "moment";
import React, { useEffect, useRef, useState } from "react";

export function formatYearMonth(yearMonth) {
  return yearMonth ? moment(yearMonth, "YYYY-MM").format("MMM YYYY") : "";
}

const Template1 = ({ resumeData = {}, containerWidth }) => {
  const {
    profileInfo = {},
    contactInfo = {},
    education = [],
    workExperience = [],
    projects = [],
    skills = [],
    certifications = [],
    interests = [],
  } = resumeData;

  const resumeRef = useRef(null);
  const [baseWidth, setBaseWidth] = useState(1100);
  const [scale, setScale] = useState(1);

  const linkedin =
    typeof contactInfo.linkedin === "string" ? contactInfo.linkedin : "";
  const github =
    typeof contactInfo.github === "string" ? contactInfo.github : "";
  const website =
    typeof contactInfo.website === "string" ? contactInfo.website : "";

  useEffect(() => {
    if (resumeRef.current) {
      const actualBaseWidth = resumeRef.current.offsetWidth;
      setBaseWidth(actualBaseWidth);
      if (containerWidth > 0) {
        setScale(containerWidth / actualBaseWidth);
      }
    }
  }, [containerWidth]);

  // Group skills logically
  const groupedSkills = {
    "Automation & Test tools": [],
    "Product Management": [],
    Languages: [],
    "Other Skills": [],
  };

  skills.forEach((skill) => {
    if (["Selenium/Webdriver", "TestNG", "Jenkins"].includes(skill.name)) {
      groupedSkills["Automation & Test tools"].push(skill.name);
    } else if (["Agile", "Scrum", "JIRA", "Microsoft TFS"].includes(skill.name)) {
      groupedSkills["Product Management"].push(skill.name);
    } else if (
      ["Python", "Java", "Javascript", "Databases (MySQL)"].includes(skill.name)
    ) {
      groupedSkills.Languages.push(skill.name);
    } else {
      groupedSkills["Other Skills"].push(skill.name);
    }
  });

  return (
    <div
      ref={resumeRef}
      className="bg-white font-sans text-black mx-auto shadow-sm rounded-md overflow-hidden print:shadow-none print:rounded-none"
      style={{
        transform: containerWidth > 0 ? `scale(${scale})` : "none",
        transformOrigin: "top left",
        width: containerWidth > 0 ? `${baseWidth}px` : "210mm",
        minHeight: "297mm",
        aspectRatio: "210 / 297",
        margin: "0 auto",
      }}
    >
      {/* ===== HEADER ===== */}
      <header className="px-10 pt-10 pb-6 border-b border-gray-300 bg-gray-50">
        <div className="text-center">
          <h1 className="text-3xl font-bold uppercase tracking-wide mb-2">
            {profileInfo.fullName}
          </h1>
          <h2 className="text-lg font-semibold text-gray-700 mb-3">
            {profileInfo.designation}
          </h2>
          {profileInfo.summary && (
            <p className="text-sm text-gray-700 leading-relaxed max-w-3xl mx-auto">
              {profileInfo.summary}
            </p>
          )}
        </div>
      </header>

      {/* ===== BODY ===== */}
      <div className="grid grid-cols-12 gap-8 px-10 py-8 print:px-8 print:py-6">
        {/* ===== LEFT SIDEBAR ===== */}
        <aside className="col-span-4 pr-6 border-r border-gray-300 space-y-6">
          {/* Contact */}
          <section>
            <h2 className="text-sm font-bold uppercase text-gray-800 mb-3 tracking-widest border-b border-gray-200 pb-1">
              Contact
            </h2>
            <ul className="text-xs text-gray-700 space-y-2">
              <li className="flex items-start">
                <span className="font-semibold w-20">Location:</span>
                <span className="truncate">{contactInfo.location}</span>
              </li>
              <li className="flex items-start">
                <span className="font-semibold w-20">Phone:</span>
                {contactInfo.phone}
              </li>
              <li className="flex items-start">
                <span className="font-semibold w-20">Email:</span>
                <a
                  href={`mailto:${contactInfo.email}`}
                  className="text-blue-600 hover:underline break-all"
                >
                  {contactInfo.email}
                </a>
              </li>

              {linkedin && (
                <li className="flex items-start">
                  <span className="font-semibold w-20">LinkedIn:</span>
                  <a
                    href={linkedin}
                    className="text-blue-600 hover:underline truncate"
                    title={linkedin}
                  >
                    linkedin.com/in/{linkedin.split("/").pop()}
                  </a>
                </li>
              )}
              {github && (
                <li className="flex items-start">
                  <span className="font-semibold w-20">GitHub:</span>
                  <a
                    href={github}
                    className="text-blue-600 hover:underline truncate"
                    title={github}
                  >
                    github.com/{github.split("/").pop()}
                  </a>
                </li>
              )}
              {website && (
                <li className="flex items-start">
                  <span className="font-semibold w-20">Portfolio:</span>
                  <a
                    href={website}
                    className="text-blue-600 hover:underline truncate"
                    title={website}
                  >
                    {website.replace(/(^\w+:|^)\/\//, "")}
                  </a>
                </li>
              )}
            </ul>
          </section>

          {/* Skills */}
          <section>
            <h2 className="text-sm font-bold uppercase text-gray-800 mb-3 tracking-widest border-b border-gray-200 pb-1">
              Skills
            </h2>
            {Object.entries(groupedSkills).map(
              ([category, list]) =>
                list.length > 0 && (
                  <div key={category} className="mb-2">
                    {category !== "Other Skills" && (
                      <h3 className="text-xs font-semibold italic mb-1">
                        {category}
                      </h3>
                    )}
                    <ul className="text-xs text-gray-700 grid grid-cols-2 gap-x-2">
                      {list.map((skill, idx) => (
                        <li key={idx}>• {skill}</li>
                      ))}
                    </ul>
                  </div>
                )
            )}
          </section>

          {/* Education */}
          {education.length > 0 && (
            <section>
              <h2 className="text-sm font-bold uppercase text-gray-800 mb-3 tracking-widest border-b border-gray-200 pb-1">
                Education
              </h2>
              <div className="space-y-3">
                {education.map((edu, idx) => (
                  <div key={idx} className="text-xs">
                    <h3 className="font-semibold">{edu.institution}</h3>
                    <p className="italic text-gray-700">{edu.degree}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Certifications */}
          {certifications.length > 0 && (
            <section>
              <h2 className="text-sm font-bold uppercase text-gray-800 mb-3 tracking-widest border-b border-gray-200 pb-1">
                Certifications
              </h2>
              <ul className="text-xs text-gray-700 space-y-1">
                {certifications.map((cert, idx) => (
                  <li key={idx}>
                    {cert.title} ({cert.year})
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* Interests */}
          {interests.length > 0 && (
            <section>
              <h2 className="text-sm font-bold uppercase text-gray-800 mb-3 tracking-widest border-b border-gray-200 pb-1">
                Interests
              </h2>
              <ul className="text-xs text-gray-700 space-y-1">
                {interests.map((interest, idx) => (
                  <li key={idx}>• {interest}</li>
                ))}
              </ul>
            </section>
          )}
        </aside>

        {/* ===== MAIN CONTENT ===== */}
        <main className="col-span-8 pl-4 space-y-6">
          {/* Work Experience */}
          {workExperience.length > 0 && (
            <section>
              <h2 className="text-sm font-bold uppercase text-gray-800 mb-3 tracking-widest border-b border-gray-300 pb-1">
                Work Experience
              </h2>
              <div className="space-y-5">
                {workExperience.map((exp, idx) => (
                  <div key={idx} className="text-xs">
                    <div className="flex justify-between items-start mb-1">
                      <div>
                        <h3 className="font-bold">{exp.role}</h3>
                        <p className="italic text-gray-700">
                          {exp.company}
                          {exp.location && `, ${exp.location}`}
                        </p>
                      </div>
                      {exp.startDate && exp.endDate && (
                        <div className="text-right italic text-gray-600 text-xs">
                          {formatYearMonth(exp.startDate)} –{" "}
                          {formatYearMonth(exp.endDate)}
                        </div>
                      )}
                    </div>
                    <ul className="list-disc list-inside space-y-1 mt-1 pl-2">
                      {exp.description?.split("\n").map((line, i) => (
                        <li key={i}>{line}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Projects */}
          {projects.length > 0 && (
            <section>
              <h2 className="text-sm font-bold uppercase text-gray-800 mb-3 tracking-widest border-b border-gray-300 pb-1">
                Projects
              </h2>
              <div className="space-y-5">
                {projects.map((proj, idx) => (
                  <div key={idx} className="text-xs">
                    <div className="flex justify-between items-start mb-1">
                      <h3 className="font-bold">{proj.title}</h3>
                      {proj.startDate && proj.endDate && (
                        <div className="text-right italic text-gray-600">
                          {formatYearMonth(proj.startDate)} –{" "}
                          {formatYearMonth(proj.endDate)}
                        </div>
                      )}
                    </div>
                    <p className="mt-1 mb-2 text-gray-700">{proj.description}</p>
                    <div className="flex flex-wrap gap-3 text-xs">
                      {proj.github && (
                        <a
                          href={proj.github}
                          className="text-blue-600 hover:underline"
                        >
                          GitHub
                        </a>
                      )}
                      {proj.liveDemo && (
                        <a
                          href={proj.liveDemo}
                          className="text-blue-600 hover:underline"
                        >
                          Live Demo
                        </a>
                      )}
                      {proj.technologies && (
                        <span className="text-gray-600">
                          <strong>Tech:</strong> {proj.technologies.join(", ")}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </main>
      </div>
    </div>
  );
};

export default Template1;
