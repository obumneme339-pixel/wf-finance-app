import React, { useState, useEffect } from 'react';
import { Plus, ArrowRight, Landmark, MessageCircle, ArrowUpRight, ArrowDownLeft } from 'lucide-react';

const FIAT_RATES = { btc: 52000, eth: 2800, usdt: 0.79 };

const formatGBP = (n) =>
  new Intl.NumberFormat("en-GB", {
    style: "currency", currency: "GBP", minimumFractionDigits: 2, maximumFractionDigits: 2,
  }).format(Number.isFinite(n) ? n : 0);

const formatCrypto = (n, digits) =>
  (Number.isFinite(n) ? n : 0).toLocaleString("en-GB", {
    minimumFractionDigits: 0, maximumFractionDigits: digits,
  });

/* Inline SVG Logos */
const BitcoinLogo = ({ size = 28 }) => (
  <svg width={size} height={size} viewBox="0 0 32 32"><circle cx="16" cy="16" r="16" fill="#F7931A" /><text x="16" y="23" textAnchor="middle" fontSize="20" fontWeight="800" fill="#fff">₿</text></svg>
);
const EthereumLogo = ({ size = 28 }) => (
  <svg width={size} height={size} viewBox="0 0 32 32"><circle cx="16" cy="16" r="16" fill="#627EEA" /><g fill="#fff"><path fillOpacity=".6" d="M16.5 4v8.9l7.5 3.3z" /><path d="M16.5 4L9 16.2l7.5-3.3z" /><path fillOpacity=".6" d="M16.5 21.9v6.1L24 17.5z" /><path d="M16.5 28v-6.1L9 17.5z" /><path fillOpacity=".2" d="M16.5 20.6l7.5-4.4-7.5-3.3z" /><path fillOpacity=".6" d="M9 16.2l7.5 4.4v-7.7z" /></g></svg>
);
const TetherLogo = ({ size = 28 }) => (
  <svg width={size} height={size} viewBox="0 0 32 32"><circle cx="16" cy="16" r="16" fill="#26A17B" /><path fill="#fff" d="M17.9 17.3c-.1 0-.6.1-1.9.1-1 0-1.7 0-2-.1-3.9-.2-6.8-.8-6.8-1.6 0-.8 2.9-1.5 6.8-1.7v2.6c.3 0 1 .1 2 .1 1.2 0 1.8-.1 1.9-.1v-2.6c3.9.2 6.8.9 6.8 1.7 0 .8-2.9 1.4-6.8 1.6zm0-3.6v-2.4h5.4V7.8H8.6v3.6h5.4v2.4c-4.4.2-7.7 1.1-7.7 2.1 0 1 3.3 1.9 7.7 2.1v7.6h3.9v-7.6c4.4-.2 7.7-1.1 7.7-2.1 0-1-3.3-1.9-7.7-2.1z" /></svg>
);
const PayPalLogo = ({ size = 28 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24"><path fill="#003087" d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944.901C5.026.382 5.474 0 5.998 0h7.46c2.57 0 4.578.543 5.69 1.81 1.01 1.15 1.304 2.42 1.012 4.287-.023.143-.047.288-.077.437-.983 5.05-4.349 6.797-8.647 6.797h-2.19c-.524 0-.968.382-1.05.9l-1.12 7.106z"/><path fill="#0070E0" d="M21.222 6.917a3.35 3.35 0 0 0-.607-.541c-.013.076-.026.175-.041.254-.93 4.778-4.005 7.201-9.138 7.201h-2.19a.563.563 0 0 0-.556.479l-1.187 7.527h-.506l-.24 1.516a.56.56 0 0 0 .554.647h3.882c.46 0 .85-.334.922-.788.06-.26.76-4.852.816-5.09a.932.932 0 0 1 .923-.788h.58c3.76 0 6.705-1.528 7.565-5.946.36-1.847.174-3.388-.777-4.471z"/></svg>
);
const SkrillBadge = () => (
  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#8A1B61] shadow-sm">
    <span className="text-[11px] font-extrabold italic leading-none tracking-tight text-white">Skrill</span>
  </div>
);

function Dashboard({ user, setCurrentView }) {
  const [transactions, setTransactions] = useState([]);
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await fetch(`${API_URL}/api/transaction/history/${user.email}`);
        const data = await response.json();
        if (Array.isArray(data)) setTransactions(data.slice(0, 3));
      } catch (err) {
        console.error(err);
      }
    };
    fetchTransactions();
  }, [user.email, API_URL]);

  const crypto = user?.crypto || {};
  const cryptoColumns = [
    { key: "btc", symbol: "BTC", Logo: BitcoinLogo, digits: 6 },
    { key: "eth", symbol: "ETH", Logo: EthereumLogo, digits: 4 },
    { key: "usdt", symbol: "USDT", Logo: TetherLogo, digits: 2 },
  ].map((c) => {
    const amount = Number(crypto[c.key] ?? 0);
    return { ...c, amount, fiat: amount * FIAT_RATES[c.key] };
  });

  return (
    <main className="mx-auto max-w-5xl space-y-8 px-4 pb-32 pt-6 md:pb-12 bg-[#f8fafc] min-h-screen">
      
      {/* Welcome Text */}
      <div>
        <h1 className="text-[26px] font-extrabold tracking-tight text-gray-900">
          Welcome back, {user.name}
        </h1>
        <p className="mt-1 text-sm font-medium text-gray-500">
          Here's an overview of your account activity.
        </p>
      </div>

      {/* Balance Card */}
      <section className="rounded-3xl bg-gradient-to-br from-[#115e3f] to-[#0a3a27] p-6 text-white shadow-xl">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-[11px] font-extrabold uppercase tracking-widest text-white/70">Available Balance</p>
            <p className="mt-2 text-4xl font-extrabold tracking-tight sm:text-5xl">
              {formatGBP(Number(user.balance))}
            </p>
          </div>
          <button onClick={() => setCurrentView('deposit')} className="flex items-center gap-1.5 rounded-full bg-white/15 px-3.5 py-2 text-xs font-extrabold text-white backdrop-blur-sm transition hover:bg-white/25 active:scale-95">
            <Plus className="h-4 w-4" strokeWidth={3} /> Fund
          </button>
        </div>

        <div className="mt-6 grid grid-cols-3 divide-x divide-white/15 border-t border-white/15 pt-5">
          {cryptoColumns.map(({ key, symbol, Logo, amount, fiat, digits }) => (
            <div key={key} className="flex flex-col items-center px-1 text-center first:pl-0 last:pr-0">
              <div className="flex items-center gap-1.5">
                <Logo size={20} />
                <span className="text-xs font-extrabold tracking-wide">{symbol}</span>
              </div>
              <p className="mt-2 text-sm font-extrabold">{formatCrypto(amount, digits)}</p>
              <p className="mt-0.5 text-[11px] font-bold text-white/60">{formatGBP(fiat)}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Send Money Grid */}
      <section>
        <h2 className="mb-3 px-1 text-xs font-extrabold uppercase tracking-widest text-gray-500">Send Money</h2>
        <div className="grid grid-cols-2 gap-3">
          <button onClick={() => setCurrentView('international-transfer')} className="group flex flex-col items-start rounded-2xl bg-white p-4 text-left shadow-sm ring-1 ring-gray-100 transition hover:shadow-md active:scale-[0.98]">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50"><Landmark className="h-6 w-6 text-blue-600" strokeWidth={2.5} /></div>
            <p className="mt-3 text-sm font-extrabold text-gray-900">Wire Transfer</p>
            <p className="mt-0.5 text-xs font-semibold text-gray-500">International bank</p>
          </button>

          <button onClick={() => setCurrentView('transfer')} className="group flex flex-col items-start rounded-2xl bg-white p-4 text-left shadow-sm ring-1 ring-gray-100 transition hover:shadow-md active:scale-[0.98]">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-purple-50"><MessageCircle className="h-6 w-6 text-purple-600" strokeWidth={2.5} /></div>
            <p className="mt-3 text-sm font-extrabold text-gray-900">Local Transfer</p>
            <p className="mt-0.5 text-xs font-semibold text-gray-500">Domestic bank</p>
          </button>

          <button onClick={() => setCurrentView('paypal')} className="group flex flex-col items-start rounded-2xl bg-white p-4 text-left shadow-sm ring-1 ring-gray-100 transition hover:shadow-md active:scale-[0.98]">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-sky-50"><PayPalLogo size={26} /></div>
            <p className="mt-3 text-sm font-extrabold text-gray-900">PayPal</p>
            <p className="mt-0.5 text-xs font-semibold text-gray-500">Send via PayPal</p>
          </button>

          <button onClick={() => setCurrentView('skrill')} className="group flex flex-col items-start rounded-2xl bg-white p-4 text-left shadow-sm ring-1 ring-gray-100 transition hover:shadow-md active:scale-[0.98]">
            <SkrillBadge />
            <p className="mt-3 text-sm font-extrabold text-gray-900">Skrill</p>
            <p className="mt-0.5 text-xs font-semibold text-gray-500">Send via Skrill</p>
          </button>
        </div>
      </section>

      {/* Crypto Transfer Grid */}
      <section>
        <h2 className="mb-3 px-1 text-xs font-extrabold uppercase tracking-widest text-gray-500">Crypto Transfer</h2>
        <div className="grid grid-cols-3 gap-3">
          {[
            { name: "Bitcoin", Logo: BitcoinLogo, view: "btc-transfer" }, 
            { name: "Ethereum", Logo: EthereumLogo, view: "eth-transfer" }, 
            { name: "Tether", Logo: TetherLogo, view: "usdt-transfer" }
          ].map(({ name, Logo, view }) => (
            <button key={name} onClick={() => setCurrentView(view)} className="flex flex-col items-center rounded-2xl bg-white px-2 py-4 shadow-sm ring-1 ring-gray-100 transition hover:shadow-md active:scale-[0.98]">
              <Logo size={36} />
              <p className="mt-2.5 text-xs font-extrabold text-gray-900">{name}</p>
              <ArrowRight className="mt-1.5 h-4 w-4 text-gray-400" strokeWidth={2.5} />
            </button>
          ))}
        </div>
      </section>

      {/* Recent Transactions */}
      <section>
        <div className="flex justify-between items-center mb-3">
          <h2 className="px-1 text-xs font-extrabold uppercase tracking-widest text-gray-500">Recent Transactions</h2>
          <button onClick={() => setCurrentView('transactions')} className="text-xs font-bold text-[#0f5e40] flex items-center gap-1 hover:underline">
            View All <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        <div className="space-y-3">
          {transactions.length === 0 ? (
             <p className="text-sm text-gray-500">No recent transactions.</p>
          ) : (
            transactions.map((tx) => {
              const isSender = tx.senderEmail === user.email;
              return (
                <div key={tx._id} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg ${isSender ? 'bg-red-50 text-red-500' : 'bg-emerald-50 text-emerald-500'}`}>
                      {isSender ? <ArrowUpRight className="w-5 h-5" /> : <ArrowDownLeft className="w-5 h-5" />}
                    </div>
                    <div>
                      <p className="font-extrabold text-gray-900 text-sm">
                        {tx.type === 'deposit' ? 'Deposit' : (isSender ? 'Transfer Sent' : 'Received')}
                      </p>
                      <p className="text-xs font-medium text-gray-500 mt-0.5">
                        {isSender ? tx.receiverEmail : tx.senderEmail}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`font-extrabold text-sm ${isSender ? 'text-gray-900' : 'text-emerald-600'}`}>
                      {isSender ? '-' : '+'}£{tx.amount.toFixed(2)}
                    </p>
                    <p className="text-[10px] font-medium text-gray-400 mt-1">Pending</p>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </section>

    </main>
  );
}

export default Dashboard;