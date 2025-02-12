'use client'

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export function Header () {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (localStorage.getItem('user')) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    router.push('/login');
  };

  return (
    <header className="bg-[#131324] text-white mb-2">
      <div className="container mx-auto flex justify-between items-center p-4">
        <Link href="/" className="text-xl font-bold">EventKick</Link>
        <nav className="hidden md:flex space-x-4">
          <Link href="/plan" className="hover:text-gray-300">Plan</Link>
          <Link href="/contact" className="hover:text-gray-300">Contact</Link>
          <Link href="/about" className="hover:text-gray-300">About</Link>
          {isLoggedIn ? (
            <>
              <Link href="/profile" className="hover:text-gray-300">Profile</Link>
              <button onClick={handleLogout} className="hover:text-gray-300">Logout</button>
            </>
          ) : (
            <Link href="/login" className="hover:text-gray-300">Login/Signup</Link>
          )}
        </nav>
        <button className="md:hidden flex items-center" onClick={() => setIsOpen(!isOpen)}>
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path>
          </svg>
        </button>
      </div>
      {isOpen && (
        <div className="md:hidden absolute top-16 left-0 right-0 bg-opacity-5 backdrop-filter backdrop-blur-sm text-white flex flex-col items-start space-y-4 p-4 z-50">
          <nav className="flex flex-col space-y-2 p-4">
            <Link href="/plan" className="hover:text-gray-300">Plan</Link>
            <Link href="/contact" className="hover:text-gray-300">Contact</Link>
            <Link href="/about" className="hover:text-gray-300">About</Link>
            {isLoggedIn ? (
              <>
                <Link href="/profile" className="hover:text-gray-300">Profile</Link>
                <button onClick={handleLogout} className="justify-start text-start items-start hover:text-gray-300">Logout</button>
              </>
            ) : (
              <Link href="/login" className="hover:text-gray-300">Login/Signup</Link>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};
