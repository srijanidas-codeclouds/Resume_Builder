
import { API_PATHS } from '@/utils/apiPaths';
import axiosInstance from '@/utils/axiosInstance';
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { Input } from './ui/input';
import { Label } from './ui/label';

const CreateResumeForm = () => {
  const [resumeTitle, setResumeTitle] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const handleCreateResume = async(e) => {
    e.preventDefault();
    if (!resumeTitle) {
      setError('Please enter a resume title');
      return;
    }
    try {
      const response = await axiosInstance.post(API_PATHS.RESUME.CREATE, {
        title: resumeTitle,
      });
      if(response.data?._id){
        navigate(`/resume/${response.data._id}`);
      }
    } catch (error) {
      if (error.response && error.response.data.message) {
        setError(error.response.data.message);
      }else {
        setError('An unexpected error occurred. Please try again.');
      }
    }
  }
  return (
    <div className='w-full max-w-sm p-8 bg-white border border-blue-200 rounded-lg shadow-lg dark:bg-gray-800 dark:border-gray-700 '>
        <h3 className="mb-4 text-xl font-medium text-gray-900 dark:text-white text-center ">Create New Resume</h3>
        <p className="text-gray-600 mb-8 text-sm text-center">
          Give your resume a title to get started. You can always change it later.
        </p>
        <form onSubmit={handleCreateResume}>
          <Label htmlFor="resumeTitle" className="mb-1 block text-sm font-semibold text-gray-700 dark:text-gray-300">
            Resume Title
          </Label>
          <Input
            type="text"
            onChange={({ target }) => setResumeTitle(target.value)}
            placeholder="e.g., Software Engineer"
            value={resumeTitle}
            className="mb-4 w-full placeholder:text-gray-300 font-medium"
          />
          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors text-sm"
          >
            Create Resume
          </button>
        </form>
    </div>
  )
}

export default CreateResumeForm