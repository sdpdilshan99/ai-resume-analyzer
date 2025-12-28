import Navbar from "~/components/Navbar";
import type { Route } from "./+types/home";
import ResumeCard from "~/components/ResumeCard";
import { useAuthStore } from "~/lib/auth-store"; // New Real World Store
import { useNavigate } from "react-router";
import { useEffect, useState } from "react";
import { supabase } from "~/lib/supabase"; // New Supabase Client
import DeleteModal from "~/components/DeleteModal";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "CV Boost" },
    { name: "description", content: "AI-powered resume analyzer that scores CVs and gives quick insights." },
  ];
}

export default function Home() {
  const { user, isLoading: authLoading } = useAuthStore();
  const navigate = useNavigate();
  
  // State to hold real resumes from the database
  const [dbResumes, setDbResumes] = useState<any[]>([]);
  const [dataLoading, setDataLoading] = useState(true);

  // Modal State
  const [deleteTarget, setDeleteTarget] = useState<any>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // 1. Protect the Route
  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth?next=/');
    }
  }, [user, authLoading, navigate]);

  // 2. Fetch Real Data from Supabase
  useEffect(() => {
    async function getMyResumes() {
      if (!user) return;
      
      const { data, error } = await supabase
        .from('resumes') // This must match your Table Name in Supabase
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data) {
        setDbResumes(data);
      }
      setDataLoading(false);
    }

    if (user) getMyResumes();
  }, [user]);


  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      await supabase.from('resumes').delete().eq('id', deleteTarget.id);
      await Promise.all([
        supabase.storage.from('previews').remove([deleteTarget.image_url]),
        supabase.storage.from('resumes').remove([deleteTarget.resume_path])
      ]);
      setDbResumes(prev => prev.filter(r => r.id !== deleteTarget.id));
      setDeleteTarget(null);
    } catch (err) {
      console.error(err);
    } finally {
      setIsDeleting(false);
    }
  };


  return (
    <main className="bg-[url('/images/bg-main.svg')] bg-cover min-h-screen">
      <Navbar />

      <section className="main-section container mx-auto px-4">
        <div className="page-heading py-16 text-center">
          <h1 className="text-4xl font-bold">AI-Powered Resume Feedback</h1>
          <h2 className="text-xl text-gray-600">Analyze your CV and improve your applications instantly.</h2>
        </div>

        {/* 3. Display Loading State or Data */}
        {dataLoading ? (
          <div className="flex justify-center py-10">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-blue-500"></div>
          </div>
        ) : (
          <div className="resumes-section grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {dbResumes.length > 0 ? (
              dbResumes.map((resume) => (
                <ResumeCard key={resume.id} resume={resume} onDeleteClick={() => setDeleteTarget(resume)} />
              ))
            ) : (
              <div className="col-span-full text-center py-10 bg-white/50 rounded-xl border-2 border-dashed border-gray-300">
                <p className="text-gray-500">No resumes analyzed yet. Start your first one!</p>
                <button 
                  onClick={() => navigate('/upload')}
                  className="mt-4 text-blue-600 font-bold hover:underline"
                >
                  + Upload Resume
                </button>
              </div>
            )}
          </div>
        )}
      </section>

      <DeleteModal 
        isOpen={!!deleteTarget} 
        itemName={deleteTarget?.company_name || "this analysis"}
        isLoading={isDeleting}
        onClose={() => setDeleteTarget(null)}
        onConfirm={confirmDelete}
      />
    </main>
  );
}

function setPreviewResume(arg0: (prev: any) => any) {
  throw new Error("Function not implemented.");
}
