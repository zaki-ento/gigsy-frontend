'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { fetchApi } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';

export default function OrderDetailPage() {
  const { id } = useParams();
  const { profile } = useAuth();
  const [order, setOrder] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [text, setText] = useState('');
  const [note, setNote] = useState('');
  const [busy, setBusy] = useState('');
  const [error, setError] = useState('');

  const load = async () => {
    const [orderRes, messageRes] = await Promise.all([
      fetchApi(`/order/${id}`),
      fetchApi(`/order/${id}/messages`).catch(() => ({ items: [] })),
    ]);
    setOrder(orderRes.item || orderRes);
    const raw = messageRes.items;
    setMessages(Array.isArray(raw) ? raw : raw?.messages || []);
  };

  useEffect(() => {
    if (id) load().catch((e) => setError(e.message));
  }, [id]);

  const act = async (action: string) => {
    setBusy(action);
    setError('');
    try {
      await fetchApi(`/order/${id}/${action}`, {
        method: 'POST',
        body: JSON.stringify(note ? { message: note, detail: note, reason: note } : {}),
      });
      setNote('');
      await load();
    } catch (e: any) {
      setError(e.message || 'Action failed');
    } finally {
      setBusy('');
    }
  };

  const send = async () => {
    if (!text.trim()) return;
    setBusy('message');
    try {
      await fetchApi(`/order/${id}/messages`, {
        method: 'POST',
        body: JSON.stringify({ message: text.trim() }),
      });
      setText('');
      await load();
    } catch (e: any) {
      setError(e.message || 'Could not send message');
    } finally {
      setBusy('');
    }
  };

  const role = profile?.type || profile?.profile_type;
  const title = order?.service?.title || order?.job?.title || `Order #${id}`;

  return (
    <div className="space-y-6">
      <Link href="/dashboard/orders" className="inline-flex items-center gap-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
        <ArrowLeftIcon className="w-4 h-4" /> Orders
      </Link>
      {!order ? (
        <div className="skeleton h-40 rounded-3xl" />
      ) : (
        <div className="glass-card rounded-3xl p-8">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-wider mb-2" style={{ color: 'var(--text-muted)' }}>{order.formatted_id || `#${order.id}`}</p>
              <h1 className="text-3xl font-black" style={{ color: 'var(--text-primary)' }}>{title}</h1>
              <p className="mt-2 capitalize text-sm" style={{ color: 'var(--text-secondary)' }}>{order.status} · {order.stage || order.type}</p>
            </div>
            <div className="text-2xl font-black" dangerouslySetInnerHTML={{ __html: order.total_html || '' }} />
          </div>
          {error && <p className="mt-4 text-sm text-red-400">{error}</p>}
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Note for delivery, revision, or cancellation"
            className="input-dark w-full mt-6 px-4 py-3 rounded-2xl text-sm"
            rows={3}
          />
          <div className="flex flex-wrap gap-2 mt-4">
            {role === 'freelancer' && (
              <button disabled={!!busy} onClick={() => act('deliver')} className="btn-primary px-4 py-2 rounded-xl text-sm">{busy === 'deliver' ? 'Sending…' : 'Deliver'}</button>
            )}
            {role !== 'freelancer' && (
              <>
                <button disabled={!!busy} onClick={() => act('approve')} className="btn-primary px-4 py-2 rounded-xl text-sm">Approve</button>
                <button disabled={!!busy} onClick={() => act('revision')} className="btn-glass px-4 py-2 rounded-xl text-sm">Request revision</button>
                <button disabled={!!busy} onClick={() => act('complete')} className="btn-glass px-4 py-2 rounded-xl text-sm">Complete</button>
              </>
            )}
            <button disabled={!!busy} onClick={() => act('cancel')} className="btn-glass px-4 py-2 rounded-xl text-sm">Cancel</button>
          </div>
        </div>
      )}

      <div className="glass-card rounded-3xl p-6">
        <h2 className="text-lg font-bold mb-4" style={{ color: 'var(--text-primary)' }}>Order messages</h2>
        <div className="space-y-3 max-h-80 overflow-y-auto mb-4">
          {messages.length === 0 && <p className="text-sm" style={{ color: 'var(--text-muted)' }}>No messages yet.</p>}
          {messages.map((msg) => (
            <div key={msg.id} className="rounded-2xl px-4 py-3" style={{ background: 'rgba(255,255,255,0.7)', border: '1px solid var(--border)' }}>
              <p className="text-sm" style={{ color: 'var(--text-primary)' }}>{msg.message || msg.filter_message}</p>
            </div>
          ))}
        </div>
        <div className="flex gap-2">
          <input value={text} onChange={(e) => setText(e.target.value)} className="input-dark flex-1 px-4 py-3 rounded-xl text-sm" placeholder="Write a message" />
          <button onClick={send} disabled={busy === 'message'} className="btn-primary px-5 rounded-xl text-sm">Send</button>
        </div>
      </div>
    </div>
  );
}
