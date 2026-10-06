'use client';

import { useEffect, useState } from 'react';
import { fetchApi } from '@/lib/api';

export default function SupportPage() {
  const [tickets, setTickets] = useState<any[]>([]);
  const [active, setActive] = useState<any>(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [reply, setReply] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  const load = () => {
    fetchApi('/support')
      .then((r) => setTickets(r.items || []))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const open = async (id: number) => {
    const res = await fetchApi(`/support/${id}`);
    setActive(res.item || res);
  };

  const create = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await fetchApi('/support', { method: 'POST', body: JSON.stringify({ title, content }) });
      setTitle('');
      setContent('');
      load();
    } catch (err: any) {
      setError(err.message || 'Could not open ticket.');
    }
  };

  const sendReply = async () => {
    if (!active || !reply.trim()) return;
    try {
      await fetchApi(`/support/${active.id}/reply`, {
        method: 'POST',
        body: JSON.stringify({ content: reply.trim() }),
      });
      setReply('');
      open(active.id);
    } catch (err: any) {
      setError(err.message || 'Could not send reply.');
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-black mb-2" style={{ color: 'var(--text-primary)' }}>Support</h1>
        <p style={{ color: 'var(--text-secondary)' }}>Open a ticket and follow the conversation.</p>
      </div>
      {error && <p className="text-sm text-red-400">{error}</p>}
      <div className="grid lg:grid-cols-2 gap-6">
        <form onSubmit={create} className="glass-card rounded-3xl p-6 space-y-4">
          <h2 className="font-bold" style={{ color: 'var(--text-primary)' }}>New ticket</h2>
          <input required value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Subject" className="input-dark w-full px-4 py-3 rounded-xl text-sm" />
          <textarea required value={content} onChange={(e) => setContent(e.target.value)} placeholder="How can we help?" rows={5} className="input-dark w-full px-4 py-3 rounded-xl text-sm" />
          <button className="btn-primary px-6 py-3 rounded-xl text-sm font-bold">Submit</button>
        </form>
        <div className="glass-card rounded-3xl overflow-hidden">
          {loading ? <div className="p-6 skeleton h-24" /> : tickets.length === 0 ? (
            <p className="p-8 text-sm" style={{ color: 'var(--text-muted)' }}>No tickets yet.</p>
          ) : tickets.map((ticket) => (
            <button key={ticket.id} onClick={() => open(ticket.id)} className="w-full text-left px-5 py-4 border-b border-white/5">
              <p className="font-semibold" style={{ color: 'var(--text-primary)' }}>{ticket.title}</p>
              <p className="text-xs capitalize" style={{ color: 'var(--text-muted)' }}>{ticket.status}</p>
            </button>
          ))}
        </div>
      </div>
      {active && (
        <div className="glass-card rounded-3xl p-6 space-y-4">
          <h2 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>{active.title}</h2>
          <div className="text-sm" style={{ color: 'var(--text-secondary)' }} dangerouslySetInnerHTML={{ __html: active.content || '' }} />
          <div className="space-y-3">
            {(active.replies || []).map((item: any) => (
              <div key={item.id} className="rounded-2xl px-4 py-3" style={{ background: 'rgba(255,255,255,0.7)' }}>
                <div className="text-sm" dangerouslySetInnerHTML={{ __html: item.content || '' }} />
              </div>
            ))}
          </div>
          <div className="flex gap-2">
            <input value={reply} onChange={(e) => setReply(e.target.value)} className="input-dark flex-1 px-4 py-3 rounded-xl text-sm" placeholder="Reply" />
            <button onClick={sendReply} className="btn-primary px-5 rounded-xl text-sm">Send</button>
          </div>
        </div>
      )}
    </div>
  );
}
