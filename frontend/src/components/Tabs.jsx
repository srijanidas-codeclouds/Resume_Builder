import React from 'react'

const Tabs = ({tabs,activeTab,setActiveTab}) => {
  return (
    <div className='w-full my-2'>
        <div className="flex flex-wrap bg-blue-100 p-2 rounded-lg border border-blue-300">
            {tabs.map((tab)=>(
                <button 
                    key={tab.label}
                    className={`relative flex-1 sm:flex-none px-4 sm:px-6 py-2 sm:py-3 text-xs sm:text-sm font-semibold rounded-lg transition-all ${activeTab===tab.label ? 'bg-white text-blue-600 shadow-lg' : 'text-blue-800 hover:bg-white hover:shadow'}`}
                    onClick={()=>setActiveTab(tab.label)}
                >
                    <span className="relative z-10">
                    {tab.label}

                    {activeTab===tab.label && (
                        <div className="absolute inset-x-0 bottom-0 h-2 bg-blue-600 rounded-t-lg">
                            
                        </div>
                    )}
                    </span>
                </button>
            ))}
        </div>
    </div>
  )
}

export default Tabs