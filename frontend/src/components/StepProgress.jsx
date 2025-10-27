import React from 'react'

const StepProgress = ({progress}) => {
  return (
    <>
    <div className='relative w-full h-4 bg-white/5 backdrop-blur-xl overflow-hidden rounded-full border border-white/10'>
        <div className='absolute inset-0 bg-blue-200'/>
        {/* progress bar */}
        <div className="relative h-full bg-blue-500 bg-[length:200%_100%] transition-all duration-700 ease-out rounded-full overflow-hidden animate-pulse-glow"style={{width:`${progress}%`}}>
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-500 to-transparent animate-glow"/>
        </div>
        {progress>0 && (
            <div className='absolute top-0  w-6 h-full bg-blue-500' style={{left:`${Math.max(0,progress-4)}%`}}>
            </div>
        )}
    </div>

    <div className='flex justify-between items-center mt-3'>
        <div className="text-xs font-bold text-white/60">
            {progress<25 ? '0%' : progress<50 ? '25%' : progress<75 ? '50%' : '75%' }
        </div>
        <div className="flex items-center gap-2">
            {progress === 100 && (
                <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-white" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                </div>
            )}
        </div>
    </div></>
  )
}

export default StepProgress