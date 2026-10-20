import React, { useState } from 'react';
import { Settings as SettingsIcon, Save } from 'lucide-react';

function Settings({ user, setUser }) {
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // NEW LINE FOR DEPLOYMENT
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    setIsLoading(true);

    try {
      const response = await fetch(`${API_URL}/api/user/update`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id, name, email, newPassword }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to update profile');
      }

      localStorage.setItem('wfUser', JSON.stringify(data.user));
      setUser(data.user);
      setMessage(data.message);
      setNewPassword(''); 

    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-8 text-white max-w-2xl mx-auto">
      <div className="mb-8">
        <h2 className="text-3xl font-bold flex items-center gap-3">
          <SettingsIcon className="text-blue-400" /> Account Settings
        </h2>
        <p className="text-slate-400 mt-1">Update your personal information and password.</p>
      </div>

      <div className="bg-slate-900 p-8 rounded-2xl border border-slate-800 shadow-xl">
        {message && <div className="bg-green-500/20 border border-green-500 text-green-400 p-3 rounded-lg mb-6 text-sm text-center">{message}</div>}
        {error && <div className="bg-red-500/20 border border-red-500 text-red-400 p-3 rounded-lg mb-6 text-sm text-center">{error}</div>}

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          
          <div>
            <label className="block text-sm text-slate-400 mb-2">Full Name</label>
            <input 
              type="text" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-white focus:outline-none focus:border-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm text-slate-400 mb-2">Email Address</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-white focus:outline-none focus:border-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm text-slate-400 mb-2">New Password <span className="text-xs text-slate-500">(Leave blank to keep current password)</span></label>
            <input 
              type="password" 
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-white focus:outline-none focus:border-blue-500"
              placeholder="••••••••"
            />
          </div>

          <button 
            type="submit" 
            disabled={isLoading}
            className="mt-4 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition-colors disabled:opacity-50"
          >
            <Save className="w-5 h-5" /> {isLoading ? 'Saving...' : 'Save Changes'}
          </button>

        </form>
      </div>
    </div>
  );
}

export default Settings;