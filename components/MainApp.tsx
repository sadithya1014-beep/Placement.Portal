import React, { useState, useMemo } from 'react';
import Header from './Header';
import JobList from './JobList';
import JobDetails from './JobDetails';
import ApplyModal from './ApplyModal';
import ApplicationList from './ApplicationList';
import ApplicationDetails from './ApplicationDetails';
import StudentList from './StudentList';
import StudentDetails from './StudentDetails';
import { JOBS, USERS } from '../constants';
import type { Job, Application, User, Student } from '../types';
import { InboxIcon } from './icons/InboxIcon';
import { UserGroupIcon } from './icons/UserGroupIcon';


interface MainAppProps {
  loggedInUser: User;
  onLogout: () => void;
  applications: Application[];
  onApply: (applicationData: Omit<Application, 'id' | 'jobId' | 'studentId'>, jobId: number) => void;
}

const MainApp: React.FC<MainAppProps> = ({ loggedInUser, onLogout, applications, onApply }) => {
  // Common state
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);

  // Student-specific state
  const [isApplyModalOpen, setIsApplyModalOpen] = useState<boolean>(false);
  
  // Admin-specific state
  const [adminTab, setAdminTab] = useState<'applications' | 'students'>('applications');
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

  const jobsById = useMemo(() => JOBS.reduce((acc, job) => {
    acc[job.id] = job;
    return acc;
  }, {} as Record<number, Job>), []);
  
  const usersById = useMemo(() => USERS.reduce((acc, user) => {
    acc[user.id] = user;
    return acc;
  }, {} as Record<number, User>), []);

  const students = useMemo(() => USERS.filter(u => u.role === 'student') as Student[], []);

  const appliedJobIds = useMemo(() => {
    if (loggedInUser.role === 'student') {
        return new Set(applications.filter(app => app.studentId === loggedInUser.id).map(app => app.jobId));
    }
    // Fix: Explicitly type the empty Set to avoid it being inferred as Set<unknown>.
    return new Set<number>();
  }, [applications, loggedInUser]);

  const handleSelectJob = (job: Job) => {
    setSelectedJob(job);
    // For admins, clear other selections
    if (loggedInUser.role !== 'student') {
        setSelectedApplication(null);
        setSelectedStudent(null);
    }
  };

  const handleCloseDetails = () => setSelectedJob(null);
  
  const handleOpenApplyModal = () => {
    if (selectedJob) setIsApplyModalOpen(true);
  };

  const handleCloseApplyModal = () => setIsApplyModalOpen(false);

  const handleStudentApply = (applicationData: Omit<Application, 'jobId' | 'id' | 'studentId'>) => {
    if (selectedJob) {
      onApply(applicationData, selectedJob.id);
      handleCloseApplyModal();
    }
  };

  const handleSelectApplication = (application: Application) => {
    setSelectedApplication(application);
    setSelectedStudent(null);
  };
  
  const handleSelectStudent = (student: Student) => {
    setSelectedStudent(student);
    setSelectedApplication(null);
  };

  const studentView = (
    <div className="flex flex-col md:flex-row gap-8">
      <div className={`w-full md:w-1/3 transition-transform duration-300 ease-in-out ${selectedJob ? 'hidden md:block' : 'block'}`}>
        <JobList jobs={JOBS} onSelectJob={handleSelectJob} selectedJobId={selectedJob?.id} appliedJobIds={appliedJobIds} />
      </div>

      <div className={`w-full md:w-2/3 transition-opacity duration-300 ease-in-out ${selectedJob ? 'block' : 'hidden md:block'}`}>
        {selectedJob && loggedInUser.role === 'student' ? (
          <JobDetails
            job={selectedJob}
            onClose={handleCloseDetails}
            onApply={handleOpenApplyModal}
            isApplied={appliedJobIds.has(selectedJob.id)}
          />
        ) : (
          <div className="h-full hidden md:flex items-center justify-center bg-white rounded-xl shadow-md border border-slate-200">
            <div className="text-center p-8">
              <h2 className="text-2xl font-bold text-slate-700">Welcome, {loggedInUser.name}</h2>
              <p className="mt-2 text-slate-500">Select a job from the list to view its details.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  const adminView = (
    <div>
        <div className="mb-6 border-b border-gray-200">
            <nav className="-mb-px flex space-x-6" aria-label="Tabs">
                <button onClick={() => setAdminTab('applications')} className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${adminTab === 'applications' ? 'border-primary-500 text-primary-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>
                    Applications
                </button>
                <button onClick={() => setAdminTab('students')} className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${adminTab === 'students' ? 'border-primary-500 text-primary-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>
                    Students
                </button>
            </nav>
        </div>
        
        {adminTab === 'applications' && (
             <div className="flex flex-col md:flex-row gap-8">
                <div className={`w-full md:w-1/3 transition-transform duration-300 ease-in-out ${selectedApplication ? 'hidden md:block' : 'block'}`}>
                    <ApplicationList 
                        applications={applications} 
                        usersById={usersById}
                        jobsById={jobsById}
                        onSelectApplication={handleSelectApplication}
                        selectedApplicationId={selectedApplication?.id}
                    />
                </div>
                <div className={`w-full md:w-2/3 transition-opacity duration-300 ease-in-out ${selectedApplication ? 'block' : 'hidden md:block'}`}>
                    {selectedApplication ? (
                    <ApplicationDetails
                        application={selectedApplication}
                        job={jobsById[selectedApplication.jobId]}
                        student={usersById[selectedApplication.studentId] as Student}
                        onClose={() => setSelectedApplication(null)}
                    />
                    ) : (
                    <div className="h-full hidden md:flex items-center justify-center bg-white rounded-xl shadow-md border border-slate-200">
                        <div className="text-center p-8">
                        <InboxIcon className="w-16 h-16 mx-auto text-slate-300" />
                        <h2 className="mt-4 text-2xl font-bold text-slate-700">Application Viewer</h2>
                        <p className="mt-2 text-slate-500">
                            {applications.length > 0 
                            ? "Select an application to view details."
                            : "No applications have been submitted yet."
                            }
                        </p>
                        </div>
                    </div>
                    )}
                </div>
            </div>
        )}

        {adminTab === 'students' && (
            <div className="flex flex-col md:flex-row gap-8">
                <div className={`w-full md:w-1/3 transition-transform duration-300 ease-in-out ${selectedStudent ? 'hidden md:block' : 'block'}`}>
                   <StudentList
                    students={students}
                    onSelectStudent={handleSelectStudent}
                    selectedStudentId={selectedStudent?.id}
                   />
                </div>
                <div className={`w-full md:w-2/3 transition-opacity duration-300 ease-in-out ${selectedStudent ? 'block' : 'hidden md:block'}`}>
                    {selectedStudent ? (
                        <StudentDetails 
                            student={selectedStudent}
                            applications={applications.filter(app => app.studentId === selectedStudent.id)}
                            jobsById={jobsById}
                            onClose={() => setSelectedStudent(null)}
                        />
                    ) : (
                        <div className="h-full hidden md:flex items-center justify-center bg-white rounded-xl shadow-md border border-slate-200">
                            <div className="text-center p-8">
                                <UserGroupIcon className="w-16 h-16 mx-auto text-slate-300" />
                                <h2 className="mt-4 text-2xl font-bold text-slate-700">Student Directory</h2>
                                <p className="mt-2 text-slate-500">Select a student to view their profile and application history.</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        )}
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <Header user={loggedInUser} onLogout={onLogout} />
      <main className="container mx-auto px-4 py-8">
        {loggedInUser.role === 'student' ? studentView : adminView}
      </main>
      {isApplyModalOpen && selectedJob && loggedInUser.role === 'student' && (
        <ApplyModal 
            job={selectedJob} 
            student={loggedInUser} 
            onClose={handleCloseApplyModal} 
            onSubmit={handleStudentApply} 
        />
      )}
    </div>
  );
};

export default MainApp;