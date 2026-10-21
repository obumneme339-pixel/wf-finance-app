import React, { useState, useEffect } from 'react';
import { ArrowUpRight, ArrowDownLeft } from 'lucide-react';

function Transactions({ user }) {
  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        console.log("Fetching for:", user.email); // Debugging
        const response = await fetch(`${API_URL}/api/transaction/history/${user.email}`);
        const data = await response.json();
        
        // Ensure it's an array before setting it
        if (Array.isArray(data)) {
          setTransactions(data);
        } else {
          console.error("Data is not an array:", data);
        }
      } catch (err) {
        console.error("Failed to fetch transactions", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchTransactions();
  }, [user.email, API_URL]);

  return (
    <div className="p-4 md:p-8 text-white max-w-6xl mx-auto">
      <div className="mb-8">
        <h2 className="text-3xl font-bold">Transaction History 🧾</h2>
        <p className="text-slate-400 mt-1">View all your past activity in one place.</p>
      </div>

      <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
        {isLoading ? (
          <p className="text-slate-400">Loading history...</p>
        ) : transactions.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-slate-400">No transactions found.</p>
            <p className="text-xs text-slate-500 mt-2">Looking for email: {user.email}</p>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {transactions.map((tx) => {
              const isSender = tx.senderEmail === user.email;
              return (
                <div key={tx._id} className="flex flex-col md:flex-row md:items-center justify-between p-4 bg-slate-800/30 rounded-xl hover:bg-slate-800 transition-colors border border-slate-800/50">
                  <div className="flex items-center gap-4 mb-4 md:mb-0">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${isSender ? 'bg-rose-500/20 text-rose-400' : 'bg-emerald-500/20 text-emerald-400'}`}>
                      {isSender ? <ArrowUpRight className="w-6 h-6" /> : <ArrowDownLeft className="w-6 h-6" />}
                    </div>
                    <div>
                      <p className="font-bold text-lg">
                        {isSender ? `Sent to ${tx.receiverEmail}` : `Received from ${tx.senderEmail}`}
                      </p>
                      <p className="text-sm text-slate-400">
                        {new Date(tx.createdAt).toLocaleString()} • {tx.type === 'crypto_buy' ? 'Crypto Purchase' : 'Bank Transfer'}
                      </p>
                    </div>
                  </div>
                  <div className="text-left md:text-right">
                    <p className={`font-bold text-xl ${isSender ? 'text-white' : 'text-emerald-400'}`}>
                      {isSender ? '-' : '+'}${tx.amount.toFixed(2)}
                    </p>
                    <p className="text-sm text-slate-400">Completed</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default Transactions;