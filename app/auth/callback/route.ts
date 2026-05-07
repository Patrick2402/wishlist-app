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

  const supabase = await createClient()

  if (tokenHash) {
    // Hash-based OTP (works in any browser — no PKCE verifier needed)
    const { error } = await supabase.auth.verifyOtp({ type, token_hash: tokenHash })
    if (error) {
      return NextResponse.redirect(`${origin}/login?error=link_expired`)
    }
    return NextResponse.redirect(`${origin}${next}`)
  }

  if (code) {
    // PKCE code exchange — verifier must be in cookie from the same browser session
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (error) {
      // Most likely the link was opened in a different browser than where it was requested.
      // Redirect to login with a helpful message.
      return NextResponse.redirect(`${origin}/login?error=link_expired`)
    }
    return NextResponse.redirect(`${origin}${next}`)
  }

  // No code or token_hash — invalid callback URL
  return NextResponse.redirect(`${origin}/login?error=invalid_link`)
}
