import React from 'react';
import { LayoutDashboard, ArrowRightLeft, History, ShieldAlert, LogOut, Settings } from 'lucide-react';

function Sidebar({ setUser, setCurrentView, currentView, user }) {
  const getButtonClass = (viewName) => {
    const base = "flex items-center gap-3 p-3 rounded-xl transition-all duration-200 text-left w-full font-medium ";
    if (currentView === viewName) {
      return base + "bg-blue-600 text-white shadow-lg shadow-blue-900/50";
    }
    return base + "text-slate-400 hover:bg-slate-800 hover:text-white";
  };

  return (
    <div className="w-64 bg-slate-900 text-white h-full p-6 flex flex-col border-r border-slate-800 shrink-0">
      <div className="flex items-center gap-3 mb-8 px-2">
        <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center text-xl">🏦</div>
        <h1 className="text-xl font-bold tracking-wide">WF Finance</h1>
      </div>

      <nav className="flex flex-col gap-2 flex-1 overflow-y-auto">
        <button onClick={() => setCurrentView('dashboard')} className={getButtonClass('dashboard')}>
          <LayoutDashboard className="w-5 h-5" /> Dashboard
        </button>
        <button onClick={() => setCurrentView('transfer')} className={getButtonClass('transfer')}>
          <ArrowRightLeft className="w-5 h-5" /> Transfer Money
        </button>
        <button onClick={() => setCurrentView('transactions')} className={getButtonClass('transactions')}>
          <History className="w-5 h-5" /> Transactions
        </button>
        
        {/* NEW SETTINGS BUTTON */}
        <button onClick={() => setCurrentView('settings')} className={getButtonClass('settings')}>
          <Settings className="w-5 h-5" /> Settings
        </button>

        {user.isAdmin && (
          <button onClick={() => setCurrentView('admin')} className={getButtonClass('admin')}>
            <ShieldAlert className="w-5 h-5" /> Admin Panel
          </button>
        )}
      </nav>

      <div className="mt-4 pt-4 border-t border-slate-800">
        <div className="flex items-center gap-3 mb-4 px-2">
          <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center font-bold text-blue-400">
            {user.name?.charAt(0)}
          </div>
          <div>
            <p className="text-sm font-medium">{user.name}</p>
            <p className="text-xs text-slate-400">Personal Account</p>
          </div>
        </div>
        
        <button
          onClick={() => setUser(null)}
          className="flex items-center justify-center gap-3 w-full text-red-400 bg-red-600/10 hover:bg-red-600 hover:text-white p-3 rounded-xl transition-colors font-medium"
        >
          <LogOut className="w-5 h-5" /> Logout
        </button>
      </div>
    </div>
  );
}

export default Sidebar;