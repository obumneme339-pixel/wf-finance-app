import React, { useState } from 'react';
import { ArrowLeft, Wallet, ShieldCheck, CheckCircle2, Info, ArrowRight, HelpCircle, Banknote } from 'lucide-react';

const PAYMENT_METHODS = [
  { id: 'usdt', name: 'USDT', subtitle: 'Secure and fast processing' },
  { id: 'ltc', name: 'Litecoin', subtitle: 'Secure and fast processing' },
  { id: 'eth', name: 'Ethereum', subtitle: 'Secure and fast processing' },
  { id: 'btc', name: 'Bitcoin', subtitle: 'Secure and fast processing' },
];

function Deposit({ user, setUser, setCurrentView }) {
  const [selectedMethod, setSelectedMethod] = useState('usdt');
  const [amount, setAmount] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  const handleDeposit = async (e) => {
    e.preventDefault();
    setError('');

    const depositAmount = Number(amount);
    if (depositAmount < 10) {
      return setError("Minimum deposit is $10.00");
    }

    setIsProcessing(true);

    // Simulate processing delay
    setTimeout(async () => {
      try {
        const response = await fetch(`${API_URL}/api/transaction/deposit`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: user.email, amount: depositAmount }),
        });
        
        const data = await response.json();
        if (!response.ok) throw new Error(data.message);

        localStorage.setItem('wfUser', JSON.stringify(data.user));
        setUser(data.user);
        
        setIsProcessing(false);
        setIsSuccess(true);
        
      } catch (err) {
        setError(err.message);
        setIsProcessing(false);
      }
    }, 2000);
  };

  // Success Screen
  if (isSuccess) {
    return (
      <div className="p-8 max-w-lg mx-auto min-h-screen flex flex-col items-center justify-center text-center bg-white">
        <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mb-6">
          <CheckCircle2 className="w-10 h-10 text-[#0f5e40]" />
        </div>
        <h2 className="text-2xl font-extrabold text-gray-900 mb-2">Deposit Successful</h2>
        <p className="text-gray-500 mb-8">
          Your account has been funded with <span className="font-bold text-gray-900">${Number(amount).toFixed(2)}</span>.
        </p>
        <button 
          onClick={() => setCurrentView('dashboard')} 
          className="w-full bg-[#0f5e40] text-white font-extrabold py-4 rounded-xl shadow-md hover:bg-[#0a3a27] transition-colors"
        >
          Back to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] pb-10">
      
      {/* Header */}
      <div className="flex items-center gap-4 p-4 bg-white border-b border-gray-100 sticky top-0 z-10">
        <button onClick={() => setCurrentView('dashboard')} className="p-2 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors">
          <ArrowLeft className="w-5 h-5 text-gray-700" />
        </button>
        <div>
          <h1 className="text-xl font-extrabold text-gray-900 tracking-tight">Make a Deposit</h1>
          <p className="text-xs text-gray-500 font-medium">Fund your account with your preferred payment method</p>
        </div>
      </div>

      <form onSubmit={handleDeposit} className="p-4 max-w-lg mx-auto space-y-6 mt-2">
        {error && <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm border border-red-100 text-center">{error}</div>}

        {/* Payment Method Selection */}
        <div className="bg-white p-5 rounded-3xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-extrabold text-gray-900 mb-4 flex items-center gap-2">
            <Wallet className="w-5 h-5 text-gray-400" /> Select Payment Method
          </h3>
          
          <div className="space-y-3">
            {PAYMENT_METHODS.map((method) => (
              <label 
                key={method.id} 
                onClick={() => setSelectedMethod(method.id)}
                className={`flex items-center justify-between p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                  selectedMethod === method.id 
                    ? 'border-[#0f5e40] bg-[#f0fdf4]' 
                    : 'border-gray-100 bg-gray-50 hover:bg-gray-100'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${selectedMethod === method.id ? 'bg-[#d1fae5] text-[#0f5e40]' : 'bg-gray-200 text-gray-500'}`}>
                    <Banknote className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-extrabold text-gray-900">{method.name}</p>
                    <p className="text-xs font-medium text-gray-500">{method.subtitle}</p>
                  </div>
                </div>
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${selectedMethod === method.id ? 'border-[#0f5e40]' : 'border-gray-300'}`}>
                  {selectedMethod === method.id && <div className="w-2.5 h-2.5 bg-[#0f5e40] rounded-full"></div>}
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Deposit Amount */}
        <div className="bg-white p-5 rounded-3xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-extrabold text-gray-900 mb-4 flex items-center gap-2">
            <span className="text-gray-400 text-xl font-bold">$</span> Deposit Amount
          </h3>
          <div className="relative">
            <span className="absolute left-4 top-3.5 text-gray-400 font-bold text-xl">$</span>
            <input 
              type="number" 
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full bg-white border border-gray-200 rounded-2xl p-4 pl-10 text-2xl font-extrabold text-gray-900 focus:outline-none focus:border-[#0f5e40]"
              placeholder="0.00"
              required
              min="10"
            />
          </div>
          <p className="text-sm font-medium text-gray-500 mt-3 flex items-center gap-2">
            <Info className="w-4 h-4" /> Enter the amount you wish to deposit in $
          </p>
        </div>

        {/* Security Notice */}
        <div className="bg-gray-50 p-5 rounded-3xl border border-gray-100 flex items-start gap-3">
          <ShieldCheck className="w-6 h-6 text-[#0f5e40] flex-shrink-0" />
          <div>
            <p className="text-sm font-extrabold text-gray-900 mb-1">Secure Transaction</p>
            <p className="text-xs text-gray-500 leading-relaxed font-medium">
              Your payment information is encrypted and secure. We never store sensitive payment details.
            </p>
          </div>
        </div>

        {/* Submit Button */}
        <button 
          type="submit" 
          disabled={isProcessing || !amount}
          className="w-full bg-[#0f5e40] hover:bg-[#0a3a27] text-white font-extrabold py-4 rounded-2xl transition-colors flex items-center justify-center gap-2 shadow-md disabled:opacity-50 mt-2"
        >
          {isProcessing ? (
            'Processing Payment...'
          ) : (
            <>Continue to Payment <ArrowRight className="w-5 h-5" /></>
          )}
        </button>
      </form>

      {/* Need Help Section */}
      <div className="px-4 max-w-lg mx-auto mt-6">
        <div className="bg-white p-5 rounded-3xl shadow-sm border border-gray-100 flex items-start gap-4">
          <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
            <HelpCircle className="w-6 h-6 text-gray-500" />
          </div>
          <div>
            <h3 className="text-lg font-extrabold text-gray-900 mb-1">Need Help?</h3>
            <p className="text-sm text-gray-500 mb-3 leading-relaxed">
              If you encounter any issues during the deposit process, our support team is available 24/7 to assist you.
            </p>
            <button onClick={() => setCurrentView('support')} className="text-sm font-extrabold text-[#0f5e40] hover:underline flex items-center gap-1">
              Contact Support <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

    </div>
  );
}

export default Deposit;