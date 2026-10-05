'use client';

import { useEffect, useState } from 'react';
import { fetchApi } from '@/lib/api';
import { motion } from 'framer-motion';
import { CurrencyDollarIcon, ArrowUpRightIcon, ArrowDownRightIcon, DocumentTextIcon } from '@heroicons/react/24/outline';

export default function WalletPage() {
  const [wallet, setWallet] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [depositAmount, setDepositAmount] = useState('');
  const [depositing, setDepositing] = useState(false);

  useEffect(() => {
    fetchWallet();
  }, []);

  const fetchWallet = async () => {
    setLoading(true);
    try {
      const res = await fetchApi('/wallet');
      setWallet(res);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleDeposit = async () => {
    if (!depositAmount || Number(depositAmount) <= 0) return;
    setDepositing(true);
    try {
      await fetchApi('/wallet/deposit', {
        method: 'POST',
        body: JSON.stringify({ amount: Number(depositAmount) })
      });
      alert('Deposit initiated successfully');
      setDepositAmount('');
      fetchWallet();
    } catch (e: any) {
      alert(e.message || 'Deposit failed');
    } finally {
      setDepositing(false);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-black text-white mb-2">Wallet</h1>
        <p className="text-[var(--text-secondary)]">Manage your funds and view transactions.</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Balance Card */}
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="lg:col-span-2 glass-card rounded-3xl p-8 relative overflow-hidden bg-gradient-to-br from-blue-900/40 to-purple-900/40 border-blue-500/30">
          <div className="orb-pink w-64 h-64 absolute -bottom-32 -right-32 opacity-40" />
          <h2 className="text-sm font-medium text-blue-200 mb-2 uppercase tracking-wider">Available Balance</h2>
          <div className="text-5xl font-black text-white mb-8">
            {loading ? <div className="skeleton w-48 h-12 rounded" /> : <span dangerouslySetInnerHTML={{ __html: wallet?.balance_html || '$0.00' }} />}
          </div>
          
          <div className="flex gap-4">
            <button className="btn-primary px-6 py-3 rounded-xl text-sm font-bold flex items-center gap-2">
              <ArrowDownRightIcon className="w-5 h-5" /> Withdraw Funds
            </button>
            <button className="px-6 py-3 rounded-xl text-sm font-bold flex items-center gap-2 bg-white/10 hover:bg-white/20 transition-all text-white border border-white/20">
              <ArrowUpRightIcon className="w-5 h-5" /> Transfer
            </button>
          </div>
        </motion.div>

        {/* Deposit Card */}
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card rounded-3xl p-8">
          <h2 className="text-lg font-bold text-white mb-4">Add Funds</h2>
          <p className="text-sm text-[var(--text-secondary)] mb-6">Deposit funds to securely pay for services on Gigneo.</p>
          <div className="space-y-4">
            <div className="relative">
              <CurrencyDollarIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-muted)]" />
              <input
                type="number"
                value={depositAmount}
                onChange={(e) => setDepositAmount(e.target.value)}
                placeholder="Amount (USD)"
                className="input-dark w-full pl-12 pr-4 py-3.5 rounded-xl text-sm"
              />
            </div>
            <button
              onClick={handleDeposit}
              disabled={depositing || !depositAmount}
              className="btn-primary w-full py-3.5 rounded-xl text-sm font-bold disabled:opacity-50"
            >
              <span className="relative z-10">{depositing ? 'Processing...' : 'Deposit via Stripe'}</span>
            </button>
          </div>
        </motion.div>
      </div>

      {/* Transactions */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-card rounded-3xl overflow-hidden">
        <div className="p-6 border-b border-white/5 flex items-center justify-between">
          <h2 className="text-lg font-bold text-white">Recent Transactions</h2>
          <button className="text-sm text-[var(--accent-blue)] hover:text-blue-300 font-medium">View All</button>
        </div>
        <div className="p-6 text-center py-12">
           <DocumentTextIcon className="w-12 h-12 mx-auto mb-4 text-[var(--text-muted)]" />
           <p className="text-[var(--text-secondary)] text-sm">No transactions found.</p>
        </div>
      </motion.div>
    </div>
  );
}
