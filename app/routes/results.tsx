import React, { useEffect, useState, useMemo } from 'react';
import { Link, useNavigate, useParams } from 'react-router';
import { supabase } from '~/lib/supabase';
import { useAuthStore } from '~/lib/auth-store';
import Summary from '~/components/Summary';
import ATS from '~/components/ATS';
import Details from '~/components/Details';
import { Trash2 } from 'lucide-react';
import DeleteModal from '~/components/DeleteModal';


const Results = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { isLoading: authLoading, user } = useAuthStore();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const [state, setState] = useState({
        imageUrl: '',
        resumeUrl: '',
        feedback: null as Feedback | null,
        loading: true,
    });

    // Auth 
    useEffect(() => {
        if (!authLoading && !user) {
            navigate(`/auth?next=/results/${id}`);
        }
    }, [user, authLoading, navigate, id]);

    //Data Loader  
    useEffect(() => {
        let isMounted = true;
        
        const loadResume = async () => {
            if (!id || !user) return;

            try {
                const { data: resume, error } = await supabase
                    .from('resumes')
                    .select("image_url, resume_path, feedback")
                    .eq('id', id)
                    .single();

                if (error || !resume) throw error;

                const img = supabase.storage.from('previews').getPublicUrl(resume.image_url).data.publicUrl;
                const pdf = supabase.storage.from('resumes').getPublicUrl(resume.resume_path).data.publicUrl;

                if (isMounted) {
                    setState({
                        imageUrl: img,
                        resumeUrl: pdf,
                        feedback: resume.feedback,
                        loading: false,
                    });
                }
            } catch (err) {
                console.error("Pipeline Error:", err);
                if (isMounted) setState(prev => ({ ...prev, loading: false }));
            }
        };

        loadResume();
        return () => { isMounted = false }; // Cleanup
    }, [id, user]);

    const handleDelete = async () => {
        if (!id || !user) return;
        setIsDeleting(true);

        try {
            // 1. Fetch paths first if not already in state to ensure clean storage wipe
            const { data: resume } = await supabase
                .from('resumes')
                .select('image_url, resume_path')
                .eq('id', id)
                .single();

            // 2. Parallel Delete (DB + Storage)
            await Promise.all([
                supabase.from('resumes').delete().eq('id', id),
                resume?.image_url && supabase.storage.from('previews').remove([resume.image_url]),
                resume?.resume_path && supabase.storage.from('resumes').remove([resume.resume_path])
            ]);

            // 3. Navigate home after successful wipe
            navigate('/', { replace: true });
        } catch (err) {
            console.error("Delete failed:", err);
            alert("Could not delete. Please try again.");
        } finally {
            setIsDeleting(false);
            setIsModalOpen(false);
        }
    };
    
    const { imageUrl, resumeUrl, feedback, loading } = state;

    return (
        <main className='min-h-screen bg-white selection:bg-blue-100'>
            <nav className="border-b border-slate-100 px-4 py-4 sticky top-0 bg-white/90 backdrop-blur-sm z-50">
                <div className="max-w-6xl mx-auto flex items-center justify-between">
                    <Link to='/' className='text-slate-500 hover:text-blue-600 transition-colors flex items-center gap-2 text-sm font-semibold'> 
                        <img src='/icons/back.png' alt='back' className='w-3 h-3'/>
                        Dashboard
                    </Link>
                    <span className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em]">Report Analysis</span>
                </div>
            </nav>

            <div className='max-w-6xl mx-auto p-4 md:p-8'>
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16">
                    
                    {/* LEFT: Sticky Preview */}
                    <div className="lg:col-span-5 order-2 lg:order-1">
                        <div className="sticky top-24 space-y-4">
                            <div className="bg-slate-50 rounded-2xl p-2 border border-slate-200/60 shadow-sm overflow-hidden">
                                <img 
                                    src={imageUrl || '/images/placeholder.jpg'} 
                                    alt="Resume Preview" 
                                    className="w-full h-auto rounded-xl shadow-inner transition-opacity duration-500 opacity-60"
                                    onLoad={(e) => (e.currentTarget.style.opacity = '1')}
                                />
                            </div>
                            <a href={resumeUrl} target="_blank" rel="noreferrer" 
                               className="block w-full text-center py-3 bg-slate-600 text-white rounded-xl font-bold text-sm hover:bg-slate-800 transition-transform active:scale-[0.98]">
                                View Original PDF
                            </a>

                            {/* //Delete button */}
                            <button 
                                    onClick={() => setIsModalOpen(true)}
                                    className="flex items-center justify-center gap-2 w-full py-3 text-red-500 bg-red-50 hover:bg-red-100 border border-red-100 rounded-xl font-bold text-sm transition-all"
                                >
                                    <Trash2 size={16} />
                                    Delete Analysis
                                </button>

                        </div>
                    </div>

                    {/* RIGHT: Dynamic Content */}
                    <div className="lg:col-span-7 order-1 lg:order-2">
                        {loading ? (
                            <div className="flex flex-col items-center justify-center py-20">
                                <img src="/images/scan_01.gif" alt="scanning" className='w-64 opacity-80'/>
                                <p className="text-slate-400 font-medium animate-pulse">Running AI Diagnostics...</p>
                            </div>
                        ) : (
                            <div className="gradient-border space-y-5 animate-in fade-in slide-in-from-bottom-4 duration-700">
                        
                                <h2 className="text-gradient! font-bold">Analysis Results</h2>
                        
                                <div className="space-y-12">
                                    <Summary feedback={feedback!} />
                                    <ATS score={feedback?.ATS.score || 0} suggestions={feedback?.ATS.tips || []}/>
                                    <Details feedback={feedback!} />
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <DeleteModal 
                isOpen={isModalOpen}
                isLoading={isDeleting}
                itemName="this analysis"
                onClose={() => setIsModalOpen(false)}
                onConfirm={handleDelete}
            />
        </main>
    );
};

export default Results;