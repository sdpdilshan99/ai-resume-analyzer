import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router'
import { useAuthStore } from '~/lib/auth-store'
import { supabase } from '~/lib/supabase'
import VerificationMessage from '~/components/VerificationMessage'

export const meta = () => ([
    {title:'CV Booster | Auth'},
    {name:'description', content:'Authentication page for CV Booster'}
])

const Auth = () => {
    const { user, isLoading } = useAuthStore();
    const navigate = useNavigate();
    const location = useLocation();

    // Local States
    const [email, setEmail] = useState('');
    const [isEmailSent, setIsEmailSent] = useState(false);
    const [loading, setLoading] = useState(false);

    const searchParams = new URLSearchParams(location.search);
    const next = searchParams.get('next') || '/';

    useEffect(() => {
        if (user) navigate(next);
    }, [user, next, navigate]);

    // Handle Email Login/Sign Up
    const handleEmailAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const { data, error } = await supabase.auth.signInWithOtp({
            email,
            options: {
                emailRedirectTo: window.location.origin + next,
            },
        });

        if (error) {
            alert(error.message);
        } else {
            setIsEmailSent(true);
        }
        setLoading(false);
    }

    const handleGoogleSignIn = async () => {
        await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: { redirectTo: window.location.origin },
        })
    }

    return (
        <main className="bg-[url('/images/bg-auth.svg')] bg-cover min-h-screen flex items-center justify-center p-4">
            <div className='gradient-border shadow-2xl max-w-xl w-full'>
                <section className='bg-white rounded-2xl p-30'>
                    
                    {isEmailSent ? (
                        <VerificationMessage email={email} onBack={() => setIsEmailSent(false)} />
                    ) : (
                        <div className="flex flex-col gap-8">
                            <div className="text-center">
                                <h1 className="text-3xl font-bold text-gray-900">Welcome</h1>
                                <p className="text-gray-500 mt-2">Sign in to boost your career</p>
                            </div>

                            <form onSubmit={handleEmailAuth} className="flex flex-col gap-4">
                                <input 
                                    type="email"
                                    placeholder="Enter your email"
                                    required
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                                <button 
                                    disabled={loading}
                                    className="auth-button text-xl w-full text-white py-3 rounded-lg font-bold hover:bg-blue-700 transition-all disabled:opacity-50"
                                >
                                    {loading ? 'Sending...' : 'Continue with Email'}
                                </button>
                            </form>

                            <div className="relative">
                                <div className="absolute inset-0 flex items-center"><span className="w-full border-t"></span></div>
                                <div className="relative flex justify-center text-xs uppercase"><span className="bg-white px-2 text-gray-500">Or continue with</span></div>
                            </div>

                            <button onClick={handleGoogleSignIn} className="flex items-center justify-center gap-2 border border-gray-300 p-3 rounded-lg 
                            hover:bg-gray-200 transition-all hover:cursor-pointer">
                                <img src="/images/google.png" alt="Google" className="w-8 h-8" />
                                <p className='text-lg text-gray-900 font-bold'>Google</p>
                            </button>
                        </div>
                    )}
                </section>
            </div>
        </main>
    )
}

export default Auth