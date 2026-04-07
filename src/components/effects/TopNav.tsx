import { useState, useEffect } from 'react';
import { createBrowserClient } from '../../lib/supabase';

const NAV_ITEMS = [
  { label: 'TASKS', href: '/tasks' },
  { label: 'BOOKMARKS', href: '/bookmarks' },
  { label: 'PASSWORDS', href: '/passwords' },
];

export default function TopNav() {
  const [scrolled, setScrolled] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });

    const supabase = createBrowserClient();
    supabase.auth.getSession().then(({ data: { session } }) => {
      setLoggedIn(!!session);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setLoggedIn(!!session);
    });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      subscription.unsubscribe();
    };
  }, []);

  return (
    <nav
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 9997,
        padding: '12px 24px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: scrolled ? 'rgba(10, 10, 10, 0.9)' : 'transparent',
        backdropFilter: scrolled ? 'blur(10px)' : 'none',
        transition: 'background-color 0.3s ease, backdrop-filter 0.3s ease',
        fontFamily: "'DM Mono', monospace",
      }}
    >
      {/* Logo */}
      <a
        href="/"
        style={{
          fontFamily: "'Clash Display', sans-serif",
          fontSize: '18px',
          fontWeight: 600,
          color: '#F5F0E8',
          textDecoration: 'none',
          letterSpacing: '-0.02em',
        }}
      >
        cl1nical
      </a>

      {/* Nav Links */}
      <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
        {NAV_ITEMS.map(item => (
          <a
            key={item.label}
            href={item.href}
            style={{
              fontSize: '11px',
              letterSpacing: '0.1em',
              color: 'rgba(245, 240, 232, 0.6)',
              textDecoration: 'none',
              textTransform: 'uppercase',
              transition: 'color 0.2s ease',
            }}
            onMouseEnter={e => (e.target as HTMLElement).style.color = '#F5F0E8'}
            onMouseLeave={e => (e.target as HTMLElement).style.color = 'rgba(245, 240, 232, 0.6)'}
          >
            {item.label}
          </a>
        ))}
        {loggedIn ? (
          <a
            href="/dashboard"
            style={{
              fontSize: '11px',
              letterSpacing: '0.1em',
              color: '#E8A020',
              textDecoration: 'none',
              textTransform: 'uppercase',
            }}
          >
            Dashboard
          </a>
        ) : (
          <a
            href="/login"
            style={{
              fontSize: '11px',
              letterSpacing: '0.1em',
              color: '#E8A020',
              textDecoration: 'none',
              textTransform: 'uppercase',
              padding: '6px 12px',
              border: '1px solid #E8A020',
              borderRadius: '4px',
            }}
          >
            Login
          </a>
        )}
      </div>
    </nav>
  );
}
