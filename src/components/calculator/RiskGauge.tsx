import { motion } from "motion/react"
import { SCORE_MAX, SCORE_MIN, type Level } from "@/lib/risk"

const R = 52
const CX = 60
const CY = 60
const HALF = Math.PI * R

function point(angleDeg: number) {
  const a = (Math.PI * angleDeg) / 180
  return { x: CX - R * Math.cos(a), y: CY - R * Math.sin(a) }
}

const LEVEL_STROKE: Record<Level, string> = {
  low: "var(--rubikon-blue)",
  mid: "var(--rubikon-amber)",
  high: "var(--rubikon-red)",
}

/** Półkolisty wskaźnik: tło z trzema strefami, łuk wypełnia się do pozycji wyniku. */
export function RiskGauge({ score, level }: { score: number; level: Level }) {
  const ratio = (score - SCORE_MIN) / (SCORE_MAX - SCORE_MIN)
  const end = point(180)
  const start = point(0)
  const tip = point(ratio * 180)

  return (
    <svg viewBox="0 0 120 68" className="w-44 sm:w-52" aria-hidden="true">
      <path
        d={`M ${start.x} ${start.y} A ${R} ${R} 0 0 1 ${end.x} ${end.y}`}
        fill="none"
        stroke="var(--rubikon-blue-line)"
        strokeWidth="10"
        strokeLinecap="round"
      />
      <motion.path
        d={`M ${start.x} ${start.y} A ${R} ${R} 0 0 1 ${end.x} ${end.y}`}
        fill="none"
        stroke={LEVEL_STROKE[level]}
        strokeWidth="10"
        strokeLinecap="round"
        strokeDasharray={HALF}
        initial={{ strokeDashoffset: HALF }}
        animate={{ strokeDashoffset: HALF * (1 - ratio) }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
      />
      <motion.circle
        cx={tip.x}
        cy={tip.y}
        r="4"
        fill="#fff"
        stroke={LEVEL_STROKE[level]}
        strokeWidth="3"
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.9, duration: 0.25 }}
      />
    </svg>
  )
}
