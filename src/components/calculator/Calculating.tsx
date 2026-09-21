import { useEffect, useState } from "react"
import { AnimatePresence, motion } from "motion/react"
import { LogoMark } from "@/components/brand/Logo"
import { copy } from "@/lib/copy"

/** Trzy komunikaty po kolei, ok. 1,2 s łącznie. Rodzic kończy krok po `duration`. */
export const CALCULATING_MS = 1300

export function Calculating() {
  const [i, setI] = useState(0)
  useEffect(() => {
    const step = CALCULATING_MS / copy.calculating.length
    const t1 = setTimeout(() => setI(1), step)
    const t2 = setTimeout(() => setI(2), step * 2)
    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
    }
  }, [])

  return (
    <div
      className="flex min-h-[20rem] flex-col items-center justify-center gap-6 text-center"
      role="status"
      aria-live="polite"
    >
      <div className="relative flex size-20 items-center justify-center">
        <motion.span
          className="absolute inset-0 rounded-full border-2 border-blue/30"
          animate={{ scale: [1, 1.5], opacity: [0.7, 0] }}
          transition={{ duration: 1.2, repeat: Infinity, ease: "easeOut" }}
        />
        <motion.span
          className="absolute inset-0 rounded-full border-2 border-blue/30"
          animate={{ scale: [1, 1.5], opacity: [0.7, 0] }}
          transition={{ duration: 1.2, repeat: Infinity, ease: "easeOut", delay: 0.4 }}
        />
        <motion.span
          className="absolute inset-[-6px] rounded-full border-2 border-transparent border-t-blue"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        />
        <LogoMark className="size-11" />
      </div>
      <div className="h-6">
        <AnimatePresence mode="wait">
          <motion.p
            key={i}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.2 }}
            className="text-sm font-medium text-ink-muted"
          >
            {copy.calculating[i]}
          </motion.p>
        </AnimatePresence>
      </div>
    </div>
  )
}
