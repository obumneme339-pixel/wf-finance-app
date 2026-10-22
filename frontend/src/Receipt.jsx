import React from 'react';
import { ArrowLeft, CheckCircle2, Clock, Printer, Download, ShieldCheck, Copy } from 'lucide-react';

function Receipt({ transaction, setCurrentView }) {
  if (!transaction) {
    return (
      <div className="p-8 text-center mt-20">
        <p>No transaction selected.</p>
        <button onClick={() => setCurrentView('transactions')} className="mt-4 text-emerald-600 font-bold">Go Back</button>
      </div>
    );
  }

  const isSender = transaction.type !== 'deposit'; // If not a deposit, they are sending
  const isPending = transaction.status === 'Pending';
  const amount = Number(transaction.amount) || 0;
  
  // Format Date
  const dateObj = new Date(transaction.createdAt);
  const formattedDate = dateObj.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
  const formattedTime = dateObj.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

  const handlePrint = () => {
    window.print(); // This triggers the browser's print dialog (Save as PDF)
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] pb-24">
      {/* Header Bar */}
      <div className="flex items-center justify-between p-4 bg-white border-b border-gray-100 sticky top-0 z-10">
        <button onClick={() => setCurrentView('transactions')} className="p-2 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors">
          <ArrowLeft className="w-5 h-5 text-gray-700" />
        </button>
        <h1 className="text-lg font-extrabold text-gray-900 tracking-tight">Transaction Receipt</h1>
        <div className="w-9"></div> {/* Spacer for alignment */}
      </div>

      <div className="p-4 max-w-lg mx-auto mt-4">
        
        {/* Main Receipt Card */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          
          {/* Top Colored Header */}
          <div className="bg-[#0f5e40] p-8 text-center flex flex-col items-center text-white">
            <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 ${isPending ? 'bg-amber-500/20 text-amber-300' : 'bg-white/20 text-white'}`}>
              {isPending ? <Clock className="w-8 h-8" /> : <CheckCircle2 className="w-8 h-8" />}
            </div>
            <p className="text-sm font-medium text-emerald-100 mb-1">
              {isSender ? 'Amount Sent' : 'Amount Received'}
            </p>
            <h2 className="text-4xl font-extrabold tracking-tight">
              {isSender ? '-' : '+'}£{amount.toFixed(2)}
            </h2>
            <div className={`mt-3 inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${isPending ? 'bg-amber-500/20 text-amber-200' : 'bg-white/20 text-white'}`}>
              {transaction.status || 'Completed'}
            </div>
          </div>

          {/* Details Section */}
          <div className="p-6 space-y-6">
            
            <div className="flex justify-between items-center border-b border-gray-100 pb-3">
              <span className="text-sm font-medium text-gray-500">Transaction Type</span>
              <span className="text-sm font-bold text-gray-900 uppercase">
                {transaction.type?.replace('_', ' ') || 'Transfer'}
              </span>
            </div>

            <div className="flex justify-between items-center border-b border-gray-100 pb-3">
              <span className="text-sm font-medium text-gray-500">Date & Time</span>
              <span className="text-sm font-bold text-gray-900 text-right">
                {formattedDate} <br/> <span className="text-xs text-gray-500">{formattedTime}</span>
              </span>
            </div>

            <div className="flex justify-between items-center border-b border-gray-100 pb-3">
              <span className="text-sm font-medium text-gray-500">Transaction ID</span>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold text-gray-900 bg-gray-100 px-2 py-1 rounded-md">
                  {transaction._id.slice(-10).toUpperCase()}
                </span>
                <Copy className="w-4 h-4 text-gray-400 cursor-pointer hover:text-emerald-600" onClick={() => navigator.clipboard.writeText(transaction._id)} />
              </div>
            </div>

            {/* Recipient Info (Only shows if money was sent) */}
            {isSender && (
              <div className="bg-gray-50 rounded-2xl p-4 space-y-3 mt-4">
                <p className="text-xs font-extrabold text-gray-500 uppercase tracking-wider">Recipient Details</p>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">Name / Account</span>
                  <span className="text-sm font-bold text-gray-900 text-right max-w-[200px] truncate">
                    {transaction.receiverEmail || 'External Account'}
                  </span>
                </div>
              </div>
            )}

            <div className="flex items-center gap-2 text-xs text-gray-400 mt-6 justify-center">
              <ShieldCheck className="w-4 h-4" /> Secured by WF Finance
            </div>

          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-3 mt-6">
          <button onClick={handlePrint} className="bg-white border border-gray-200 text-gray-700 font-bold py-3.5 rounded-xl shadow-sm hover:bg-gray-50 flex items-center justify-center gap-2 transition-colors">
            <Printer className="w-4 h-4" /> Print
          </button>
          <button onClick={handlePrint} className="bg-[#0f5e40] text-white font-bold py-3.5 rounded-xl shadow-md hover:bg-[#0a3a27] flex items-center justify-center gap-2 transition-colors">
            <Download className="w-4 h-4" /> Save PDF
          </button>
        </div>

      </div>
    </div>
  );
}

export default Receipt;