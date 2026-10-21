import React, { useState } from 'react';
import { ArrowLeft, Globe, ShieldCheck, Lock, CheckCircle2 } from 'lucide-react';

function InternationalTransfer({ user, setUser, setCurrentView }) {
  const [iban, setIban] = useState('');
  const [swift, setSwift] = useState('');
  const [recipientName, setRecipientName] = useState('');
  const [amount, setAmount] = useState('');
  const [otp, setOtp] = useState('');
  
  const [step, setStep] = useState(1); // 1 = Details, 2 = Security Check, 3 = Success
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  const handleDetailsSubmit = (e) => {
    e.preventDefault();
    setError('');

    const transferAmount = Number(amount);
    if (transferAmount < 100) {
      setError("Minimum international transfer is $100.");
      return;
    }
    if (transferAmount > user.balance) {
      setError("Insufficient funds in your account.");
      return;
    }

    // Move to the Security Check step
    setStep(2);
  };

  const handleSecuritySubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (otp !== '123456') {
      setError("Invalid Authorization Code. (Hint: enter 123456 for this demo).");
      return;
    }

    setIsProcessing(true);

    // Simulate bank processing delay
    setTimeout(async () => {
      try {
        // For this demo, we will send it to the backend using a dummy email as the receiver
        // In a real app, the backend would handle IBAN and SWIFT routing
        const dummyReceiverEmail = 'international@bank.com'; 
        
        const response = await fetch(`${API_URL}/api/transaction/transfer`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            senderEmail: user.email, 
            receiverEmail: dummyReceiverEmail, 
            amount: Number(amount) 
          }),
        });
        
        const data = await response.json();
        
        // Even if the receiver doesn't exist in our DB, we still want to show success for the demo
        // In a real app, you would check response.ok
        
        // Update local balance (simulate success)
        const updatedUser = { ...user, balance: user.balance - Number(amount) };
        localStorage.setItem('wfUser', JSON.stringify(updatedUser));
        setUser(updatedUser);

        setIsProcessing(false);
        setStep(3);
        
      } catch (err) {
        // We will ignore backend errors for this demo and just show success
        const updatedUser = { ...user, balance: user.balance - Number(amount) };
        localStorage.setItem('wfUser', JSON.stringify(updatedUser));
        setUser(updatedUser);
        setIsProcessing(false);
        setStep(3);
      }
    }, 2500);
  };

  // --- UI: SUCCESS SCREEN ---
  if (step === 3) {
    return (
      <div className="p-8 text-white max-w-md mx-auto flex flex-col items-center justify-center min-h-[70vh]">
        <div className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center mb-6 animate-bounce">
          <CheckCircle2 className="w-10 h-10 text-emerald-400" />
        </div>
        <h2 className="text-3xl font-bold mb-2">Transfer Sent</h2>
        <p className="text-slate-400 text-center mb-8">
          Your international transfer of <span className="text-white font-bold">${Number(amount).toFixed(2)}</span> to {recipientName} is being processed.
        </p>
        <button 
          onClick={() => setCurrentView('dashboard')}
          className="w-full bg-[#d4f762] hover:bg-[#c2e654] text-slate-900 font-bold py-4 rounded-xl transition-colors"
        >
          Back to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 text-white max-w-md mx-auto pb-20">
      <button 
        onClick={() => setCurrentView('dashboard')}
        className="flex items-center gap-2 text-slate-400 hover:text-white mb-6 transition-colors"
      >
        <ArrowLeft className="w-5 h-5" /> Back to Dashboard
      </button>

      <div className="flex items-center gap-3 mb-2">
        <Globe className="w-8 h-8 text-blue-400" />
        <h2 className="text-3xl font-bold">International Transfer</h2>
      </div>
      <p className="text-slate-400 mb-8">Send money globally via secure wire transfer.</p>

      {error && (
        <div className="bg-red-500/20 border border-red-500 text-red-400 p-3 rounded-lg mb-6 text-sm">
          {error}
        </div>
      )}

      {/* STEP 1: RECIPIENT DETAILS */}
      {step === 1 && (
        <form onSubmit={handleDetailsSubmit} className="space-y-5 bg-slate-900 p-6 rounded-2xl border border-slate-800">
          <div>
            <label className="block text-xs text-slate-500 mb-1">Recipient Full Name</label>
            <input 
              type="text" 
              value={recipientName}
              onChange={(e) => setRecipientName(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-sm focus:outline-none focus:border-blue-500"
              placeholder="Jane Doe"
              required
            />
          </div>

          <div>
            <label className="block text-xs text-slate-500 mb-1">IBAN / Account Number</label>
            <input 
              type="text" 
              value={iban}
              onChange={(e) => setIban(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-sm focus:outline-none focus:border-blue-500 font-mono"
              placeholder="GB29 NWBK 6016 1331 9268 19"
              required
            />
          </div>

          <div>
            <label className="block text-xs text-slate-500 mb-1">SWIFT / BIC Code</label>
            <input 
              type="text" 
              value={swift}
              onChange={(e) => setSwift(e.target.value.toUpperCase())}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-sm focus:outline-none focus:border-blue-500 font-mono"
              placeholder="NWBKGB2L"
              required
            />
          </div>

          <div>
            <label className="block text-xs text-slate-500 mb-1">Amount to Send ($)</label>
            <div className="relative">
              <span className="absolute left-4 top-3 text-slate-400 font-bold text-xl">$</span>
              <input 
                type="number" 
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 pl-8 text-xl font-bold focus:outline-none focus:border-blue-500"
                placeholder="0.00"
                required
                min="100"
              />
            </div>
            <p className="text-xs text-slate-500 mt-1">Available: ${user.balance.toFixed(2)}</p>
          </div>

          <button 
            type="submit" 
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl transition-colors mt-4"
          >
            Continue to Security Check
          </button>
        </form>
      )}

      {/* STEP 2: SECURITY CHECK */}
      {step === 2 && (
        <form onSubmit={handleSecuritySubmit} className="space-y-6 bg-slate-900 p-6 rounded-2xl border border-slate-800">
          <div className="flex flex-col items-center justify-center py-4 text-center">
            <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mb-4">
              <Lock className="w-8 h-8 text-blue-400" />
            </div>
            <h3 className="text-xl font-bold mb-2">Bank Authorization</h3>
            <p className="text-sm text-slate-400 max-w-[250px]">
              For your security, please enter the 6-digit authorization code sent to your registered device.
            </p>
          </div>

          <div>
            <input 
              type="text" 
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
              className="w-full bg-slate-800 border-2 border-slate-700 rounded-xl p-4 text-center text-2xl font-mono tracking-[1em] focus:outline-none focus:border-emerald-500"
              placeholder="000000"
              required
            />
            <p className="text-xs text-emerald-400/70 text-center mt-2">Demo Hint: Enter 123456</p>
          </div>

          <button 
            type="submit" 
            disabled={isProcessing}
            className="w-full bg-[#d4f762] hover:bg-[#c2e654] text-slate-900 font-bold py-4 rounded-xl transition-colors disabled:opacity-50 flex items-center justify-center"
          >
            {isProcessing ? 'Authorizing Wire...' : `Authorize $${amount}`}
          </button>
          
          <button 
            type="button"
            onClick={() => setStep(1)}
            className="w-full text-slate-400 hover:text-white text-sm transition-colors"
          >
            Cancel and go back
          </button>
        </form>
      )}
    </div>
  );
}

export default InternationalTransfer;