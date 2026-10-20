import React from 'react';
import { User, Mail, DollarSign, Wallet } from 'lucide-react';

function Profile({ user }) {
  // Define all four coins with their current USD prices
  const coins = [
    { id: 'btc', name: 'Bitcoin', symbol: 'BTC', balance: user.crypto?.btc || 0, price: 65000, logo: 'https://cryptologos.cc/logos/bitcoin-btc-logo.png?v=026', decimals: 6 },
    { id: 'eth', name: 'Ethereum', symbol: 'ETH', balance: user.crypto?.eth || 0, price: 3500, logo: 'https://cryptologos.cc/logos/ethereum-eth-logo.png?v=026', decimals: 6 },
    { id: 'usdt', name: 'Tether', symbol: 'USDT', balance: user.crypto?.usdt || 0, price: 1, logo: 'https://cryptologos.cc/logos/tether-usdt-logo.png?v=026', decimals: 2 },
    { id: 'usdc', name: 'USD Coin', symbol: 'USDC', balance: user.crypto?.usdc || 0, price: 1, logo: 'https://cryptologos.cc/logos/usd-coin-usdc-logo.png?v=026', decimals: 2 },
  ];

  // Sort ALL coins by their actual USD value (highest to lowest)
  const sortedCoins = coins.sort((a, b) => (b.balance * b.price) - (a.balance * a.price));

  return (
    <div className="p-8 text-white max-w-4xl mx-auto">
      <div className="mb-8">
        <h2 className="text-3xl font-bold">Account Information 👤</h2>
        <p className="text-slate-400 mt-1">Your personal details and wallet overview.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Personal Details Card */}
        <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 h-fit">
          <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
            <User className="text-blue-400" /> Personal Details
          </h3>
          
          <div className="flex flex-col gap-4">
            <div>
              <p className="text-sm text-slate-400 mb-1">Full Name</p>
              <p className="font-medium text-lg bg-slate-800 p-3 rounded-lg">{user.name}</p>
            </div>
            <div>
              <p className="text-sm text-slate-400 mb-1">Email Address</p>
              <p className="font-medium text-lg bg-slate-800 p-3 rounded-lg flex items-center gap-2">
                <Mail className="w-4 h-4 text-slate-400" /> {user.email}
              </p>
            </div>
            <div>
              <p className="text-sm text-slate-400 mb-1">Account Type</p>
              <p className="font-medium text-lg bg-slate-800 p-3 rounded-lg text-emerald-400">Premium Checking</p>
            </div>
          </div>
        </div>

        {/* Wallet Overview Card */}
        <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800">
          <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
            <Wallet className="text-emerald-400" /> Wallet Overview
          </h3>

          <div className="flex flex-col gap-4">
            {/* USD is always shown first */}
            <div className="bg-slate-800 p-4 rounded-lg flex justify-between items-center border border-slate-700">
              <div className="flex items-center gap-3">
                <DollarSign className="text-emerald-400 w-5 h-5" />
                <span className="font-medium text-emerald-100">USD Balance</span>
              </div>
              <span className="font-bold text-lg">${user.balance.toFixed(2)}</span>
            </div>
            
            {/* Render all crypto coins */}
            {sortedCoins.map((coin) => {
              const usdValue = coin.balance * coin.price;
              
              return (
                <div key={coin.id} className="bg-slate-800 p-4 rounded-lg flex justify-between items-center border border-slate-700">
                  <div className="flex items-center gap-3">
                    <img src={coin.logo} className="w-6 h-6" alt={coin.symbol} />
                    <div className="flex flex-col">
                      <span className="font-medium text-emerald-100">{coin.name}</span>
                      {/* Show the USD value under the name */}
                      <span className="text-xs text-slate-400">
                        ≈ ${usdValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col text-right">
                    <span className="font-bold text-sm">
                      {coin.balance.toFixed(coin.decimals)} {coin.symbol}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
}

export default Profile;