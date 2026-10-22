import React from 'react';
import { 
  LayoutDashboard, Download, Landmark, Globe, ArrowRightLeft, 
  Receipt, FileText, CreditCard, TrendingUp, HandCoins, 
  RefreshCw, Headphones, UserCog, LogOut, X 
} from 'lucide-react';

function Sidebar({ setUser, setCurrentView, currentView, user, isMobileMenuOpen, setIsMobileMenuOpen }) {
  
  const handleNavClick = (view) => {
    setCurrentView(view);
    if (setIsMobileMenuOpen) setIsMobileMenuOpen(false);
  };

  const getLinkClass = (view) => {
    const base = "flex items-center gap-4 w-full p-2.5 rounded-xl transition-all duration-200 text-left font-medium ";
    if (currentView === view) {
      return base + "bg-[#f0f4f8] text-[#0f5e40]";
    }
    return base + "text-gray-700 hover:bg-gray-50";
  };

  const getIconClass = (view) => {
    const base = "w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-colors ";
    if (currentView === view) {
      return base + "bg-[#d1e7dd] text-[#0f5e40]";
    }
    return base + "bg-[#f3f4f6] text-gray-600";
  };

  return (
    <>
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/40 z-40 md:hidden backdrop-blur-sm" 
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      <div className={`
        fixed md:relative z-50 w-[85vw] max-w-[320px] bg-white h-screen flex flex-col border-r border-gray-200 shrink-0 transition-transform duration-300 ease-in-out overflow-y-auto
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        
        <div className="flex items-center justify-between p-4 md:hidden border-b border-gray-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[#0f5e40] rounded-lg flex items-center justify-center text-white text-sm">🏦</div>
            <span className="font-extrabold text-gray-900 tracking-wide">WF FINANCE</span>
          </div>
          <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 text-gray-500 bg-gray-100 rounded-full hover:bg-gray-200">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 border-b border-gray-100">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-gray-900 flex items-center justify-center text-white text-lg font-bold shrink-0">
                {user?.name?.charAt(0)}
              </div>
              <div className="overflow-hidden">
                <h2 className="font-extrabold text-gray-900 text-lg truncate">{user?.name}</h2>
                <p className="text-xs text-gray-500 truncate">{user?.email}</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 mb-2">
            <span className="bg-gray-100 text-gray-700 px-2.5 py-1 rounded-md text-xs font-bold font-mono tracking-wider">
              # {user?.accountNumber || '95942587664'}
            </span>
          </div>
          <p className="text-xs text-gray-500 mb-5">Savings Account</p>

          <p className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest mb-1">Available Balance</p>
          <p className="text-3xl font-extrabold text-gray-900 mb-4">
            £{Number(user?.balance || 0).toLocaleString('en-GB', { minimumFractionDigits: 2 })}
          </p>

          <div className="flex gap-2">
            <button onClick={() => handleNavClick('deposit')} className="flex-1 bg-[#0f5e40] hover:bg-[#0a3a27] text-white py-2.5 rounded-xl text-sm font-bold flex items-center justify-center gap-1 transition-colors">
              <Download className="w-4 h-4" /> Deposit
            </button>
            <button className="flex-1 bg-[#e2e8f0] hover:bg-[#cbd5e1] text-gray-800 py-2.5 rounded-xl text-sm font-bold flex items-center justify-center gap-1 transition-colors">
              <HandCoins className="w-4 h-4" /> Loan
            </button>
          </div>
        </div>

        <div className="flex-1 p-4">
          <p className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest mb-3 px-2">Menu</p>
          
          <div className="flex flex-col gap-1">
            <button onClick={() => handleNavClick('dashboard')} className={getLinkClass('dashboard')}>
              <div className={getIconClass('dashboard')}><LayoutDashboard className="w-5 h-5" /></div>
              Dashboard
            </button>

            <button onClick={() => handleNavClick('deposit')} className={getLinkClass('deposit')}>
              <div className={getIconClass('deposit')}><Download className="w-5 h-5" /></div>
              Deposits
            </button>

            <button onClick={() => handleNavClick('transfer')} className={getLinkClass('transfer')}>
              <div className={getIconClass('transfer')}><Landmark className="w-5 h-5" /></div>
              Local Transfer
            </button>

            <button onClick={() => handleNavClick('international-transfer')} className={getLinkClass('international-transfer')}>
              <div className={getIconClass('international-transfer')}><Globe className="w-5 h-5" /></div>
              International Transfer
            </button>

            <button onClick={() => handleNavClick('internal-transfer')} className={getLinkClass('internal-transfer')}>
              <div className={getIconClass('internal-transfer')}><ArrowRightLeft className="w-5 h-5" /></div>
              Internal Transfer
            </button>

            <button onClick={() => handleNavClick('transactions')} className={getLinkClass('transactions')}>
              <div className={getIconClass('transactions')}><Receipt className="w-5 h-5" /></div>
              Transactions
            </button>

            <button onClick={() => handleNavClick('statement')} className={getLinkClass('statement')}>
              <div className={getIconClass('statement')}><FileText className="w-5 h-5" /></div>
              Account Statement
            </button>

            <button onClick={() => handleNavClick('cards')} className={getLinkClass('cards')}>
              <div className={getIconClass('cards')}><CreditCard className="w-5 h-5" /></div>
              Virtual Cards
            </button>

            <button onClick={() => handleNavClick('investments')} className={getLinkClass('investments')}>
              <div className={getIconClass('investments')}><TrendingUp className="w-5 h-5" /></div>
              Investments
            </button>

            <button onClick={() => handleNavClick('grants')} className={getLinkClass('grants')}>
              <div className={getIconClass('grants')}><HandCoins className="w-5 h-5" /></div>
              Grant Applications
            </button>

            <button onClick={() => handleNavClick('crypto-swap')} className={getLinkClass('crypto-swap')}>
              <div className={getIconClass('crypto-swap')}><RefreshCw className="w-5 h-5 text-amber-500" /></div>
              Crypto Swap
            </button>
          </div>

          <p className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest mt-6 mb-3 px-2">Settings</p>

          <div className="flex flex-col gap-1">
            <button onClick={() => handleNavClick('support')} className={getLinkClass('support')}>
              <div className={getIconClass('support')}><Headphones className="w-5 h-5" /></div>
              Customer Support
            </button>

            <button onClick={() => handleNavClick('settings')} className={getLinkClass('settings')}>
              <div className={getIconClass('settings')}><UserCog className="w-5 h-5" /></div>
              Profile Settings
            </button>

            <button onClick={() => setUser(null)} className="flex items-center gap-4 w-full p-2.5 rounded-xl transition-all duration-200 text-left font-medium text-rose-600 hover:bg-rose-50 mt-1">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 bg-rose-50 text-rose-600">
                <LogOut className="w-5 h-5" />
              </div>
              Log Out
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default Sidebar;