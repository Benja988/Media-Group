import React from 'react';

export function Logo({ className = '', size = 32 }: { className?: string; size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden
    >
      <rect width="24" height="24" rx="6" fill="url(#g)" />
      <path d="M7 14c0-2.761 2.239-5 5-5s5 2.239 5 5" stroke="rgba(255,255,255,0.95)" strokeWidth="1.2" strokeLinecap="round" />
      <path d="M4 12c0-4.418 3.582-8 8-8s8 3.582 8 8" stroke="rgba(255,255,255,0.7)" strokeWidth="0.9" strokeLinecap="round" />
      <defs>
        <linearGradient id="g" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0%" stopColor="#7C3AED" />
          <stop offset="100%" stopColor="#2563EB" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export default Logo;
