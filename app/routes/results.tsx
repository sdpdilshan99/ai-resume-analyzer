import React, { useEffect, useState } from 'react'
import {  Link, useNavigate, useParams } from 'react-router'
import type { Route } from './+types/results';
import { supabase } from '~/lib/supabase';
import { useAuthStore } from '~/lib/auth-store';



export function meta({}: Route.MetaArgs) {
  return [
    { title: "Resume | Review" },
    { name: "description", content: "Details overview of your resume" },
  ];
}

const results = () => {
    const {id} = useParams()

    const [imageUrl, setImageUrl] = useState('');
    const [resumeUrl, setResumeUrl] = useState('');
    const [feedback, setFeedback] = useState('');
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate()

    const {isLoading: authLoading, user} = useAuthStore();

    useEffect(() => {
        if (!authLoading && !user) {
        navigate(`/auth?next=/results/${id}`);
        }
    }, [user, authLoading, navigate]);
    
    useEffect(() => {
        const loadResume = async () => {
            if(!id) return;

            //fetch data
            const {data : resumeData  , error} = await supabase
                .from('resumes')
                .select(`*`)
                .eq('id', id)
                .single();

            if(error || !resumeData) {
                console.error("Error fetching resume:", error);
                setLoading(false);
                return;
            }
            
            const {data: imgUrl} = supabase.storage
                .from('previews')
                .getPublicUrl(resumeData.image_url);

            const {data: pdfUrl} = supabase.storage
                .from('resumes')
                .getPublicUrl(resumeData.resume_path)
            
            setImageUrl(imgUrl.publicUrl);
            setResumeUrl(pdfUrl.publicUrl);
            setFeedback(resumeData.feedback);
            setLoading(false)

        }


        loadResume()

    },[id])

    

    console.log({imageUrl, resumeUrl})

  return (
    <main className='min-h-screen bg-white'>
    {/* Simple Top Nav */}
    <nav className="border-b border-slate-100 px-4 py-4 sticky top-0 bg-white/90 backdrop-blur-sm z-50">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
            <Link to='/' className='text-slate-500 hover:text-slate-800 flex items-center gap-2 text-sm font-medium'> 
                <img src='/icons/back.png' alt='back' className='w-3 h-3'/>
                Dashboard
            </Link>
            <h2 className="text-slate-400 text-xs font-bold uppercase tracking-widest">Analysis Report</h2>
        </div>
    </nav>

    <div className='max-w-6xl mx-auto p-4 md:p-8'>
        {/* Main Grid: 1 col on mobile, 12 cols on desktop */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16">
            
            {/* LEFT: Resume Preview - Simple Card */}
            <div className="lg:col-span-5 order-2 lg:order-1">
                <div className="bg-slate-50 rounded-xl p-2 border border-slate-200 shadow-sm sticky top-24">
                    <img 
                        src={imageUrl} 
                        alt="Resume" 
                        className="w-full h-auto rounded-lg shadow-inner"
                    />
                    <div className="mt-4 flex gap-2 p-2">
                        <a href={resumeUrl} target="_blank" className="flex-1 bg-white border border-slate-200 text-slate-700 text-center py-2.5 rounded-lg text-sm font-semibold hover:bg-slate-50 transition-colors">
                            Open PDF 
                        </a>
                    </div>
                </div>
            </div>

            {/* RIGHT: Feedback Content */}
            <div className="lg:col-span-7 order-1 lg:order-2 space-y-10">
                {/* Score Header */}
                <section>
                    <h1 className="text-3xl font-bold text-slate-900 mb-2">Resume Score</h1>
                    <div className="flex items-baseline gap-2">
                        <span className="text-6xl font-black text-blue-600">{feedback?.overallScore}</span>
                        <span className="text-slate-400 text-xl font-medium">/ 100</span>
                    </div>
                    <p className="text-slate-500 mt-4 leading-relaxed">
                        We've analyzed your resume against the job requirements. Below is a breakdown of how well your profile matches and where you can improve.
                    </p>
                </section>

                <hr className="border-slate-100" />

                {/* Categories Breakdown */}
                <div className="space-y- flex justify-center items-center">
                    {feedback ? (
                        <div>
                            SUmmery ATS Details
                        </div>
                    ) : (
                        <img src="/images/scan_01.gif" alt="scaning"  className='w-100'/>
                    )}
                </div>
            </div>
        </div>
    </div>
</main>
  )
}

export default results