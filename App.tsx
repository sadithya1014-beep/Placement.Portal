import React, { useState } from 'react';
import LoginPage from './components/LoginPage';
import MainApp from './components/MainApp';
import type { UserRole, Application, User } from './types';
import { USERS } from './constants';

const App: React.FC = () => {
  const [loggedInUser, setLoggedInUser] = useState<User | null>(null);
  const [applications, setApplications] = useState<Application[]>([]);

  const handleLogin = (role: UserRole, email: string, password: string): boolean => {
    const user = USERS.find(u => u.role === role && u.email === email && u.password === password);
    if (user) {
      setLoggedInUser(user);
      return true;
    }
    return false;
  };

  const handleLogout = () => {
    setLoggedInUser(null);
  };

  const handleApply = (applicationData: Omit<Application, 'jobId' | 'id' | 'studentId'>, jobId: number) => {
    if (loggedInUser && loggedInUser.role === 'student') {
      const newApplication: Application = {
        ...applicationData,
        jobId: jobId,
        studentId: loggedInUser.id,
        id: Date.now(), // Simple unique ID
      };
      setApplications(prev => [...prev, newApplication]);
    }
  };

  return (
    <>
      {loggedInUser ? (
        <MainApp 
          loggedInUser={loggedInUser} 
          onLogout={handleLogout} 
          applications={applications}
          onApply={handleApply}
        />
      ) : (
        <LoginPage onLogin={handleLogin} />
      )}
    </>
  );
};

export default App;