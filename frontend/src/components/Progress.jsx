import { rgba } from 'framer-motion'
import React from 'react'

const Progress = ({progress = 0, total = 5, color , bgColor}) => {
  return (
    <div className='flex gap-2'>
        {[...Array(total)].map((_,index)=>(
            <div 
                key={index}
                className={`w-6 h-6 rounded transition-all duration-300 ${index<progress ? 'bg-blue-500' : 'bg-blue-100'}`}
            >
                style={{backgroundColor: index<progress ? color || rgba(1,1,1,1) : bgColor || rgba(1,1,1,0.1)}}
            </div>
        ))}
    </div>
  )
}

export default Progress