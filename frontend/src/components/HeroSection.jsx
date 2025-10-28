import React, { useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { UserContext } from '@/context/UserContext' // adjust import path if needed
import ViewTemplate from './ViewTemplate'

const HeroSection = () => {
  const navigate = useNavigate()
  const { user } = useContext(UserContext)

  const handleNavigation = () => {
    if (user) {
      navigate('/dashboard')
    } else {
      navigate('/signin')
    }
  }

  const handleViewTemplate = () => {
    navigate('/templates')
  }

  return (
    <div className="relative isolate px-6 pt-14 lg:px-8">
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
          className="relative left-[calc(50%-11rem)] aspect-1155/678 w-144.5 -translate-x-1/2 rotate-30 bg-linear-to-tr from-[#ff80b5] to-[#9089fc] opacity-40 sm:left-[calc(50%-30rem)] sm:w-288.75"
        />
      </div>

      <div className="mx-auto max-w-2xl py-32 sm:py-48 lg:py-56">
        <div className="hidden sm:mb-8 sm:flex sm:justify-center">
          <div className="relative rounded-full px-3 py-1 text-sm/6 text-gray-600 ring-1 ring-gray-900/10 hover:ring-gray-900/20">
            New feature: AI Resume Suggestions just launched!{" "}
            <button onClick={handleNavigation} className="font-semibold text-indigo-600 cursor-pointer">
              <span aria-hidden="true" className="absolute inset-0" />
              Try it now <span aria-hidden="true">&rarr;</span>
            </button>
          </div>
        </div>

        <div className="text-center">
          <h1 className="text-5xl font-semibold tracking-tight text-gray-900 sm:text-7xl">
            Build Your Professional Resume in Minutes
          </h1>
          <p className="mt-8 text-md font-medium text-gray-500 sm:text-xl/8">
            Create stunning, ATS-friendly resumes that help you land your dream job. 
            Customize templates, add your experience, and download instantly — all for free.
          </p>

          <div className="mt-10 flex items-center justify-center gap-x-6">
            {user ? (
              <button
                onClick={handleNavigation}
                className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Go to Dashboard 
              </button>
            ) : (
              <button
              onClick={handleNavigation}
              className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Create Resume
            </button>
            )
            }
            <button
              onClick={handleViewTemplate}
              className="text-sm/6 font-semibold text-gray-900"
            >
              
              View Templates <span aria-hidden="true">→</span>
            </button>
          </div>
        </div>
      </div>

      {/* Bottom blur */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]"
      >
        <div
          style={{
            clipPath:
              "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
          }}
          className="relative left-[calc(50%+3rem)] aspect-1155/678 w-144.5 -translate-x-1/2 bg-linear-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%+36rem)] sm:w-288.75"
        />
      </div>
    </div>
  )
}

export default HeroSection
