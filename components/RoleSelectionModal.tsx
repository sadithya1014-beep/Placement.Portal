import React from 'react';
import type { UserRole } from '../types';
import { XIcon } from './icons/XIcon';
import { UserIcon } from './icons/UserIcon';
import { AcademicCapIcon } from './icons/AcademicCapIcon';
import { BuildingOfficeIcon } from './icons/BuildingOfficeIcon';
import { BriefcaseIcon } from './icons/BriefcaseIcon';

interface RoleSelectionModalProps {
  onLogin: (role: UserRole) => void;
  onClose: () => void;
}

const ROLES: { role: UserRole; name: string; description: string; icon: React.FC<React.SVGProps<SVGSVGElement>> }[] = [
  { role: 'student', name: 'Student', description: 'Browse and apply for jobs', icon: UserIcon },
  { role: 'teacher', name: 'Teacher', description: 'View student applications', icon: AcademicCapIcon },
  { role: 'hod', name: 'HOD', description: 'Departmental overview', icon: AcademicCapIcon },
  { role: 'pto', name: 'Placement Officer', description: 'Manage all placements', icon: BuildingOfficeIcon },
];

const RoleSelectionModal: React.FC<RoleSelectionModalProps> = ({ onLogin, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-[100] flex justify-center items-center p-4 font-sans animate-fade-in">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl relative transform animate-slide-up">
        <div className="p-6 border-b border-slate-200 text-center">
           <BriefcaseIcon className="w-12 h-12 text-primary-600 mx-auto" />
            <h1 className="text-2xl font-extrabold text-slate-800 mt-2 tracking-tight">
              Select Your Role
            </h1>
            <p className="text-md text-slate-500 mt-1">Please select your role to continue to the portal</p>
        </div>
        <button onClick={onClose} className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-600">
            <XIcon className="w-6 h-6" />
        </button>
        <div className="p-8">
            <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {ROLES.map(({ role, name, description, icon: Icon }) => (
                <button
                    key={role}
                    onClick={() => onLogin(role)}
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
      </div>
    </div>
  );
};

export default RoleSelectionModal;
