import React from 'react'
import { Link } from 'react-router'

const Navbar = () => {
  return (
    <nav className='navbar'>
        <Link to="/" className='text-xl sm:text-2xl font-bold text-gradient'>CV Boost</Link>
        <Link to="/upload" className='primary-button w-fit text-sm sm:text-xl] '>Upload Resume</Link>
    </nav>
  )
}

export default Navbar