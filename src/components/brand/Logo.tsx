import { cn } from "cn"

type LogoProps = {
  className?: string
  /** Sam sygnet, bez nazwy, do ciasnych miejsc. */
  markOnly?: boolean
  /** Wersja na ciemnym tle. */
  inverted?: boolean
  /** Pierwsza linia; domyślnie „Rubikon”. */
  name?: string
  /** Zdanie pozycjonujące pod nazwą; bez niego pokazujemy „Ubezpieczenia”. */
  tagline?: string
}

/**
 * Sygnet Rubikon: linia, która w połowie drogi robi uskok w górę,
 * moment przekroczenia. Cyberincydent dzieli firmę na „przed” i „po”.
 */
export function LogoMark({ className, inverted }: { className?: string; inverted?: boolean }) {
  return (
    <svg
      viewBox="0 0 32 32"
      aria-hidden="true"
      className={cn("size-8 shrink-0", className)}
    >
      <rect width="32" height="32" rx="9" fill={inverted ? "#fff" : "var(--rubikon-navy)"} />
      <path
        d="M6 20h9l4-8h7"
        fill="none"
        stroke={inverted ? "var(--rubikon-navy)" : "#fff"}
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function Logo({ className, markOnly, inverted, name = "Rubikon", tagline }: LogoProps) {
  return (
    <span
      className={cn("inline-flex items-center gap-2.5", className)}
      aria-label="Rubikon Ubezpieczenia"
      role="img"
    >
      <LogoMark inverted={inverted} />
      {!markOnly && (
        <span className="flex flex-col leading-none">
          <span
            className={cn(
              "text-[1.05rem] font-semibold tracking-tight",
              inverted ? "text-white" : "text-navy",
            )}
          >
            {name}
          </span>
          {tagline ? (
            <span
              className={cn(
                "mt-1 text-[0.78rem] font-medium",
                inverted ? "text-white/75" : "text-ink-muted",
              )}
            >
              {tagline}
            </span>
          ) : (
            <span
              className={cn(
                "mt-1 text-[0.62rem] font-medium tracking-[0.14em] uppercase",
                inverted ? "text-white/70" : "text-ink-muted",
              )}
            >
              Ubezpieczenia
            </span>
          )}
        </span>
      )}
    </span>
  )
}
