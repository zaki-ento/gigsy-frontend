'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { fetchApi } from '@/lib/api';
import { BookmarkIcon } from '@heroicons/react/24/outline';

export default function SavedPage() {
  const [groups, setGroups] = useState<Record<string, { items: any[] }>>({});
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    fetchApi('/saved')
      .then((r) => setGroups(r.groups || {}))
      .catch(() => setGroups({}))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const unsave = async (id: number) => {
    await fetchApi('/saved', { method: 'POST', body: JSON.stringify({ id }) });
    load();
  };

  const hrefFor = (type: string, item: any) => {
    if (type === 'service') return `/services/${item.id}`;
    if (type === 'job') return `/jobs/${item.id}`;
    if (type === 'freelancer') return `/freelancers/${item.id}`;
    return `/employers/${item.id}`;
  };

  const entries = Object.entries(groups);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-black mb-2" style={{ color: 'var(--text-primary)' }}>Saved</h1>
        <p style={{ color: 'var(--text-secondary)' }}>Services, jobs, and profiles you bookmarked.</p>
      </div>
      {loading ? (
        <div className="skeleton h-32 rounded-3xl" />
      ) : entries.every(([, group]) => !(group.items || []).length) ? (
        <div className="glass-card rounded-3xl p-12 text-center">
          <BookmarkIcon className="w-12 h-12 mx-auto mb-3" style={{ color: 'var(--text-muted)' }} />
          <p style={{ color: 'var(--text-secondary)' }}>Nothing saved yet.</p>
        </div>
      ) : (
        entries.map(([type, group]) => (
          <section key={type} className="space-y-3">
            <h2 className="text-sm font-semibold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>{type}</h2>
            <div className="glass-card rounded-3xl divide-y divide-white/5">
              {(group.items || []).map((item) => (
                <div key={item.id} className="p-5 flex items-center justify-between gap-4">
                  <Link href={hrefFor(type, item)} className="font-semibold" style={{ color: 'var(--text-primary)' }}>
                    {item.title || item.name}
                  </Link>
                  <button onClick={() => unsave(item.id)} className="text-sm" style={{ color: 'var(--accent-blue)' }}>Remove</button>
                </div>
              ))}
            </div>
          </section>
        ))
      )}
    </div>
  );
}
