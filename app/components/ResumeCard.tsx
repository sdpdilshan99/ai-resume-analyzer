import React from 'react'
import { Link } from 'react-router'
import ScoreCircle from './ScoreCircle'
import { getPublicUrl } from '~/lib/utils'
import { Trash2 } from 'lucide-react'

const ResumeCard = ({resume, onDeleteClick}: {resume: any , onDeleteClick: () => void}) => {
  const { id, company_name, job_title, feedback, image_url } = resume;
  return (
    <div className="relative group">

      <button 
        onClick={(e) => { e.preventDefault(); e.stopPropagation(); onDeleteClick(); }}
        className="absolute top-4 right-4 z-20 p-2.5 bg-white/80 backdrop-blur-md text-red-500 rounded-xl opacity-0 group-hover:opacity-100 transition-all hover:bg-red-500 hover:text-white shadow-xl border border-slate-200"
      >
        <Trash2 size={18} />
      </button>

    <Link to={`/results/${id}`} className='resume-card animate-in fade-in duration-300 h-full w-full relative'>

      <div className="resume-card-header ">
        <div className="flex flex-col gap-2">
          <h2 className="!text-black font-bold break-words">
            {company_name ?? "Unknown Company"}
          </h2>

          <h3 className="text-lg break-words text-gray-500">
            {job_title ?? "Unknown Job Title"}
          </h3>
        </div>

        <div className="flex-shrink-0">
          <ScoreCircle score={feedback.overallScore}/>
        </div>
      </div>

      <div className="gradient-border animate-in fade-in duration-300">
        <div className="w-full ">
          <img src={getPublicUrl(image_url)} alt="resume cv" className='w-full h-100 object-cover object-top'/>
        </div>
      </div>
    </Link>
    </div>

  )
}

export default ResumeCard
