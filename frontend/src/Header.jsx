import React from 'react';
import { Bell, Search, UserCircle, Menu } from 'lucide-react';

function Header({ title, userName, toggleMobileMenu }) {
  return (
    <header className="h-20 bg-slate-900 border-b border-slate-800 flex items-center justify-between px-4 md:px-8 text-white shrink-0">
      <div className="flex items-center gap-4">
        {/* Hamburger Menu Button - Only visible on mobile */}
        <button 
          onClick={toggleMobileMenu}
          className="md:hidden p-2 rounded-lg hover:bg-slate-800 transition-colors"
        >
          <Menu className="w-6 h-6 text-slate-300" />
        </button>
        
        <h1 className="text-2xl font-bold">{title}</h1>
      </div>
      
      <div className="flex items-center gap-4 md:gap-6">
        {/* Search Bar - Hidden on small mobile */}
        <div className="relative hidden lg:block">
          <Search className="w-5 h-5 absolute left-3 top-2.5 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search..." 
            className="bg-slate-800 border border-slate-700 rounded-full py-2 pl-10 pr-4 text-sm focus:outline-none focus:border-blue-500 w-64"
          />
        </div>
        
        <button className="relative p-2 rounded-full hover:bg-slate-800 transition-colors hidden sm:block">
          <Bell className="w-6 h-6 text-slate-300" />
          <span className="absolute top-1 right-2 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>
        
        <div className="flex items-center gap-3 border-l border-slate-700 pl-4 md:pl-6">
          <UserCircle className="w-8 h-8 text-blue-400" />
          <span className="font-medium hidden sm:block">{userName}</span>
        </div>
      </div>
    </header>
  );
}

export default Header;