import React, { useState } from 'react';
import Login from './Login';
import Dashboard from './Dashboard';
import Transfer from './Transfer';
import Admin from './Admin';
import Transactions from './Transactions'; 
import Profile from './Profile';
import Settings from './Settings'; 
import Deposit from './Deposit'; 
import InternationalTransfer from './InternationalTransfer'; 
import PayPalTransfer from './PayPalTransfer'; 
import SkrillTransfer from './SkrillTransfer'; 
import Sidebar from './Sidebar';
import Header from './Header';
import LandingPage from './LandingPage';
import BottomNav from './BottomNav'; 

function App() {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('wfUser');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  
  const [currentView, setCurrentView] = useState('dashboard'); 
  const [showAuth, setShowAuth] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('wfUser');
    setUser(null);
    setShowAuth(false);
  };

  const getPageTitle = () => {
    if (currentView === 'transfer') return 'Local Transfer';
    if (currentView === 'admin') return 'Admin Panel';
    if (currentView === 'transactions') return 'Transactions';
    if (currentView === 'profile') return 'Account Info';
    if (currentView === 'settings') return 'Settings'; 
    if (currentView === 'deposit') return 'Fund Wallet';
    if (currentView === 'international-transfer') return 'Wire Transfer';
    if (currentView === 'paypal') return 'PayPal Transfer';
    if (currentView === 'skrill') return 'Skrill Transfer';
    return 'Dashboard';
  };

  if (user) {
    return (
      <div className="flex h-screen w-full bg-[#f8fafc] overflow-hidden relative">
        <Sidebar 
          setUser={handleLogout} 
          setCurrentView={setCurrentView} 
          currentView={currentView}
          user={user}
          isMobileMenuOpen={isMobileMenuOpen}
          setIsMobileMenuOpen={setIsMobileMenuOpen}
        />
        
        <div className="flex-1 flex flex-col h-full overflow-hidden w-full relative">
          <Header 
            title={getPageTitle()} 
            userName={user.name} 
            user={user} 
            toggleMobileMenu={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          />
          
          <div className="flex-1 overflow-y-auto pb-20 md:pb-0">
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
            ) : currentView === 'deposit' ? (
              <Deposit user={user} setUser={setUser} setCurrentView={setCurrentView} />
            ) : currentView === 'international-transfer' ? (
              <InternationalTransfer user={user} setUser={setUser} setCurrentView={setCurrentView} />
            ) : currentView === 'paypal' ? (
              <PayPalTransfer user={user} setUser={setUser} setCurrentView={setCurrentView} />
            ) : currentView === 'skrill' ? (
              <SkrillTransfer user={user} setUser={setUser} setCurrentView={setCurrentView} />
            ) : (
              <Dashboard user={user} setUser={setUser} setCurrentView={setCurrentView} />
            )}
          </div>

          <div className="md:hidden">
            <BottomNav currentView={currentView} setCurrentView={setCurrentView} />
          </div>
        </div>
      </div>
    );
  }

  if (!showAuth) {
    return (
      <LandingPage 
        onLogin={() => setShowAuth(true)} 
        onRegister={() => setShowAuth(true)} 
      />
    );
  }

  return (
    <div className="bg-[#f8fafc] min-h-screen">
      <Login setUser={setUser} />
      <button 
        onClick={() => setShowAuth(false)} 
        className="fixed top-4 left-4 text-gray-500 hover:text-gray-900 flex items-center gap-2 bg-white/50 p-2 rounded-lg backdrop-blur-sm z-50 font-medium"
      >
        ← Back to Home
      </button>
    </div>
  );
}

export default App;