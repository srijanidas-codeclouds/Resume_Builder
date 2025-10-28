import React, { useState } from 'react'
import DashboardLayout from './DashboardLayout'
import Navbar from './Navbar'
import { TemplateCard } from './ThemeSelector'
import { useNavigate } from 'react-router-dom'
import { Button } from './ui/button'
import { CheckIcon } from 'lucide-react'
import Resume3 from '../assets/resume3.png'
import Resume2 from '../assets/resume2.png'
import Resume1 from '../assets/resume1.png'

const TEMPLATE_CATEGORIES = [
  "Minimalist",
  "Modern",
  "Photo",
  "Professional",
];

const TEMPLATES = [
  { id: 1, name: "Simple Professional CV", img: Resume1 }, 
  { id: 2, name: "Minimalist White and Grey", img: Resume2 }, 
  { id: 3, name: "Blue Simple Professional CV", img: Resume3 },
];

const ViewTemplate = () => {

  const [selectedCategory, setSelectedCategory] = useState("Trending");
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const navigate = useNavigate();

  // Simulate creating a new resume template and navigate to dashboard
  const handleSelectTemplate = (template) => {
    setSelectedTemplate(template.id);
    setTimeout(() => {
      navigate("/dashboard", { state: { templateId: template.id } });
    }, 500);
  };
  
  return (
    <div className='flex flex-col min-h-screen text-gray-900'>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        <Navbar />
        {/* Background blur */}
          <div
            aria-hidden="true"
            className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
          >
            <div
              style={{
                clipPath:
                  "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
              }}
              className="relative left-[calc(50%-11rem)] aspect-1155/678 w-144.5 -translate-x-1/2 rotate-30 bg-linear-to-tr from-[#ff80b5] to-[#9089fc] opacity-20 sm:left-[calc(50%-30rem)] sm:w-288.75"
            />
          </div>

         {/* ===== Header ===== */}
      <div className="text-center pt-10 pb-6"></div>
        <h1 className="text-center text-3xl font-semibold text-gray-900">
          Start inspired
        </h1>
        <p className="text-gray-600 mt-2">
          Get a head start with free design templates you can customize in a few clicks.
        </p>
      </div>
         

         {/* Template Cards Section */}
        {/* ===== Categories ===== */}
      <div className="flex overflow-x-auto no-scrollbar justify-center gap-6 border-b border-gray-200 px-4 sm:px-8">
        {TEMPLATE_CATEGORIES.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`relative pb-3 font-medium text-sm transition-colors ${
              selectedCategory === category
                ? "text-blue-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            {category}
            {selectedCategory === category && (
              <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-blue-600 rounded-full" />
            )}
          </button>
        ))}
      </div>

      {/* ===== Template Grid ===== */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-3 gap-6">
          {TEMPLATES.map((template) => (
            <div
              key={template.id}
              onClick={() => handleSelectTemplate(template)}
              className={`relative group cursor-pointer bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden transition-transform hover:scale-[1.03] hover:shadow-md ${
                selectedTemplate === template.id
                  ? "ring-2 ring-blue-500 border-blue-400"
                  : ""
              }`}
            >
              {/* Thumbnail */}
              <img
                src={template.img}
                alt={template.name}
                className="w-full h-60 object-cover"
              />

              {/* Hover Overlay */}
              <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                <Button className="bg-blue-100 text-black rounded-lg hover:bg-blue-200 border-2 border-blue-500">
                  Use this template
                </Button>
              </div>

              {/* Template Info */}
              <div className="p-3">
                <p className="text-sm font-semibold text-gray-900 truncate">
                  {template.name}
                </p>
                <p className="text-xs text-gray-500">Resume by Qwaleb</p>
              </div>

              {/* Selected Check */}
              {selectedTemplate === template.id && (
                <div className="absolute top-2 right-2 bg-blue-600 text-white p-1 rounded-full">
                  <CheckIcon className="w-4 h-4" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ViewTemplate