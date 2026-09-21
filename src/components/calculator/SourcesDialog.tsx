import { ExternalLink } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { copy } from "@/lib/copy"

export function SourcesDialog({
  open,
  onOpenChange,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[calc(100dvh-2rem)] overflow-y-auto rounded-2xl p-6 sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-ink">{copy.sources.title}</DialogTitle>
          <DialogDescription className="text-pretty text-[0.95rem] leading-relaxed text-ink-muted">
            {copy.sources.lead}
          </DialogDescription>
        </DialogHeader>
        <ul className="flex flex-col divide-y divide-border">
          {copy.sources.items.map((s) => (
            <li key={s.url} className="py-3 first:pt-0 last:pb-0">
              <a
                href={s.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-1.5 text-sm font-semibold text-navy underline-offset-4 hover:underline"
              >
                {s.name}
                <ExternalLink className="size-3.5 text-ink-muted group-hover:text-navy" />
              </a>
              <p className="mt-1 text-sm leading-snug text-ink-muted">{s.what}</p>
            </li>
          ))}
        </ul>
      </DialogContent>
    </Dialog>
  )
}
