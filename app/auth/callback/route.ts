export const runtime = 'edge'

import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import type { EmailOtpType } from '@supabase/supabase-js'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const tokenHash = searchParams.get('token_hash')
  const type = (searchParams.get('type') ?? 'magiclink') as EmailOtpType
  const next = searchParams.get('next') ?? '/dashboard'

  try {
    const supabase = await createClient()

    if (tokenHash) {
      const { error } = await supabase.auth.verifyOtp({ type, token_hash: tokenHash })
      if (error) return NextResponse.redirect(`${origin}/login?error=link_expired`)
      return NextResponse.redirect(`${origin}${next}`)
    }

    if (code) {
      const { error } = await supabase.auth.exchangeCodeForSession(code)
      if (error) return NextResponse.redirect(`${origin}/login?error=link_expired`)
      return NextResponse.redirect(`${origin}${next}`)
    }
  } catch {
    // any unhandled error → safe redirect instead of Cloudflare 500
  }

  return NextResponse.redirect(`${origin}/login?error=invalid_link`)
}
