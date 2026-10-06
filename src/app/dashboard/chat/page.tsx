'use client';

import { useEffect, useState, useRef } from 'react';
import { fetchApi } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import {
  PaperAirplaneIcon,
  MagnifyingGlassIcon,
  ChatBubbleLeftEllipsisIcon,
} from '@heroicons/react/24/outline';

export default function ChatPage() {
  const { profile } = useAuth();
  const [conversations, setConversations] = useState<any[]>([]);
  const [messages, setMessages] = useState<any[]>([]);
  const [selectedConv, setSelectedConv] = useState<any>(null);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [search, setSearch] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchApi('/chats')
      .then((r) => {
        const convs = r.items || r.conversations || [];
        setConversations(convs);
        if (convs.length > 0) {
          selectConversation(convs[0]);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const selectConversation = async (conv: any) => {
    setSelectedConv(conv);
    setMessages([]);
    try {
      const r = await fetchApi(`/chats/${conv.id || conv.profile_id}/messages`);
      const payload = r.items || {};
      setMessages(payload.messages || r.messages || (Array.isArray(r.items) ? r.items : []));
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!newMessage.trim() || !selectedConv) return;
    const text = newMessage.trim();
    setNewMessage('');
    setSending(true);

    const tempMsg = {
      id: Date.now(),
      message: text,
      sender_id: profile?.profile_id,
      created_at: new Date().toISOString(),
      _sending: true,
    };
    setMessages((prev) => [...prev, tempMsg]);

    try {
      const memberId = selectedConv.id || selectedConv.profile_id;
      await fetchApi(`/chats/${memberId}/messages`, {
        method: 'POST',
        body: JSON.stringify({ message: text }),
      });
      const updated = await fetchApi(`/chats/${memberId}/messages`);
      const payload = updated.items || {};
      setMessages(payload.messages || updated.messages || []);
    } catch (e) {
      console.error(e);
    } finally {
      setSending(false);
    }
  };

  const filteredConvs = conversations.filter((c) =>
    !search || c.name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-3xl font-black text-white mb-2">Messages</h1>
        <p className="text-[var(--text-secondary)]">Chat with clients and freelancers.</p>
      </div>

      <div className="glass-card rounded-3xl overflow-hidden flex" style={{ height: '70vh', minHeight: '500px' }}>
        {/* Sidebar */}
        <div className="w-72 shrink-0 flex flex-col" style={{ borderRight: '1px solid var(--border)' }}>
          {/* Search */}
          <div className="p-4" style={{ borderBottom: '1px solid var(--border)' }}>
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--text-muted)' }} />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search conversations..."
                className="input-dark w-full pl-9 pr-3 py-2.5 rounded-xl text-sm"
              />
            </div>
          </div>

          {/* Conversation List */}
          <div className="flex-1 overflow-y-auto">
            {loading ? (
              <div className="p-4 space-y-3">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="skeleton w-10 h-10 rounded-full shrink-0" />
                    <div className="flex-1 space-y-1.5">
                      <div className="skeleton h-4 w-24 rounded" />
                      <div className="skeleton h-3 w-32 rounded" />
                    </div>
                  </div>
                ))}
              </div>
            ) : filteredConvs.length === 0 ? (
              <div className="p-8 text-center">
                <ChatBubbleLeftEllipsisIcon className="w-10 h-10 mx-auto mb-3" style={{ color: 'var(--text-muted)' }} />
                <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>No conversations yet</p>
              </div>
            ) : (
              filteredConvs.map((conv) => (
                <button
                  key={conv.id || conv.profile_id}
                  onClick={() => selectConversation(conv)}
                  className="w-full flex items-center gap-3 p-4 text-left transition-all hover:bg-white/5"
                  style={{
                    background: selectedConv?.id === conv.id ? 'rgba(79,110,247,0.08)' : 'transparent',
                    borderLeft: `2px solid ${selectedConv?.id === conv.id ? 'var(--accent-blue)' : 'transparent'}`,
                  }}
                >
                  <div className="relative">
                    {conv.avatar ? (
                      <img src={conv.avatar} alt={conv.name} className="w-10 h-10 rounded-full object-cover" />
                    ) : (
                      <div
                        className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white"
                        style={{ background: 'var(--bg-card-hover)', border: '1px solid var(--border)' }}
                      >
                        {conv.name?.charAt(0) || '?'}
                      </div>
                    )}
                    {(conv.is_online || conv.online) && (
                      <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-green-400 border-2 border-[var(--bg-card)]" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-white truncate">{conv.name || 'User'}</p>
                    <p className="text-xs truncate" style={{ color: 'var(--text-muted)' }}>
                      {conv.last_message || 'Start a conversation'}
                    </p>
                  </div>
                  {(conv.unread_count || conv.unread) > 0 && (
                    <span className="text-on-fill text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full" style={{ background: 'var(--accent-blue)' }}>
                      {conv.unread_count || conv.unread}
                    </span>
                  )}
                </button>
              ))
            )}
          </div>
        </div>

        {/* Messages Area */}
        {selectedConv ? (
          <div className="flex-1 flex flex-col min-w-0">
            {/* Header */}
            <div className="flex items-center gap-3 px-6 py-4" style={{ borderBottom: '1px solid var(--border)' }}>
              {selectedConv.avatar ? (
                <img src={selectedConv.avatar} alt={selectedConv.name} className="w-9 h-9 rounded-full object-cover" />
              ) : (
                <div className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold text-white" style={{ background: 'var(--bg-card-hover)' }}>
                  {selectedConv.name?.charAt(0) || '?'}
                </div>
              )}
              <div>
                <p className="font-bold text-white text-sm">{selectedConv.name || 'User'}</p>
                <p className="text-xs" style={{ color: (selectedConv.is_online || selectedConv.online) ? '#1a7f37' : 'var(--text-muted)' }}>
                  {(selectedConv.is_online || selectedConv.online) ? 'Online' : 'Offline'}
                </p>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              <AnimatePresence>
                {messages.map((msg, idx) => {
                  const mine = profile?.profile_id || profile?.id;
                  const isOwn = Number(msg.sender_id) === Number(mine);
                  return (
                    <motion.div
                      key={msg.id || idx}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className="max-w-xs lg:max-w-sm px-4 py-3 rounded-2xl text-sm"
                        style={{
                          background: isOwn ? 'linear-gradient(180deg, #4da3ff, #0071e3)' : 'rgba(255,255,255,0.8)',
                          color: isOwn ? 'white' : 'var(--text-primary)',
                          border: isOwn ? 'none' : '1px solid var(--border)',
                          opacity: msg._sending ? 0.7 : 1,
                        }}
                      >
                        <p>{msg.message || msg.content}</p>
                        <p
                          className="text-xs mt-1 opacity-60"
                          style={{ textAlign: isOwn ? 'right' : 'left' }}
                        >
                          {(msg.sent_at || msg.created_at)
                            ? new Date(msg.sent_at || msg.created_at).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
                            : '...'}
                        </p>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="px-6 py-4" style={{ borderTop: '1px solid var(--border)' }}>
              <div className="flex items-center gap-3">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
                  placeholder="Type a message..."
                  className="input-dark flex-1 px-4 py-3 rounded-2xl text-sm"
                />
                <button
                  onClick={handleSend}
                  disabled={sending || !newMessage.trim()}
                  className="btn-primary w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 disabled:opacity-50"
                >
                  <PaperAirplaneIcon className="w-5 h-5 relative z-10" />
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center text-center">
            <div>
              <ChatBubbleLeftEllipsisIcon className="w-16 h-16 mx-auto mb-4" style={{ color: 'var(--text-muted)' }} />
              <h2 className="text-xl font-bold text-white mb-2">Select a conversation</h2>
              <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                Choose from the list to start messaging.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
