'use client'

import React from 'react'

export const Sparkle = ({ size = 22, color = 'var(--c4)', style }: { size?: number; color?: string; style?: React.CSSProperties }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" style={style} aria-hidden="true">
    <path d="M12 2 C12.6 7.5 16.5 11.4 22 12 C16.5 12.6 12.6 16.5 12 22 C11.4 16.5 7.5 12.6 2 12 C7.5 11.4 11.4 7.5 12 2 Z" fill={color} />
  </svg>
)

export const Bow = ({ size = 60, color = 'var(--c2)', style }: { size?: number; color?: string; style?: React.CSSProperties }) => (
  <svg width={size} height={size * 0.78} viewBox="0 0 80 64" style={style} aria-hidden="true">
    <path d="M40 32 C32 16, 12 14, 6 24 C2 32, 8 42, 16 42 C24 42, 32 38, 40 32 Z" fill={color} stroke="rgba(0,0,0,.16)" strokeWidth="1"/>
    <path d="M40 32 C48 16, 68 14, 74 24 C78 32, 72 42, 64 42 C56 42, 48 38, 40 32 Z" fill={color} stroke="rgba(0,0,0,.16)" strokeWidth="1"/>
    <ellipse cx="40" cy="32" rx="6" ry="8" fill={color} stroke="rgba(0,0,0,.20)" strokeWidth="1"/>
    <path d="M36 40 C32 50, 30 58, 32 62" stroke={color} strokeWidth="6" fill="none" strokeLinecap="round"/>
    <path d="M44 40 C48 50, 50 58, 48 62" stroke={color} strokeWidth="6" fill="none" strokeLinecap="round"/>
  </svg>
)

export const Heart = ({ size = 24, color = 'var(--c1)', style, filled = true }: { size?: number; color?: string; style?: React.CSSProperties; filled?: boolean }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" style={style} aria-hidden="true">
    <path d="M12 21 C5 16, 2 12, 2 8 C2 4.5, 5 2, 8 2 C10 2, 11.5 3, 12 5 C12.5 3, 14 2, 16 2 C19 2, 22 4.5, 22 8 C22 12, 19 16, 12 21 Z"
          fill={filled ? color : 'none'} stroke={color} strokeWidth="1.6" strokeLinejoin="round"/>
  </svg>
)

export const Star = ({ size = 22, color = 'var(--c4)', style }: { size?: number; color?: string; style?: React.CSSProperties }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" style={style} aria-hidden="true">
    <path d="M12 2 L14.6 8.5 L21.5 9.2 L16.3 13.8 L17.9 20.6 L12 17 L6.1 20.6 L7.7 13.8 L2.5 9.2 L9.4 8.5 Z"
          fill={color} stroke="rgba(0,0,0,.14)" strokeWidth=".8" strokeLinejoin="round"/>
  </svg>
)

export const Ribbon = ({ width = 200, color = 'var(--c2)', label = 'Nowe', style }: { width?: number; color?: string; label?: string; style?: React.CSSProperties }) => (
  <svg width={width} height={36} viewBox={`0 0 ${width} 36`} style={style} aria-hidden="true">
    <path d={`M0 4 H${width - 12} L${width} 18 L${width - 12} 32 H0 L8 18 Z`} fill={color} stroke="rgba(0,0,0,.16)" strokeWidth="1" strokeLinejoin="round"/>
    <text x={width / 2} y="22" textAnchor="middle" fontFamily="var(--font-sans, system-ui)" fontWeight="600" fontSize="13" fill="var(--ink)" letterSpacing=".05em">{label}</text>
  </svg>
)

export const GiftTag = ({ size = 80, color = 'var(--c3)', style }: { size?: number; color?: string; style?: React.CSSProperties }) => (
  <svg width={size} height={size * 0.7} viewBox="0 0 100 70" style={style} aria-hidden="true">
    <path d="M14 4 L92 4 Q98 4 98 10 L98 60 Q98 66 92 66 L14 66 Q8 66 4 62 L0 35 L4 8 Q8 4 14 4 Z" fill={color} stroke="rgba(0,0,0,.18)" strokeWidth="1"/>
    <circle cx="14" cy="35" r="5" fill="var(--bg)" stroke="rgba(0,0,0,.18)" strokeWidth="1"/>
  </svg>
)

export const SquigglyUnderline = ({ width = 180, color = 'var(--c1)', style }: { width?: number; color?: string; style?: React.CSSProperties }) => (
  <svg width={width} height={12} viewBox={`0 0 ${width} 12`} style={style} aria-hidden="true" preserveAspectRatio="none">
    <path d={`M2 8 Q ${width * 0.15} 2, ${width * 0.3} 7 T ${width * 0.6} 7 T ${width * 0.95} 6`}
          stroke={color} strokeWidth="3.5" fill="none" strokeLinecap="round"/>
  </svg>
)

export const ScribbleArrow = ({ size = 60, color = 'currentColor', style }: { size?: number; color?: string; style?: React.CSSProperties }) => (
  <svg width={size} height={size} viewBox="0 0 60 60" style={style} aria-hidden="true">
    <path d="M6 8 Q 20 24, 12 38 Q 8 48, 22 50 Q 38 52, 50 36"
          stroke={color} strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M44 30 L50 36 L44 42" stroke={color} strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

export const ConfettiCluster = ({ size = 140, style }: { size?: number; style?: React.CSSProperties }) => (
  <svg width={size} height={size} viewBox="0 0 140 140" style={style} aria-hidden="true">
    <rect x="20" y="22" width="10" height="16" rx="2" fill="var(--c1)" transform="rotate(-18 25 30)"/>
    <rect x="60" y="10" width="8" height="14" rx="2" fill="var(--c4)" transform="rotate(22 64 17)"/>
    <rect x="100" y="30" width="10" height="16" rx="2" fill="var(--c5)" transform="rotate(-30 105 38)"/>
    <circle cx="40" cy="80" r="5" fill="var(--c3)"/>
    <circle cx="110" cy="90" r="6" fill="var(--c2)"/>
    <circle cx="80" cy="110" r="4" fill="var(--c1)"/>
    <path d="M20 110 L30 105 L26 118 Z" fill="var(--c4)"/>
    <path d="M120 60 L130 55 L126 68 Z" fill="var(--c5)"/>
    <path d="M70 40 q4 -6 8 0 q-4 6 -8 0z" fill="var(--c2)"/>
  </svg>
)

export const GiftBox = ({ size = 160, style, c1 = 'var(--c1)', c2 = 'var(--c2)' }: { size?: number; style?: React.CSSProperties; c1?: string; c2?: string }) => (
  <svg width={size} height={size} viewBox="0 0 160 160" style={style} aria-hidden="true">
    <ellipse cx="80" cy="148" rx="46" ry="6" fill="rgba(31,26,20,.08)"/>
    <rect x="22" y="60" width="116" height="86" rx="6" fill={c1} stroke="rgba(0,0,0,.20)" strokeWidth="1.4"/>
    <rect x="14" y="48" width="132" height="22" rx="6" fill={c1} stroke="rgba(0,0,0,.20)" strokeWidth="1.4"/>
    <rect x="72" y="48" width="16" height="98" fill={c2} stroke="rgba(0,0,0,.20)" strokeWidth="1"/>
    <path d="M80 48 C 60 30, 30 26, 28 40 C 26 52, 50 56, 80 48 Z" fill={c2} stroke="rgba(0,0,0,.20)" strokeWidth="1.2"/>
    <path d="M80 48 C 100 30, 130 26, 132 40 C 134 52, 110 56, 80 48 Z" fill={c2} stroke="rgba(0,0,0,.20)" strokeWidth="1.2"/>
    <ellipse cx="80" cy="48" rx="8" ry="9" fill={c2} stroke="rgba(0,0,0,.20)" strokeWidth="1.2"/>
    <path d="M40 28 l1 4 l4 1 l-4 1 l-1 4 l-1 -4 l-4 -1 l4 -1 z" fill="var(--c4)"/>
    <path d="M132 90 l1 4 l4 1 l-4 1 l-1 4 l-1 -4 l-4 -1 l4 -1 z" fill="var(--c4)"/>
  </svg>
)

export const FloatingDeco = ({
  children, top, left, right, bottom, rot = 0, delay = 0, scale = 1,
}: {
  children: React.ReactNode
  top?: number | string
  left?: number | string
  right?: number | string
  bottom?: number | string
  rot?: number
  delay?: number
  scale?: number
}) => (
  <div aria-hidden="true" style={{
    position: 'absolute', top, left, right, bottom,
    pointerEvents: 'none',
    animation: `float-soft 6s ease-in-out infinite`,
    animationDelay: `${delay}s`,
    transform: `rotate(${rot}deg) scale(${scale})`,
    ['--rot' as string]: `${rot}deg`,
  }}>
    {children}
  </div>
)
