import React, { useState } from "react";

const LandingPage = ({ onLogin, onRegister }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { name: "Personal", href: "#personal" },
    { name: "Business", href: "#business" },
    { name: "Wealth", href: "#wealth" },
    { name: "Cards", href: "#cards" },
    { name: "Rates", href: "#rates" },
    { name: "About", href: "#about" },
  ];

  return (
    <div className="min-h-screen bg-white font-sans text-gray-900 antialiased overflow-y-auto scroll-smooth">
      {/* Top Announcement Bar */}
      <div className="bg-gradient-to-r from-emerald-800 to-teal-700 text-white text-center py-2.5 px-4 text-sm font-medium">
        <span className="inline-flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-300 animate-pulse"></span>
          World-class service from your true international private bank • 0% foreign transaction fees
        </span>
      </div>

      {/* Header */}
      <header className="bg-[#0a2e24] text-white sticky top-0 z-50 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16 md:h-20">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-lime-300 to-emerald-400 flex items-center justify-center shadow-lg">
                <span className="font-bold text-[#0a2e24] text-xl">W</span>
              </div>
              <div className="leading-none">
                <div className="font-bold text-base tracking-wide">WF FINANCE</div>
                <div className="text-[10px] tracking-[0.2em] text-emerald-300/90 font-medium">PRIVATE BANK</div>
              </div>
            </div>

            <nav className="hidden lg:flex items-center gap-8">
              {navLinks.map((link) => (
                <a key={link.name} href={link.href} className="text-sm font-medium text-white/80 hover:text-white transition-colors">
                  {link.name}
                </a>
              ))}
            </nav>

            <div className="hidden lg:flex items-center gap-3">
              <button onClick={onLogin} className="text-sm font-medium text-white/90 hover:text-white px-4 py-2">Login</button>
              <button onClick={onRegister} className="bg-lime-300 hover:bg-lime-200 text-[#0a2e24] text-sm font-semibold px-5 py-2.5 rounded-full transition shadow-md">Open Account</button>
            </div>

            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="lg:hidden w-11 h-11 rounded-xl bg-white/10 flex items-center justify-center hover:bg-white/15 transition">
              {mobileMenuOpen ? <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg> : <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-white/10 bg-[#0a2e24]">
            <div className="px-4 py-4 space-y-1">
              {navLinks.map((link) => (
                <a key={link.name} href={link.href} onClick={() => setMobileMenuOpen(false)} className="block px-4 py-3 rounded-xl text-white/90 hover:bg-white/10 font-medium">{link.name}</a>
              ))}
              <div className="pt-4 mt-2 border-t border-white/10 flex flex-col gap-3">
                <button onClick={onLogin} className="w-full text-center py-3 rounded-xl border border-white/20 text-white font-medium">Login</button>
                <button onClick={onRegister} className="w-full text-center py-3 rounded-xl bg-lime-300 text-[#0a2e24] font-semibold">Open Account</button>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section className="relative bg-[#0a2e24] text-white overflow-hidden">
        <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`, backgroundSize: "40px 40px" }} />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 pt-16 pb-24 lg:pt-24 lg:pb-32">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-emerald-500/20 text-emerald-300 text-xs font-semibold px-3 py-1.5 rounded-full mb-6">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span> Welcome to WF Finance International Bank
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-[1.1] tracking-tight mb-6">
                Empowering your<br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-lime-300 to-emerald-300">Day to Day Banking</span>
              </h1>
              <p className="text-lg text-white/70 max-w-lg mb-8 leading-relaxed">
                Simple, secure, and intelligent personal banking — available in person, online, or on your device. Zero commission. Real exchange rates.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 mb-12">
                <button onClick={onRegister} className="bg-lime-300 hover:bg-lime-200 text-[#0a2e24] font-semibold px-8 py-4 rounded-full transition shadow-xl shadow-lime-300/20 flex items-center justify-center gap-2">
                  Enrol New Account
                </button>
                <button onClick={onLogin} className="bg-white/10 hover:bg-white/15 border border-white/20 text-white font-semibold px-8 py-4 rounded-full transition flex items-center justify-center gap-2">
                  Login to Banking
                </button>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
                <div><div className="text-3xl font-bold text-lime-300">13M+</div><div className="text-sm text-white/50 mt-1">Clients worldwide</div></div>
                <div><div className="text-3xl font-bold text-lime-300">0%</div><div className="text-sm text-white/50 mt-1">Commission fees</div></div>
                <div className="col-span-2 sm:col-span-1"><div className="text-3xl font-bold text-lime-300">$500k</div><div className="text-sm text-white/50 mt-1">Transaction limit</div></div>
              </div>
            </div>
            <div className="relative">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl shadow-black/40 border border-white/10">
                <img src="https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=800&q=80" alt="Private banking" className="w-full h-[420px] object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a2e24]/80 via-transparent to-transparent" />
                <div className="absolute bottom-6 left-6 right-6">
                  <div className="bg-white/95 backdrop-blur-xl rounded-2xl p-4 shadow-2xl flex items-center gap-4">
                    <div className="w-12 h-8 bg-gradient-to-r from-red-500 to-orange-500 rounded-md flex items-center justify-center"><span className="text-white text-[10px] font-bold">MC</span></div>
                    <div className="flex-1"><div className="text-[11px] text-gray-500 font-medium">Payment Method</div><div className="font-semibold text-gray-900 tracking-wide">•••• 5550</div></div>
                    <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center"><svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 1. PERSONAL BANKING SECTION */}
      <section id="personal" className="py-20 lg:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">Personal Banking Solutions</h2>
            <p className="text-lg text-gray-600">Expert advice, personalized strategies, and modern tools designed for your everyday life.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {[
              { title: "Cash Flow Optimization", desc: "Improve cash flow through structured savings, intelligent budgeting, and real-time insights.", icon: <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg> },
              { title: "Expert Investment Management", desc: "Professional portfolio management tailored to your goals, risk tolerance, and time horizon.", icon: <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg> },
              { title: "Security & Pension Optimization", desc: "Military-grade encryption, biometric access, and smart pension strategies for your future.", icon: <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg> },
            ].map((item) => (
              <div key={item.title} className="group bg-gray-50 rounded-2xl p-7 border border-gray-100 hover:border-emerald-200 hover:shadow-xl transition-all duration-300">
                <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-5 group-hover:bg-emerald-600 group-hover:text-white transition">{item.icon}</div>
                <h3 className="text-lg font-bold mb-2">{item.title}</h3>
                <p className="text-gray-600 text-[15px] leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 2. CARDS SECTION */}
      <section id="cards" className="py-20 bg-[#0a2e24] text-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="inline-block bg-lime-400/15 text-lime-300 text-xs font-semibold px-3 py-1.5 rounded-full mb-6">Premium Cards</div>
              <h2 className="text-3xl sm:text-4xl font-bold mb-5 leading-tight">The card that works everywhere. <br/>With zero hidden fees.</h2>
              <p className="text-white/70 text-lg leading-relaxed mb-8">
                Get your physical or virtual WF Finance Mastercard instantly. Pay in 150+ currencies at the real exchange rate, with no markups on weekends or holidays.
              </p>
              <ul className="space-y-4 mb-10">
                {["Instant virtual card for online shopping", "Free ATM withdrawals up to $500/month", "Apple Pay & Google Pay ready", "Cashback on everyday spending"].map((item) => (
                  <li key={item} className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-lime-400/20 flex items-center justify-center flex-shrink-0"><svg className="w-3.5 h-3.5 text-lime-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg></div>
                    <span className="text-white/90">{item}</span>
                  </li>
                ))}
              </ul>
              <button onClick={onRegister} className="bg-lime-300 hover:bg-lime-200 text-[#0a2e24] font-semibold px-8 py-3.5 rounded-full transition shadow-lg">Get Your Card</button>
            </div>
            
            {/* 3D Credit Card Visual */}
            <div className="relative flex justify-center lg:justify-end perspective-1000">
              <div className="relative w-full max-w-[400px] aspect-[1.58/1] rounded-2xl bg-gradient-to-br from-gray-900 via-gray-800 to-black p-6 shadow-2xl shadow-black/50 border border-gray-700 overflow-hidden transform rotate-y-[-10deg] rotate-x-[10deg] hover:rotate-0 transition-transform duration-500">
                <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
                <div className="relative z-10 flex flex-col justify-between h-full">
                  <div className="flex justify-between items-start">
                    <div className="text-xl font-bold tracking-widest text-white/90">WF FINANCE</div>
                    <div className="text-lg font-bold italic text-white/80">Mastercard</div>
                  </div>
                  <div className="space-y-4">
                    <div className="w-12 h-9 rounded-md bg-gradient-to-r from-yellow-200 to-yellow-400 border border-yellow-500 relative overflow-hidden">
                       <div className="absolute inset-0 border-r border-b border-yellow-600/50 w-1/2 h-full"></div>
                       <div className="absolute inset-0 border-t border-l border-yellow-600/50 w-1/2 h-1/2 ml-auto"></div>
                    </div>
                    <div className="text-2xl tracking-[0.2em] font-mono text-white/90">5550 4382 9921 0438</div>
                  </div>
                  <div className="flex justify-between items-end">
                    <div>
                      <div className="text-[10px] text-white/50 mb-1">CARD HOLDER</div>
                      <div className="text-sm font-medium tracking-wide">JOHN WICK</div>
                    </div>
                    <div>
                      <div className="text-[10px] text-white/50 mb-1">EXPIRES</div>
                      <div className="text-sm font-medium tracking-wide">12/28</div>
                    </div>
                    <div className="w-12 h-8 bg-white/10 rounded flex items-center justify-center">
                       <svg className="w-6 h-6 text-white/80" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/></svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. BUSINESS SECTION */}
      <section id="business" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="bg-white rounded-3xl p-8 md:p-12 shadow-xl border border-gray-100 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="md:w-2/3">
              <div className="inline-block bg-blue-100 text-blue-800 text-xs font-semibold px-3 py-1.5 rounded-full mb-4">For Businesses</div>
              <h2 className="text-3xl font-bold mb-4">Scale your business with smarter treasury.</h2>
              <p className="text-gray-600 text-lg mb-6">Multi-user access, dedicated relationship managers, and seamless API integrations for your growing company.</p>
              <button onClick={onRegister} className="bg-[#0a2e24] text-white font-semibold px-8 py-3.5 rounded-full hover:bg-[#0d3b2e] transition">Open Business Account</button>
            </div>
            <div className="md:w-1/3 flex justify-center">
               <div className="w-32 h-32 bg-blue-50 rounded-full flex items-center justify-center">
                  <svg className="w-16 h-16 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* RATES SECTION */}
      <section id="rates" className="py-20 bg-[#0a2e24] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-block bg-lime-400/15 text-lime-300 text-xs font-semibold px-3 py-1.5 rounded-full mb-6">Focus Feature</div>
              <h2 className="text-3xl sm:text-4xl font-bold mb-5 leading-tight">Get the real exchange rate.<br />No markup. No surprises.</h2>
              <p className="text-white/70 text-lg leading-relaxed mb-8">We don’t charge fees for spending on your card abroad. We pass Mastercard’s exchange rate directly to you — without extra charges or hidden spreads.</p>
              <ul className="space-y-4 mb-10">
                {["0% foreign transaction fees", "Live mid-market rates", "Instant notifications", "Multi-currency support"].map((item) => (
                  <li key={item} className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-lime-400/20 flex items-center justify-center flex-shrink-0"><svg className="w-3.5 h-3.5 text-lime-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg></div>
                    <span className="text-white/90">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="relative">
              <div className="bg-gradient-to-br from-emerald-900/80 to-[#0a2e24] rounded-3xl p-8 border border-white/10">
                <div className="flex items-center justify-between mb-8">
                  <span className="text-sm text-white/50">Exchange Preview</span>
                  <span className="text-xs bg-emerald-500/20 text-emerald-300 px-2.5 py-1 rounded-full">Live</span>
                </div>
                <div className="space-y-6">
                  <div className="flex justify-between items-end">
                    <div><div className="text-sm text-white/50 mb-1">You send</div><div className="text-3xl font-bold">$10,000</div></div>
                    <div className="text-right"><div className="text-sm text-white/50 mb-1">They receive</div><div className="text-3xl font-bold text-lime-300">€9,247</div></div>
                  </div>
                  <div className="h-px bg-white/10" />
                  <div className="flex justify-between text-sm"><span className="text-white/50">Rate</span><span className="font-medium">1 USD = 0.9247 EUR</span></div>
                  <div className="flex justify-between text-sm"><span className="text-white/50">Our fee</span><span className="font-medium text-lime-300">$0.00</span></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* WEALTH / APP SECTION */}
      <section id="wealth" className="py-20 lg:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="order-2 lg:order-1">
              <div className="relative mx-auto max-w-sm">
                <div className="bg-[#0a2e24] rounded-[2.5rem] p-3 shadow-2xl shadow-emerald-900/20">
                  <div className="bg-white rounded-[2rem] overflow-hidden">
                    <div className="bg-[#0a2e24] text-white px-6 pt-8 pb-6">
                      <div className="flex justify-between items-center mb-6">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-lime-300 text-[#0a2e24] flex items-center justify-center text-xs font-bold">J</div>
                          <div><div className="text-xs text-white/60">Good Evening</div><div className="font-semibold text-sm">John Wick</div></div>
                        </div>
                        <div className="text-right text-xs text-white/60"><div>18:03</div><div>Oct 20, 2026</div></div>
                      </div>
                      <div className="text-xs text-white/50 mb-1">Available Balance</div>
                      <div className="text-3xl font-bold tracking-tight">$20,000.00</div>
                    </div>
                    <div className="p-5 space-y-3">
                      <div className="grid grid-cols-2 gap-3">
                        <button className="bg-gray-50 rounded-xl p-3 text-left text-xs font-medium text-gray-800">Account Info</button>
                        <button className="bg-lime-100 text-emerald-800 rounded-xl p-3 text-left text-xs font-medium">Send Money</button>
                        <button className="bg-gray-50 rounded-xl p-3 text-left text-xs font-medium text-gray-800">Deposit</button>
                        <button className="bg-gray-50 rounded-xl p-3 text-left text-xs font-medium text-gray-800">History</button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="order-1 lg:order-2">
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-5">Wealth in your pocket</h2>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">Full account control, real-time balances, instant transfers, virtual cards, and biometric security — all in one elegant experience.</p>
              <div className="flex flex-wrap gap-4">
                <button onClick={onRegister} className="bg-[#0a2e24] text-white font-semibold px-6 py-3 rounded-full flex items-center gap-2 hover:bg-[#0d3b2e] transition"><svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/></svg> App Store</button>
                <button onClick={onRegister} className="bg-[#0a2e24] text-white font-semibold px-6 py-3 rounded-full flex items-center gap-2 hover:bg-[#0d3b2e] transition"><svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M3.18 23.3L12 14.5l8.82 8.8c-.5.3-1.1.5-1.7.5H4.88c-.6 0-1.2-.2-1.7-.5zm18.64-3.1L13.5 12l8.32-8.2c.4.6.6 1.3.6 2.1v12.2c0 .8-.2 1.5-.6 2.1zM3.18.7C3.7.4 4.3.2 4.88.2h14.24c.6 0 1.2.2 1.7.5L12 9.5 3.18.7z"/></svg> Google Play</button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA & Footer (id="about" on footer) */}
      <footer id="about" className="bg-[#06241c] text-gray-400 pt-16 pb-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-10 mb-14">
            <div className="col-span-2 lg:col-span-1">
              <div className="flex items-center gap-2 mb-5">
                <div className="w-9 h-9 rounded-lg bg-lime-300 flex items-center justify-center font-bold text-[#0a2e24]">W</div>
                <span className="text-white font-semibold">WF Finance</span>
              </div>
              <p className="text-sm leading-relaxed mb-6">Your true international community private bank. Simple. Secure. Transparent.</p>
              <div className="flex gap-4">
                 <button onClick={onRegister} className="bg-lime-300 text-[#0a2e24] font-bold text-xs px-4 py-2 rounded-lg hover:bg-lime-200 transition">Join Today</button>
              </div>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4 text-sm">Products</h4>
              <ul className="space-y-2.5 text-sm">
                <li><a href="#personal" className="hover:text-white transition">Personal Banking</a></li>
                <li><a href="#business" className="hover:text-white transition">Business Accounts</a></li>
                <li><a href="#cards" className="hover:text-white transition">Credit & Debit Cards</a></li>
                <li><a href="#wealth" className="hover:text-white transition">Wealth Management</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4 text-sm">Company</h4>
              <ul className="space-y-2.5 text-sm">
                <li><a href="#" className="hover:text-white transition">About Us</a></li>
                <li><a href="#" className="hover:text-white transition">Careers</a></li>
                <li><a href="#" className="hover:text-white transition">Press</a></li>
                <li><a href="#" className="hover:text-white transition">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4 text-sm">Support</h4>
              <ul className="space-y-2.5 text-sm">
                <li><a href="#" className="hover:text-white transition">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition">Security</a></li>
                <li><a href="#" className="hover:text-white transition">Status</a></li>
                <li><a href="#" className="hover:text-white transition">API Docs</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4 text-sm">Legal</h4>
              <ul className="space-y-2.5 text-sm">
                <li><a href="#" className="hover:text-white transition">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition">Terms of Service</a></li>
                <li><a href="#" className="hover:text-white transition">Cookie Policy</a></li>
                <li><a href="#" className="hover:text-white transition">Licenses</a></li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 text-sm">
            <div>© {new Date().getFullYear()} WF Finance Private Bank. All rights reserved.</div>
            <div className="flex items-center gap-2"><span className="text-lg">🇺🇸</span><span>English</span></div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;