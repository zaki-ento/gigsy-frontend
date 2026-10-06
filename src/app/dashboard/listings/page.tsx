'use client';

import { useEffect, useState } from 'react';
import { fetchApi } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';

export default function ListingsPage() {
  const { profile } = useAuth();
  const role = profile?.type || profile?.profile_type || 'freelancer';
  const isEmployer = role === 'employer';
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [budget, setBudget] = useState('');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const load = () => {
    setLoading(true);
    const path = isEmployer ? '/me/jobs' : '/me/services';
    fetchApi(path)
      .then((r) => setItems(r.items || []))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (profile) load();
  }, [profile?.type, profile?.profile_type]);

  const create = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      if (isEmployer) {
        await fetchApi('/me/jobs', {
          method: 'POST',
          body: JSON.stringify({ title, description, budget: budget ? Number(budget) : undefined }),
        });
      } else {
        await fetchApi('/me/services', {
          method: 'POST',
          body: JSON.stringify({
            title,
            description,
            price_plan_one_price: budget ? Number(budget) : undefined,
          }),
        });
      }
      setTitle('');
      setDescription('');
      setBudget('');
      load();
    } catch (err: any) {
      setError(err.message || 'Could not save listing.');
    } finally {
      setSaving(false);
    }
  };

  const runAction = async (id: number, action: string) => {
    const base = isEmployer ? 'job' : 'service';
    try {
      if (action === 'delete') {
        await fetchApi(`/me/${base}/${id}`, { method: 'DELETE' });
      } else {
        await fetchApi(`/me/${base}/${id}/${action}`, { method: 'POST' });
      }
      load();
    } catch (err: any) {
      setError(err.message || 'Action failed');
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-black mb-2" style={{ color: 'var(--text-primary)' }}>{isEmployer ? 'My jobs' : 'My services'}</h1>
        <p style={{ color: 'var(--text-secondary)' }}>Create, publish, pause, or remove your listings.</p>
      </div>

      <form onSubmit={create} className="glass-card rounded-3xl p-6 space-y-4">
        <h2 className="font-bold" style={{ color: 'var(--text-primary)' }}>New {isEmployer ? 'job' : 'service'}</h2>
        {error && <p className="text-sm text-red-400">{error}</p>}
        <input required value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title" className="input-dark w-full px-4 py-3 rounded-xl text-sm" />
        <textarea required value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Description" rows={4} className="input-dark w-full px-4 py-3 rounded-xl text-sm" />
        <input value={budget} onChange={(e) => setBudget(e.target.value)} type="number" min="0" placeholder={isEmployer ? 'Budget' : 'Starting price'} className="input-dark w-full px-4 py-3 rounded-xl text-sm" />
        <button disabled={saving} className="btn-primary px-6 py-3 rounded-xl text-sm font-bold disabled:opacity-50">{saving ? 'Saving…' : 'Save draft'}</button>
      </form>

      <div className="glass-card rounded-3xl overflow-hidden">
        {loading ? (
          <div className="p-6"><div className="skeleton h-16 rounded-xl" /></div>
        ) : items.length === 0 ? (
          <p className="p-8 text-sm" style={{ color: 'var(--text-muted)' }}>No listings yet.</p>
        ) : (
          <div className="divide-y divide-white/5">
            {items.map((item) => (
              <div key={item.id} className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <p className="font-semibold" style={{ color: 'var(--text-primary)' }}>{item.title}</p>
                  <p className="text-xs capitalize" style={{ color: 'var(--text-muted)' }}>{item.status}</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {['publish', 'pause', 'draft', 'clone'].map((action) => (
                    <button key={action} onClick={() => runAction(item.id, action)} className="btn-glass px-3 py-1.5 rounded-lg text-xs capitalize">{action}</button>
                  ))}
                  <button onClick={() => runAction(item.id, 'delete')} className="px-3 py-1.5 rounded-lg text-xs text-red-400">Delete</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
