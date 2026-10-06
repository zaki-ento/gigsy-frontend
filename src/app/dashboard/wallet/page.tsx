'use client';

import { useEffect, useState } from 'react';
import { fetchApi } from '@/lib/api';
import { motion } from 'framer-motion';
import { CurrencyDollarIcon, ArrowDownRightIcon, DocumentTextIcon } from '@heroicons/react/24/outline';

export default function WalletPage() {
  const [wallet, setWallet] = useState<any>(null);
  const [invoices, setInvoices] = useState<any[]>([]);
  const [payouts, setPayouts] = useState<any[]>([]);
  const [withdrawals, setWithdrawals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [depositAmount, setDepositAmount] = useState('');
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [payoutId, setPayoutId] = useState('');
  const [depositing, setDepositing] = useState(false);
  const [withdrawing, setWithdrawing] = useState(false);

  useEffect(() => {
    fetchWallet();
  }, []);

  const fetchWallet = async () => {
    setLoading(true);
    try {
      const res = await fetchApi('/wallet');
      setWallet(res.wallet || res);
      const [invoiceRes, payoutRes, withdrawalRes] = await Promise.all([
        fetchApi('/wallet/invoices').catch(() => ({ items: [] })),
        fetchApi('/wallet/payouts').catch(() => ({ payouts: [] })),
        fetchApi('/wallet/withdrawals').catch(() => ({ items: [] })),
      ]);
      setInvoices(invoiceRes.items || []);
      setPayouts(payoutRes.payouts || []);
      setWithdrawals(withdrawalRes.items || []);
      const firstPayout = (payoutRes.payouts || [])[0];
      if (firstPayout?.id) setPayoutId(String(firstPayout.id));
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
      const res = await fetchApi('/wallet/deposit', {
        method: 'POST',
        body: JSON.stringify({ amount: Number(depositAmount) })
      });
      if (res.redirect) {
        window.location.href = res.redirect;
        return;
      }
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
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="lg:col-span-2 glass-card rounded-3xl p-8 relative overflow-hidden">
          <div className="orb-blue w-64 h-64 absolute -bottom-32 -right-32 opacity-50" />
          <h2 className="text-sm font-medium mb-2 uppercase tracking-wider" style={{ color: 'var(--accent-blue)' }}>Available Balance</h2>
          <div className="text-5xl font-black mb-3" style={{ color: 'var(--text-primary)' }}>
            {loading ? <div className="skeleton w-48 h-12 rounded" /> : <span dangerouslySetInnerHTML={{ __html: wallet?.balance_html || '$0.00' }} />}
          </div>
          <p className="text-sm mb-8" style={{ color: 'var(--text-secondary)' }}>{wallet?.credits ?? 0} credits available</p>

          <div className="flex flex-col sm:flex-row gap-3 max-w-md">
            <input className="input-dark flex-1 px-4 py-3 rounded-xl text-sm" placeholder="Withdraw amount" value={withdrawAmount} onChange={(e) => setWithdrawAmount(e.target.value)} />
            <select className="input-dark px-4 py-3 rounded-xl text-sm" value={payoutId} onChange={(e) => setPayoutId(e.target.value)}>
              <option value="">Payout method</option>
              {payouts.map((p) => (
                <option key={p.id} value={p.id}>{p.title || p.type || p.id}</option>
              ))}
            </select>
            <button
              disabled={withdrawing || !withdrawAmount || !payoutId}
              onClick={async () => {
                setWithdrawing(true);
                try {
                  await fetchApi('/wallet/withdrawals', { method: 'POST', body: JSON.stringify({ amount: Number(withdrawAmount), payout_id: payoutId }) });
                  setWithdrawAmount('');
                  fetchWallet();
                } catch (e: any) {
                  alert(e.message || 'Withdrawal failed');
                } finally {
                  setWithdrawing(false);
                }
              }}
              className="btn-primary px-5 py-3 rounded-xl text-sm font-bold flex items-center gap-2 disabled:opacity-50"
            >
              <ArrowDownRightIcon className="w-5 h-5" /> {withdrawing ? 'Sending…' : 'Withdraw'}
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
        {invoices.length === 0 && withdrawals.length === 0 ? (
          <div className="p-6 text-center py-12">
            <DocumentTextIcon className="w-12 h-12 mx-auto mb-4 text-[var(--text-muted)]" />
            <p className="text-[var(--text-secondary)] text-sm">No transactions found.</p>
          </div>
        ) : (
          <div className="divide-y divide-white/5">
            {invoices.map((item) => (
              <div key={`inv-${item.id}`} className="px-6 py-4 flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{item.title || `Invoice #${item.id}`}</p>
                  <p className="text-xs capitalize" style={{ color: 'var(--text-muted)' }}>{item.status} · {item.type}</p>
                </div>
                <span className="text-sm font-bold" dangerouslySetInnerHTML={{ __html: item.total_html || '' }} />
              </div>
            ))}
            {withdrawals.map((item) => (
              <div key={`wd-${item.id}`} className="px-6 py-4 flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>Withdrawal #{item.id}</p>
                  <p className="text-xs capitalize" style={{ color: 'var(--text-muted)' }}>{item.status}</p>
                </div>
                <span className="text-sm font-bold" dangerouslySetInnerHTML={{ __html: item.total_html || '' }} />
              </div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
}
