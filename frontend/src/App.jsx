import React, { useState } from 'react';
import { ArrowLeft, Mail, ShieldCheck } from 'lucide-react';

function PayPalTransfer({ user, setUser, setCurrentView }) {
  const [paypalEmail, setPaypalEmail] = useState('');
  const [amount, setAmount] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  const handleTransfer = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsLoading(true);

    try {
      const response = await fetch(`${API_URL}/api/transaction/external-transfer`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          email: user.email, 
          amount: Number(amount), 
          platform: 'PayPal', 
          recipientAccount: paypalEmail 
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message);

      setSuccess(`Successfully sent $${amount} to ${paypalEmail}`);
      localStorage.setItem('wfUser', JSON.stringify(data.user));
      setUser(data.user);
      setAmount('');
      setPaypalEmail('');

    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-4 md:p-8 max-w-lg mx-auto text-gray-900 min-h-screen bg-[#f8fafc]">
      <button 
        onClick={() => setCurrentView('dashboard')}
        className="flex items-center gap-2 text-gray-500 hover:text-gray-900 mb-6 font-medium transition-colors"
      >
        <ArrowLeft className="w-5 h-5" /> Back
      </button>

      <div className="flex items-center gap-3 mb-8">
        <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
          <img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" alt="PayPal" className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Send via PayPal</h2>
          <p className="text-sm text-gray-500">Secure international transfer</p>
        </div>
      </div>

      {error && <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-6 text-sm border border-red-100">{error}</div>}
      {success && <div className="bg-emerald-50 text-emerald-600 p-3 rounded-lg mb-6 text-sm border border-emerald-100">{success}</div>}

      <form onSubmit={handleTransfer} className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 space-y-6">
        
        <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
          <label className="block text-sm font-bold text-gray-700 mb-2">PayPal Recipient</label>
          <div className="relative">
            <Mail className="w-5 h-5 absolute left-3 top-3.5 text-gray-400" />
            <input 
              type="email" 
              value={paypalEmail}
              onChange={(e) => setPaypalEmail(e.target.value)}
              className="w-full bg-white border border-gray-300 rounded-lg p-3 pl-10 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="recipient@example.com"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">Transfer Amount</label>
          <div className="relative">
            <span className="absolute left-4 top-3 text-gray-500 font-bold">$</span>
            <input 
              type="number" 
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full bg-white border border-gray-300 rounded-lg p-3 pl-8 text-2xl font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="0.00"
              required
              min="1"
              max={user.balance}
            />
          </div>
          <p className="text-xs text-gray-500 mt-2">Available: ${user.balance.toFixed(2)}</p>
        </div>

        <div className="bg-blue-50 text-blue-700 p-4 rounded-xl text-xs flex items-start gap-3">
          <ShieldCheck className="w-5 h-5 flex-shrink-0" />
          <p>Funds will be sent directly to the recipient's PayPal account.</p>
        </div>

        <button 
          type="submit" 
          disabled={isLoading}
          className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-4 rounded-xl transition-all shadow-md disabled:opacity-50"
        >
          {isLoading ? 'Processing...' : 'Send to PayPal'}
        </button>

      </form>
    </div>
  );
}

export default PayPalTransfer;