export const runtime = 'edge'

export async function GET(request: Request) {
  const url = new URL(request.url).searchParams.get('url')
  if (!url) return Response.json({ error: 'missing url' }, { status: 400 })

  try {
    const res = await fetch(url, {
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; Wiszlist/1.0)' },
      signal: AbortSignal.timeout(5000),
    })
    const html = await res.text()

    const get = (prop: string) => {
      const m =
        html.match(new RegExp(`<meta[^>]+property=["']${prop}["'][^>]+content=["']([^"']+)["']`, 'i')) ||
        html.match(new RegExp(`<meta[^>]+content=["']([^"']+)["'][^>]+property=["']${prop}["']`, 'i'))
      return m?.[1] ?? null
    }

    const titleFallback = html.match(/<title[^>]*>([^<]+)<\/title>/i)?.[1]?.trim() ?? null

    return Response.json({
      image: get('og:image'),
      title: get('og:title') ?? titleFallback,
    })
  } catch {
    return Response.json({ image: null, title: null })
  }
}
