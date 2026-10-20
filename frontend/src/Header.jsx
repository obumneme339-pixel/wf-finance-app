import React from 'react';
import { Bell, Search, UserCircle } from 'lucide-react';

function Header({ title, userName }) {
  return (
    <header className="h-20 bg-slate-900 border-b border-slate-800 flex items-center justify-between px-8 text-white shrink-0">
      <div>
        <h1 className="text-2xl font-bold">{title}</h1>
      </div>
      
      <div className="flex items-center gap-6">
        <div className="relative hidden md:block">
          <Search className="w-5 h-5 absolute left-3 top-2.5 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search..." 
            className="bg-slate-800 border border-slate-700 rounded-full py-2 pl-10 pr-4 text-sm focus:outline-none focus:border-blue-500 w-64"
          />
        </div>
        
        <button className="relative p-2 rounded-full hover:bg-slate-800 transition-colors">
          <Bell className="w-6 h-6 text-slate-300" />
          <span className="absolute top-1 right-2 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>
        
        <div className="flex items-center gap-3 border-l border-slate-700 pl-6">
          <UserCircle className="w-8 h-8 text-blue-400" />
          <span className="font-medium">{userName}</span>
        </div>
      </div>
    </header>
  );
}

export default Header;