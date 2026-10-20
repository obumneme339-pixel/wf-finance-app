import React, { useState } from 'react';

function Transfer({ user, setUser }) {
  const [receiverEmail, setReceiverEmail] = useState('');
  const [amount, setAmount] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // NEW LINE FOR DEPLOYMENT
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  const handleTransfer = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    setIsLoading(true);

    try {
      // UPDATED TO USE API_URL
      const response = await fetch(`${API_URL}/api/transaction/transfer`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          senderEmail: user.email,
          receiverEmail,
          amount: Number(amount)
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Transfer failed');
      }

      setMessage(data.message);
      setUser({ ...user, balance: user.balance - Number(amount) });
      setReceiverEmail('');
      setAmount('');

    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-10 text-white">
      <h2 className="text-3xl font-semibold mb-6">Transfer Money 💸</h2>
      
      <div className="bg-slate-900 p-8 rounded-2xl shadow-xl w-full max-w-md border border-slate-800">
        <p className="text-slate-400 mb-6">Your current balance: <span className="text-white font-bold">${user.balance.toFixed(2)}</span></p>

        {message && <div className="bg-green-500/20 border border-green-500 text-green-400 p-3 rounded-lg mb-4 text-sm text-center">{message}</div>}
        {error && <div className="bg-red-500/20 border border-red-500 text-red-400 p-3 rounded-lg mb-4 text-sm text-center">{error}</div>}

        <form onSubmit={handleTransfer} className="flex flex-col gap-4">
          <div>
            <label className="block text-sm text-slate-400 mb-1">Receiver's Email</label>
            <input 
              type="email" 
              value={receiverEmail}
              onChange={(e) => setReceiverEmail(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-white focus:outline-none focus:border-blue-500"
              placeholder="friend@test.com"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm text-slate-400 mb-1">Amount ($)</label>
            <input 
              type="number" 
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-white focus:outline-none focus:border-blue-500"
              placeholder="50"
              min="1"
              required
            />
          </div>

          <button 
            type="submit" 
            disabled={isLoading}
            className="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition-colors disabled:opacity-50"
          >
            {isLoading ? 'Sending...' : 'Send Money'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Transfer;