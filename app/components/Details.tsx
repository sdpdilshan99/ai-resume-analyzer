import React, { useMemo } from 'react'
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '~/components/Accordion'
import { cn } from '~/lib/utils'

// 1. Refined ScoreBadge
const ScoreBadge = ({ score }: { score: number }) => {
  const styles = useMemo(() => {
    if (score > 69) return "bg-emerald-50 text-emerald-700 border-emerald-200";
    if (score > 39) return "bg-amber-50 text-amber-700 border-amber-200";
    return "bg-rose-50 text-rose-700 border-rose-200";
  }, [score]);

  return (
    <div className={cn("px-2.5 py-0.5 rounded-full text-xs font-bold border", styles)}>
      {score}/100
    </div>
  )
}

// 2. Refined Tip Card (Combined Tip + Explanation)
const TipCard = ({ tip }: { tip: FeedbackTip }) => {
  const isGood = tip.type === "good";
  
  return (
    <div className={cn(
      "group p-4 rounded-xl border transition-all duration-200",
      isGood 
        ? "bg-emerald-100/50 hover:bg-emerald-100/70 border-gray-100 hover:border-emerald-200" 
        : "bg-amber-100/50 hover:bg-amber-100/70 border-gray-100 hover:border-amber-200"
    )}>
      <div className="flex gap-3">
        {isGood ? (
          <img src='/icons/check.svg' className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
        ) : (
          <img src='/icons/warning.svg' className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
        )}
        <div className="space-y-1">
          <p className={cn("font-bold text-sm uppercase tracking-tight", isGood ? "text-emerald-900" : "text-amber-900")}>
            {tip.tip}
          </p>
          <p className="text-slate-600 text-sm leading-relaxed">
            {tip.explanation}
          </p>
        </div>
      </div>
    </div>
  );
};



// Details.tsx

const Details = ({ feedback }: { feedback: Feedback }) => {
  const categories = useMemo(() => [
    { id: 'toneAndStyle', title: 'Tone & Style', data: feedback.toneAndStyle },
    { id: 'content', title: 'Content', data: feedback.content },
    { id: 'structure', title: 'Structure', data: feedback.structure },
    { id: 'skills', title: 'Skills', data: feedback.skills },
  ], [feedback]);

  return (
    <div className="w-full space-y-4">
      <div className="flex items-center justify-between px-1">
        <h2 className="text-xl font-black text-slate-900 tracking-tight">Detailed Analysis</h2>
      </div>

      <Accordion 
        type="single" 
        collapsible 
        /* 1. overflow-anchor: none stops the mobile browser from 'snapping' the scroll */
        className="space-y-3 [overflow-anchor:none]"
      >
        {categories.map((category) => (
          <AccordionItem 
            key={category.id} 
            value={category.id}
            className="border border-slate-200 rounded-2xl overflow-hidden bg-white shadow-sm"
          >
            <AccordionTrigger 
              className="hover:no-underline py-4 px-4 outline-none"
              /* 2. Preventing the default focus behavior often stops the jump on mobile */
              onPointerDown={(e) => e.preventDefault()} 
            >
              <div className="flex items-center justify-between w-full">
                <span className="text-[15px] font-bold text-slate-700">{category.title}</span>
                <ScoreBadge score={category.data.score} />
              </div>
            </AccordionTrigger>
            
            <AccordionContent className="pb-4 px-4">
              <div className="grid grid-cols-1 gap-3 pt-2 border-t border-slate-50">
                {category.data.tips.map((tip, idx) => (
                   <TipCard key={idx} tip={tip} />
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  )
}

export default Details