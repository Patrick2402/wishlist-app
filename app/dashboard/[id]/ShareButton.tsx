'use client'

import { useState } from 'react'

const B = 'var(--font-sans)'

export default function ShareButton({ slug }: { slug: string }) {
  const [copied, setCopied] = useState(false)

  async function handleCopy() {
    const url = `${window.location.origin}/list/${slug}`
    await navigator.clipboard.writeText(url)
    setCopied(true)
    setTimeout(() => setCopied(false), 2200)
  }

  return (
    <button onClick={handleCopy} className={copied ? 'btn' : 'btn btn-ghost'} style={{ fontSize: 13, padding: '10px 18px', gap: 8, transition: 'all .2s' }}>
      {copied
        ? <><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>Skopiowano!</>
        : <><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><polyline points="16 6 12 2 8 6"/><line x1="12" y1="2" x2="12" y2="15"/></svg>Udostępnij</>
      }
    </button>
  )
}
