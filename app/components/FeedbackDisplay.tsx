const FeedbackDisplay = ({ feedback }: { feedback: Feedback | null }) => {
  if (!feedback) return null;

  const categories = [
    { label: 'ATS Optimization', data: feedback.ATS },
    { label: 'Tone & Style', data: feedback.toneAndStyle },
    { label: 'Technical Skills', data: feedback.skills },
  ];

  return (
    <div className="space-y-6">
      {categories.map((cat) => (
        <div key={cat.label} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">{cat.label}</h2>
            <span className="text-blue-600 font-bold">{cat.data.score}/100</span>
          </div>
          <ul className="space-y-3">
            {cat.data.tips.map((tip, i) => (
              <li key={i} className={`p-4 rounded-xl border ${tip.type === 'good' ? 'bg-green-50 border-green-100' : 'bg-amber-50 border-amber-100'}`}>
                <p className="font-bold text-slate-900">{tip.tip}</p>
                <p className="text-sm text-slate-600 mt-1">{tip.explanation}</p>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};