import React from 'react'
import { AiToolsData } from '../assets/assets'

const Tools = () => {
  return (
    <div className='container my-32 mx-auto w-full flex flex-col  justify-center items-center gap-5'>
        <h1 className='lg:text-6xl md:text-4xl text-2xl  text-black font-extrabold text-center'>Powerful AI Tools</h1>
        <h2 className='text-gray-500 max-w-[600px] text-center lg:text-xl md:text-[18px] text-[16px]'>Everything you need to create, enhance, and optimize your content with cutting-edge AI technology.</h2>
        <div className='grid lg:grid-cols-2 grid-cols-1 gap-5 '>
            {AiToolsData.map(({title,description,Icon,bg,path},index)=>(
                <div key={index} className='shadow-[-5px_5px_20px_rgba(0,0,0,0.3)] p-10 gap-3 rounded-xl flex flex-col justify-between transition-all hover:translate-y-[-10px] w-[350px]'>
                    <div className={`w-12 h-12 rounded-xl text-white flex justify-center items-center`} style={{background: `linear-gradient(to bottom,${bg.from},${bg.to})`}}><Icon/></div>
                    <h1 className='font-bold text-2xl'>{title}</h1>
                    <h2 className='text-gray-400 text-[12px]'>{description}</h2>
                </div>
            ))}
        </div>
    </div>
  )
}

export default Tools