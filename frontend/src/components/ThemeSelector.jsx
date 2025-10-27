import { DUMMY_RESUME_DATA, resumeTemplates } from '@/utils/data';
import React, { useEffect, useRef, useState } from 'react';
import { Button } from './ui/button';
import { CheckIcon, Edit2Icon } from 'lucide-react';
import RenderResume from './RenderResume';
import Tabs from './Tabs';

const TABS_DATA = [{ label: 'Templates' }];

// Single Template Card
export const TemplateCard = ({ thumbnailImg, isSelected, onSelect }) => {
  return (
    <div
      className={`group flex flex-col bg-white border-2 rounded-xl overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-[1.02] ${
        isSelected
          ? 'border-blue-500 shadow-md'
          : 'border-gray-200 hover:border-blue-400'
      }`}
      onClick={onSelect}
    >
      {/* When a template thumbnail is available */}
      {thumbnailImg ? (
        <div className="w-full h-56 sm:h-72 md:h-80 lg:h-96 relative overflow-hidden">
          <img
            src={thumbnailImg || '/placeholder.svg'}
            alt="Template Preview"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-300" />

          {/* Selected indicator */}
          {isSelected && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-8 h-8 flex items-center justify-center rounded-full bg-blue-500 text-white shadow-md">
                <CheckIcon className="w-4 h-4" />
              </div>
            </div>
          )}
        </div>
      ) : (
        // When no preview is available
        <div className="w-full h-56 flex flex-col items-center justify-center bg-blue-50 border-t border-gray-100">
          <div className="w-12 h-12 bg-white rounded-md flex items-center justify-center mb-2 border border-gray-300">
            <Edit2Icon className="w-6 h-6 text-gray-700" />
          </div>
          <p className="text-gray-700 text-sm font-medium">No Preview Available</p>
        </div>
      )}
    </div>
  );
};

// Theme Selector Page
const ThemeSelector = ({ selectedTheme, setSelectedTheme, resumeData, onClose }) => {
  const resumeRef = useRef(null);
  const [baseWidth, setBaseWidth] = useState(800);

  // Get the initial selected template index
  const initialIndex = resumeTemplates.findIndex((t) => t.id === selectedTheme);
  const [selectedTemplate, setSelectedTemplate] = useState({
    theme: selectedTheme || resumeTemplates[0].id,
    index: initialIndex !== -1 ? initialIndex : 0,
  });

  const [tabValue, setTabValue] = useState('Templates');

  // Apply selected theme and close modal
  const handleTemplateSelection = () => {
    setSelectedTheme(selectedTemplate.theme);
    onClose();
  };

  // Update width dynamically for responsive preview
  const updateBaseWidth = () => {
    if (resumeRef.current) {
      setBaseWidth(resumeRef.current.offsetWidth);
    }
  };

  // Handle resize updates
  useEffect(() => {
    updateBaseWidth();
    window.addEventListener('resize', updateBaseWidth);
    return () => {
      window.removeEventListener('resize', updateBaseWidth);
    };
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
      {/* Header */}
      {/* <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 sm:p-6 bg-gradient-to-r from-blue-100 to-blue-200 rounded-xl border border-blue-300 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-800">Select a Theme</h2>
        <Tabs tabs={TABS_DATA} activeTab={tabValue} setActiveTab={setTabValue} />
      </div> */}

      {/* Apply Button */}
      <div>
        <Button
          onClick={handleTemplateSelection}
          className="flex items-center gap-2 bg-blue-100 hover:bg-blue-200 text-blue-800 border border-blue-400 rounded-lg px-4 py-2 transition-all shadow-sm"
        >
          <CheckIcon size={16} />
          Apply Template Changes
        </Button>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 lg:gap-8">
        {/* Left: Template Thumbnails */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 shadow-sm p-4 sm:p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[65vh] overflow-y-auto pr-2">
            {resumeTemplates.map((template, index) => (
              <TemplateCard
                key={`template_${index}`}
                thumbnailImg={template.thumbnailImg}
                isSelected={selectedTemplate.index === index}
                onSelect={() => setSelectedTemplate({ theme: template.id, index })}
              />
            ))}
          </div>
        </div>

        {/* Right: Resume Preview */}
        <div
          className="lg:col-span-3 bg-white rounded-xl border border-gray-200 shadow-sm p-4 sm:p-6"
          ref={resumeRef}
        >
          <RenderResume
            templateId={selectedTemplate?.theme || ''}
            resumeData={resumeData || DUMMY_RESUME_DATA}
            containerWidth={baseWidth}
          />
        </div>
      </div>
    </div>
  );
};

export default ThemeSelector;
