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
import CryptoTransfer from './CryptoTransfer'; 
import InternalTransfer from './InternalTransfer'; 
import Sidebar from './Sidebar';
import Header from './Header';
import LandingPage from './LandingPage';
import BottomNav from './BottomNav'; 

// Placeholder for upcoming pages
const PlaceholderPage = ({ title }) => (
  <div className="flex flex-col items-center justify-center h-full min-h-[70vh] text-center p-8 bg-[#f8fafc]">
    <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center mb-4">
      <span className="text-3xl">🚧</span>
    </div>
    <h2 className="text-2xl font-extrabold text-gray-900 mb-2">{title}</h2>
    <p className="text-gray-500 max-w-sm">This feature is currently under development. Check back soon!</p>
  </div>
);

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
    if (currentView === 'btc-transfer') return 'Send Bitcoin';
    if (currentView === 'eth-transfer') return 'Send Ethereum';
    if (currentView === 'usdt-transfer') return 'Send Tether';
    if (currentView === 'internal-transfer') return 'Internal Transfer';
    if (currentView === 'statement') return 'Account Statement';
    if (currentView === 'investments') return 'Investments';
    if (currentView === 'grants') return 'Grant Applications';
    if (currentView === 'crypto-swap') return 'Crypto Swap';
    if (currentView === 'support') return 'Customer Support';
    if (currentView === 'cards') return 'Virtual Cards';
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
              /* CRITICAL FIX: Passed setCurrentView here */
              <Transactions user={user} setCurrentView={setCurrentView} /> 
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
            ) : currentView === 'btc-transfer' ? (
              <CryptoTransfer user={user} setUser={setUser} setCurrentView={setCurrentView} cryptoType="btc" />
            ) : currentView === 'eth-transfer' ? (
              <CryptoTransfer user={user} setUser={setUser} setCurrentView={setCurrentView} cryptoType="eth" />
            ) : currentView === 'usdt-transfer' ? (
              <CryptoTransfer user={user} setUser={setUser} setCurrentView={setCurrentView} cryptoType="usdt" />
            ) : currentView === 'internal-transfer' ? (
              <InternalTransfer user={user} setUser={setUser} setCurrentView={setCurrentView} />
            
            /* PLACEHOLDERS */
            ) : currentView === 'statement' ? (
              <PlaceholderPage title="Account Statement" />
            ) : currentView === 'investments' ? (
              <PlaceholderPage title="Investments" />
            ) : currentView === 'grants' ? (
              <PlaceholderPage title="Grant Applications" />
            ) : currentView === 'crypto-swap' ? (
              <PlaceholderPage title="Crypto Swap" />
            ) : currentView === 'support' ? (
              <PlaceholderPage title="Customer Support" />
            ) : currentView === 'cards' ? (
              <PlaceholderPage title="Virtual Cards" />
            
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