import ResumeSummaryCard from '@/components/Cards';
import CreateResumeForm from '@/components/CreateResumeForm';
import DashboardLayout from '@/components/DashboardLayout';
import Modal from '@/components/Modal';
import { Spinner } from '@/components/ui/spinner';
import { UserContext } from '@/context/UserContext';
import { API_PATHS } from '@/utils/apiPaths';
import axiosInstance from '@/utils/axiosInstance';
import { LucideFilePlus2, LucideTrash2, Plus } from 'lucide-react';
import moment from 'moment';
import React, { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';


const Dashboard = () => {
  const navigate = useNavigate();
  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [allResumes, setAllResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingResumeId, setDeletingResumeId] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState('modern');
  // const [openTemplateSelector, setOpenTemplateSelector] = useState(false);
  const { user} = useContext(UserContext);
  
   // Calculate completion percentage for a resume
  const calculateCompletion = (resume) => {
    let completedFields = 0;
    let totalFields = 0;

    // Profile Info
    totalFields += 3;
    if (resume.profileInfo?.fullName) completedFields++;
    if (resume.profileInfo?.designation) completedFields++;
    if (resume.profileInfo?.summary) completedFields++;

    // Contact Info
    totalFields += 2;
    if (resume.contactInfo?.email) completedFields++;
    if (resume.contactInfo?.phone) completedFields++;

    // Work Experience
    resume.workExperience?.forEach(exp => {
      totalFields += 5;
      if (exp.company) completedFields++;
      if (exp.title) completedFields++;
      if (exp.startDate) completedFields++;
      if (exp.endDate) completedFields++;
      if (exp.description) completedFields++;
    });

    // Education
    resume.education?.forEach(edu => {
      totalFields += 5;
      if (edu.degree) completedFields++;
      if (edu.institution) completedFields++;
      if (edu.startDate) completedFields++;
      if (edu.endDate) completedFields++;
      if (edu.gpa) completedFields++;
    });

    // Skills
    resume.skills?.forEach(skill => {
      totalFields += 2;
      if (skill.name) completedFields++;
      if (skill.progress > 0) completedFields++;
    });

    // Projects
    resume.projects?.forEach(project => {
      totalFields += 4;
      if (project.title) completedFields++;
      if (project.description) completedFields++;
      if (project.github) completedFields++;
      if (project.liveDemo) completedFields++;
    });

    // Certifications
    resume.certifications?.forEach(cert => {
      totalFields += 3;
      if (cert.name) completedFields++;
      if (cert.issuer) completedFields++;
      if (cert.issueDate) completedFields++;
    });

    // Languages
    resume.languages?.forEach(lang => {
      totalFields += 2;
      if (lang.name) completedFields++;
      if (lang.progress > 0) completedFields++;
    });

    // Interests
    totalFields += resume.interests?.length || 0;
    completedFields +=
      resume.interests?.filter((i) =>
        typeof i === 'string' ? i.trim() !== '' : i?.name?.trim() !== ''
      )?.length || 0;

    return Math.round((completedFields / totalFields) * 100);
  };
  
  const fetchAllResumes = async () => {
    try {
        const response = await axiosInstance.get(API_PATHS.RESUME.GET_ALL)
        const resumesWithCompletion = response.data.map(resume => ({
            ...resume,
            completion: calculateCompletion(resume)
        }));
        setAllResumes(resumesWithCompletion);
        setLoading(false);
    } catch (error) {
        console.error('Error fetching resumes:', error);
    }finally{
        setLoading(false);
    }
  }
  
  useEffect(() => {
    fetchAllResumes();
  }, []);

  const handleDeleteResume = async () => {
      if(!deletingResumeId) return;
      try {
        await axiosInstance.delete(API_PATHS.RESUME.DELETE(deletingResumeId));
        toast.success('Resume deleted successfully');
        fetchAllResumes();
      } catch (error) {
        console.error('Error deleting resume:', error);
        toast.error('Failed to delete resume. Please try again.');
      } finally{
        setDeletingResumeId(null);
        setShowDeleteConfirm(false);
      }
  }
  
  const handleDeleteResumeClick = (id) => {
    setDeletingResumeId(id);
    setShowDeleteConfirm(true);
  }

  return (
    <DashboardLayout>
        <div className="container mx-auto px-0 py-6">
            <div className='flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6'>
                <div className='flex flex-col text-center md:text-left'>
                    <h1 className='text-xl font-bold text-gray-900'>My Resumes</h1>
                    <p className='text-gray-500 text-lg mt-5'>
                        {allResumes.length > 0 ? `You have ${allResumes.length} resumes${allResumes.length !== 1 ? 's' : ''}. Click on a resume to view or edit it.` : 'You have no resumes yet. Create your first resume to get started!'}
                    </p>
                </div>
                <div className='flex gap-3'>
                    {/* <button
                        onClick={() => setOpenCreateModal(true)}
                        className='flex gap-1 group relative rounded-lg border-2 border-sky-400 bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:shadow-lg'
                    >
                        <span className='absolute top-0 left-0 size-full rounded-md border border-dashed border-sky-50 shadow-inner shadow-white/30 group-active:shadow-white/10' />
                        <span className='absolute top-0 left-0 size-full rotate-180 rounded-md border-sky-50 shadow-inner shadow-black/30 group-active:shadow-black/10' />
                        <Plus className='h-4 w-4 mt-0.5' strokeWidth={3} /> New Resume
                    </button> */}
                </div>
            </div>
            {/* Loading */}
            {loading && (
            <div className="flex justify-center items-center py-12">
              <Spinner className="size-6 text-blue-500" />
            </div>
            )}
            {/* Empty State */}
            {!loading && allResumes.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="bg-blue-100 p-4 rounded-full mb-4">
                <Plus className="h-6 w-6 text-blue-600" strokeWidth={2} />
              </div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">No Resumes Found</h2>
                <p className="text-gray-500 max-w-md mb-6 text-lg">
                    You haven't created any resumes yet. Click the button below to create your first resume and start building your professional profile.
                </p>
                <button
                    onClick={() => setOpenCreateModal(true)}
                    className='flex gap-1 group relative rounded-lg border-2 border-sky-400 bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:shadow-lg cursor-pointer'
                >
                    <span className='absolute top-0 left-0 size-full rounded-md border border-dashed border-sky-50 shadow-inner shadow-white/30 group-active:shadow-white/10' />
                    <span className='absolute top-0 left-0 size-full rotate-180 rounded-md border-sky-50 shadow-inner shadow-black/30 group-active:shadow-black/10' />
                    <LucideFilePlus2 className='h-4 w-4 mt-0.5' strokeWidth={3} /> Create Your First Resume
                </button>
            </div>
            )}
            {/* Resumes */}
            {!loading && allResumes.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div onClick={() => setOpenCreateModal(true)} className="flex flex-col items-center justify-center bg-gradient-to-br from-violet-50 to-blue-50 border-2 border-dashed border-blue-300 rounded-2xl p-6 cursor-pointer transition-all hover:shadow-lg hover:border-blue-500 h-full">
                    <div className='w-16 h-16 rounded-full bg-gradient-to-r from-blue-600 to-sky-600 flex items-center justify-center mb-4 cursor-pointer'>
                        <LucideFilePlus2 className='text-white' strokeWidth={2} />
                    </div>
                    <h2 className='text-xl font-semibold text-gray-900 mb-2 text-center cursor-pointer'>Create New Resume</h2>
                    <p className='text-gray-600 text-center cursor-pointer text-xl font-medium'>Start building your professional resume now.</p>
                </div>
                {allResumes.map((resume) => (
                    <ResumeSummaryCard
                        key={resume._id}
                        imgUrl={resume.thumbnailLink || ''}
                        title={resume.title || 'Untitled Resume'}
                        createdAt={resume.createdAt}
                        updatedAt={resume.updatedAt}
                        onSelect={() => navigate(`/resume/${resume._id}`)}
                        onDelete={()=> handleDeleteResumeClick(resume._id)}
                        completion={resume.completion || 0}
                        isPremium={user?.isPremium || false}
                        isNew={moment().diff(moment(resume.createdAt), 'days') < 7}
                    />
                ))}
                </div>
            )}
        </div>
        {/* ================= Template Selector Modal ================= */}
        {/* <Modal
          isOpen={openTemplateSelector}
          onClose={() => setOpenTemplateSelector(false)}
          title="Select Template"
          maxWidth="max-w-6xl"
          className="p-6"
        >
          <ThemeSelector
            selectedTheme={selectedTemplate}
            setSelectedTheme={setSelectedTemplate}
            onClose={() => {
              setOpenTemplateSelector(false);
              setOpenCreateModal(true); 
            }}
          />
        </Modal> */}
        {/* Create Modal */}
        <Modal
        isOpen={openCreateModal}
        onClose={() => setOpenCreateModal(false)}
        hideHeader
        maxWidth="max-w-lg"
        className="p-6 z-40"
      >
        <div className="mb-2">
          <div className="mt-1 relative">
            {/* <h3 className="text-[24px] flex-1 font-semibold text-center">
              New Resume
            </h3> */}
            {/* top right corner close button */}
            <button
              onClick={() => setOpenCreateModal(false)}
              className="absolute top-4 right-5 text-gray-600 border border-gray-300 w-6 h-6 rounded-lg flex items-center justify-center hover:border-gray-800"
            >
              X
            </button>
          </div>

          <CreateResumeForm
            selectedTemplate={selectedTemplate}
            setSelectedTemplate={setSelectedTemplate}
            onSuccess={() => {
              setOpenCreateModal(false);
              fetchAllResumes();
            }}
          />
        </div>
      </Modal>
        {/* Delete Modal */}
        <Modal 
            isOpen={showDeleteConfirm}
            onClose={() => setShowDeleteConfirm(false)}
            title="Confirm Deletion"
            showActionBtn
            actionBtnText="Delete"  
            actionBtnClassName="bg-red-600 hover:bg-red-700"
            onActionClick={handleDeleteResume}
            maxWidth="max-w-md"
            className="p-10"
        >
            <div className="p-6 text-center">
                <div className="flex flex-col items-center text-center">
                    <div className="bg-red-100 p-3 rounded-full mb-4">
                    <LucideTrash2 className="h-6 w-6 text-red-600" />
                    </div>
                </div>
                <h3 className="text-lg font-bold text-gray-700 mb-2">Are you sure you want to delete this resume?</h3>
                <p className="text-gray-600 mb-4 text-sm font-medium ">This action cannot be undone. Please confirm if you want to proceed with deleting this resume.</p>
            </div>
        </Modal> 
    </DashboardLayout>
  )
}

export default Dashboard