import React, { useState } from 'react';
import Login from './Login';
import Dashboard from './Dashboard';
import Transfer from './Transfer';
import Admin from './Admin';
import Transactions from './Transactions'; 
import Profile from './Profile';
import Settings from './Settings'; 
import Sidebar from './Sidebar';
import Header from './Header';
import LandingPage from './LandingPage'; // <-- Import the Landing Page!

function App() {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('wfUser');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  
  const [currentView, setCurrentView] = useState('dashboard'); 
  
  // NEW: This state controls whether we are looking at the Landing Page or the Login Screen
  const [showAuth, setShowAuth] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('wfUser');
    setUser(null);
    setShowAuth(false); // Go back to the landing page on logout
  };

  const getPageTitle = () => {
    if (currentView === 'transfer') return 'Transfer Money';
    if (currentView === 'admin') return 'Admin Panel';
    if (currentView === 'transactions') return 'Transactions';
    if (currentView === 'profile') return 'Account Info';
    if (currentView === 'settings') return 'Settings'; 
    return 'Dashboard';
  };

  // 1. If user is logged in, show the Dashboard app
  if (user) {
    return (
      <div className="flex h-screen w-full bg-slate-950 overflow-hidden">
        <Sidebar 
          setUser={handleLogout} 
          setCurrentView={setCurrentView} 
          currentView={currentView}
          user={user}
        />
        
        <div className="flex-1 flex flex-col h-full overflow-hidden">
          <Header title={getPageTitle()} userName={user.name} />
          
          <div className="flex-1 overflow-y-auto bg-slate-950">
            {currentView === 'transfer' ? (
              <Transfer user={user} setUser={setUser} />
            ) : currentView === 'admin' ? (
              <Admin />
            ) : currentView === 'transactions' ? (
              <Transactions user={user} /> 
            ) : currentView === 'profile' ? (
              <Profile user={user} />
            ) : currentView === 'settings' ? (
              <Settings user={user} setUser={setUser} />
            ) : (
              <Dashboard user={user} setUser={setUser} setCurrentView={setCurrentView} />
            )}
          </div>
        </div>
      </div>
    );
  }

  // 2. If user is NOT logged in, check if they clicked "Login" yet
if (!showAuth) {
  return (
    <LandingPage 
      onLogin={() => setShowAuth(true)} 
      onRegister={() => setShowAuth(true)} 
    />
  );
}

  // 3. If they clicked Login/Enrol, show the Auth screen
  return (
    <div>
      <Login setUser={setUser} />
      {/* A small back button just in case they change their mind */}
      <button 
        onClick={() => setShowAuth(false)} 
        className="fixed top-4 left-4 text-slate-400 hover:text-white flex items-center gap-2 bg-slate-900/50 p-2 rounded-lg backdrop-blur-sm"
      >
        ← Back to Home
      </button>
    </div>
  );
}

export default App;