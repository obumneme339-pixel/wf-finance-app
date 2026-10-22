import React, { useState } from 'react';
import { ArrowLeft, ArrowLeftRight, User, Landmark, Banknote, ShieldCheck, Eye, EyeOff } from 'lucide-react';

function InternationalTransfer({ user, setUser, setCurrentView }) {
  const [formData, setFormData] = useState({
    holderName: '', accountNumber: '', iban: '', bankName: '', swift: '',
    country: '', bankAddress: '', accountType: '', amount: '', purpose: '', pin: ''
  });

  const [showPin, setShowPin] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.pin.length !== 6) {
      return setError("Please enter your 6-digit PIN.");
    }

    setIsLoading(true);

    try {
      const response = await fetch(`${API_URL}/api/transaction/wire-transfer`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: user.email,
          amount: Number(formData.amount),
          pin: formData.pin,
          beneficiaryName: formData.holderName,
          accountNumber: formData.accountNumber,
          bankName: formData.bankName
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
      <div className="p-8 max-w-lg mx-auto min-h-screen flex flex-col items-center justify-center text-center">
        <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mb-6">
          <ShieldCheck className="w-10 h-10 text-emerald-600" />
        </div>
        <h2 className="text-2xl font-extrabold text-gray-900 mb-2">Transfer Authorized</h2>
        <p className="text-gray-500 mb-8">Your wire transfer of £{Number(formData.amount).toFixed(2)} to {formData.holderName} is being processed.</p>
        <button onClick={() => setCurrentView('dashboard')} className="w-full bg-[#0f5e40] text-white font-bold py-4 rounded-xl shadow-md">
          Back to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pb-10">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#e6f4ea] rounded-xl flex items-center justify-center">
            <ArrowLeftRight className="w-5 h-5 text-[#0f5e40]" />
          </div>
          <div>
            <h1 className="text-lg font-extrabold text-gray-900">Send Money via Wire</h1>
            <p className="text-xs text-gray-500">Secure international transfer</p>
          </div>
        </div>
        <button onClick={() => setCurrentView('dashboard')} className="text-gray-400 hover:text-gray-700">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
        </button>
      </div>

      <form onSubmit={handleSubmit} className="p-4 max-w-lg mx-auto space-y-5">
        {error && <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm border border-red-100 text-center">{error}</div>}

        {/* Beneficiary Info */}
        <div className="bg-[#f8fafc] p-5 rounded-2xl border border-gray-100">
          <h3 className="text-sm font-extrabold text-gray-900 mb-4 flex items-center gap-2">
            <User className="w-4 h-4 text-[#0f5e40]" /> Beneficiary Information
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-[10px] font-bold text-gray-500 mb-1 tracking-wider">ACCOUNT HOLDER NAME</label>
              <input type="text" name="holderName" onChange={handleChange} className="w-full bg-white border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:border-[#0f5e40]" placeholder="John Smith" required />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] font-bold text-gray-500 mb-1 tracking-wider">ACCOUNT NUMBER</label>
                <input type="text" name="accountNumber" onChange={handleChange} className="w-full bg-white border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:border-[#0f5e40]" placeholder="123456789" required />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-gray-500 mb-1 tracking-wider">IBAN</label>
                <input type="text" name="iban" onChange={handleChange} className="w-full bg-white border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:border-[#0f5e40]" placeholder="GB29NWBK601..." required />
              </div>
            </div>
          </div>
        </div>

        {/* Bank Details */}
        <div className="bg-white p-5 rounded-2xl border border-gray-100">
          <h3 className="text-sm font-extrabold text-gray-900 mb-4 flex items-center gap-2">
            <Landmark className="w-4 h-4 text-amber-500" /> Bank Details
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-[10px] font-bold text-gray-500 mb-1 tracking-wider">BANK NAME</label>
              <input type="text" name="bankName" onChange={handleChange} className="w-full bg-white border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:border-[#0f5e40]" placeholder="Bank of America" required />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] font-bold text-gray-500 mb-1 tracking-wider">SWIFT / BIC CODE</label>
                <input type="text" name="swift" onChange={handleChange} className="w-full bg-white border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:border-[#0f5e40]" placeholder="BOFAUS3N" required />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-gray-500 mb-1 tracking-wider">COUNTRY</label>
                <input type="text" name="country" onChange={handleChange} className="w-full bg-white border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:border-[#0f5e40]" placeholder="United States" required />
              </div>
            </div>
            <div>
              <label className="block text-[10px] font-bold text-gray-500 mb-1 tracking-wider">BANK ADDRESS</label>
              <input type="text" name="bankAddress" onChange={handleChange} className="w-full bg-white border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:border-[#0f5e40]" placeholder="100 N Tryon St, Charlotte" required />
            </div>
          </div>
        </div>

        {/* Transfer Amount */}
        <div className="bg-[#f4faf7] p-5 rounded-2xl border border-emerald-100">
          <h3 className="text-sm font-extrabold text-gray-900 mb-4 flex items-center gap-2">
            <Banknote className="w-4 h-4 text-[#0f5e40]" /> Transfer Amount
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-[10px] font-bold text-gray-500 mb-1 tracking-wider">AMOUNT TO SEND</label>
              <div className="relative">
                <span className="absolute left-4 top-3 text-[#0f5e40] font-bold text-lg">£</span>
                <input type="number" name="amount" onChange={handleChange} className="w-full bg-white border-2 border-[#0f5e40] rounded-xl p-3 pl-8 text-2xl font-extrabold text-gray-900 focus:outline-none" placeholder="0.00" required />
              </div>
              <p className="text-xs text-gray-500 mt-2 font-medium">Available: £{user.balance.toFixed(2)}</p>
            </div>
            <div>
              <label className="block text-[10px] font-bold text-gray-500 mb-1 tracking-wider">TRANSFER PURPOSE (OPTIONAL)</label>
              <textarea name="purpose" onChange={handleChange} className="w-full bg-white border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:border-[#0f5e40] resize-none h-20" placeholder="Invoice payment, personal transfer, etc." />
            </div>
          </div>
        </div>

        {/* Secure Transaction */}
        <div className="bg-[#fffbf0] p-5 rounded-2xl border border-amber-100">
          <h3 className="text-sm font-extrabold text-gray-900 mb-1 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-amber-500" /> Secure Transaction
          </h3>
          <p className="text-xs text-gray-500 mb-3">Enter your PIN to authorize this transfer</p>
          <div className="relative">
            <input 
              type={showPin ? "text" : "password"} 
              name="pin" 
              maxLength="6" 
              onChange={handleChange} 
              className="w-full bg-white border-2 border-amber-400 rounded-xl p-3 tracking-[0.5em] text-center text-xl font-mono text-gray-900 focus:outline-none" 
              placeholder="••••••" 
              required 
            />
            <button type="button" onClick={() => setShowPin(!showPin)} className="absolute right-3 top-3 text-gray-400">
              {showPin ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Submit Button */}
        <button type="submit" disabled={isLoading} className="w-full bg-[#88c5a8] hover:bg-[#72b393] text-white font-extrabold py-4 rounded-xl transition-colors flex items-center justify-center gap-2 shadow-sm disabled:opacity-50 mt-4">
          <ShieldCheck className="w-5 h-5" /> {isLoading ? 'Authorizing...' : 'Authorize & Send Money'}
        </button>

        <div className="flex items-center justify-center gap-1 text-[10px] text-gray-400 mt-2">
          <ShieldCheck className="w-3 h-3" /> Your transaction is secured with bank-grade encryption
        </div>

      </form>
    </div>
  );
}

export default InternationalTransfer;