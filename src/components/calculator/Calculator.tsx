import { useEffect, useLayoutEffect, useRef, useState } from "react"
import { AnimatePresence, motion } from "motion/react"
import { Clock3, Lock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { QuestionStep } from "./QuestionStep"
import { Calculating, CALCULATING_MS } from "./Calculating"
import { ResultCard } from "./ResultCard"
import { LeadDialog } from "./LeadDialog"
import { INDUSTRY_ICONS, MFA_ICONS, SIZE_ICONS } from "./icons"
import { copy } from "@/lib/copy"
import {
  INDUSTRIES,
  MFA,
  SIZES,
  calculateRisk,
  isComplete,
  type Answers,
} from "@/lib/risk"

type Step = "start" | 0 | 1 | 2 | "calculating" | "result"
const TOTAL = 3

const EMPTY: Answers = { industry: null, size: null, mfa: null }

const slide = {
  initial: { opacity: 0, x: 24 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -24 },
  transition: { duration: 0.25, ease: [0.22, 1, 0.36, 1] as const },
}

/** Wysokość treści karty z ResizeObservera; `null`, dopóki nie zmierzymy. */
function useContentHeight() {
  const ref = useRef<HTMLDivElement>(null)
  const [height, setHeight] = useState<number | null>(null)
  useLayoutEffect(() => {
    const el = ref.current
    if (!el) return
    const update = () => setHeight(el.getBoundingClientRect().height)
    update()
    const ro = new ResizeObserver(update)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])
  return { ref, height }
}

export function Calculator({ onOpenSources }: { onOpenSources: () => void }) {
  const [step, setStep] = useState<Step>("start")
  const content = useContentHeight()
  const [answers, setAnswers] = useState<Answers>(EMPTY)
  const [leadOpen, setLeadOpen] = useState(false)
  const result = calculateRisk(answers)

  // Wybór kafelka: krótka pauza, żeby użytkownik zobaczył zaznaczenie, potem dalej.
  function pick<K extends keyof Answers>(
    key: K,
    value: Answers[K],
    next: Step,
  ) {
    setAnswers((a) => ({ ...a, [key]: value }))
    setTimeout(() => setStep(next), 260)
  }

  useEffect(() => {
    if (step !== "calculating") return
    const t = setTimeout(() => setStep("result"), CALCULATING_MS)
    return () => clearTimeout(t)
  }, [step])

  // Trzy segmenty: wypełnia się tyle, na którym kroku jesteś (1/3, 2/3, 3/3).
  const filled = typeof step === "number" ? step + 1 : TOTAL
  const showProgress = step !== "start" && step !== "result"

  return (
    <div
      className="flex w-full max-w-2xl flex-col items-center transition-[padding-top] duration-300 ease-out"
      style={{
        // Wszystkie ekrany trzymają jedną kotwicę; wynik jest wyższy, więc ma własne wyśrodkowanie.
        paddingTop: step === "result" ? "var(--result-top)" : "var(--card-top)",
      }}
    >
      <p
        className={
          step === "start"
            ? "mb-7 text-center text-[1.7rem] leading-tight font-semibold text-navy sm:mb-8"
            : "mb-4 text-center text-xs font-semibold tracking-[0.12em] text-blue uppercase"
        }
      >
        {copy.start.kicker}
      </p>
      <section
        className="relative w-full rounded-3xl bg-white shadow-lift ring-1 ring-navy/8"
        aria-label={copy.start.kicker}
      >
        {/* Dolna krawędź karty dogania treść w 200 ms, w rytmie animacji zmiany kroku. */}
        <motion.div
          className="overflow-hidden"
          animate={{ height: content.height ?? "auto" }}
          initial={false}
          transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
        >
          <div ref={content.ref} className="p-6 sm:p-8">
            {showProgress && (
              <div
                role="progressbar"
                aria-label="Postęp"
                aria-valuemin={0}
                aria-valuemax={TOTAL}
                aria-valuenow={filled}
                className="mb-6 grid grid-cols-3 gap-2"
              >
                {Array.from({ length: TOTAL }, (_, i) => (
                  <span
                    key={i}
                    className="h-1.5 overflow-hidden rounded-full bg-blue-soft"
                  >
                    <span
                      className="block h-full origin-left rounded-full bg-blue transition-transform duration-500 ease-out"
                      style={{ transform: `scaleX(${i < filled ? 1 : 0})` }}
                    />
                  </span>
                ))}
              </div>
            )}

            <AnimatePresence mode="wait" initial={false}>
              {step === "start" && (
                <motion.div
                  key="start"
                  {...slide}
                  className="flex flex-col gap-6"
                >
                  <div className="flex flex-col gap-3">
                    <h1 className="text-balance text-[2rem] leading-[1.08] font-bold tracking-tight text-navy sm:text-[2.75rem]">
                      {copy.start.title}
                    </h1>
                  </div>
                  <ul className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-ink-muted">
                    <li className="inline-flex items-center gap-1.5">
                      <Clock3 className="size-4 text-blue" /> 3 pytania, ok. 30
                      sekund
                    </li>
                    <li className="inline-flex items-center gap-1.5">
                      <Lock className="size-4 text-blue" /> Wynik od razu, bez
                      podawania danych
                    </li>
                  </ul>
                  <Button
                    type="button"
                    onClick={() => setStep(0)}
                    className="h-12 w-full rounded-xl bg-red text-base font-semibold text-white shadow-soft hover:bg-red/90 sm:h-13 sm:w-auto sm:self-start sm:px-6"
                  >
                    {copy.start.cta}
                  </Button>
                  <button
                    type="button"
                    onClick={onOpenSources}
                    className="cursor-pointer self-start text-left text-xs text-ink-muted underline-offset-4 transition-colors hover:text-navy hover:underline"
                  >
                    {copy.start.note} *
                  </button>
                </motion.div>
              )}

              {typeof step === "number" && (
                <motion.div key={`q${step}`} {...slide}>
                  {step === 0 && (
                    <QuestionStep
                      question={copy.questions.industry}
                      options={INDUSTRIES}
                      icons={INDUSTRY_ICONS}
                      value={answers.industry}
                      onSelect={(id) => pick("industry", id, 1)}
                      onBack={() => setStep("start")}
                    />
                  )}
                  {step === 1 && (
                    <QuestionStep
                      question={copy.questions.size}
                      options={SIZES}
                      icons={SIZE_ICONS}
                      value={answers.size}
                      onSelect={(id) => pick("size", id, 2)}
                      onBack={() => setStep(0)}
                    />
                  )}
                  {step === 2 && (
                    <QuestionStep
                      question={copy.questions.mfa}
                      hint={copy.questions.mfaHint}
                      options={MFA}
                      icons={MFA_ICONS}
                      value={answers.mfa}
                      onSelect={(id) => pick("mfa", id, "calculating")}
                      onBack={() => setStep(1)}
                    />
                  )}
                </motion.div>
              )}

              {step === "calculating" && (
                <motion.div key="calc" {...slide}>
                  <Calculating />
                </motion.div>
              )}

              {step === "result" && result && (
                <motion.div key="result" {...slide}>
                  <ResultCard
                    result={result}
                    onSecure={() => setLeadOpen(true)}
                    onChange={() => setStep(0)}
                    onSources={onOpenSources}
                  />
                </motion.div>
              )}
            </AnimatePresence>

            {result && isComplete(answers) && (
              <LeadDialog
                open={leadOpen}
                onOpenChange={setLeadOpen}
                answers={answers}
              />
            )}
          </div>
        </motion.div>
      </section>
    </div>
  )
}
