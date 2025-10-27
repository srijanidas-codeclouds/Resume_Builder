import React from 'react'
import Template1 from './Template1'
import Template2 from './Template2'

const RenderResume = ({ resumeData , templateId, containerWidth }) => {
  switch (templateId) {
    case "01":
        return(
            <Template1 resumeData={resumeData} containerWidth={containerWidth} />
        )
    case "02":
        return(
            <Template2 resumeData={resumeData} containerWidth={containerWidth} />
        )
    default:
        return(
            <Template1 resumeData={resumeData} containerWidth={containerWidth} />
        )
  }
}

export default RenderResume