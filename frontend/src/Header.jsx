import React from 'react';
import { Bell, UserCircle, Menu } from 'lucide-react';

function Header({ title, userName, toggleMobileMenu }) {
  return (
    <header className="h-16 md:h-20 bg-slate-900 border-b border-slate-800 flex items-center justify-between px-4 md:px-8 text-white shrink-0">
      <div className="flex items-center gap-3">
        {/* Hamburger Menu */}
        <button 
          onClick={toggleMobileMenu}
          className="p-2 -ml-2 rounded-lg hover:bg-slate-800 transition-colors"
        >
          <Menu className="w-6 h-6 text-slate-300" />
        </button>
        
        {/* Mobile Logo (Hides the "Dashboard" text on mobile) */}
        <div className="flex items-center gap-2 md:hidden">
          <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center text-sm">🏦</div>
          <span className="font-bold text-lg">WF Finance</span>
        </div>

        {/* Desktop Title */}
        <h1 className="text-2xl font-bold hidden md:block">{title}</h1>
      </div>
      
      <div className="flex items-center gap-3 md:gap-6">
        <button className="relative p-2 rounded-full hover:bg-slate-800 transition-colors">
          <Bell className="w-6 h-6 text-slate-300" />
          <span className="absolute top-1 right-2 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>
        
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