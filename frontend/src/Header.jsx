import React, { useState, useEffect } from 'react';
import { Bell, UserCircle, Menu, ArrowUpRight, ArrowDownLeft } from 'lucide-react';

function Header({ title, userName, toggleMobileMenu, user }) {
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unread, setUnread] = useState(true);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  useEffect(() => {
    if (!user) return;

    const fetchNotifications = async () => {
      try {
        const response = await fetch(`${API_URL}/api/transaction/history/${user.email}`);
        const data = await response.json();
        if (Array.isArray(data)) {
          // Get the 3 most recent transactions for the notification dropdown
          setNotifications(data.slice(0, 3));
        }
      } catch (err) {
        console.error("Failed to fetch notifications", err);
      }
    };
    fetchNotifications();
  }, [user, API_URL]);

  const handleBellClick = () => {
    setShowNotifications(!showNotifications);
    if (!showNotifications) {
      setUnread(false); // Remove the red dot when opened
    }
  };

  return (
    <header className="h-16 md:h-20 bg-slate-900 border-b border-slate-800 flex items-center justify-between px-4 md:px-8 text-white shrink-0 relative z-50">
      <div className="flex items-center gap-3">
        <button 
          onClick={toggleMobileMenu}
          className="md:hidden p-2 -ml-2 rounded-lg hover:bg-slate-800 transition-colors"
        >
          <Menu className="w-6 h-6 text-slate-300" />
        </button>
        
        <div className="flex items-center gap-2 md:hidden">
          <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center text-sm">🏦</div>
          <span className="font-bold text-lg">WF Finance</span>
        </div>

        <h1 className="text-2xl font-bold hidden md:block">{title}</h1>
      </div>
      
      <div className="flex items-center gap-3 md:gap-6">
        
        {/* NOTIFICATION BELL */}
        <div className="relative">
          <button 
            onClick={handleBellClick}
            className="relative p-2 rounded-full hover:bg-slate-800 transition-colors"
          >
            <Bell className="w-6 h-6 text-slate-300" />
            {unread && (
              <span className="absolute top-1.5 right-2 w-2.5 h-2.5 bg-red-500 border-2 border-slate-900 rounded-full"></span>
            )}
          </button>

          {/* NOTIFICATION DROPDOWN */}
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-72 md:w-80 bg-slate-800 rounded-xl shadow-2xl border border-slate-700 overflow-hidden">
              <div className="p-3 border-b border-slate-700 flex justify-between items-center bg-slate-900/50">
                <span className="font-semibold text-sm">Notifications</span>
                <span className="text-xs text-slate-400">{notifications.length} recent</span>
              </div>
              
              <div className="max-h-64 overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="p-4 text-center text-sm text-slate-400">No new notifications</div>
                ) : (
                  notifications.map((tx) => {
                    const isSender = tx.senderEmail === user?.email;
                    return (
                      <div key={tx._id} className="p-3 border-b border-slate-700/50 hover:bg-slate-700/50 transition-colors flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${isSender ? 'bg-rose-500/20 text-rose-400' : 'bg-emerald-500/20 text-emerald-400'}`}>
                          {isSender ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownLeft className="w-4 h-4" />}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-white">
                            {isSender ? 'Transfer Sent' : 'Funds Received'}
                          </p>
                          <p className="text-xs text-slate-400">
                            {isSender ? `To ${tx.receiverEmail}` : `From ${tx.senderEmail}`} • ${tx.amount.toFixed(2)}
                          </p>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          )}
        </div>
        
        <div className="flex items-center gap-2 md:border-l border-slate-700 md:pl-6">
          <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center">
            <UserCircle className="w-6 h-6 text-blue-400" />
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;