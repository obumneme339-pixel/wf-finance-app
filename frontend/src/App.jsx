import React from 'react';
import { 
  ArrowLeft, CheckCircle2, Clock, Printer, Download, 
  Copy, ArrowUpRight, ArrowDownLeft, FileText, User, 
  CreditCard, ShieldCheck, Wallet, ArrowRightLeft
} from 'lucide-react';

function Receipt({ transaction, setCurrentView, user }) {
  if (!transaction) {
    return (
      <div className="p-8 text-center mt-20">
        <p>No transaction selected.</p>
        <button onClick={() => setCurrentView('transactions')} className="mt-4 text-emerald-600 font-bold">Go Back</button>
      </div>
    );
  }

  // --- DATA LOGIC ---
  const isDeposit = transaction.type === 'deposit';
  const isDebit = !isDeposit; // Everything else is treated as outgoing
  
  const amount = Number(transaction.amount) || 0;
  const status = transaction.status || 'Completed';
  const isPending = status === 'Pending';

  const dateObj = new Date(transaction.createdAt);
  const formattedDate = dateObj.toLocaleDateString('en-GB', { month: 'short', day: 'numeric', year: 'numeric' });
  const formattedTime = dateObj.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
  
  // Format the ID like the spec: CRT2RUN5PYFEDK5 or CRED/NHF...
  const txId = transaction._id.slice(-12).toUpperCase();
  const receiptRef = `CRED/${txId.slice(0, 6)}-${dateObj.getFullYear()}`;

  const handlePrint = () => window.print();
  const copyToClipboard = (text) => navigator.clipboard.writeText(text);

  return (
    <div className="min-h-screen bg-[#F8F9FA] pb-24 font-sans text-[#172126]">
      
      {/* Global Top Header (Matches the Credit Screenshot) */}
      <div className="flex items-center justify-between p-4 bg-white border-b border-gray-200">
        <div className="flex items-center gap-4">
          <button onClick={() => setCurrentView('transactions')} className="p-2 bg-gray-50 hover:bg-gray-100 rounded-lg">
            <ArrowLeft className="w-5 h-5 text-gray-700" />
          </button>
          <div>
            <h1 className="text-xl font-extrabold text-gray-900">{isDeposit ? 'Deposit Receipt' : 'Transaction Receipt'}</h1>
            {isDeposit && <p className="text-xs text-gray-500 font-medium">{receiptRef}</p>}
          </div>
        </div>
        {isDeposit && (
          <button onClick={() => copyToClipboard(receiptRef)} className="p-2 bg-gray-50 hover:bg-gray-100 rounded-lg border border-gray-200">
            <Copy className="w-4 h-4 text-gray-600" />
          </button>
        )}
      </div>

      <div className="p-4 max-w-lg mx-auto mt-4 space-y-4">
        
        {/* ========================================================= */}
        {/* DEBIT LAYOUT (Outgoing Transfers)                         */}
        {/* ========================================================= */}
        {isDebit && (
          <div className="bg-white rounded-3xl border border-gray-200 overflow-hidden shadow-sm">
            
            {/* Green Header */}
            <div className="bg-[#206A49] p-6 text-white relative">
              <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-6 h-6 text-white" />
                  <div>
                    <h2 className="font-extrabold tracking-widest text-sm">CREDENCE</h2>
                    <p className="text-[8px] tracking-wider text-emerald-200">PREMIUM BANKING</p>
                  </div>
                </div>
                <div className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${
                  isPending ? 'bg-yellow-500/20 text-yellow-200 border-yellow-400/30' : 'bg-white/20 text-white border-white/30'
                }`}>
                  {isPending ? 'PENDING' : 'PROCESSED'}
                </div>
              </div>
              <h3 className="text-xl font-medium mt-4">Transaction Receipt</h3>
            </div>

            {/* Debit Amount Section */}
            <div className="p-8 border-b border-gray-100 flex justify-between items-center bg-white">
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Transaction Amount</p>
                <p className="text-4xl font-extrabold text-[#C95878]">- £{amount.toFixed(2)}</p>
              </div>
              <div className="w-16 h-16 bg-[#F9EBEF] rounded-2xl border border-[#C95878]/20 flex items-center justify-center">
                <ArrowUpRight className="w-8 h-8 text-[#C95878]" />
              </div>
            </div>
            
            <div className="bg-[#F9EBEF] px-8 py-3 flex items-center gap-2 border-b border-gray-100">
              <span className="w-4 h-4 rounded-full bg-[#C95878]/20 flex items-center justify-center text-[#C95878] font-bold text-[10px]">i</span>
              <p className="text-xs font-medium text-[#C95878]">Funds sent from your account</p>
            </div>

            {/* Debit Details Section */}
            <div className="p-6 space-y-5">
              <h4 className="text-xs font-extrabold text-gray-800 uppercase tracking-widest flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#206A49]" /> Transaction Details
              </h4>
              
              <div className="space-y-3">
                <div>
                  <p className="text-[10px] text-gray-400 font-bold uppercase mb-1">Transaction ID</p>
                  <div className="flex justify-between items-center bg-gray-50 p-3 rounded-xl border border-gray-100">
                    <span className="text-sm font-mono font-bold text-gray-800">{txId}</span>
                    <Copy onClick={() => copyToClipboard(txId)} className="w-4 h-4 text-gray-400 cursor-pointer hover:text-[#206A49]" />
                  </div>
                </div>
                <div>
                  <p className="text-[10px] text-gray-400 font-bold uppercase mb-1">Transaction Date</p>
                  <div className="bg-gray-50 p-3 rounded-xl border border-gray-100 text-sm font-medium text-gray-800">{formattedDate} • {formattedTime}</div>
                </div>
                <div>
                  <p className="text-[10px] text-gray-400 font-bold uppercase mb-1">Payment Method</p>
                  <div className="bg-gray-50 p-3 rounded-xl border border-gray-100 text-sm font-medium text-gray-800 capitalize">{transaction.type.replace('_', ' ')}</div>
                </div>
                <div>
                  <p className="text-[10px] text-gray-400 font-bold uppercase mb-1">Transaction Type</p>
                  <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                    <span className="text-xs font-bold text-[#C95878] bg-[#F9EBEF] px-3 py-1 rounded-md">DEBIT</span>
                  </div>
                </div>
              </div>

              {/* Recipient Info (Only for Debit) */}
              <h4 className="text-xs font-extrabold text-gray-800 uppercase tracking-widest flex items-center gap-2 mt-8">
                <User className="w-4 h-4 text-[#206A49]" /> Recipient Information
              </h4>
              <div className="space-y-3">
                <div>
                  <p className="text-[10px] text-gray-400 font-bold uppercase mb-1">Account Name</p>
                  <div className="bg-gray-50 p-3 rounded-xl border border-gray-100 text-sm font-medium text-gray-800">{transaction.receiverEmail || 'N/A'}</div>
                </div>
                <div>
                  <p className="text-[10px] text-gray-400 font-bold uppercase mb-1">Bank Name</p>
                  <div className="bg-gray-50 p-3 rounded-xl border border-gray-100 text-sm font-medium text-gray-800">Credence / External</div>
                </div>
              </div>

              {/* Processing Details */}
              <h4 className="text-xs font-extrabold text-gray-800 uppercase tracking-widest flex items-center gap-2 mt-8">
                <Clock className="w-4 h-4 text-[#206A49]" /> Processing Details
              </h4>
              <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Processed By</span>
                  <span className="font-bold text-gray-800">Admin Manager</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Processing Time</span>
                  <span className="font-bold text-gray-800">{formattedDate} - {formattedTime}</span>
                </div>
              </div>

              {/* Balance After */}
              <div className="bg-[#EAF5EF] p-4 rounded-xl border border-[#206A49]/20 mt-4 flex justify-between items-center">
                <span className="text-xs font-bold text-[#206A49] uppercase">Balance After Transaction</span>
                <span className="text-xl font-extrabold text-gray-900">£{user.balance.toFixed(2)}</span>
              </div>

              {/* Important Notice */}
              <div className="bg-gray-50 p-5 rounded-xl border border-gray-200 mt-6 text-center">
                <p className="text-[10px] font-bold text-gray-800 uppercase tracking-widest mb-2 flex items-center justify-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-[#206A49]" /> Important Notice
                </p>
                <p className="text-xs text-gray-500 leading-relaxed">
                  This is an official transaction receipt from Credence Bank. Please retain for your records. Contact mail@karamelscript.name.ng for questions.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* CREDIT LAYOUT (Incoming Deposits)                         */}
        {/* ========================================================= */}
        {isDeposit && (
          <>
            {/* Main Deposit Summary Card */}
            <div className="bg-white rounded-3xl border border-gray-200 p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <ArrowDownLeft className="w-4 h-4 text-[#206A49]" />
                <span className="text-xs font-bold text-[#206A49] uppercase tracking-wider">Deposit</span>
              </div>
              
              <h2 className="text-5xl font-extrabold text-gray-900 tracking-tight mb-6">
                + £{amount.toFixed(2)}
              </h2>
              
              <div className="flex justify-between items-end">
                <p className="text-xs font-medium text-gray-500">{formattedDate} • {formattedTime}</p>
                <div className={`flex items-center gap-1 px-3 py-1.5 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                  isPending ? 'bg-[#FFF8E6] text-[#D7B74F]' : 'bg-[#EAF5EF] text-[#206A49]'
                }`}>
                  {isPending ? <Clock className="w-3 h-3" /> : <CheckCircle2 className="w-3 h-3" />}
                  {status}
                </div>
              </div>
            </div>

            {/* Payment Method & Type Card */}
            <div className="bg-white rounded-3xl border border-gray-200 overflow-hidden shadow-sm">
              <div className="flex justify-between items-center p-5 border-b border-gray-100">
                <div className="flex items-center gap-3">
                  <CreditCard className="w-5 h-5 text-gray-400" />
                  <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Payment Method</span>
                </div>
                <div className="w-8 h-8 rounded-lg bg-[#EAF5EF] flex items-center justify-center">
                  <Wallet className="w-4 h-4 text-[#206A49]" />
                </div>
              </div>
              
              <div className="flex justify-between items-center p-5">
                <div className="flex items-center gap-3">
                  <ArrowRightLeft className="w-5 h-5 text-gray-400" />
                  <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Type</span>
                </div>
                <span className="text-sm font-bold text-gray-900">Incoming Deposit</span>
              </div>
            </div>
          </>
        )}

        {/* ========================================================= */}
        {/* SHARED BOTTOM ACTION BUTTONS                              */}
        {/* ========================================================= */}
        <div className="pt-4 space-y-3">
          <div className="flex gap-3">
            <button onClick={handlePrint} className="flex-1 bg-white border border-gray-300 text-gray-700 font-bold py-3.5 rounded-xl shadow-sm hover:bg-gray-50 flex items-center justify-center gap-2 transition-colors">
              <Printer className="w-4 h-4" /> Print
            </button>
            <button onClick={handlePrint} className="flex-1 bg-white border border-gray-300 text-gray-700 font-bold py-3.5 rounded-xl shadow-sm hover:bg-gray-50 flex items-center justify-center gap-2 transition-colors">
              <Download className="w-4 h-4" /> Download
            </button>
          </div>
          
          <button onClick={() => setCurrentView('transactions')} className="w-full bg-[#206A49] text-white font-bold py-4 rounded-xl shadow-md hover:bg-[#1a553a] flex items-center justify-center gap-2 transition-colors">
            <ArrowLeft className="w-5 h-5" /> Back to History
          </button>
        </div>

      </div>
    </div>
  );
}

export default Receipt;