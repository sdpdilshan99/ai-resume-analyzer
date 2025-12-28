import React, { useMemo } from 'react'
import ScoreGauge from './ScoreGauge'
import ScoreBadge from './ScoreBadge';

interface CategoryProps {
  title: string;
  score: number;
}

const Category = ({ title, score }: CategoryProps) => {
  // color component for clean reusability
  const textColor = score > 69 ? 'text-emerald-600' : score > 49 ? 'text-amber-600' : 'text-red-600';

  return (
    <div className="flex items-center justify-between py-4 border-b border-slate-50 last:border-0 group">
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <span className="text-slate-700 font-semibold text-lg leading-none">{title}</span>
          <ScoreBadge score={score} />
        </div>
      </div>

      <div className="text-right">
        <span className={`text-xl font-bold ${textColor}`}>{score}</span>
        <span className="text-slate-400 font-medium text-sm ml-0.5">/100</span>
      </div>
    </div>
  );
};

const Summary = ({ feedback }: { feedback: Feedback }) => {
  // We use useMemo to prevent unnecessary re-renders of the category list
  const categories = useMemo(() => [
    { title: 'Tone & Style', score: feedback.toneAndStyle.score },
    { title: 'Content', score: feedback.content.score },
    { title: 'Structure', score: feedback.structure.score },
    { title: 'Skills', score: feedback.skills.score },
  ], [feedback]);

  return (
    <section className="bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow duration-300 w-full overflow-hidden">
      {/* Top Hero Section */}
      <div className="flex flex-col sm:flex-row items-center p-6 gap-6 bg-slate-50/50">
        <div className="shrink-0 flex-1/6">
          <ScoreGauge score={feedback.overallScore} />
        </div>
        <div className="text-center sm:text-left">
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Your Resume Score</h2>
          <p className="text-sm text-slate-500 mt-1 max-w-[240px]">
            Based on AI analysis of keywords, formatting, and industry standards.
          </p>
        </div>
      </div>

      {/* Categories Section */}
      <div className="px-6 pb-2">
        {categories.map((item) => (
          <Category key={item.title} title={item.title} score={item.score} />
        ))}
      </div>
    </section>
  );
};

export default Summary;