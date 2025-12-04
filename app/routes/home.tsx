import Navbar from "~/components/Navbar";
import type { Route } from "./+types/home";
import { resumes } from "constants";
import ResumeCard from "~/components/ResumeCard";
import { usePuterStore } from "~/lib/puter";
import { useNavigate } from "react-router";
import { useEffect } from "react";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "CV Boost" },
    { name: "description", content: "AI-powered resume analyzer that scores CVs and gives quick insights for job seekers and recruiters." },
  ];
}

export default function Home() {
  const {isLoading, auth} = usePuterStore();
    const navigate = useNavigate();

    useEffect(() => {
        if(!auth.isAuthenticated)
            navigate('/auth?next=/');
        
    },[auth.isAuthenticated]);

  return (
  <main className="bg-[url('/images/bg-main.svg')] bg-cover">
    <Navbar />

    <section className="main-section">
      <div className="page-heading py-16">
        <h1>AI-Powered Resume Feedback</h1>
        <h2>Analyze your CV, get skill scores, and improve your job applications instantly.</h2>
      </div>

    {resumes?.length > 0 && (
      <div className="resumes-section">
        {resumes?.map((resume) => (
          <ResumeCard key={resume.id} resume={resume}/>
        ))}
      </div>
    )}
    
    </section>
  </main>
  )
}
