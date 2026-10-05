'use client';

import Link from 'next/link';
import { SparklesIcon } from '@heroicons/react/24/outline';

const footerLinks = {
  'Marketplace': [
    { label: 'Browse Services', href: '/services' },
    { label: 'Find Jobs', href: '/jobs' },
    { label: 'Hire Talent', href: '/freelancers' },
    { label: 'Companies', href: '/employers' },
  ],
  'Company': [
    { label: 'About Gigneo', href: '#' },
    { label: 'Careers', href: '#' },
    { label: 'Press', href: '#' },
    { label: 'Blog', href: '#' },
  ],
  'Support': [
    { label: 'Help Center', href: '#' },
    { label: 'Contact Us', href: '#' },
    { label: 'Privacy Policy', href: '#' },
    { label: 'Terms of Service', href: '#' },
  ],
};

export default function Footer() {
  return (
    <footer style={{ background: 'var(--bg-secondary)', borderTop: '1px solid var(--border)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center space-x-2 mb-5">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center btn-primary">
                <SparklesIcon className="w-5 h-5 text-white relative z-10" />
              </div>
              <span className="text-lg font-bold">Gig<span className="gradient-text-blue">neo</span></span>
            </Link>
            <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              The premium marketplace where world-class talent meets visionary companies.
            </p>
            <div className="flex items-center space-x-4 mt-6">
              {['𝕏', 'in', 'f', 'ig'].map((s) => (
                <a key={s} href="#" className="w-9 h-9 rounded-lg flex items-center justify-center text-sm font-bold transition-all hover:bg-white/5"
                  style={{ border: '1px solid var(--border)', color: 'var(--text-secondary)' }}
                >
                  {s}
                </a>
              ))}
            </div>
          </div>

          {/* Link Groups */}
          {Object.entries(footerLinks).map(([group, links]) => (
            <div key={group}>
              <h4 className="text-sm font-semibold text-white mb-5 tracking-wider uppercase">{group}</h4>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link href={link.href} className="text-sm transition-colors hover:text-white" style={{ color: 'var(--text-secondary)' }}>
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4" style={{ borderColor: 'var(--border)' }}>
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
            © {new Date().getFullYear()} Gigneo. All rights reserved.
          </p>
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
            Built with ❤️ for creators & builders worldwide.
          </p>
        </div>
      </div>
    </footer>
  );
}
