import React, { useState } from 'react';
import { ArrowLeftRight, X, Mail, Banknote, Info, Send } from 'lucide-react';

function PayPalTransfer({ user, setUser, setCurrentView }) {
  const [email, setEmail] = useState('');
  const [amount, setAmount] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await fetch(`${API_URL}/api/transaction/external-transfer`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: user.email,
          amount: Number(amount),
          platform: 'PayPal',
          recipientAccount: email,
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message);

      localStorage.setItem('wfUser', JSON.stringify(data.user));
      setUser(data.user);
      setSuccess(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="p-8 max-w-lg mx-auto min-h-screen flex flex-col items-center justify-center text-center bg-gray-50">
        <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mb-6">
          <Send className="w-10 h-10 text-emerald-600" />
        </div>
        <h2 className="text-2xl font-extrabold text-gray-900 mb-2">Sent to PayPal</h2>
        <p className="text-gray-500 mb-8">Your transfer of £{Number(amount).toFixed(2)} to {email} is being processed.</p>
        <button onClick={() => setCurrentView('dashboard')} className="w-full bg-[#0f5e40] text-white font-bold py-4 rounded-xl shadow-md">
          Back to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-10">
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-white border-b border-gray-100 sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#e6f4ea] rounded-xl flex items-center justify-center">
            <ArrowLeftRight className="w-5 h-5 text-[#0f5e40]" />
          </div>
          <div>
            <h1 className="text-lg font-extrabold text-gray-900">Send Money via PayPal</h1>
            <p className="text-xs text-gray-500">Secure international transfer</p>
          </div>
        </div>
        <button onClick={() => setCurrentView('dashboard')} className="text-gray-400 hover:text-gray-700 bg-gray-100 p-2 rounded-lg">
          <X className="w-5 h-5" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="p-4 max-w-lg mx-auto space-y-5 mt-2">
        {error && <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm border border-red-100 text-center">{error}</div>}

        {/* Recipient */}
        <div className="bg-[#f8fafc] p-5 rounded-2xl border border-gray-100">
          <h3 className="text-sm font-extrabold text-gray-900 mb-4 flex items-center gap-2">
            <Mail className="w-4 h-4 text-[#3b82f6]" /> PayPal Recipient
          </h3>
          <div>
            <label className="block text-[10px] font-bold text-gray-500 mb-1 tracking-wider">PAYPAL EMAIL ADDRESS</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-white border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:border-[#0f5e40]" placeholder="recipient@example.com" required />
            <p className="text-xs text-gray-500 mt-2">Enter the recipient's PayPal email address</p>
          </div>
        </div>

        {/* Amount */}
        <div className="bg-[#f4faf7] p-5 rounded-2xl border border-emerald-100">
          <h3 className="text-sm font-extrabold text-gray-900 mb-4 flex items-center gap-2">
            <Banknote className="w-4 h-4 text-[#0f5e40]" /> Transfer Amount
          </h3>
          <div>
            <label className="block text-[10px] font-bold text-gray-500 mb-1 tracking-wider">AMOUNT TO SEND</label>
            <div className="relative">
              <span className="absolute left-4 top-3 text-[#0f5e40] font-bold text-lg">£</span>
              <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} className="w-full bg-white border-2 border-[#0f5e40] rounded-xl p-3 pl-8 text-2xl font-extrabold text-gray-900 focus:outline-none" placeholder="0.00" required />
            </div>
            <p className="text-xs text-gray-500 mt-2 font-medium">Available: £{user.balance.toFixed(2)}</p>
          </div>
        </div>

        {/* Info Banner */}
        <div className="bg-blue-50 p-4 rounded-2xl border border-blue-100 flex items-start gap-3">
          <Info className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-blue-800 font-medium leading-relaxed">
            Funds will be sent directly to the recipient's PayPal account. Processing typically takes a few minutes.
          </p>
        </div>

        {/* Submit */}
        <button type="submit" disabled={isLoading} className="w-full bg-[#88c5a8] hover:bg-[#72b393] text-white font-extrabold py-4 rounded-xl transition-colors flex items-center justify-center gap-2 shadow-sm disabled:opacity-50 mt-4">
          <Send className="w-5 h-5" /> {isLoading ? 'Processing...' : 'Send to PayPal'}
        </button>
      </form>
    </div>
  );
}

export default PayPalTransfer;