import React from 'react';

const ScoreBadge = ({ score }: { score: number }): React.ReactElement => {
  const { bg, text, label } =
    score > 69
      ? { bg: 'bg-badge-green', text: 'text-green-600', label: 'Strong' }
      : score > 49
      ? { bg: 'bg-badge-yellow', text: 'text-yellow-600', label: 'Good Start' }
      : { bg: 'bg-badge-red', text: 'text-red-600', label: 'Needs Work' };

  return (
    <div className={`inline-flex items-center px-3 py-1 rounded-full ${bg}`}>
      <p className={`text-xs font-semibold ${text}`}>{label}</p>
    </div>
  );
};


export default ScoreBadge;