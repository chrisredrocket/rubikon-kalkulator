import { ArrowLeft } from "lucide-react"
import type { LucideIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { OptionTile } from "./OptionTile"
import { copy } from "@/lib/copy"

type QuestionOption<Id extends string> = { id: Id; label: string; hint?: string }

type QuestionStepProps<Id extends string> = {
  question: string
  hint?: string
  options: readonly QuestionOption<Id>[]
  icons: Record<Id, LucideIcon>
  value: Id | null
  onSelect: (id: Id) => void
  onBack: () => void
}

export function QuestionStep<Id extends string>({
  question,
  hint,
  options,
  icons,
  value,
  onSelect,
  onBack,
}: QuestionStepProps<Id>) {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h2 className="text-balance text-xl leading-snug font-semibold text-ink sm:text-2xl">
          {question}
        </h2>
        {hint && <p className="text-sm text-ink-muted">{hint}</p>}
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {options.map((o) => (
          <OptionTile
            key={o.id}
            label={o.label}
            hint={o.hint}
            icon={icons[o.id]}
            selected={value === o.id}
            onSelect={() => onSelect(o.id)}
          />
        ))}
      </div>

      <div>
        <Button
          type="button"
          variant="ghost"
          onClick={onBack}
          className="-ml-2 h-9 px-2 text-ink-muted hover:text-ink"
        >
          <ArrowLeft data-icon="inline-start" />
          {copy.questions.back}
        </Button>
      </div>
    </div>
  )
}
