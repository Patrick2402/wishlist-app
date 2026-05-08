export const runtime = 'edge'

const HTML_ENTITIES: Record<string, string> = {
  '&amp;': '&', '&lt;': '<', '&gt;': '>', '&quot;': '"',
  '&apos;': "'", '&nbsp;': ' ', '&ndash;': '–', '&mdash;': '—',
}

function decodeHtml(str: string): string {
  return str
    .replace(/&#x([0-9a-f]+);/gi, (_, hex) => String.fromCodePoint(parseInt(hex, 16)))
    .replace(/&#([0-9]+);/g, (_, dec) => String.fromCodePoint(parseInt(dec, 10)))
    .replace(/&[a-z]+;/gi, e => HTML_ENTITIES[e.toLowerCase()] ?? e)
    .trim()
}

export async function GET(request: Request) {
  const url = new URL(request.url).searchParams.get('url')
  if (!url) return Response.json({ error: 'missing url' }, { status: 400 })

  try {
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'pl-PL,pl;q=0.9,en-US;q=0.8',
        'Cache-Control': 'no-cache',
      },
      redirect: 'follow',
      signal: AbortSignal.timeout(6000),
    })

    if (!res.ok) return Response.json({ image: null, title: null })

    // Read only first 100KB — enough for <head>, avoids huge product pages
    const reader = res.body?.getReader()
    let html = ''
    let bytes = 0
    if (reader) {
      const decoder = new TextDecoder()
      while (bytes < 100_000) {
        const { done, value } = await reader.read()
        if (done) break
        html += decoder.decode(value, { stream: true })
        bytes += value?.byteLength ?? 0
        // Stop once we've seen </head> — no need to read the rest
        if (html.includes('</head>')) break
      }
      reader.cancel()
    }

    const getMeta = (prop: string) => {
      const m =
        html.match(new RegExp(`<meta[^>]+property=["']${prop}["'][^>]+content=["']([^"']+)["']`, 'i')) ||
        html.match(new RegExp(`<meta[^>]+content=["']([^"']+)["'][^>]+property=["']${prop}["']`, 'i')) ||
        html.match(new RegExp(`<meta[^>]+name=["']${prop}["'][^>]+content=["']([^"']+)["']`, 'i'))
      return m?.[1] ? decodeHtml(m[1]) : null
    }

    const titleFallback = html.match(/<title[^>]*>([^<]+)<\/title>/i)?.[1]
    const title = getMeta('og:title') ?? (titleFallback ? decodeHtml(titleFallback) : null)

    // Strip site name suffix from title (e.g. "Kawa Lavazza | Allegro.pl" → "Kawa Lavazza")
    const cleanTitle = title?.replace(/\s*[|–—-]\s*(allegro\.pl|amazon|zalando|empik|modivo|morele|ceneo).*$/i, '').trim() ?? null

    return Response.json({
      image: getMeta('og:image'),
      title: cleanTitle,
    })
  } catch {
    return Response.json({ image: null, title: null })
  }
}
