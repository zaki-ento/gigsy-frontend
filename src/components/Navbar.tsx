'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BriefcaseIcon,
  SparklesIcon,
  UserGroupIcon,
  BuildingOfficeIcon,
  BellIcon,
  ChevronDownIcon,
  Bars3Icon,
  XMarkIcon,
  MagnifyingGlassIcon,
  ArrowRightOnRectangleIcon,
  Cog6ToothIcon,
  RectangleStackIcon,
} from '@heroicons/react/24/outline';

const navLinks = [
  { label: 'Services', href: '/services', icon: SparklesIcon },
  { label: 'Find Work', href: '/jobs', icon: BriefcaseIcon },
  { label: 'Talent', href: '/freelancers', icon: UserGroupIcon },
  { label: 'Companies', href: '/employers', icon: BuildingOfficeIcon },
];

export default function Navbar() {
  const { token, profile, logout } = useAuth();
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close menus on route change
  useEffect(() => {
    setMenuOpen(false);
    setProfileOpen(false);
  }, [pathname]);

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + '/');

  return (
    <>
      <header
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-500"
        style={{
          background: scrolled ? 'rgba(255,255,255,0.72)' : 'rgba(255,255,255,0.42)',
          backdropFilter: 'blur(24px) saturate(180%)',
          WebkitBackdropFilter: 'blur(24px) saturate(180%)',
          borderBottom: '1px solid rgba(255,255,255,0.7)',
          boxShadow: scrolled ? '0 8px 30px rgba(28,39,64,0.06)' : 'none',
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-[72px] py-4">
            {/* Logo */}
            <Link href="/" className="flex items-center shrink-0">
              <img src="/logo-dark.png" alt="Gigneo" className="h-8 w-auto object-contain" />
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center space-x-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center space-x-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                    isActive(link.href)
                      ? 'text-white bg-white/10'
                      : 'text-[var(--text-secondary)] hover:text-white hover:bg-white/5'
                  }`}
                >
                  <link.icon className="w-4 h-4" />
                  <span>{link.label}</span>
                </Link>
              ))}
            </nav>

            {/* Right side */}
            <div className="flex items-center space-x-3">
              {!token ? (
                <>
                  <Link
                    href="/login"
                    className="hidden md:block text-sm font-medium text-[var(--text-secondary)] hover:text-white transition-colors px-4 py-2"
                  >
                    Log In
                  </Link>
                  <Link
                    href="/register"
                    className="btn-primary text-sm font-semibold px-5 py-2.5 rounded-xl flex items-center gap-2"
                  >
                    <span className="relative z-10">Get Started</span>
                  </Link>
                </>
              ) : (
                <div className="flex items-center space-x-3">
                  {/* Notifications */}
                  <Link
                    href="/dashboard/notifications"
                    className="relative w-10 h-10 rounded-xl flex items-center justify-center text-[var(--text-secondary)] hover:text-white hover:bg-white/5 transition-all"
                  >
                    <BellIcon className="w-5 h-5" />
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[var(--accent-pink)]"></span>
                  </Link>

                  {/* Profile Dropdown */}
                  <div className="relative">
                    <button
                      onClick={() => setProfileOpen(!profileOpen)}
                      className="flex items-center space-x-2 rounded-xl px-3 py-2 hover:bg-white/5 transition-all"
                    >
                      <div className="w-8 h-8 rounded-lg overflow-hidden border border-white/10 bg-white/5 flex items-center justify-center">
                        <img src={profile?.avatar || '/default-avatar.png'} alt={profile?.name || ''} className="w-full h-full object-cover" />
                      </div>
                      <span className="hidden md:block text-sm font-medium text-white max-w-[100px] truncate">
                        {profile?.name?.split(' ')[0] || 'Account'}
                      </span>
                      <ChevronDownIcon className={`w-4 h-4 text-[var(--text-secondary)] transition-transform ${profileOpen ? 'rotate-180' : ''}`} />
                    </button>

                    <AnimatePresence>
                      {profileOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: 8, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 8, scale: 0.95 }}
                          transition={{ duration: 0.15 }}
                          className="absolute right-0 mt-2 w-56 glass-card rounded-2xl py-2 overflow-hidden"
                          style={{ border: '1px solid var(--border)' }}
                        >
                          <div className="px-4 py-3 border-b border-white/5">
                            <p className="text-sm font-semibold text-white truncate">{profile?.name}</p>
                            <p className="text-xs text-[var(--text-muted)] capitalize">{profile?.type || 'Member'}</p>
                          </div>
                          {[
                            { href: '/dashboard', label: 'Dashboard', icon: RectangleStackIcon },
                            { href: '/dashboard/settings', label: 'Settings', icon: Cog6ToothIcon },
                          ].map((item) => (
                            <Link
                              key={item.href}
                              href={item.href}
                              className="flex items-center space-x-3 px-4 py-2.5 text-sm text-[var(--text-secondary)] hover:text-white hover:bg-white/5 transition-all"
                            >
                              <item.icon className="w-4 h-4" />
                              <span>{item.label}</span>
                            </Link>
                          ))}
                          <div className="border-t border-white/5 mt-1 pt-1">
                            <button
                              onClick={logout}
                              className="flex items-center space-x-3 w-full px-4 py-2.5 text-sm text-red-400 hover:bg-red-500/10 transition-all"
                            >
                              <ArrowRightOnRectangleIcon className="w-4 h-4" />
                              <span>Sign Out</span>
                            </button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              )}

              {/* Mobile Menu Button */}
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="md:hidden w-10 h-10 rounded-xl flex items-center justify-center hover:bg-white/5 text-[var(--text-secondary)] hover:text-white transition-all"
              >
                {menuOpen ? <XMarkIcon className="w-5 h-5" /> : <Bars3Icon className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed inset-0 z-40 md:hidden"
            style={{ background: 'rgba(247,248,251,0.94)', backdropFilter: 'blur(28px) saturate(180%)' }}
          >
            <div className="flex flex-col h-full pt-24 px-6 pb-8">
              <nav className="flex flex-col space-y-2">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`flex items-center space-x-3 px-4 py-4 rounded-2xl text-base font-medium transition-all ${
                      isActive(link.href)
                        ? 'text-white bg-white/10'
                        : 'text-[var(--text-secondary)] hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <link.icon className="w-5 h-5" />
                    <span>{link.label}</span>
                  </Link>
                ))}
              </nav>

              <div className="mt-auto space-y-3">
                {!token ? (
                  <>
                    <Link href="/login" className="block w-full py-4 text-center rounded-2xl text-white font-medium" style={{ border: '1px solid var(--border)' }}>
                      Log In
                    </Link>
                    <Link href="/register" className="btn-primary block w-full py-4 text-center rounded-2xl font-semibold">
                      <span className="relative z-10">Get Started Free</span>
                    </Link>
                  </>
                ) : (
                  <button onClick={logout} className="block w-full py-4 text-center rounded-2xl text-red-400 font-medium" style={{ border: '1px solid rgba(239,68,68,0.2)' }}>
                    Sign Out
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Spacer so content isn't behind fixed nav */}
      <div className="h-[72px]" />
    </>
  );
}
