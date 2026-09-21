import { motion } from "motion/react"
import { cn } from "cn"
import type { LucideIcon } from "lucide-react"

type OptionTileProps = {
  label: string
  hint?: string
  icon: LucideIcon
  selected: boolean
  onSelect: () => void
}

export function OptionTile({ label, hint, icon: Icon, selected, onSelect }: OptionTileProps) {
  return (
    <motion.button
      type="button"
      onClick={onSelect}
      aria-pressed={selected}
      whileTap={{ scale: 0.97 }}
      transition={{ type: "spring", stiffness: 500, damping: 30 }}
      className={cn(
        "group flex min-h-[4.5rem] w-full items-center gap-3 rounded-2xl border bg-white px-4 py-3 text-left transition-colors outline-none",
        "focus-visible:ring-3 focus-visible:ring-blue/40",
        selected
          ? "border-navy bg-blue-soft shadow-soft"
          : "border-border hover:border-blue-line hover:bg-blue-soft/50",
      )}
    >
      <span
        className={cn(
          "flex size-10 shrink-0 items-center justify-center rounded-xl transition-colors",
          selected ? "bg-navy text-white" : "bg-blue-soft text-navy group-hover:bg-white",
        )}
      >
        <Icon className="size-5" strokeWidth={1.75} />
      </span>
      <span className="flex min-w-0 flex-col">
        <span className="text-[0.95rem] leading-snug font-medium whitespace-nowrap text-ink">{label}</span>
        {hint && <span className="mt-0.5 text-xs text-ink-muted">{hint}</span>}
      </span>
    </motion.button>
  )
}
