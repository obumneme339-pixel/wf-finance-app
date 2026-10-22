import React from 'react';
import { Home, Activity, Send, CreditCard, User } from 'lucide-react';

function BottomNav({ currentView, setCurrentView }) {
  const navItems = [
    { id: 'dashboard', label: 'Home', icon: Home },
    { id: 'transactions', label: 'Activity', icon: Activity },
    { id: 'transfer', label: 'Transfer', icon: Send, isPrimary: true },
    { id: 'cards', label: 'Cards', icon: CreditCard }, // We can build this page later
    { id: 'profile', label: 'Account', icon: User },
  ];

  return (
    <div className="fixed bottom-0 w-full bg-white border-t border-gray-100 pb-safe z-50">
      <div className="flex justify-around items-center h-16 max-w-lg mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;

          if (item.isPrimary) {
            return (
              <button
                key={item.id}
                onClick={() => setCurrentView(item.id)}
                className="flex flex-col items-center justify-center -mt-6 bg-[#0f5e40] text-white w-14 h-14 rounded-full shadow-lg border-4 border-white transition-transform hover:scale-105"
              >
                <Icon className="w-6 h-6" />
              </button>
            );
          }

          return (
            <button
              key={item.id}
              onClick={() => setCurrentView(item.id)}
              className={`flex flex-col items-center justify-center w-full h-full space-y-1 ${
                isActive ? 'text-[#0f5e40]' : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'fill-[#0f5e40]/10' : ''}`} />
              <span className={`text-[10px] font-medium ${isActive ? 'font-bold' : ''}`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default BottomNav;