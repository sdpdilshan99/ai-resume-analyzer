import React from 'react';

interface Props {
  email: string;
  onBack: () => void;
}

const VerificationMessage = ({ email, onBack }: Props) => {
  return (
    <div className="flex flex-col items-center text-center gap-6 animate-in fade-in zoom-in duration-300">
      <div className="bg-blue-50 p-6 rounded-full text-blue-500">
        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
          <polyline points="22,6 12,13 2,6"></polyline>
        </svg>
      </div>
      
      <div className="space-y-2">
        <h2 className="text-2xl font-bold text-gray-900">Verify your email</h2>
        <p className="text-gray-600 max-w-sm">
          We've sent a magic link to <span className="font-semibold text-gray-900">{email}</span>. 
          Please check your inbox and click the link to continue.
        </p>
      </div>

      <button 
        onClick={onBack}
        className="text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
      >
        ← Use a different email
      </button>
    </div>
  );
};

export default VerificationMessage;