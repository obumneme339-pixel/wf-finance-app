import React, { useState } from 'react';
import { ArrowLeftRight, X, Info, ShieldCheck, Eye, EyeOff, Send } from 'lucide-react';

const COIN_CONFIG = {
  btc: { name: 'Bitcoin', symbol: 'BTC', decimals: 8, color: '#F7931A' },
  eth: { name: 'Ethereum', symbol: 'ETH', decimals: 6, color: '#627EEA' },
  usdt: { name: 'Tether', symbol: 'USDT', decimals: 2, color: '#26A17B' },
};

function CryptoTransfer({ user, setUser, setCurrentView, cryptoType }) {
  const [walletAddress, setWalletAddress] = useState('');
  const [recipientName, setRecipientName] = useState('');
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  const [pin, setPin] = useState('');
  const [showPin, setShowPin] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
  const coin = COIN_CONFIG[cryptoType] || COIN_CONFIG['btc'];

  const availableBalance = user.crypto?.[cryptoType] || 0;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (pin.length !== 6) {
      return setError("Please enter your 6-digit PIN.");
    }
    if (Number(amount) > availableBalance) {
      return setError(`Insufficient ${coin.symbol} balance.`);
    }

    setIsLoading(true);

    try {
      const response = await fetch(`${API_URL}/api/transaction/crypto-transfer`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: user.email,
          cryptoType: cryptoType,
          amount: Number(amount),
          walletAddress,
          pin
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
        <h2 className="text-2xl font-extrabold text-gray-900 mb-2">Sent {coin.name}</h2>
        <p className="text-gray-500 mb-8">Your transfer of {amount} {coin.symbol} is being processed.</p>
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
            <h1 className="text-lg font-extrabold text-gray-900">Send Money via {coin.name}</h1>
            <p className="text-xs text-gray-500">Secure international transfer</p>
          </div>
        </div>
        <button onClick={() => setCurrentView('dashboard')} className="text-gray-400 hover:text-gray-700 bg-gray-100 p-2 rounded-lg">
          <X className="w-5 h-5" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="p-4 max-w-lg mx-auto space-y-5 mt-2">
        {error && <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm border border-red-100 text-center">{error}</div>}

        {/* Recipient Wallet */}
        <div className="bg-[#f8fafc] p-5 rounded-2xl border border-gray-100">
          <h3 className="text-sm font-extrabold text-gray-900 mb-4 flex items-center gap-2">
            <div className="w-5 h-5 rounded-full flex items-center justify-center text-white text-[10px] font-bold" style={{ backgroundColor: coin.color }}>
              {coin.symbol[0]}
            </div>
            {coin.name} Recipient
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-[10px] font-bold text-gray-500 mb-1 tracking-wider">RECIPIENT'S {coin.symbol} WALLET ADDRESS</label>
              <input type="text" value={walletAddress} onChange={(e) => setWalletAddress(e.target.value)} className="w-full bg-white border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:border-[#0f5e40] font-mono" placeholder="Enter wallet address" required />
              <p className="text-[11px] text-gray-500 mt-2 flex items-center gap-1">
                <Info className="w-3 h-3" /> Ensure the address is correct. {coin.name} transactions cannot be reversed.
              </p>
            </div>
            <div>
              <label className="block text-[10px] font-bold text-gray-500 mb-1 tracking-wider">RECIPIENT NAME (OPTIONAL)</label>
              <input type="text" value={recipientName} onChange={(e) => setRecipientName(e.target.value)} className="w-full bg-white border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:border-[#0f5e40]" placeholder="John Doe" />
            </div>
          </div>
        </div>

        {/* Amount */}
        <div className="bg-[#f4faf7] p-5 rounded-2xl border border-emerald-100">
          <h3 className="text-sm font-extrabold text-gray-900 mb-4 flex items-center gap-2">
            <div className="w-5 h-5 rounded-full flex items-center justify-center text-white text-[10px] font-bold" style={{ backgroundColor: coin.color }}>
              {coin.symbol[0]}
            </div>
            Transfer Amount
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-[10px] font-bold text-gray-500 mb-1 tracking-wider">AMOUNT TO SEND ({coin.symbol})</label>
              <div className="relative">
                <span className="absolute left-4 top-3 text-gray-800 font-bold text-sm">{coin.symbol}</span>
                <input type="number" step="any" value={amount} onChange={(e) => setAmount(e.target.value)} className="w-full bg-white border-2 border-[#0f5e40] rounded-xl p-3 pl-14 text-2xl font-extrabold text-gray-900 focus:outline-none" placeholder={`0.${'0'.repeat(coin.decimals)}`} required />
              </div>
              <p className="text-xs text-gray-500 mt-2 font-medium">Available: {availableBalance.toFixed(coin.decimals)} {coin.symbol}</p>
            </div>
            <div>
              <label className="block text-[10px] font-bold text-gray-500 mb-1 tracking-wider">TRANSFER NOTE (OPTIONAL)</label>
              <textarea value={note} onChange={(e) => setNote(e.target.value)} className="w-full bg-white border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:border-[#0f5e40] resize-none h-20" placeholder="Payment reference or note" />
            </div>
          </div>
        </div>

        {/* Security Notice */}
        <div className="bg-[#f4faf7] p-4 rounded-2xl border border-emerald-100 flex items-start gap-3">
          <ShieldCheck className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-extrabold text-gray-900 mb-1">Important Security Notice</p>
            <p className="text-xs text-gray-600 leading-relaxed">
              Double-check the wallet address. Cryptocurrency transfers are irreversible and cannot be refunded once confirmed.
            </p>
          </div>
        </div>

        {/* Secure Transaction (PIN) */}
        <div className="bg-[#fffbf0] p-5 rounded-2xl border border-amber-100">
          <h3 className="text-sm font-extrabold text-gray-900 mb-1 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-amber-500" /> Secure Transaction
          </h3>
          <p className="text-xs text-gray-500 mb-3">Enter your PIN to authorize this transfer</p>
          <div className="relative">
            <input 
              type={showPin ? "text" : "password"} 
              maxLength="6" 
              value={pin}
              onChange={(e) => setPin(e.target.value)} 
              className="w-full bg-white border-2 border-amber-400 rounded-xl p-3 tracking-[0.5em] text-center text-xl font-mono text-gray-900 focus:outline-none" 
              placeholder="••••••" 
              required 
            />
            <button type="button" onClick={() => setShowPin(!showPin)} className="absolute right-3 top-3 text-gray-400 hover:text-gray-700">
              {showPin ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Submit */}
        <button type="submit" disabled={isLoading} className="w-full bg-[#88c5a8] hover:bg-[#72b393] text-white font-extrabold py-4 rounded-xl transition-colors flex items-center justify-center gap-2 shadow-sm disabled:opacity-50 mt-4">
          <Send className="w-5 h-5" /> {isLoading ? 'Processing...' : `Send ${coin.name}`}
        </button>
      </form>
    </div>
  );
}

export default CryptoTransfer;