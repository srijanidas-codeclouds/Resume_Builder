import React from "react";
import { Document, Page, View } from "@react-pdf/renderer";
import Template1 from "./Template1";
import Template2 from "./Template2";


const ResumePDFDocument = ({ resumeData }) => {
  if (!resumeData) return null;

  // Check all possible template indicators
  const templateId =
    resumeData?.templateId ||
    resumeData?.template?.id ||
    resumeData?.template?.theme ||
    "classic"; // default fallback

  // Decide which template to use
  let SelectedTemplate;
  switch (templateId.toLowerCase()) {
    case "02":
    case "template2":
    case "modern":
      SelectedTemplate = Template2;
      break;

    case "01":
    case "template1":
    case "classic":
    default:
      SelectedTemplate = Template1;
      break;
  }

  const TemplateComponent = SelectedTemplate;

  return (
    <Document>
      {/* <Page size="A4"> */}
        {/* <View> */}
          <TemplateComponent
            resumeData={resumeData}
            forPdf={true}
            containerWidth={794}
          />
        {/* </View> */}
      {/* </Page> */}
    </Document>
  );
};

export default ResumePDFDocument;
