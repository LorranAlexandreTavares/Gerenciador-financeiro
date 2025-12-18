
import React, { useState, useEffect } from 'react';
import { UserData } from './types';
import { LoginScreen } from './components/LoginScreen';
import { OnboardingScreen } from './components/OnboardingScreen';
import { Dashboard } from './components/Dashboard';

// --- Constantes de Armazenamento ---
const ALL_USERS_KEY = 'finsimples_all_users_data';
const CURRENT_USER_KEY = 'finsimples_current_user';

const App = () => {
  // --- State ---
  const [allUsersData, setAllUsersData] = useState<Record<string, UserData>>(() => {
    try {
      const saved = localStorage.getItem(ALL_USERS_KEY);
      return saved ? JSON.parse(saved) : {};
    } catch (e) {
      return {};
    }
  });

  const [currentUser, setCurrentUser] = useState<string | null>(() => {
    try {
      return localStorage.getItem(CURRENT_USER_KEY);
    } catch (e) {
      return null;
    }
  });

  // --- Persistência ---
  useEffect(() => {
    try {
      localStorage.setItem(ALL_USERS_KEY, JSON.stringify(allUsersData));
    } catch (e) {
      console.error("Failed to save user data to localStorage", e);
    }
  }, [allUsersData]);

  useEffect(() => {
    try {
      if (currentUser) {
        localStorage.setItem(CURRENT_USER_KEY, currentUser);
      } else {
        localStorage.removeItem(CURRENT_USER_KEY);
      }
    } catch (e) {
      console.error("Failed to save current user to localStorage", e);
    }
  }, [currentUser]);

  // --- Handlers ---
  const handleLogin = (username: string): boolean => {
    if (allUsersData[username]) {
      setCurrentUser(username);
      return true;
    }
    return false;
  };

  const handleRegister = (username: string, password: string): boolean => {
    if (allUsersData[username]) {
      alert('Este nome de usuário já existe.');
      return false;
    }
    const newUser: UserData = {
      password, // Em um app real, isso deveria ser "hasheado"
      settings: { userName: username, savingsGoal: 0, age: '', profession: '' },
      transactions: [],
      goals: [],
      hasCompletedOnboarding: false,
    };
    setAllUsersData(prev => ({ ...prev, [username]: newUser }));
    setCurrentUser(username);
    return true;
  };

  const handleLogout = () => {
    setCurrentUser(null);
  };
  
  const handleSaveOnboarding = (settings: UserData['settings']) => {
    if (currentUser) {
        setAllUsersData(prev => ({
            ...prev,
            [currentUser]: {
                ...prev[currentUser],
                settings,
                hasCompletedOnboarding: true,
            }
        }));
    }
  };

  const handleDataChange = (newUserData: Omit<UserData, 'password' | 'hasCompletedOnboarding'>) => {
     if(currentUser && allUsersData[currentUser]){
        setAllUsersData(prev => ({
            ...prev,
            [currentUser]: {
                ...prev[currentUser],
                ...newUserData
            }
        }))
     }
  }

  // --- Lógica de Renderização ---
  if (!currentUser) {
    return <LoginScreen onLogin={handleLogin} onRegister={handleRegister} />;
  }

  const currentUserData = allUsersData[currentUser];
  if (!currentUserData) {
      // Caso de erro onde o usuário atual não tem dados. Desloga.
      handleLogout();
      return null;
  }

  if (!currentUserData.hasCompletedOnboarding) {
    return <OnboardingScreen onSave={handleSaveOnboarding} defaultUsername={currentUserData.settings.userName} />;
  }

  return <Dashboard userData={currentUserData} onDataChange={handleDataChange} onLogout={handleLogout} />;
};

export default App;
