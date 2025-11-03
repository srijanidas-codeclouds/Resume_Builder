import { API_PATHS } from '@/utils/apiPaths';
import axiosInstance from '@/utils/axiosInstance';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { resumeTemplates } from '@/utils/data';
import { Button } from './ui/button';
import { CheckIcon, Edit2Icon } from 'lucide-react';

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
      {thumbnailImg ? (
        <div className="w-full aspect-[3/4] object-cover relative overflow-hidden">
          <img
            src={thumbnailImg || '/placeholder.svg'}
            alt="Template Preview"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300" />
          {isSelected && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-8 h-8 flex items-center justify-center rounded-full bg-blue-500 text-white shadow-md">
                <CheckIcon className="w-4 h-4" />
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="w-full aspect-[3/4] flex flex-col items-center justify-center bg-blue-50 border-t border-gray-100">
          <div className="w-12 h-12 bg-white rounded-md flex items-center justify-center mb-2 border border-gray-300">
            <Edit2Icon className="w-6 h-6 text-gray-700" />
          </div>
          <p className="text-gray-700 text-sm font-medium">
            No Preview Available
          </p>
        </div>
      )}
    </div>
  );
};

const ThemeSelector = ({ selectedTheme, setSelectedTheme, resumeData, onClose, hideActions }) => {
  const [selectedTemplate, setSelectedTemplate] = useState({
    theme: selectedTheme || resumeTemplates[0].id,
    index: 0,
  });

  const handleTemplateSelection = () => {
    setSelectedTheme(selectedTemplate.theme);
    onClose?.();
  };

  // Only first 2 templates
  const templatesToShow = resumeTemplates.slice(0, 2);

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 space-y-6">
      {/* Apply Button */}
      {!hideActions && (
  <div className="flex justify-end">
    <Button
      onClick={handleTemplateSelection}
      className="flex items-center gap-2 bg-blue-100 hover:bg-blue-200 text-blue-800 border border-blue-400 rounded-lg px-4 py-2 transition-all shadow-sm"
    >
      <CheckIcon size={16} />
      Apply Template Changes
    </Button>
  </div>
)}

      {/* Template Cards Grid */}
      {/* <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 sm:p-6"> */}
        <div className="grid grid-cols-2 sm:grid-cols-2 gap-4">
          {templatesToShow.map((template, index) => (
            <TemplateCard
              key={`template_${index}`}
              thumbnailImg={template.thumbnailImg}
              isSelected={selectedTemplate.index === index}
              onSelect={() =>
                setSelectedTemplate({ theme: template.id, index })
              }
            />
          ))}
        </div>
      </div>
    // </div>
  );
};

const CreateResumeForm = ({ onSuccess, selectedTemplate, setSelectedTemplate }) => {
  const [resumeTitle, setResumeTitle] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleCreateResume = async (e) => {
    e.preventDefault();
    if (!resumeTitle.trim()) {
      setError('Please enter a resume title');
      return;
    }

    try {
      const response = await axiosInstance.post(API_PATHS.RESUME.CREATE, {
        title: resumeTitle.trim(),
        template: {
          theme: selectedTemplate || 'modern'
        },
      });

      if (response.data?._id) {
        navigate(`/resume/${response.data._id}`);
      }

      onSuccess?.();
    } catch (error) {
      if (error.response?.data?.message) {
        setError(error.response.data.message);
      } else {
        setError('An unexpected error occurred. Please try again.');
      }
    }
  };

  return (
    <div className="w-full max-w-5xl p-8 bg-white border border-blue-200 rounded-lg shadow-lg dark:bg-gray-800 dark:border-gray-700">
      <h3 className="mb-4 text-xl font-medium text-gray-900 dark:text-white text-center">
        Create New Resume
      </h3>
      <p className="text-gray-600 mb-6 text-sm text-center">
        Enter your resume title and choose a template to get started.
      </p>

      <form onSubmit={handleCreateResume} className="space-y-6">
        {/* Title Input */}
        <div>
          <Label
            htmlFor="resumeTitle"
            className="mb-1 block text-sm font-semibold text-gray-700 dark:text-gray-300"
          >
            Resume Title
          </Label>
          <Input
            type="text"
            onChange={({ target }) => setResumeTitle(target.value)}
            placeholder="e.g., Software Engineer Resume"
            value={resumeTitle}
            className="w-full placeholder:text-gray-300 font-medium"
          />
          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
        </div>

        {/* Inline Template Selector */}
        <div>
          <Label className="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-300">
            Choose Template
          </Label>
          {/* <div className="border border-gray-200 rounded-lg overflow-hidden"> */}
            <ThemeSelector
              selectedTheme={selectedTemplate}
              setSelectedTheme={setSelectedTemplate}
              hideActions={true} // hides "Apply" button inside ThemeSelector
            />
          {/* </div> */}
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors text-sm"
        >
          Create Resume
        </button>
      </form>
    </div>
  );
};

export default CreateResumeForm;
