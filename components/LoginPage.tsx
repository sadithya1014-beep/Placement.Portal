import React, { useState, useEffect } from 'react';
import type { UserRole } from '../types';
import LoginModal from './LoginModal';
import FeaturedJobCard from './FeaturedJobCard';
import { JOBS } from '../constants';
import { BriefcaseIcon } from './icons/BriefcaseIcon';
import { MenuIcon } from './icons/MenuIcon';
import { XIcon } from './icons/XIcon';
import { ArrowRightIcon } from './icons/ArrowRightIcon';

interface LoginPageProps {
  onLogin: (role: UserRole, email: string, password: string) => boolean;
}

const NavLinks: React.FC<{ onLoginClick: () => void; isMobile?: boolean }> = ({ onLoginClick, isMobile }) => {
  const baseClasses = "font-medium text-slate-600 hover:text-primary-600 transition-colors";
  const mobileClasses = "block py-2 text-lg";
  const desktopClasses = "";
  
  return (
    <>
      <a href="#" className={`${baseClasses} ${isMobile ? mobileClasses : desktopClasses}`}>Home</a>
      <a href="#" className={`${baseClasses} ${isMobile ? mobileClasses : desktopClasses}`}>About</a>
      <a href="#" className={`${baseClasses} ${isMobile ? mobileClasses : desktopClasses}`}>Contact</a>
      <button
        onClick={onLoginClick}
        className={`w-full text-left md:w-auto px-4 py-2 text-sm font-medium text-white bg-primary-600 border border-transparent rounded-md shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors ${isMobile ? 'mt-4' : 'ml-4'}`}
      >
        Login
      </button>
    </>
  );
};

const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLoginClick = () => {
    setIsMobileMenuOpen(false);
    setIsModalOpen(true);
  };

  return (
    <div className="bg-white text-slate-800 font-sans">
      {isModalOpen && <LoginModal onLogin={onLogin} onClose={() => setIsModalOpen(false)} />}
      
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled || isMobileMenuOpen ? 'bg-white shadow-md' : 'bg-transparent'}`}>
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center space-x-3">
              <BriefcaseIcon className="w-8 h-8 text-primary-600" />
              <span className="text-2xl font-bold text-slate-800 tracking-tight">
                Placement Portal
              </span>
            </div>
            <div className="hidden md:flex items-center space-x-6">
              <NavLinks onLoginClick={handleLoginClick} />
            </div>
            <div className="md:hidden">
              <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
                {isMobileMenuOpen ? <XIcon className="w-6 h-6" /> : <MenuIcon className="w-6 h-6" />}
              </button>
            </div>
          </div>
          {isMobileMenuOpen && (
            <div className="md:hidden pt-2 pb-4 space-y-2">
              <NavLinks onLoginClick={handleLoginClick} isMobile />
            </div>
          )}
        </div>
      </nav>

      <header className="relative pt-20 min-h-[60vh] md:min-h-screen flex items-center bg-cover bg-center" style={{backgroundImage: "url('https://images.unsplash.com/photo-1521737604893-d14cc237f11d?q=80&w=2084&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')"}}>
        <div className="absolute inset-0 bg-black bg-opacity-50" />
        <div className="relative container mx-auto px-4 text-center text-white">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight">Find Your Dream Job Today</h1>
          <p className="mt-4 text-lg md:text-xl max-w-3xl mx-auto text-slate-200">
            Connecting talented students with incredible opportunities. Your career starts here.
          </p>
          <button
            onClick={handleLoginClick}
            className="mt-8 px-8 py-3 bg-primary-600 text-white font-semibold rounded-lg shadow-lg hover:bg-primary-700 transition-transform hover:scale-105 duration-300 ease-in-out flex items-center justify-center mx-auto"
          >
            Get Started <ArrowRightIcon className="w-5 h-5 ml-2" />
          </button>
        </div>
      </header>
      
      <section id="featured-jobs" className="py-20 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-800">Featured Jobs</h2>
            <p className="mt-2 text-lg text-slate-500">Here are some of the most recent job openings</p>
          </div>
          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {JOBS.slice(0, 6).map(job => (
              <FeaturedJobCard key={job.id} job={job} onViewJob={handleLoginClick} />
            ))}
          </div>
        </div>
      </section>

      <footer className="bg-slate-800 text-white">
        <div className="container mx-auto px-4 py-12 text-center">
          <p>&copy; {new Date().getFullYear()} Placement Portal. All rights reserved.</p>
          <p className="text-sm text-slate-400 mt-2">Designed to empower students and connect them with top employers.</p>
        </div>
      </footer>
    </div>
  );
};

export default LoginPage;