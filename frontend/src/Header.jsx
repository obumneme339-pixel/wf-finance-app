import React, { useState, useEffect } from 'react';
import { Bell, Menu, ArrowUpRight, ArrowDownLeft } from 'lucide-react';

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
        if (Array.isArray(data)) setNotifications(data.slice(0, 3));
      } catch (err) {
        console.error("Failed to fetch notifications", err);
      }
    };
    fetchNotifications();
  }, [user, API_URL]);

  const handleBellClick = () => {
    setShowNotifications(!showNotifications);
    if (!showNotifications) setUnread(false); 
  };

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 text-gray-900 shrink-0 relative z-50">
      
      <div className="flex-1 flex items-center justify-start">
        <button 
          onClick={toggleMobileMenu} 
          className="md:hidden p-2 -ml-2 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <Menu className="w-6 h-6 text-gray-700" />
        </button>
        <h1 className="text-xl font-bold text-gray-900 hidden md:block">{title}</h1>
      </div>

      {/* WF FINANCE LOGO */}
      <div className="flex-1 flex flex-col items-center justify-center">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 22C12 22 20 18 20 12V5L12 2L4 5V12C4 18 12 22 12 22Z" fill="#0f5e40"/>
          <path d="M12 6C10 6 8 8 8 10C8 13 12 16 12 16C12 16 16 13 16 10C16 8 14 6 12 6Z" fill="#4ade80"/>
          <path d="M12 22C12 22 20 18 20 12V5L12 2L4 5V12C4 18 12 22 12 22Z" stroke="#0f5e40" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        <span className="font-extrabold text-[11px] tracking-[0.2em] text-[#0f5e40] uppercase mt-0.5">WF FINANCE</span>
      </div>
      
      <div className="flex-1 flex items-center justify-end gap-3">
        <div className="relative">
          <button 
            onClick={handleBellClick} 
            className="relative p-2 rounded-full hover:bg-gray-100 transition-colors"
          >
            <Bell className="w-6 h-6 text-gray-600" />
            {unread && (
              <span className="absolute top-1.5 right-2 w-2.5 h-2.5 bg-red-500 border-2 border-white rounded-full"></span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-72 md:w-80 bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden">
              <div className="p-3 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
                <span className="font-bold text-sm text-gray-800">Notifications</span>
              </div>
              
              <div className="max-h-64 overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="p-4 text-center text-sm text-gray-500">No new notifications</div>
                ) : (
                  notifications.map((tx) => {
                    const isSender = tx.senderEmail === user?.email;
                    return (
                      <div key={tx._id} className="p-3 border-b border-gray-100 hover:bg-gray-50 transition-colors flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${isSender ? 'bg-red-100 text-red-600' : 'bg-emerald-100 text-emerald-600'}`}>
                          {isSender ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownLeft className="w-4 h-4" />}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-gray-800">
                            {isSender ? 'Transfer Sent' : 'Funds Received'}
                          </p>
                          <p className="text-xs text-gray-500">
                            {isSender ? `To ${tx.receiverEmail}` : `From ${tx.senderEmail}`} • £{tx.amount.toFixed(2)}
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
        
        <div className="w-9 h-9 rounded-full bg-slate-900 flex items-center justify-center cursor-pointer shadow-sm border border-gray-200">
           <span className="font-bold text-sm text-white">{userName.charAt(0)}</span>
        </div>
      </div>
    </header>
  );
}

export default Header;