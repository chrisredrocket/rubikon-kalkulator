/**
 * Logika kalkulatora — wartości 1:1 ze `specyfikacja.md`.
 * Kwoty w PLN, przeliczone po kursie NBP 3,7998 z 18.09.2026.
 */

export type IndustryId = "finance" | "health" | "industry" | "tech" | "retail" | "services"
export type SizeId = "s1" | "s2" | "s3" | "s4"
export type MfaId = "yes" | "unknown" | "no"
export type Level = "low" | "mid" | "high"
export type Direction = "up" | "down" | "neutral"

export type Answers = {
  industry: IndustryId | null
  size: SizeId | null
  mfa: MfaId | null
}

export type Option<Id extends string> = {
  id: Id
  label: string
  points: number
  /** Krótki opis pod etykietą — tylko tam, gdzie pomaga. */
  hint?: string
  factor: { direction: Direction; text: string }
}

export type IndustryOption = Option<IndustryId> & { multiplier: number }
export type SizeOption = Option<SizeId> & { base: number }
export type MfaOption = Option<MfaId> & { multiplier: number }

/** Mnożnik branży = koszt w branży / średnia globalna 4,99 mln USD (IBM 2026). */
export const INDUSTRIES: IndustryOption[] = [
  {
    id: "finance",
    label: "Finanse i ubezpieczenia",
    points: 3,
    multiplier: 1.26,
    factor: { direction: "up", text: "Finanse: pieniądze i dane klientów w jednym systemie, dokładnie to, po co przychodzą hakerzy" },
  },
  {
    id: "health",
    label: "Ochrona zdrowia",
    points: 3,
    multiplier: 1.33,
    factor: { direction: "up", text: "Ochrona zdrowia: wyciek danych pacjentów to najdroższy incydent ze wszystkich branż" },
  },
  {
    id: "industry",
    label: "Produkcja i przemysł",
    points: 2,
    multiplier: 1.1,
    factor: { direction: "up", text: "Produkcja: przestój linii kosztuje z każdą godziną" },
  },
  {
    id: "tech",
    label: "IT i technologia",
    points: 2,
    multiplier: 1.1,
    factor: { direction: "up", text: "IT: incydent u Ciebie zatrzymuje systemy klientów i uruchamia kary z umów" },
  },
  {
    id: "retail",
    label: "Handel i e-commerce",
    points: 1,
    multiplier: 0.76,
    factor: { direction: "down", text: "Handel: koszt incydentu niższy, ale przestój sklepu zatrzymuje sprzedaż od pierwszej godziny" },
  },
  {
    id: "services",
    label: "Usługi i inne",
    points: 1,
    multiplier: 1.02,
    factor: { direction: "neutral", text: "Usługi: dane klientów i faktury to częsty cel hakerów" },
  },
]

/** Baza = koszt jednego incydentu wg wielkości firmy (Hiscox 2026, Sophos 2026, IBM 2026). */
export const SIZES: SizeOption[] = [
  {
    id: "s1",
    label: "1–49",
    hint: "mikro i mała firma",
    points: 1,
    base: 200_000,
    factor: { direction: "down", text: "Mała firma: mniej kont, ale nikt ich nie pilnuje" },
  },
  {
    id: "s2",
    label: "50–249",
    hint: "średnia firma",
    points: 2,
    base: 1_400_000,
    factor: { direction: "neutral", text: "Średnia firma: dziesiątki kont, najczęściej bez nikogo od bezpieczeństwa" },
  },
  {
    id: "s3",
    label: "250–999",
    hint: "duża firma",
    points: 3,
    base: 6_500_000,
    factor: { direction: "up", text: "Duża firma: setki kont i dostawców, jeden słaby punkt wystarczy" },
  },
  {
    id: "s4",
    label: "1000+",
    hint: "korporacja",
    points: 3,
    base: 19_000_000,
    factor: { direction: "up", text: "Ponad tysiąc pracowników: jedno przejęte konto otwiera hakerom wszystkie działy naraz" },
  },
]

/** Mnożnik MFA to założenie projektowe (±15%), nie dana ze źródła — patrz specyfikacja 4.3. */
export const MFA: MfaOption[] = [
  {
    id: "yes",
    label: "Tak, wszędzie",
    points: 0,
    multiplier: 0.85,
    factor: { direction: "down", text: "MFA działa: najczęstsza droga włamania zamknięta. Koszt przestoju i kar zostaje" },
  },
  {
    id: "unknown",
    label: "Tylko częściowo",
    points: 2,
    multiplier: 1.0,
    factor: { direction: "up", text: "MFA tylko częściowo: jedno niezabezpieczone konto wystarczy do włamania" },
  },
  {
    id: "no",
    label: "Nie lub nie wiem",
    points: 4,
    multiplier: 1.15,
    factor: { direction: "up", text: "Brak MFA: jedna przejęta skrzynka otwiera drogę do pieniędzy i danych" },
  },
]

export const THRESHOLDS = { lowMax: 4, midMax: 7 } as const
export const SCORE_MIN = 2
export const SCORE_MAX = 10

export type Factor = { direction: Direction; text: string }

export type RiskResult = {
  score: number
  level: Level
  /** Kwota po zaokrągleniu do wyświetlenia. */
  amount: number
  /** Kwota surowa, przed zaokrągleniem. */
  amountRaw: number
  factors: Factor[]
  mfa: MfaId
}

export function findIndustry(id: IndustryId) {
  return INDUSTRIES.find((o) => o.id === id)!
}
export function findSize(id: SizeId) {
  return SIZES.find((o) => o.id === id)!
}
export function findMfa(id: MfaId) {
  return MFA.find((o) => o.id === id)!
}

export function levelFromScore(score: number): Level {
  if (score <= THRESHOLDS.lowMax) return "low"
  if (score <= THRESHOLDS.midMax) return "mid"
  return "high"
}

/** Poniżej 1 mln do 10 tys., od 1 mln do 0,1 mln. */
export function roundAmount(value: number) {
  if (value < 1_000_000) return Math.round(value / 10_000) * 10_000
  return Math.round(value / 100_000) * 100_000
}

const ORDER: Record<Direction, number> = { up: 0, neutral: 1, down: 2 }

export function isComplete(a: Answers): a is { industry: IndustryId; size: SizeId; mfa: MfaId } {
  return a.industry !== null && a.size !== null && a.mfa !== null
}

export function calculateRisk(answers: Answers): RiskResult | null {
  if (!isComplete(answers)) return null
  const industry = findIndustry(answers.industry)
  const size = findSize(answers.size)
  const mfa = findMfa(answers.mfa)

  const score = industry.points + size.points + mfa.points
  const amountRaw = size.base * industry.multiplier * mfa.multiplier

  // Najpierw czynniki, które podbijają wynik, potem neutralne, na końcu obniżające.
  // Gdy wszystkie trzy obniżają, zostają dwa — resztę mówi zdanie wyniku.
  const all = [industry.factor, size.factor, mfa.factor].sort(
    (a, b) => ORDER[a.direction] - ORDER[b.direction],
  )
  const factors = all.every((f) => f.direction === "down") ? all.slice(0, 2) : all

  return {
    score,
    level: levelFromScore(score),
    amount: roundAmount(amountRaw),
    amountRaw,
    factors,
    mfa: mfa.id,
  }
}
