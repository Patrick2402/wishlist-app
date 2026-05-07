import Link from 'next/link'
import { Gift, Share2, ShieldCheck, Sparkles } from 'lucide-react'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Nav */}
      <nav className="flex items-center justify-between px-6 py-4 max-w-6xl mx-auto">
        <div className="flex items-center gap-2 font-bold text-xl text-rose-500">
          <Gift className="w-6 h-6" />
          Wishlist
        </div>
        <div className="flex items-center gap-4">
          <Link href="/login" className="text-slate-600 hover:text-slate-900 text-sm font-medium">
            Zaloguj się
          </Link>
          <Link
            href="/login"
            className="bg-rose-500 hover:bg-rose-600 text-white text-sm font-medium px-4 py-2 rounded-full transition-colors"
          >
            Zacznij za darmo
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="text-center px-6 pt-20 pb-24 max-w-4xl mx-auto">
        <div className="inline-flex items-center gap-2 bg-rose-50 text-rose-600 text-sm font-medium px-4 py-1.5 rounded-full mb-6">
          <Sparkles className="w-4 h-4" />
          Koniec z duplikatami prezentów
        </div>
        <h1 className="text-5xl sm:text-6xl font-extrabold text-slate-900 leading-tight mb-6">
          Lista życzeń,{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-500 to-pink-600">
            którą naprawdę chcesz dostać
          </span>
        </h1>
        <p className="text-xl text-slate-500 mb-10 max-w-2xl mx-auto">
          Dodaj produkty z Allegro, Zalando i każdego innego sklepu. Udostępnij link znajomym —
          oni rezerwują prezenty anonimowo, żebyś się nie dowiedział co dostaniesz.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/login"
            className="bg-rose-500 hover:bg-rose-600 text-white font-semibold px-8 py-4 rounded-2xl text-lg transition-colors shadow-lg shadow-rose-200"
          >
            Stwórz listę życzeń
          </Link>
          <Link
            href="#jak-to-dziala"
            className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold px-8 py-4 rounded-2xl text-lg transition-colors"
          >
            Jak to działa?
          </Link>
        </div>
      </section>

      {/* How it works */}
      <section id="jak-to-dziala" className="bg-slate-50 py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-slate-900 mb-4">Jak to działa?</h2>
          <p className="text-center text-slate-500 mb-12">Trzy proste kroki do idealnych prezentów</p>
          <div className="grid sm:grid-cols-3 gap-8">
            {[
              {
                step: '1',
                title: 'Dodaj produkty',
                desc: 'Wklej link do produktu z dowolnego sklepu — Allegro, Zalando, ASOS. Dodajemy tytuł, zdjęcie i cenę automatycznie.',
                color: 'bg-rose-100 text-rose-600',
              },
              {
                step: '2',
                title: 'Udostępnij link',
                desc: 'Każda lista dostaje unikalny link. Wyślij go rodzinie lub znajomym przez WhatsApp, SMS albo email.',
                color: 'bg-pink-100 text-pink-600',
              },
              {
                step: '3',
                title: 'Prezenty bez duplikatów',
                desc: 'Znajomi rezerwują co kupią — Ty nie widzisz kto co zarezerwował. Żadnych niespodzianek do momentu urodzin!',
                color: 'bg-purple-100 text-purple-600',
              },
            ].map(({ step, title, desc, color }) => (
              <div key={step} className="bg-white rounded-2xl p-6 shadow-sm">
                <div className={`w-10 h-10 rounded-xl ${color} flex items-center justify-center font-bold text-lg mb-4`}>
                  {step}
                </div>
                <h3 className="font-semibold text-slate-900 text-lg mb-2">{title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-6 max-w-5xl mx-auto">
        <h2 className="text-3xl font-bold text-center text-slate-900 mb-12">Wszystko czego potrzebujesz</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { icon: Gift, title: 'Dowolny sklep', desc: 'Allegro, Zalando, ASOS, Amazon — wklejasz link, my resztę robimy.' },
            { icon: Share2, title: 'Łatwe udostępnianie', desc: 'Jeden link do kliknięcia — nie trzeba zakładać konta, żeby zarezerwować.' },
            { icon: ShieldCheck, title: 'Prywatność gwarantowana', desc: 'Właściciel listy nigdy nie widzi kto co zarezerwował — tylko że jest zajęte.' },
          ].map(({ icon: Icon, title, desc }) => (
            <div key={title} className="flex gap-4 p-6 rounded-2xl border border-slate-100 hover:border-rose-100 hover:shadow-sm transition-all">
              <div className="w-10 h-10 bg-rose-50 rounded-xl flex items-center justify-center shrink-0">
                <Icon className="w-5 h-5 text-rose-500" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 mb-1">{title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gradient-to-br from-rose-500 to-pink-600 py-20 px-6 text-center">
        <h2 className="text-3xl font-bold text-white mb-4">Gotowy na idealne prezenty?</h2>
        <p className="text-rose-100 mb-8 text-lg">Stwórz pierwszą listę w mniej niż minutę.</p>
        <Link
          href="/login"
          className="bg-white text-rose-600 font-semibold px-8 py-4 rounded-2xl text-lg hover:bg-rose-50 transition-colors inline-block"
        >
          Zacznij za darmo
        </Link>
      </section>

      {/* Footer */}
      <footer className="text-center text-slate-400 text-sm py-8">
        &copy; {new Date().getFullYear()} Wishlist — Made with love in Poland
      </footer>
    </div>
  )
}
