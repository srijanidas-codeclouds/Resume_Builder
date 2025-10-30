// src/components/Template1.jsx
import React, { useEffect, useRef, useState } from "react";
import moment from "moment";

// Import react-pdf primitives (used when forPdf === true)
import {
  Page as PDFPage,
  View as PDFView,
  Text as PDFText,
  Link as PDFLink,
  StyleSheet as PDFStyleSheet,
} from "@react-pdf/renderer";

/**
 * formatYearMonth kept identical
 */
export function formatYearMonth(yearMonth) {
  return yearMonth ? moment(yearMonth, "YYYY-MM").format("MMM YYYY") : "";
}

/**
 * Shared style objects for both DOM and react-pdf rendering.
 * PDFStyleSheet.create simply returns an object; we reuse it for consistency.
 */
const pdfStyles = PDFStyleSheet.create
  ? PDFStyleSheet.create({
      page: {
        backgroundColor: "#fff",
        color: "#000",
        fontFamily: "Helvetica",
        paddingVertical: 24,
        paddingHorizontal: 36,
        fontSize: 10,
        lineHeight: 1.5,
      },
      header: {
        textAlign: "center",
        marginBottom: 10,
        paddingBottom: 6,
        borderBottomWidth: 1,
        borderBottomColor: "#d1d5db",
      },
      name: { fontSize: 18, fontWeight: "bold", textTransform: "uppercase", marginBottom: 4 },
      designation: { fontSize: 12, fontWeight: 600, color: "#374151", marginBottom: 4, marginTop: 2 },
      summary: { fontSize: 10, color: "#4b5563", textAlign: "justify", marginTop: 2 },
      body: { display: "flex", flexDirection: "row", gap: 14, marginTop: 12 },
      sidebar: { width: "35%", paddingRight: 6, borderRightWidth: 1, borderRightColor: "#d1d5db" },
      main: { width: "65%", paddingLeft: 8 },
      section: { marginBottom: 8 },
      sectionTitle: {
        fontSize: 10,
        fontWeight: "bold",
        textTransform: "uppercase",
        color: "#1f2937",
        borderBottomWidth: 1,
        borderBottomColor: "#d1d5db",
        marginBottom: 4,
        paddingBottom: 2,
      },
      text: { fontSize: 9, color: "#374151" },
      small: { fontSize: 8, color: "#6b7280" },
      link: { color: "#2563eb", textDecoration: "underline", fontSize: 9 },
      listItem: { marginBottom: 2, flexDirection: "row" },
      bold: { fontWeight: "bold" },
      italic: { fontStyle: "italic" },
    })
  : {
      page: {},
      header: {},
      name: {},
      designation: {},
      summary: {},
      body: {},
      sidebar: {},
      main: {},
      section: {},
      sectionTitle: {},
      text: {},
      small: {},
      link: {},
      listItem: {},
      bold: {},
      italic: {},
    };

/**
 * Template1 is now dual-mode:
 * - forPdf=false (default) => renders HTML DOM (so your UI preview continues to work)
 * - forPdf=true => renders react-pdf primitives (Page, View, Text, Link) for PDF generation
 *
 * Keep component name & prop usage the same; add 'forPdf' when used in PDF creation.
 */
const Template1 = ({ resumeData = {}, containerWidth = 0, forPdf = false }) => {
  const {
    profileInfo = {},
    contactInfo = {},
    education = [],
    workExperience = [],
    projects = [],
    skills = [],
    certifications = [],
    languages = [],
    interests = [],
  } = resumeData;

  const resumeRef = useRef(null);
  const [baseWidth, setBaseWidth] = useState(1100);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    if (!forPdf && resumeRef.current) {
      const actualBaseWidth = resumeRef.current.offsetWidth;
      setBaseWidth(actualBaseWidth);
      if (containerWidth > 0) {
        setScale(containerWidth / actualBaseWidth);
      }
    }
  }, [containerWidth, forPdf]);

  // Group skills 
  const groupedSkills = {
    "Automation & Test tools": [],
    "Product Management": [],
    Languages: [],
    "Other Skills": [],
  };

  (skills || []).forEach((skill) => {
    if (["Selenium/Webdriver", "TestNG", "Jenkins"].includes(skill.name)) {
      groupedSkills["Automation & Test tools"].push(skill.name);
    } else if (["Agile", "Scrum", "JIRA", "Microsoft TFS"].includes(skill.name)) {
      groupedSkills["Product Management"].push(skill.name);
    } else if (["Python", "Java", "Javascript", "Databases (MySQL)"].includes(skill.name)) {
      groupedSkills.Languages.push(skill.name);
    } else {
      groupedSkills["Other Skills"].push(skill.name);
    }
  });

  // Import react-pdf primitives
  const EPage = forPdf ? PDFPage : "div";
  const EView = forPdf ? PDFView : "div";
  const EText = forPdf ? PDFText : "p";
  const ELink = forPdf ? PDFLink : "a";

  // Shared small renderer for list of description lines
  const renderDescriptionLines = (description, TextComp, textStyle) => {
    if (!description) return null;
    return description.split("\n").map((line, i) => (
      <TextComp key={i} style={textStyle}>
        {"\u2022"} {line}
      </TextComp>
    ));
  };

  // ---------- PDF MODE ---------- 
  if (forPdf) {
  return (
    <EPage size="A4" style={pdfStyles.page}>
      {/* Header */}
      <EView style={pdfStyles.header}>
        <EText style={pdfStyles.name}>{profileInfo.fullName}</EText>
        <EText style={pdfStyles.designation}>{profileInfo.designation}</EText>
        {profileInfo.summary && (
          <EText style={pdfStyles.summary}>{profileInfo.summary}</EText>
        )}
      </EView>

      {/* Body */}
      <EView
        style={{
          flexDirection: "row",
          alignItems: "flex-start",
          gap: 0,
        }}
      >
        {/* Sidebar */}
        <EView
          style={{
            flexBasis: "36%",
            paddingRight: 10,
            borderRightWidth: 1,
            borderRightColor: "#d1d5db",
          }}
        >
          {/* Contact */}
          <EView style={{ marginBottom: 10 }}>
            <EText style={pdfStyles.sectionTitle}>Contact</EText>
            {contactInfo.location && (
              <EText style={pdfStyles.text}>Location: {contactInfo.location}</EText>
            )}
            {contactInfo.phone && (
              <EText style={pdfStyles.text}>Phone: {contactInfo.phone}</EText>
            )}
            {contactInfo.email && (
              <EText style={pdfStyles.text}>Email: 
              <ELink src={`mailto:${contactInfo.email}`} style={pdfStyles.link}>
                {contactInfo.email}
              </ELink></EText>
            )}
            {contactInfo.linkedin && (
              <EText style={pdfStyles.text}>LinkedIn:
              <ELink src={contactInfo.linkedin} style={pdfStyles.link}>
                LinkedIn
              </ELink>
              </EText>
            )}
            {contactInfo.github && (
              <EText style={pdfStyles.text}>GitHub:
              <ELink src={contactInfo.github} style={pdfStyles.link}>
                GitHub
              </ELink>
              </EText>
            )}
            {contactInfo.website && (
              <EText style={pdfStyles.text}>Portfolio:
              <ELink src={contactInfo.website} style={pdfStyles.link}>
                Portfolio
              </ELink>
              </EText>
            )}
          </EView>

          {/* Skills */}
          {Object.entries(groupedSkills).some(([_, list]) => list.length > 0) && (
            <EView style={{ marginBottom: 10 }}>
              <EText style={pdfStyles.sectionTitle}>Skills</EText>
              {Object.entries(groupedSkills).map(
                ([category, list]) =>
                  list.length > 0 && (
                    <EView key={category} style={{ marginBottom: 3 }}>
                      {category !== "Other Skills" && (
                        <EText style={[pdfStyles.text, pdfStyles.italic]}>
                          {category}
                        </EText>
                      )}
                      {list.map((skill,progress, i) => (
                        <EText key={i} style={pdfStyles.text}>
                          • {skill} {progress}
                        </EText>
                      ))}
                    </EView>
                  )
              )}
            </EView>
          )}

          {/* Education */}
          {education.length > 0 && (
            <EView style={{ marginBottom: 10 }}>
              <EText style={pdfStyles.sectionTitle}>Education</EText>
              {education.map((edu, idx) => (
                <EView key={idx} style={{ marginBottom: 4 }}>
                  <EText style={[pdfStyles.bold, pdfStyles.text]}>
                    {edu.institution}
                  </EText>
                  <EText style={pdfStyles.text}>{edu.degree}</EText>
                  <EText style={pdfStyles.small}>
                    {formatYearMonth(edu.startDate)} -{" "}
                    {formatYearMonth(edu.endDate)}
                  </EText>
                  {edu.gpa && (
                    <EText style={pdfStyles.small}>GPA: {edu.gpa}</EText>
                  )}
                </EView>
              ))}
            </EView>
          )}

          {/* Certifications */}
          {certifications.length > 0 && (
            <EView style={{ marginBottom: 10 }}>
              <EText style={pdfStyles.sectionTitle}>Certifications</EText>
              {certifications.map((cert, idx) => (
                <EView key={idx} style={{ marginBottom: 2 }}>
                  <EText style={pdfStyles.text}>
                    {cert.name} — {cert.issuer}
                  </EText>
                  {cert.issueDate && (
                    <EText style={pdfStyles.small}>{cert.issueDate}</EText>
                  )}
                </EView>
              ))}
            </EView>
          )}

          {/* Languages */}
          {languages.length > 0 && (
            <EView style={{ marginBottom: 10 }}>
              <EText style={pdfStyles.sectionTitle}>Languages</EText>
              {languages.map((lang, idx) => (
                <EText key={idx} style={pdfStyles.text}>
                  {lang.name} {lang.progress && `(${lang.progress})`}
                </EText>
              ))}
            </EView>
          )}

          {/* Interests */}
          {interests.length > 0 && (
            <EView>
              <EText style={pdfStyles.sectionTitle}>Interests</EText>
              {interests.map((interest, idx) => (
                <EText key={idx} style={pdfStyles.text}>
                  • {interest.name}
                </EText>
              ))}
            </EView>
          )}
        </EView>

        {/* Main section */}
        <EView
          style={{
            flexBasis: "64%",
            paddingLeft: 12,
          }}
        >
          {/* Work Experience */}
          {workExperience.length > 0 && (
            <EView style={{ marginBottom: 10 }}>
              <EText style={pdfStyles.sectionTitle}>Work Experience</EText>
              {workExperience.map((exp, idx) => (
                <EView key={idx} style={{ marginBottom: 6 }}>
                  <EView
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                    }}
                  >
                    <EView>
                      <EText style={[pdfStyles.text, pdfStyles.bold]}>
                        {exp.title}
                      </EText>
                      {/* location in next line of company */}

                      <EText style={pdfStyles.text}>
                        {exp.company}
                        {exp.location && `, ${exp.location}`}
                      </EText>
                      
                    </EView>
                    {exp.startDate && (
                      <EText style={[pdfStyles.small, pdfStyles.italic]}>
                        {formatYearMonth(exp.startDate)} –{" "}
                        {formatYearMonth(exp.endDate)}
                      </EText>
                    )}
                  </EView>
                  {renderDescriptionLines(exp.description, PDFText, pdfStyles.text)}
                </EView>
              ))}
            </EView>
          )}

          {/* Projects */}
          {projects.length > 0 && (
            <EView>
              <EText style={pdfStyles.sectionTitle}>Projects</EText>
              {projects.map((proj, idx) => (
                <EView key={idx} style={{ marginBottom: 5 }}>
                  <EText style={[pdfStyles.text, pdfStyles.bold]}>
                    {proj.title}
                  </EText>
                  {proj.description && (
                    <EText style={pdfStyles.text}>{proj.description}</EText>
                  )}
                  <EView style={{ flexDirection: "row", flexWrap: "wrap" }}>
                    {proj.github && (
                      <ELink src={proj.github} style={pdfStyles.link}>
                        GitHub
                      </ELink>
                    )}
                    {proj.liveDemo && (
                      <ELink src={proj.liveDemo} style={pdfStyles.link}>
                        Live Demo
                      </ELink>
                    )}
                  </EView>
                </EView>
              ))}
            </EView>
          )}
        </EView>
      </EView>
    </EPage>
  );
}

  // DOM rendering (for the in-app preview)
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
      <header className="px-0 pt-5 pb-6 border-b border-gray-300 bg-gray-50 ">
        <div className="text-center">
          <h1 className="text-2xl font-bold uppercase tracking-wide mb-2">
            {profileInfo.fullName}
          </h1>
          <h2 className="text-md font-semibold text-gray-700 mb-2">
            {profileInfo.designation}
          </h2>
          {profileInfo.summary && (
            <p className="text-sm text-gray-700 leading-relaxed max-w-3xl mx-auto text-justify px-2">
              {profileInfo.summary}
            </p>
          )}
        </div>
      </header>

      {/* ===== BODY ===== */}
      <div className="grid grid-cols-12 gap-8 px-10 py-8 print:px-8 print:py-6">
        {/* ===== LEFT SIDEBAR ===== */}
        <aside className="col-span-4 pr-2 border-r border-gray-300 space-y-2 text-wrap">
          {/* Contact */}
          <section>
            <h2 className="text-sm font-bold uppercase text-gray-800 mb-3 tracking-widest border-b border-gray-200 pb-1">
              Contact
            </h2>
            <ul className="text-xs text-gray-700 space-y-1">
              <li className="flex items-start">
                <span className="font-semibold w-20">Location:</span>
                <span className="break-words">{contactInfo.location || ""}</span>
              </li>
              <li className="flex items-start">
                <span className="font-semibold w-20">Phone:</span>
                {contactInfo.phone || ""}
              </li>
              <li className="flex flex-col">
                <span className="font-semibold w-20">Email:</span>
                <a
                  href={`mailto:${contactInfo.email || ""}`}
                  className="text-blue-600 hover:underline break-all"
                >
                  {contactInfo.email || ""}
                </a>
              </li>

              {/* LinkedIn */}
              {typeof contactInfo.linkedin === "string" && contactInfo.linkedin.trim() !== "" && (
                <li className="flex flex-col">
                  <span className="font-semibold">LinkedIn:</span>
                  <a
                    href={
                      /^https?:\/\//i.test(contactInfo.linkedin)
                        ? contactInfo.linkedin
                        : `https://${contactInfo.linkedin}`
                    }
                    className="text-blue-600 hover:underline break-words"
                    title={contactInfo.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {String(contactInfo.linkedin).replace(/(^\w+:|^)\/\//, "")}
                  </a>
                </li>
              )}

              {/* GitHub */}
              {typeof contactInfo.github === "string" && contactInfo.github.trim() !== "" && (
                <li className="flex flex-col">
                  <span className="font-semibold">GitHub:</span>
                  <a
                    href={
                      /^https?:\/\//i.test(contactInfo.github)
                        ? contactInfo.github
                        : `https://${contactInfo.github}`
                    }
                    className="text-blue-600 hover:underline break-words"
                    title={contactInfo.github}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {String(contactInfo.github).replace(/(^\w+:|^)\/\//, "")}
                  </a>
                </li>
              )}

              {/* Portfolio / Website */}
              {typeof contactInfo.website === "string" && contactInfo.website.trim() !== "" && (
                <li className="flex flex-col">
                  <span className="font-semibold">Portfolio:</span>
                  <a
                    href={
                      /^https?:\/\//i.test(contactInfo.website)
                        ? contactInfo.website
                        : `https://${contactInfo.website}`
                    }
                    className="text-blue-600 hover:underline break-words"
                    title={contactInfo.website}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {String(contactInfo.website).replace(/(^\w+:|^)\/\//, "")}
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
                      <h3 className="text-xs font-semibold italic mb-1">{category}</h3>
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
                  <div key={idx} className="text-xs space-y-0.5">
                    <p className="font-semibold text-gray-800">{edu.institution}</p>
                    <p className=" text-gray-700">{edu.degree}</p>
                    <p className="italic text-gray-400">{edu.startDate} - {edu.endDate}</p>
                    {edu.gpa && <p className="text-gray-400 italic">GPA: {edu.gpa}</p>}
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
                    <span className="font-semibold">{cert.name}</span> -{" "}
                    <span className="italic">{cert.issueDate}</span>
                    <br />
                    <span className="text-gray-500">{cert.issuer}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* Languages */}
          {languages.length > 0 && (
            <section>
              <h2 className="text-sm font-bold uppercase text-gray-800 mb-3 tracking-widest border-b border-gray-200 pb-1">
                Languages
              </h2>
              <ul className="text-xs text-gray-700 space-y-1">
                {languages.map((lang, idx) => (
                  <li key={idx}><span className="font-semibold">{lang.name}</span> - <span className="italic">{lang.level}</span></li>
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
                  <li key={idx}>• {interest?.name || ''}</li>
                ))}
              </ul>
            </section>
          )}
        </aside>

        {/* ===== MAIN CONTENT ===== */}
        <main className="col-span-8 pl-2 space-y-6">
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
                          {exp.title && `${exp.title} - `}
                          <span>
                            {exp.company}
                            {exp.location && `, ${exp.location}`}
                          </span>    
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
                        <a href={proj.github} className="text-blue-600 hover:underline">GitHub</a>
                      )}
                      {proj.liveDemo && (
                        <a href={proj.liveDemo} className="text-blue-600 hover:underline">Live Demo</a>
                      )}
                      {proj.technologies && (
                        <span className="text-gray-600"><strong>Tech:</strong> {proj.technologies.join(", ")}</span>
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
