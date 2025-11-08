import React, { useState } from 'react';
import type { UserRole } from '../types';
import { XIcon } from './icons/XIcon';
import { UserIcon } from './icons/UserIcon';
import { AcademicCapIcon } from './icons/AcademicCapIcon';
import { BuildingOfficeIcon } from './icons/BuildingOfficeIcon';
import { BriefcaseIcon } from './icons/BriefcaseIcon';
import { ChevronLeftIcon } from './icons/ChevronLeftIcon';

interface LoginModalProps {
  onLogin: (role: UserRole, email: string, password: string) => boolean;
  onClose: () => void;
}

const ROLES: { role: UserRole; name: string; description: string; icon: React.FC<React.SVGProps<SVGSVGElement>> }[] = [
  { role: 'student', name: 'Student', description: 'Browse and apply for jobs', icon: UserIcon },
  { role: 'teacher', name: 'Teacher', description: 'View student applications', icon: AcademicCapIcon },
  { role: 'hod', name: 'HOD', description: 'Departmental overview', icon: AcademicCapIcon },
  { role: 'pto', name: 'Placement Officer', description: 'Manage all placements', icon: BuildingOfficeIcon },
];

const LoginModal: React.FC<LoginModalProps> = ({ onLogin, onClose }) => {
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleRoleSelect = (role: UserRole) => {
    setSelectedRole(role);
    setError('');
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRole) return;

    const success = onLogin(selectedRole, email.trim(), password);
    if (success) {
      onClose();
    } else {
      setError('Invalid credentials. Please try again.');
    }
  };

  const handleBack = () => {
    setSelectedRole(null);
    setError('');
    setEmail('');
    setPassword('');
  }

  const roleSelectionView = (
    <>
      <div className="p-6 border-b border-slate-200 text-center">
        <BriefcaseIcon className="w-12 h-12 text-primary-600 mx-auto" />
        <h1 className="text-2xl font-extrabold text-slate-800 mt-2 tracking-tight">
          Select Your Role
        </h1>
        <p className="text-md text-slate-500 mt-1">Please select your role to continue</p>
      </div>
      <div className="p-8">
        <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {ROLES.map(({ role, name, description, icon: Icon }) => (
            <button
              key={role}
              onClick={() => handleRoleSelect(role)}
              className="group bg-white p-6 rounded-xl shadow-md border border-slate-200 hover:border-primary-500 hover:shadow-xl hover:-translate-y-2 transition-all duration-300 ease-in-out text-left flex flex-col items-start"
            >
              <div className="p-3 bg-primary-100 rounded-lg">
                <Icon className="w-8 h-8 text-primary-600" />
              </div>
              <h2 className="text-xl font-bold text-slate-800 mt-4">{name}</h2>
              <p className="text-slate-500 mt-1 flex-grow">{description}</p>
              <div className="mt-4 text-primary-600 font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                Continue &rarr;
              </div>
            </button>
          ))}
        </div>
      </div>
    </>
  );

  const loginFormView = (
    <>
      <div className="p-6 border-b border-slate-200 text-center relative">
         <button onClick={handleBack} className="absolute top-1/2 -translate-y-1/2 left-6 flex items-center text-sm font-semibold text-slate-600 hover:text-primary-600">
          <ChevronLeftIcon className="w-5 h-5 mr-1" />
          Back
        </button>
        <h1 className="text-2xl font-extrabold text-slate-800 tracking-tight">
          Login as {ROLES.find(r => r.role === selectedRole)?.name}
        </h1>
      </div>
      <form onSubmit={handleLogin} className="p-8">
        {error && <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg" role="alert">{error}</div>}
        <div className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-slate-700">Email Address</label>
            <input type="email" id="email" value={email} onChange={e => setEmail(e.target.value)} required className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm" />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-slate-700">Password</label>
            <input type="password" id="password" value={password} onChange={e => setPassword(e.target.value)} required className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm" />
          </div>
        </div>
         <div className="mt-6 flex justify-end">
            <button type="submit" className="w-full md:w-auto justify-center px-6 py-2 text-sm font-medium text-white bg-primary-600 border border-transparent rounded-md shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
              Login
            </button>
        </div>
      </form>
    </>
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-[100] flex justify-center items-center p-4 font-sans animate-fade-in">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl relative transform animate-slide-up">
        <button onClick={onClose} className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-600 z-10">
          <XIcon className="w-6 h-6" />
        </button>
        {selectedRole ? loginFormView : roleSelectionView}
      </div>
    </div>
  );
};

export default LoginModal;