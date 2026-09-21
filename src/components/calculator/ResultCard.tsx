import { motion } from "motion/react"
import { TrendingDown, TrendingUp, Minus } from "lucide-react"
import { cn } from "cn"
import { Button } from "@/components/ui/button"
import { RiskGauge } from "./RiskGauge"
import { useCountUp } from "./useCountUp"
import { Sentences } from "./Sentences"
import { copy } from "@/lib/copy"
import { formatPLN } from "@/lib/format"
import type { Direction, Level, RiskResult } from "@/lib/risk"

const LEVEL_STYLE: Record<Level, { badge: string }> = {
  low: { badge: "bg-blue-soft text-blue" },
  mid: { badge: "bg-amber-soft text-amber" },
  high: { badge: "bg-navy/5 text-red" },
}

const DIRECTION_ICON: Record<Direction, { icon: typeof TrendingUp; cls: string }> = {
  up: { icon: TrendingUp, cls: "text-navy/60" },
  neutral: { icon: Minus, cls: "text-ink-muted/70" },
  down: { icon: TrendingDown, cls: "text-blue/70" },
}

const fadeUp = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
}

type ResultCardProps = {
  result: RiskResult
  onSecure: () => void
  onChange: () => void
  onSources: () => void
}

/** Dopisek o skali firmy: tylko przy niskim ryzyku i kwocie powyżej tej wartości. */
const SCALE_NOTE_FROM = 5_000_000

export function ResultCard({ result, onSecure, onChange, onSources }: ResultCardProps) {
  const style = LEVEL_STYLE[result.level]
  const animated = useCountUp(result.amount, 1100, 350)
  // Licznik biegnie po zaokrąglonych krokach, żeby nie migotać cyframi po przecinku.
  const shown = formatPLN(
    result.amount >= 1_000_000
      ? Math.round(animated / 100_000) * 100_000
      : Math.round(animated / 10_000) * 10_000,
  )

  // Do zdania wyniku idzie ta sama sformatowana kwota, którą widzi użytkownik po zakończeniu licznika.
  const amountLabel = formatPLN(result.amount)

  return (
    <div className="flex flex-col gap-7">
      <div className="flex flex-col items-center gap-3 text-center">
        <RiskGauge score={result.score} level={result.level} />
        <motion.span
          {...fadeUp}
          transition={{ delay: 0.8, duration: 0.35 }}
          className={cn(
            "mt-1 rounded-full px-3.5 py-1.5 text-sm font-semibold",
            style.badge,
          )}
        >
          {copy.result.level[result.level]}
        </motion.span>
      </div>

      <motion.div
        {...fadeUp}
        transition={{ delay: 0.3, duration: 0.4 }}
        className="flex flex-col items-center gap-1.5 rounded-2xl bg-blue-soft/60 px-4 py-5 text-center ring-1 ring-navy/10"
      >
        <span className="text-sm font-medium text-ink-muted">{copy.result.amountTitle}</span>
        <span className="inline-flex items-start gap-1">
          <span
            className="tabular text-5xl font-bold tracking-tight text-navy sm:text-6xl"
            aria-live="polite"
          >
            {shown}
          </span>
          <button
            type="button"
            onClick={onSources}
            aria-label={`${copy.result.amountTag}. ${copy.sources.title}`}
            title={copy.sources.title}
            className="mt-1 flex size-7 items-center justify-center rounded-full text-2xl leading-none font-semibold text-blue transition-colors hover:bg-blue-soft hover:text-navy focus-visible:ring-3 focus-visible:ring-blue/40 focus-visible:outline-none"
          >
            *
          </button>
        </span>
        {result.level === "low" && result.amount > SCALE_NOTE_FROM && (
          <span className="mt-1 text-sm text-ink-muted">{copy.result.scaleNote}</span>
        )}
      </motion.div>

      <div className="flex flex-col gap-2.5">
        <motion.h3
          {...fadeUp}
          transition={{ delay: 1.0, duration: 0.3 }}
          className="text-xs font-semibold tracking-[0.12em] text-ink-muted uppercase"
        >
          {copy.result.factorsTitle}
        </motion.h3>
        <ul className="flex flex-col gap-2.5">
          {result.factors.map((f, i) => {
            const { icon: Icon, cls } = DIRECTION_ICON[f.direction]
            return (
              <motion.li
                key={f.text}
                {...fadeUp}
                transition={{ delay: 1.1 + i * 0.12, duration: 0.3 }}
                className="flex items-start gap-2"
              >
                <Icon className={cn("mt-0.5 size-3.5 shrink-0", cls)} strokeWidth={2} />
                <span className="text-[0.8rem] leading-[1.5] text-ink-muted">{f.text}</span>
              </motion.li>
            )
          })}
        </ul>
      </div>

      <motion.div
        {...fadeUp}
        transition={{ delay: 1.5, duration: 0.35 }}
        className="flex flex-col items-center gap-4"
      >
        <p className="text-center text-base leading-relaxed font-medium text-ink sm:text-[1.05rem]">
          <Sentences text={copy.result.sentence(result.level, result.mfa, amountLabel)} />
        </p>
        <Button
          type="button"
          onClick={onSecure}
          className="h-12 w-full rounded-xl bg-red text-base font-semibold text-white shadow-soft hover:bg-red/90 sm:h-13 sm:w-[340px]"
        >
          {copy.result.cta}
        </Button>
        <button
          type="button"
          onClick={onChange}
          className="text-sm text-ink-muted/70 underline-offset-4 transition-colors hover:text-ink-muted hover:underline"
        >
          {copy.result.change}
        </button>
      </motion.div>
    </div>
  )
}
