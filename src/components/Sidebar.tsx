'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Sidebar() {
  const pathname = usePathname();

  const navItems = [
    { name: 'Overview', href: '/dashboard' },
    { name: 'My Wallet', href: '/dashboard/wallet' },
    { name: 'Active Orders', href: '/dashboard/orders' },
    { name: 'Proposals', href: '/dashboard/proposals' },
    { name: 'Messages', href: '/dashboard/chat' },
    { name: 'Settings', href: '/dashboard/settings' },
  ];

  return (
    <aside className="w-64 bg-white border-r border-gray-100 hidden md:block flex-shrink-0 min-h-screen pt-8">
      <nav className="space-y-1 px-4">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`block px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                isActive 
                  ? 'bg-blue-50 text-blue-700' 
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              {item.name}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
