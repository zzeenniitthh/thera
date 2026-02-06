'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navItems = [
  {
    href: '/compass',
    label: 'Compass',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <circle cx="12" cy="12" r="10" />
        <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" fill="currentColor" opacity="0.3" />
      </svg>
    ),
  },
  {
    href: '/journey',
    label: 'Journey',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M12 2L12 22" strokeDasharray="2 4" />
        <circle cx="12" cy="6" r="2" fill="currentColor" opacity="0.5" />
        <circle cx="12" cy="14" r="2" fill="currentColor" opacity="0.3" />
        <circle cx="12" cy="20" r="1.5" fill="currentColor" opacity="0.7" />
      </svg>
    ),
  },
  {
    href: '/new-goal',
    label: 'New Horizon',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <line x1="12" y1="5" x2="12" y2="19" />
        <line x1="5" y1="12" x2="19" y2="12" />
      </svg>
    ),
  },
];

export function Navigation() {
  const pathname = usePathname();

  // Hide nav on exploration pages and home landing
  if (pathname.startsWith('/explore/') || pathname === '/') {
    return null;
  }

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-30 bg-thera-dark-900/80 backdrop-blur-md border-t border-thera-dark-600">
      <div className="flex items-center justify-around max-w-lg mx-auto py-3">
        {navItems.map((item) => {
          const isActive = pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center gap-1 px-4 py-1 transition-all duration-300 ${
                isActive
                  ? 'text-white'
                  : 'text-thera-gray-400 hover:text-thera-gray-200'
              }`}
            >
              {item.icon}
              <span className="text-[10px] tracking-widest uppercase font-mono">
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
