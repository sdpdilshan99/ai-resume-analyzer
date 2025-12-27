import React, { use } from 'react'
import { Link } from 'react-router'
import { useAuthStore } from '~/lib/auth-store'

const Navbar = () => {
  const {signOut} = useAuthStore()

  return (
    <nav className='navbar'>
        <Link to="/" className='text-xl sm:text-2xl font-bold text-gradient'>CV Boost</Link>
        <Link to="/upload" className='primary-button w-fit text-sm sm:text-xl] '>Upload Resume</Link>
        <button  className='primary-button w-fit ' onClick={() => signOut()}>Log out</button>
    </nav>
  )
}

export default Navbar