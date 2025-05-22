"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isMenuOpen && !event.target.closest('nav') && !event.target.closest('button')) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [isMenuOpen]);

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMenuOpen]);

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled ? 'bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm shadow-md' : 'bg-white dark:bg-gray-900'
    } text-gray-900 dark:text-white`}>
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link href="/" className="flex items-center z-20">
          <div className="relative w-10 h-10 sm:w-12 sm:h-12">
            <Image 
              src="/images/icon.png" 
              alt="NOM Logo" 
              fill
              className="object-contain"
              priority
              unoptimized={true}
            />
          </div>
          <span className="ml-2 text-lg font-bold">NOM</span>
        </Link>
        
        {/* Hamburger button for mobile */}
        <button 
          className="md:hidden z-20 p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
        >
          <div className="w-6 flex flex-col items-end justify-center gap-1.5">
            <span className={`block h-0.5 bg-current transition-all duration-300 ${
              isMenuOpen ? 'w-6 translate-y-2 rotate-45' : 'w-6'
            }`}></span>
            <span className={`block h-0.5 bg-current transition-all duration-300 ${
              isMenuOpen ? 'opacity-0' : 'w-4'
            }`}></span>
            <span className={`block h-0.5 bg-current transition-all duration-300 ${
              isMenuOpen ? 'w-6 -translate-y-2 -rotate-45' : 'w-5'
            }`}></span>
          </div>
        </button>
        
        {/* Desktop navigation */}
        <nav className="hidden md:block font-bold">
          <ul className="flex space-x-6">
            <li><Link href="/" className="hover:text-purple-500 transition-colors">Home</Link></li>
            <li><Link href="/about" className="hover:text-purple-500 transition-colors">About</Link></li>
            <li><Link href="/tokenomics" className="hover:text-purple-500 transition-colors">Tokenomics</Link></li>
            <li><Link href="/roadmap" className="hover:text-purple-500 transition-colors">Roadmap</Link></li>
          </ul>
        </nav>
      </div>
      
      {/* Mobile navigation overlay */}
      <div className={`fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity duration-300 md:hidden ${
        isMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`}>
        <nav className={`absolute right-0 top-0 bottom-0 w-64 max-w-[80vw] bg-white dark:bg-gray-900 shadow-xl transition-transform duration-300 overflow-y-auto ${
          isMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}>
          <div className="p-6">
            <div className="flex justify-end mb-8">
              <button 
                onClick={() => setIsMenuOpen(false)}
                className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-800"
                aria-label="Close menu"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <ul className="space-y-4">
              <li>
                <Link 
                  href="/" 
                  className="block py-2 px-4 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Home
                </Link>
              </li>
              <li>
                <Link 
                  href="/about" 
                  className="block py-2 px-4 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  About
                </Link>
              </li>
              <li>
                <Link 
                  href="/tokenomics" 
                  className="block py-2 px-4 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Tokenomics
                </Link>
              </li>
              <li>
                <Link 
                  href="/roadmap" 
                  className="block py-2 px-4 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Roadmap
                </Link>
              </li>
            </ul>
            
            {/* Social links in mobile menu */}
            <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Connect with us:</p>
              <div className="flex space-x-4">
                <a href="https://twitter.com/NomToken" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-500">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"></path>
                  </svg>
                </a>
                <a href="https://t.me/NomTokenOfficial" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:text-blue-600">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.248l-1.97 9.269c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.333-.373-.121l-6.871 4.326-2.962-.924c-.643-.204-.657-.643.136-.953l11.57-4.461c.538-.196 1.006.128.832.953z"></path>
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </nav>
      </div>
    </header>
  );
} 