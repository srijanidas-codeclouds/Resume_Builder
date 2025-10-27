import Navbar from '@/components/Navbar'
import { UserContext } from '@/context/UserContext';
import React, { useContext } from 'react'

const DashboardLayout = ({children}) => {
  const { user} = useContext(UserContext);
  return (
    <div>
      <div className="px-6 pt-14 lg:px-8">
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
        {/* ===== Page Wrapper ===== */}
      <main className="relative z-10 px-4 sm:px-6 lg:px-8 pt-24 pb-10">
        {/* User Welcome */}
        {user && (
          <div className="container mx-auto mb-6 text-center">
            <h2 className="text-2xl sm:text-3xl font-semibold text-gray-900">
              Welcome back, <span className="text-blue-600">{user.name}</span>!
            </h2>
          </div>
        )}

        {/* ===== Page Content (Children) ===== */}
        <div className="container mx-auto">{children}</div>
      </main>
      </div>
    </div>
  );
};

export default DashboardLayout