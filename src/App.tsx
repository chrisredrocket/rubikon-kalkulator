import { useState } from "react"
import { Phone } from "lucide-react"
import { Logo } from "@/components/brand/Logo"
import { Calculator } from "@/components/calculator/Calculator"
import { SourcesDialog } from "@/components/calculator/SourcesDialog"
import { copy } from "@/lib/copy"

export default function App() {
  const [sourcesOpen, setSourcesOpen] = useState(false)
  // Klik w logo restartuje kalkulator: zmiana klucza montuje komponent od nowa.
  const [resetKey, setResetKey] = useState(0)

  return (
    <div className="flex min-h-dvh flex-col">
      <header className="bg-navy text-white">
        <div className="relative mx-auto flex w-full max-w-5xl items-center justify-between px-4 py-4 sm:px-6">
          <button
            type="button"
            onClick={() => setResetKey((k) => k + 1)}
            aria-label="Wróć na ekran startowy"
            className="-mx-2 rounded-lg px-2 py-1 text-left transition-opacity hover:opacity-90 focus-visible:ring-2 focus-visible:ring-white/60 focus-visible:outline-none"
          >
            <Logo inverted name={copy.brand} tagline="Zanim coś się wydarzy" />
          </button>
          <a
            href="tel:+48221234567"
            className="inline-flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-sm font-medium text-white/85 transition-colors hover:bg-white/10 hover:text-white"
          >
            <Phone className="size-4" strokeWidth={2} aria-hidden="true" />
            <span>
              <span className="hidden sm:inline">Doradca: </span>22 123 45 67
            </span>
          </a>
        </div>
      </header>

      <main
        className="mx-auto flex min-h-[calc(100svh-114px)] w-full max-w-5xl flex-col items-center justify-start px-4 pb-10 sm:px-6 sm:pb-14"
      >
        <Calculator key={resetKey} onOpenSources={() => setSourcesOpen(true)} />
      </main>

      <footer className="mx-auto flex w-full max-w-5xl flex-col items-center gap-2 px-4 pb-8 text-center text-xs text-ink-muted sm:flex-row sm:justify-between sm:px-6">
        <span>© 2026 {copy.brand}</span>
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => setSourcesOpen(true)}
            className="font-medium text-navy underline-offset-4 hover:underline"
          >
            <span aria-hidden="true">* </span>
            {copy.footer.sources}
          </button>
          <span aria-hidden="true">·</span>
          <span>{copy.footer.prototype}</span>
        </div>
      </footer>

      <SourcesDialog open={sourcesOpen} onOpenChange={setSourcesOpen} />
    </div>
  )
}
