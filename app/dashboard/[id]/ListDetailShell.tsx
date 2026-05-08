'use client'

import { useState } from 'react'
import AddItemModal from './AddItemModal'

export default function ListDetailShell({ wishlistId }: { wishlistId: string }) {
  const [open, setOpen] = useState(false)
  return (
    <>
      <button onClick={() => setOpen(true)} className="btn btn-pop" style={{ fontSize: 13, padding: '10px 18px', display: 'inline-flex', alignItems: 'center', gap: 6 }}>
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M12 5v14M5 12h14"/></svg>
        Dodaj
      </button>
      <AddItemModal open={open} onClose={() => setOpen(false)} defaultListId={wishlistId} defaultItemCount={0} />
    </>
  )
}
