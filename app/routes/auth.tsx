import React, { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router'
import { usePuterStore } from '~/lib/puter'

export const meta = () => ([
    {title:'CV Booster | Auth'},
    {name:'description', content:'Authentication page for CV Booster application'}
])

const auth = () => {
    const {isLoading, auth} = usePuterStore();
    const location = useLocation();
    const next = location.search.split('next=')[1];
    const navigate = useNavigate();

    useEffect(() => {
        if(auth.isAuthenticated){
            navigate(next);
        }
    },[auth.isAuthenticated, next]);
 
  return (
    <main className="bg-[url('/images/bg-auth.svg')] bg-cover min-h-screen flex items-center justify-center">
        <div className='gradient-border shadow-lg'>
            <section className='flex flex-col gap-8 bg-white rounded-2xl p-10'>
                <div className="flex flex-col items-center gap-2 text-center">
                    <h1 className="text-3xl font-bold text-gray-900 py-10">
                    Welcome to CV Booster
                    </h1>
                    <h2 className="text-xl font-medium text-gray-700">
                    Log in to continue your job journey
                    </h2>
                    <p className="text-gray-500 max-w-2xl py-5">
                    Access your personalized dashboard, track your applications, and boost your career opportunities.
                    </p>
                </div>

                <div className="flex justify-center">
                    {isLoading ? (
                        <button className="auth-button animate-pulse">
                            <p>Signing you in...</p>
                        </button>
                    ) :(
                        <>
                            {auth.isAuthenticated ? (
                                <button className="auth-button" onClick={auth.signOut}>
                                    <p>Log Out</p>
                                </button>
                            ) : (
                                <button className='auth-button' onClick={auth.signIn}>
                                    <p>Log In</p>
                                </button>
                            )}
                        </>
                    )}
                </div>
            </section>
        </div>
    </main>
  )
}

export default auth