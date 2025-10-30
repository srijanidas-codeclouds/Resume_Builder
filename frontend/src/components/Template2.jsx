import React, { useEffect, useRef, useState } from "react";
import moment from "moment";
import {
  Page as PDFPage,
  View as PDFView,
  Text as PDFText,
  Link as PDFLink,
  StyleSheet as PDFStyleSheet,
} from "@react-pdf/renderer";

// ---------- Utils ----------
export function formatYearMonth(yearMonth) {
  return yearMonth ? moment(yearMonth, "YYYY-MM").format("MMM YYYY") : "";
}

// ---------- PDF Styles ----------
const pdfStyles = PDFStyleSheet.create({
  page: {
    backgroundColor: "#fff",
    color: "#111",
    fontFamily: "Helvetica",
    fontSize: 9.5,
    paddingTop: 32,
    paddingBottom: 36,
    paddingHorizontal: 48,
    lineHeight: 1.4,
  },
  header: { textAlign: "center", marginBottom: 12 },
  name: { fontSize: 16, fontWeight: 700, color: "#111827", marginBottom: 4 },
  designation: { fontSize: 10, color: "#4b5563", marginBottom: 4 },
  contactRow: {
    flexDirection: "row",
    justifyContent: "center",
    flexWrap: "wrap",
    marginTop: 2,
  },
  contactText: { fontSize: 8.5, color: "#374151", marginHorizontal: 3 },
  link: {
    fontSize: 8.5,
    color: "#2563EB",
    textDecoration: "underline",
    marginHorizontal: 3,
  },
  divider: {
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
    marginVertical: 8,
  },
  section: { marginBottom: 12 },
  sectionTitle: {
    fontSize: 9,
    fontWeight: 700,
    textTransform: "uppercase",
    borderBottomWidth: 1,
    borderBottomColor: "#d1d5db",
    paddingBottom: 2,
    marginBottom: 4,
    color: "#1f2937",
  },
  text: { fontSize: 9, color: "#374151", marginBottom: 2 },
  small: { fontSize: 8, color: "#6b7280" },
  italic: { fontStyle: "italic" },
  bold: { fontWeight: 600 },
  tagContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 3,
  },
  tag: {
    borderWidth: 0.6,
    borderColor: "#d1d5db",
    backgroundColor: "#f9fafb",
    paddingHorizontal: 5,
    paddingVertical: 1.5,
    borderRadius: 3,
    fontSize: 8,
    color: "#4b5563",
    marginRight: 4,
    marginBottom: 3,
  },
  gridRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
});

// ---------- Component ----------
const Template2 = ({ resumeData = {}, forPdf = false, containerWidth }) => {
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

  const EContainer = forPdf ? PDFPage : "div";
  const EView = forPdf ? PDFView : "div";
  const EText = forPdf ? PDFText : "p";
  const ELink = forPdf ? PDFLink : "a";

  // ---------- PDF MODE ----------
  if (forPdf) {
    return (
      <EContainer size="A4" style={pdfStyles.page}>
        {/* HEADER */}
        <EView style={pdfStyles.header}>
          <EText style={pdfStyles.name}>{profileInfo.fullName}</EText>
          <EText style={pdfStyles.designation}>{profileInfo.designation}</EText>
          <EView style={pdfStyles.contactRow}>
            {contactInfo.phone && (
              <EText style={pdfStyles.contactText}>{contactInfo.phone}</EText>
            )}
            {contactInfo.email && (
              <ELink src={`mailto:${contactInfo.email}`} style={pdfStyles.link}>
                {contactInfo.email}
              </ELink>
            )}
            {contactInfo.linkedin && (
              <ELink src={contactInfo.linkedin} style={pdfStyles.link}>
                LinkedIn
              </ELink>
            )}
            {contactInfo.github && (
              <ELink src={contactInfo.github} style={pdfStyles.link}>
                GitHub
              </ELink>
            )}
            {contactInfo.website && (
              <ELink src={contactInfo.website} style={pdfStyles.link}>
                Portfolio
              </ELink>
            )}
          </EView>
        </EView>

        <EView style={pdfStyles.divider} />

        {/* SUMMARY */}
        {profileInfo.summary && (
          <EView style={pdfStyles.section}>
            <EText style={pdfStyles.sectionTitle}>Summary</EText>
            <EText style={pdfStyles.text}>{profileInfo.summary}</EText>
          </EView>
        )}

        {/* EXPERIENCE */}
        {workExperience.length > 0 && (
          <EView style={pdfStyles.section}>
            <EText style={pdfStyles.sectionTitle}>Experience</EText>
            {workExperience.map((exp, i) => (
              <EView key={i} style={{ marginBottom: 8 }}>
                <EView style={pdfStyles.gridRow}>
                  <EView>
                    <EText style={[pdfStyles.text, pdfStyles.bold]}>
                      {exp.title}
                    </EText>
                    <EText style={[pdfStyles.small, pdfStyles.italic]}>
                      {exp.company}
                    </EText>
                  </EView>
                  <EView style={{ alignItems: "flex-end" }}>
                    <EText style={[pdfStyles.small, pdfStyles.italic]}>
                      {formatYearMonth(exp.startDate)} –{" "}
                      {formatYearMonth(exp.endDate)}
                    </EText>
                    {exp.location && (
                      <EText style={pdfStyles.small}>{exp.location}</EText>
                    )}
                  </EView>
                </EView>
                {exp.description &&
                  exp.description.split("\n").map((line, j) => (
                    <EText key={j} style={pdfStyles.text}>
                      • {line}
                    </EText>
                  ))}
              </EView>
            ))}
          </EView>
        )}

        {/* PROJECTS */}
        {projects.length > 0 && (
          <EView style={pdfStyles.section}>
            <EText style={pdfStyles.sectionTitle}>Projects</EText>
            {projects.map((proj, i) => (
              <EView key={i} style={{ marginBottom: 6 }}>
                <EText style={pdfStyles.bold}>{proj.title}</EText>
                {proj.description && (
                  <EText style={pdfStyles.text}>{proj.description}</EText>
                )}
                <EView style={pdfStyles.tagContainer}>
                  {proj.github && (
                    <ELink src={proj.github} style={pdfStyles.link}>
                      GitHub
                    </ELink>
                  )}
                  {proj.liveDemo && (
                    <ELink src={proj.liveDemo} style={pdfStyles.link}>
                      LiveDemo
                    </ELink>
                  )}
                </EView>
              </EView>
            ))}
          </EView>
        )}

        {/* EDUCATION */}
        {education.length > 0 && (
          <EView style={pdfStyles.section}>
            <EText style={pdfStyles.sectionTitle}>Education</EText>
            {education.map((edu, i) => (
              <EView key={i} style={{ marginBottom: 4 }}>
                <EView style={pdfStyles.gridRow}>
                  <EText style={pdfStyles.bold}>{edu.degree}</EText>
                  <EText style={pdfStyles.small}>
                    {formatYearMonth(edu.startDate)} –{" "}
                    {formatYearMonth(edu.endDate)}
                  </EText>
                </EView>
                <EText style={[pdfStyles.small, pdfStyles.italic]}>
                  {edu.institution}
                </EText>
                {edu.gpa && (
                  <EText style={[pdfStyles.small, pdfStyles.italic]}>GPA: {edu.gpa}</EText>
                )}
              </EView>
            ))}
          </EView>
        )}

        {/* SKILLS */}
        {skills.length > 0 && (
          <EView style={pdfStyles.section}>
            <EText style={pdfStyles.sectionTitle}>Skills</EText>
            <EView style={pdfStyles.tagContainer}>
              {skills.map((s, i) => (
                <EText key={i} style={pdfStyles.tag}>
                  {s.name} {s.progress && `(${s.progress})`}
                </EText>
              ))}
            </EView>
          </EView>
        )}

        {/* CERTIFICATIONS */}
        {certifications.length > 0 && (
          <EView style={pdfStyles.section}>
            <EText style={pdfStyles.sectionTitle}>Certifications</EText>
            {certifications.map((c, i) => (
              <EText key={i} style={pdfStyles.text}>
                {c.name || c.title} — {c.issuer} ({c.issueDate || c.year})
              </EText>
            ))}
          </EView>
        )}

        {/* LANGUAGES & INTERESTS */}
        {(languages.length > 0 || interests.length > 0) && (
          <EView style={pdfStyles.section}>
            <EView style={pdfStyles.gridRow}>
              {languages.length > 0 && (
                <EView style={{ marginRight: 12 }}>
                  <EText style={pdfStyles.sectionTitle}>Languages</EText>
                  <EView style={pdfStyles.tagContainer}>
                    {languages.map((l, i) => (
                      <EText key={i} style={pdfStyles.tag}>
                        {l.name} ({l.progress})
                      </EText>
                    ))}
                  </EView>
                </EView>
              )}
              {interests.length > 0 && (
                <EView>
                  <EText style={pdfStyles.sectionTitle}>Interests</EText>
                  <EView style={pdfStyles.tagContainer}>
                    {interests.map((it, i) => (
                      <EText key={i} style={pdfStyles.tag}>
                        {it.name}
                      </EText>
                    ))}
                  </EView>
                </EView>
              )}
            </EView>
          </EView>
        )}
      </EContainer>
    );
  }

  // =============== DOM MODE (Browser) ===============
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
      padding: "20px",
    }}
  >
    {/* Header */}
    <header className="text-center mb-5">
      <h1 className="text-2xl font-bold">{profileInfo.fullName}</h1>
      <h2 className="text-md text-gray-600">{profileInfo.designation}</h2>
      <div className="flex flex-wrap justify-center gap-3 text-xs text-gray-700 mt-2">
        {contactInfo.phone && <span>{contactInfo.phone}</span>}
        {contactInfo.email && (
          <a href={`mailto:${contactInfo.email}`} className="text-blue-600 hover:underline">
            {contactInfo.email}
          </a>
        )}
        {contactInfo.linkedin && (
          <a href={contactInfo.linkedin} className="text-blue-600 hover:underline">
            LinkedIn
          </a>
        )}
        {contactInfo.github && (
          <a href={contactInfo.github} className="text-blue-600 hover:underline">
            GitHub
          </a>
        )}
        {contactInfo.website && (
          <a href={contactInfo.website} className="text-blue-600 hover:underline">
            Portfolio
          </a>
        )}
      </div>
    </header>

    <hr className="border-gray-300 my-3" />

    {/* Summary */}
    {profileInfo.summary && (
      <section className="mb-5">
        <h3 className="text-sm font-bold uppercase border-b border-gray-200 pb-1">Summary</h3>
        <p className="text-xs mt-2 text-gray-700 text-justify">{profileInfo.summary}</p>
      </section>
    )}

    {/* Experience */}
    {workExperience.length > 0 && (
      <section className="mb-5">
        <h3 className="text-sm font-bold uppercase border-b border-gray-200 pb-1">Experience</h3>
        <div className="space-y-3 mt-2">
          {workExperience.map((exp, idx) => (
            <div key={idx}>
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="text-xs font-semibold">{exp.title}</h4>
                  <p className="text-xs italic text-gray-600">{exp.company}</p>
                </div>
                <div className="text-right text-xs italic text-gray-500">
                  {formatYearMonth(exp.startDate)} – {formatYearMonth(exp.endDate)}
                  <br />
                  {exp.location}
                </div>
              </div>
              <ul className="list-disc list-inside text-xs text-gray-700 mt-1">
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
      <section className="mb-5">
        <h3 className="text-sm font-bold uppercase border-b border-gray-200 pb-1">Projects</h3>
        <div className="space-y-3 mt-2">
          {projects.map((proj, idx) => (
            <div key={idx}>
              <h4 className="text-xs font-semibold">{proj.title}</h4>
              <p className="text-xs text-gray-700">{proj.description}</p>
              <div className="flex flex-wrap gap-3 text-xs mt-1">
                {proj.github && (
                  <a href={proj.github} className="text-blue-600 hover:underline">
                    GitHub
                  </a>
                )}
                {proj.liveDemo && (
                  <a href={proj.liveDemo} className="text-blue-600 hover:underline">
                    Live Demo
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>
    )}

    {/* Education */}
    {education.length > 0 && (
      <section className="mb-5">
        <h3 className="text-sm font-bold uppercase border-b border-gray-200 pb-1">Education</h3>
        <div className="space-y-2 mt-2">
          {education.map((edu, idx) => (
            <div key={idx} className="flex justify-between text-xs">
              <div>
                <p className="font-semibold">{edu.degree}</p>
                <p className="italic text-gray-600">{edu.institution}</p>
              </div>
              <p className="italic text-gray-500">
                {formatYearMonth(edu.startDate)} – {formatYearMonth(edu.endDate)}
              </p>
            </div>
          ))}
        </div>
      </section>
    )}

    {/* Skills */}
    {skills.length > 0 && (
      <section className="mb-5">
        <h3 className="text-sm font-bold uppercase border-b border-gray-200 pb-1">Skills</h3>
        <div className="flex flex-wrap gap-2 mt-2 text-xs text-gray-700">
          {skills.map((skill, idx) => (
            <span key={idx} className="bg-gray-100 border border-gray-200 px-2 py-0.5 rounded">
              {skill.name}
            </span>
          ))}
        </div>
      </section>
    )}

    {/* Certifications */}
    {certifications.length > 0 && (
      <section className="mb-5">
        <h3 className="text-sm font-bold uppercase border-b border-gray-200 pb-1">
          Certifications
        </h3>
        <ul className="text-xs mt-2 text-gray-700 space-y-1">
          {certifications.map((cert, idx) => (
            <li key={idx}>
              <strong>{cert.name}</strong> — {cert.issuer} ({cert.issueDate})
            </li>
          ))}
        </ul>
      </section>
    )}

    {/* Languages & Interests */}
    {(languages.length > 0 || interests.length > 0) && (
      <section className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-gray-700">
        {languages.length > 0 && (
          <div>
            <h3 className="text-sm font-bold uppercase border-b border-gray-200 pb-1">Languages</h3>
            <div className="flex flex-wrap gap-2 mt-2">
              {languages.map((lang, idx) => (
                <span key={idx} className="bg-gray-100 border border-gray-200 px-2 py-0.5 rounded">
                  {lang.name}
                </span>
              ))}
            </div>
          </div>
        )}

        {interests.length > 0 && (
          <div>
            <h3 className="text-sm font-bold uppercase border-b border-gray-200 pb-1">Interests</h3>
            <div className="flex flex-wrap gap-2 mt-2">
              {interests.map((int, idx) => (
                <span key={idx} className="bg-gray-100 border border-gray-200 px-2 py-0.5 rounded">
                  {int.name}
                </span>
              ))}
            </div>
          </div>
        )}
      </section>
    )}
  </div>
);

};

export default Template2;
