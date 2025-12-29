"use client"

import React, { type FormEvent, useState } from 'react'
import Navbar from "~/components/Navbar";
import { useNavigate } from "react-router";
import { generateUUID } from "~/lib/utils";
import { pdfToImages } from '~/lib/pdftoimg';
import FileUploaderDropzone from '~/components/FileUploader -use-React-Dropzone';
import { supabase } from '~/lib/supabase';
import { useAuthStore } from '~/lib/auth-store';

const Upload = () => {
    const { user, isLoading: authLoading } = useAuthStore();
    const navigate = useNavigate();
    
    // Auth Check
    React.useEffect(() => {
        if (!authLoading && !user) {
            navigate('/auth');
        }
    }, [user, authLoading]);

    const [isProcessing, setIsProcessing] = useState(false);
    const [statusText, setStatusText] = useState({ message: "", subMessage: "" });
    const [file, setFile] = useState<File | null>(null);

    const updateStatus = (msg: string, sub = "Please don't close this window") => {
        setStatusText({ message: msg, subMessage: sub });
    }

    const handleAnalyze = async ({ companyName, jobTitle, jobDescription, file }: { companyName: string, jobTitle: string, jobDescription: string, file: File }) => {
        if (!user) return navigate('/auth');
        setIsProcessing(true);

        try {
            const uuid = generateUUID();

            // 1. UPLOAD ORIGINAL PDF
            updateStatus("Securing your document...", "Uploading to cloud storage");
            const fileExt = file.name.split('.').pop();
            const filePath = `${user.id}/${uuid}.${fileExt}`;
            
            const { error: uploadError } = await supabase.storage
                .from('resumes')
                .upload(filePath, file);
            if (uploadError) throw uploadError;

            // 2. GENERATE VISUAL PREVIEWS
            updateStatus('Generating visual preview...', "Converting PDF pages to WEBP");
            const imageResult = await pdfToImages(file);
            if (imageResult.error || !imageResult.pages.length) throw new Error("Conversion failed");

            // 3. UPLOAD PREVIEWS
            updateStatus('Finalizing assets...', 'Saving page snapshots');
            const imgPath1 = `${user.id}/${uuid}_p1.webp`;
            await supabase.storage.from('previews').upload(imgPath1, imageResult.pages[0].file);

            let imgPath2 = null;
            if (imageResult.pages.length > 1) {
                imgPath2 = `${user.id}/${uuid}_p2.webp`;
                await supabase.storage.from('previews').upload(imgPath2, imageResult.pages[1].file);
            }


            updateStatus("AI engine analysis...", "Comparing your profile to job requirements");
            
            
            const formData = new FormData();
            formData.append("resume", file);
            formData.append("jobTitle", jobTitle);
            formData.append("jobDescription", jobDescription);

          
            const aiResponse = await fetch("/api/analyze", {
                method: "POST",
                body: formData
            });
            const { feedback, error: aiError } = await aiResponse.json();
            if (aiError) throw new Error(aiError);

            // 5. SAVE TO DATABASE
            updateStatus('Preparing data...', "Saving to your history");
            const { error: dbError } = await supabase
                .from('resumes')
                .insert([{
                    id: uuid,
                    user_id: user.id,
                    company_name: companyName,
                    job_title: jobTitle,
                    feedback: feedback, 
                    image_url: imgPath1,
                    image_url_2: imgPath2,
                    resume_path: filePath
                }]);
                
            if (dbError) throw dbError;

            updateStatus("Analysis complete!", "Redirecting to your dashboard...");
            setTimeout(() => navigate(`/results/${uuid}`), 1000); 
            
        } catch (error: any) {
            console.error("Pipeline Error:", error);
            alert(error.message || "Something went wrong...");
            setIsProcessing(false);
        }
    }

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const companyName = formData.get('company-name') as string;
        const jobTitle = formData.get('job-title') as string;
        const jobDescription = formData.get('job-description') as string;

        if (!file) return;
        handleAnalyze({ companyName, jobTitle, jobDescription, file });
    }

    return (
        <main className="min-h-screen bg-slate-50 text-slate-900">
            <Navbar />
            <section className="container mx-auto max-w-6xl px-6 py-12 lg:py-20">
                <div className="grid lg:grid-cols-2 gap-12 ">
                    {/* Left Side: Info (UI unchanged) */}
                    <div className="space-y-6">
                        <h1 className="text-5xl font-extrabold tracking-tight text-slate-900">
                            Get hired <span className="text-blue-600">faster.</span>
                        </h1>
                        <p className="text-lg text-slate-600 leading-relaxed">
                            Our AI analyzes your resume against specific job descriptions to give you 
                            actionable feedback and increase your interview rate.
                        </p>
                        <div className="hidden lg:block p-6 bg-blue-50 border border-blue-100 rounded-2xl">
                            <h3 className="font-bold text-blue-900 mb-2">How it works</h3>
                            <ul className="space-y-3 text-blue-800 text-sm">
                                <li className="flex gap-2"><span>1.</span> Upload your PDF Resume</li>
                                <li className="flex gap-2"><span>2.</span> Paste the Job Description</li>
                                <li className="flex gap-2"><span>3.</span> Get a deep-dive AI score</li>
                            </ul>
                        </div>
                    </div>

                    {/* Right Side: Form (UI unchanged) */}
                    <div className='relative bg-white p-8 rounded-3xl shadow-xl border border-slate-100'>
                        {isProcessing ? (
                            <div className="text-center py-10 animate-pulse">
                                <div className="w-20 h-20 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
                                <h2 className="text-2xl font-bold text-slate-800">{statusText.message}</h2>
                                <p className="text-slate-500 mt-2">{statusText.subMessage}</p>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                                <h2 className="text-xl font-bold text-gray-800 mb-2">Analyze your Resume</h2>
                                <div className="w-full lg:grid lg:grid-cols-2 lg:gap-3 lg:space-y-0 space-y-8">
                                    <input name="company-name" placeholder="Company Name" className="p-4 bg-slate-50 border-none rounded-xl focus:ring-2 ring-blue-500" required />
                                    <input name="job-title" placeholder="Job Title" className="p-4 bg-slate-50 border-none rounded-xl focus:ring-2 ring-blue-500" required />
                                </div>
                                <textarea name="job-description" rows={4} placeholder="Paste the Job Description here..." className="p-4 bg-slate-50 border-none rounded-xl focus:ring-2 ring-blue-500 resize-none" required />
                                <div className="w-full">
                                    <label className="text-sm font-semibold text-slate-500 ml-1">Resume (PDF)</label>
                                    <FileUploaderDropzone selectedFile={setFile}/>
                                </div>
                                <button type="submit" disabled={!file} className=" self-center w-full bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 active:bg-blue-800 disabled:bg-slate-300 transition-all shadow-lg shadow-blue-100">
                                    Start AI Analysis
                                </button>
                            </form>
                        )}
                    </div>
                </div>
            </section>
        </main>
    )
}

export default Upload;