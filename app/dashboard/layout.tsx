export const runtime = 'edge'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import DashboardSidebar from '@/components/DashboardSidebar'

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  return (
    <div style={{ display: 'flex', height: '100vh', background: 'var(--bg)' }}>
      <DashboardSidebar email={user.email ?? ''} />
      <main style={{ flex: 1, height: '100vh', overflow: 'auto', position: 'relative' }}>
        {children}
      </main>
    </div>
  )
}
