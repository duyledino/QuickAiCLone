import React from 'react'
import { useLocation } from 'react-router-dom'
import { assets,LinkSidebar } from '../assets/assets';
import {Edit} from 'lucide-react'

const ContentInstruction = () => {
    const path = useLocation();
    const object = LinkSidebar.find(l=>l.path === path.pathname);
  return (
    <div className='w-full h-full flex flex-col justify-center items-center text-2xl text-gray-400 bg-transparent gap-3'>
        <Edit/>
        <h1 className='text-center text-xl'>Enter a topic and click “{object.title}” to get started</h1>
    </div>
  )
}

export default ContentInstruction