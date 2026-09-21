/** „129 200” → „130 tys. zł”, „2 028 600” → „2,0 mln zł”. Wejście już zaokrąglone. */
export function formatPLN(amount: number): string {
  if (amount >= 1_000_000) {
    const mln = amount / 1_000_000
    return `${mln.toLocaleString("pl-PL", { minimumFractionDigits: 1, maximumFractionDigits: 1 })} mln zł`
  }
  return `${Math.round(amount / 1000).toLocaleString("pl-PL")} tys. zł`
}

/** Pełna kwota ze spacjami, do podsumowania w formularzu: „2 000 000 zł”. */
export function formatPLNFull(amount: number): string {
  return `${amount.toLocaleString("pl-PL", { maximumFractionDigits: 0 })} zł`
}
