import React, { useState } from 'react';
import { ArrowLeft, ArrowRightLeft, ShieldCheck, Info, Search, ArrowRight } from 'lucide-react';

function InternalTransfer({ user, setUser, setCurrentView }) {
  const [accountNumber, setAccountNumber] = useState('');
  const [recipientName, setRecipientName] = useState('');
  const [isVerified, setIsVerified] = useState(false);
  const [amount, setAmount] = useState('');
  const [pin, setPin] = useState('');
  const [description, setDescription] = useState('');
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  const handleVerify = async () => {
    if (!accountNumber) return;
    setError('');
    setIsLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/transaction/verify-account`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ accountNumber }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      
      setRecipientName(data.name);
      setIsVerified(true);
    } catch (err) {
      setError(err.message);
      setIsVerified(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTransfer = async (e) => {
    e.preventDefault();
    if (!isVerified) return setError("Please verify the recipient account first.");
    if (pin.length !== 6) return setError("PIN must be 6 digits.");

    setIsLoading(true);
    setError('');

    try {
      const response = await fetch(`${API_URL}/api/transaction/internal-transfer`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: user.email,
          recipientAccountNumber: accountNumber,
          amount: Number(amount),
          pin,
          description
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
      <div className="p-8 max-w-lg mx-auto min-h-screen flex flex-col items-center justify-center text-center bg-[#f8fafc]">
        <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mb-6">
          <ShieldCheck className="w-10 h-10 text-emerald-600" />
        </div>
        <h2 className="text-2xl font-extrabold text-gray-900 mb-2">Transfer Successful</h2>
        <p className="text-gray-500 mb-8">You have sent £{Number(amount).toFixed(2)} to {recipientName}.</p>
        <button onClick={() => setCurrentView('dashboard')} className="w-full bg-[#0f5e40] text-white font-bold py-4 rounded-xl shadow-md">
          Back to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] pb-10">
      {/* Header */}
      <div className="flex items-center gap-4 p-4 bg-white border-b border-gray-100">
        <button onClick={() => setCurrentView('dashboard')} className="p-2 bg-gray-50 rounded-xl">
          <ArrowLeft className="w-5 h-5 text-gray-700" />
        </button>
        <div>
          <h1 className="text-xl font-extrabold text-gray-900 tracking-tight">Internal Transfer</h1>
          <p className="text-xs text-gray-500 font-medium">Transfer funds between accounts instantly</p>
        </div>
      </div>

      <div className="p-4 max-w-lg mx-auto mt-2 space-y-5">
        {/* Balance Card */}
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex justify-between items-center">
          <div>
            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">Available Balance</p>
            <h2 className="text-2xl font-extrabold text-gray-900">£{user.balance.toFixed(2)}</h2>
            <p className="text-xs text-gray-500 mt-1 font-medium">Account: {user.accountNumber || '95942587664'}</p>
          </div>
          <div className="w-12 h-12 bg-[#e6f4ea] rounded-xl flex items-center justify-center">
            <ArrowRightLeft className="w-5 h-5 text-[#0f5e40]" />
          </div>
        </div>

        {error && <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm border border-red-100">{error}</div>}

        <form onSubmit={handleTransfer} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-6">
          
          {/* Recipient Details */}
          <div>
            <h3 className="text-[11px] font-extrabold text-gray-500 tracking-widest uppercase mb-3">Recipient Account</h3>
            <label className="block text-sm font-medium text-gray-700 mb-1">Account Number <span className="text-red-500">*</span></label>
            <div className="flex gap-2">
              <input 
                type="text" 
                value={accountNumber}
                onChange={(e) => { setAccountNumber(e.target.value); setIsVerified(false); }}
                className="w-full bg-white border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:border-[#0f5e40]"
                placeholder="Enter recipient account number"
                required
              />
              <button type="button" onClick={handleVerify} className="bg-[#88c5a8] hover:bg-[#72b393] text-white px-4 rounded-xl font-bold text-sm flex items-center gap-1 transition-colors">
                <Search className="w-4 h-4" /> Verify
              </button>
            </div>
            {isVerified && <p className="text-xs text-emerald-600 font-bold mt-2">Verified: {recipientName}</p>}
            <p className="text-[11px] text-gray-500 mt-2 flex items-center gap-1"><Info className="w-3 h-3" /> Internal transfers are instant and free of charge.</p>
          </div>

          <hr className="border-gray-100" />

          {/* Amount */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Transfer Amount <span className="text-red-500">*</span></label>
            <div className="relative mb-3">
              <span className="absolute left-4 top-3 text-gray-500 font-bold">£</span>
              <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} className="w-full bg-white border border-gray-200 rounded-xl p-3 pl-8 text-xl font-bold text-gray-900 focus:outline-none focus:border-[#0f5e40]" placeholder="0.00" required />
            </div>
            <div className="flex gap-2">
              {[100, 500, 1000].map(val => (
                <button type="button" key={val} onClick={() => setAmount(val)} className="flex-1 bg-[#e6f4ea] hover:bg-[#d1e7dd] text-[#0f5e40] font-bold py-2 rounded-xl text-sm transition-colors">
                  £{val}
                </button>
              ))}
              <button type="button" onClick={() => setAmount(user.balance)} className="flex-1 bg-[#e6f4ea] hover:bg-[#d1e7dd] text-[#0f5e40] font-bold py-2 rounded-xl text-sm transition-colors">
                All
              </button>
            </div>
          </div>

          <hr className="border-gray-100" />

          {/* Security & Details */}
          <div>
            <h3 className="text-[11px] font-extrabold text-gray-500 tracking-widest uppercase mb-3">Security & Details</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Transaction PIN <span className="text-red-500">*</span></label>
                <input type="password" maxLength="6" value={pin} onChange={(e) => setPin(e.target.value)} className="w-full bg-white border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:border-[#0f5e40] tracking-[0.3em]" placeholder="Enter your PIN" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description / Note (Optional)</label>
                <textarea value={description} onChange={(e) => setDescription(e.target.value)} className="w-full bg-white border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:border-[#0f5e40] resize-none h-20" placeholder="Purpose of transfer..." />
              </div>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={() => setCurrentView('dashboard')} className="w-1/3 bg-gray-50 hover:bg-gray-100 text-gray-700 font-bold py-4 rounded-xl transition-colors">
              Cancel
            </button>
            <button type="submit" disabled={isLoading || !isVerified} className="w-2/3 bg-[#88c5a8] hover:bg-[#72b393] text-white font-extrabold py-4 rounded-xl transition-colors flex items-center justify-center gap-2 shadow-sm disabled:opacity-50">
              {isLoading ? 'Processing...' : 'Review Transfer'} <ArrowRight className="w-5 h-5" />
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}

export default InternalTransfer;