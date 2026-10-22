import React, { useState, useEffect } from 'react';
import { Filter, ArrowUpRight, ArrowDownLeft, Calendar, Clock, CheckCircle2, Timer, ArrowRight, ChevronUp } from 'lucide-react';

function Transactions({ user }) {
  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // NEW: State to track if we are showing all or just the first 5
  const [showAll, setShowAll] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await fetch(`${API_URL}/api/transaction/history/${user.email}`);
        const data = await response.json();
        if (Array.isArray(data)) setTransactions(data);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchTransactions();
  }, [user.email, API_URL]);

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return {
        date: date.toLocaleDateString('en-GB', { month: 'short', day: 'numeric', year: 'numeric' }),
        time: date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })
      };
    } catch (e) {
      return { date: 'N/A', time: 'N/A' };
    }
  };

  // NEW: Logic to decide which transactions to show based on the state
  const displayedTransactions = showAll ? transactions : transactions.slice(0, 5);

  return (
    <div className="p-4 md:p-8 max-w-lg mx-auto pb-24 bg-[#f8fafc] min-h-screen">
      
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-[26px] font-extrabold text-gray-900 tracking-tight">Transaction History</h1>
        <p className="text-sm text-gray-500 font-medium mt-1">Track and manage all your account activities</p>
      </div>

      {/* Filter Button */}
      <button className="bg-white p-3 rounded-xl border border-gray-200 shadow-sm mb-6 text-gray-600 hover:bg-gray-50 transition-colors">
        <Filter className="w-5 h-5" />
      </button>

      {/* Transaction List */}
      <div className="space-y-4">
        {isLoading ? (
          <p className="text-gray-500 text-center py-10">Loading history...</p>
        ) : transactions.length === 0 ? (
          <p className="text-gray-500 text-center py-10">No transactions found.</p>
        ) : (
          displayedTransactions.map((tx) => {
            const sender = tx.senderEmail || 'Unknown';
            const receiver = tx.receiverEmail || 'Unknown';
            const amount = Number(tx.amount) || 0;
            const type = tx.type || 'transfer';
            const status = tx.status || 'Completed';

            const isSender = sender === user.email;
            const isDeposit = type === 'deposit';
            const isPending = status === 'Pending';

            const { date, time } = formatDate(tx.createdAt);

            let displayName = isSender ? receiver : sender;
            if (isDeposit) displayName = 'Self';
            
            let title = 'Domestic Transfer';
            if (isDeposit) title = 'Deposit';
            if (type === 'wire_transfer') title = 'Wire Transfer';
            if (type.includes('withdrawal')) title = `${type.split('_')[0].toUpperCase()} Transfer`;
            if (type === 'internal_transfer') title = 'Internal Transfer';

            return (
              <div key={tx._id} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
                
                {/* Top Row: Title and Amount */}
                <div className="flex justify-between items-start mb-3">
                  <h3 className="font-extrabold text-gray-900 text-[15px] flex items-center gap-2">
                    {title} <span className="text-gray-300">→</span>
                  </h3>
                  <p className={`font-extrabold text-[15px] ${isSender && !isDeposit ? 'text-rose-500' : 'text-emerald-500'}`}>
                    {isSender && !isDeposit ? '-' : '+'} £{amount.toFixed(2)}
                  </p>
                </div>

                {/* Middle Row: Icon, Name, Status Badge, Subtext */}
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${
                      isDeposit ? 'bg-[#e6f4ea] text-[#0f5e40]' : (isSender ? 'bg-[#fdf2f2] text-rose-500' : 'bg-[#e6f4ea] text-emerald-600')
                    }`}>
                      {isDeposit ? <ArrowDownLeft className="w-5 h-5" /> : (isSender ? <ArrowUpRight className="w-5 h-5" /> : <ArrowDownLeft className="w-5 h-5" />)}
                    </div>
                    
                    <div>
                      <p className="font-medium text-gray-700 text-sm mb-1">{displayName}</p>
                      <div className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wide uppercase ${
                        isPending ? 'bg-[#fffbf0] text-[#d97706]' : 'bg-[#e6f4ea] text-[#0f5e40]'
                      }`}>
                        {isPending ? <Timer className="w-3 h-3" /> : <CheckCircle2 className="w-3 h-3" />}
                        {isPending ? 'PENDING' : 'PROCESSED'}
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className={`text-xs font-semibold ${isPending ? 'text-[#d97706]' : 'text-gray-400'}`}>
                      {isPending ? 'Processing' : 'Completed'}
                    </p>
                  </div>
                </div>

                {/* Bottom Row: Date & Time */}
                <div className="flex items-center gap-4 text-[11px] font-medium text-gray-400 border-t border-gray-50 pt-3">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5" /> {date}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5" /> {time}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Bottom Button - FIXED to show more on the same page */}
      {transactions.length > 5 && (
        <div className="flex justify-center mt-8">
          <button 
            onClick={() => setShowAll(!showAll)}
            className="bg-white border border-gray-200 text-gray-700 font-bold text-sm px-6 py-3 rounded-xl shadow-sm hover:bg-gray-50 flex items-center gap-2 transition-colors active:scale-95"
          >
            {showAll ? (
              <>Show Less <ChevronUp className="w-4 h-4" /></>
            ) : (
              <>View Complete History <ArrowRight className="w-4 h-4" /></>
            )}
          </button>
        </div>
      )}
    </div>
  );
}

export default Transactions;