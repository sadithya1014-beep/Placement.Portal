import React from 'react';
import StudentCard from './StudentCard';
import type { Student } from '../types';
import { UserGroupIcon } from './icons/UserGroupIcon';

interface StudentListProps {
  students: Student[];
  onSelectStudent: (student: Student) => void;
  selectedStudentId: number | undefined;
}

const StudentList: React.FC<StudentListProps> = ({ students, onSelectStudent, selectedStudentId }) => {
  return (
    <div className="bg-white rounded-xl shadow-md border border-slate-200 h-[calc(100vh-14rem)] overflow-y-auto">
      <div className="p-4 border-b border-slate-200 sticky top-0 bg-white/80 backdrop-blur-md z-10">
        <div className="flex items-center space-x-2">
          <UserGroupIcon className="w-6 h-6 text-primary-600" />
          <h2 className="text-xl font-bold text-slate-800">Students</h2>
        </div>
        <p className="text-sm text-slate-500">{students.length} students registered</p>
      </div>
      <div className="space-y-2 p-2">
        {students.map((student) => (
          <StudentCard 
            key={student.id} 
            student={student} 
            onSelectStudent={onSelectStudent} 
            isSelected={student.id === selectedStudentId}
          />
        ))}
      </div>
    </div>
  );
};

export default StudentList;