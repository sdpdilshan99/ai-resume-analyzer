import React from 'react'
import { Link } from 'react-router'
import ScoreCircle from './ScoreCircle'
import { getPublicUrl } from '~/lib/utils'

const ResumeCard = ({resume}: {resume: any}) => {
  const { id, company_name, job_title, feedback, image_url } = resume;
  return (
    <Link to={`/resume/${id}`} className='resume-card animate-in fade-in duration-300 h-180 relative'>

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
          <img src={getPublicUrl(image_url)} alt="resume cv" className='w-full h-130 object-cover object-top'/>
        </div>
      </div>
    </Link>
  )
}

export default ResumeCard
