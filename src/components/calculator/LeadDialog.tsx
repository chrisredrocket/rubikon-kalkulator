import { useState, type FormEvent } from "react"
import { CheckCircle2 } from "lucide-react"
import { cn } from "cn"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { copy } from "@/lib/copy"
import { Sentences } from "./Sentences"
import type { IndustryId, MfaId, SizeId } from "@/lib/risk"

type LeadDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  answers: { industry: IndustryId; size: SizeId; mfa: MfaId }
}

type Fields = { name: string; email: string; phone: string }
type Errors = Partial<Record<keyof Fields, string>>

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/
const PHONE = /^[+\d][\d\s-]{6,}$/

function validate(f: Fields): Errors {
  const e: Errors = {}
  if (f.name.trim().length < 3) e.name = copy.form.errors.name
  if (!EMAIL.test(f.email.trim())) e.email = copy.form.errors.email
  if (!PHONE.test(f.phone.trim())) e.phone = copy.form.errors.phone
  return e
}

export function LeadDialog({ open, onOpenChange, answers }: LeadDialogProps) {
  const [fields, setFields] = useState<Fields>({ name: "", email: "", phone: "" })
  const [errors, setErrors] = useState<Errors>({})
  const [sent, setSent] = useState(false)

  function submit(ev: FormEvent) {
    ev.preventDefault()
    const e = validate(fields)
    setErrors(e)
    if (Object.keys(e).length === 0) setSent(true)
  }

  function update(key: keyof Fields, value: string) {
    setFields((f) => ({ ...f, [key]: value }))
    if (errors[key]) setErrors((e) => ({ ...e, [key]: undefined }))
  }

  function handleOpenChange(next: boolean) {
    onOpenChange(next)
    if (!next && sent) {
      // Po zamknięciu potwierdzenia formularz wraca do stanu wyjściowego.
      setTimeout(() => {
        setSent(false)
        setFields({ name: "", email: "", phone: "" })
        setErrors({})
      }, 200)
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-h-[calc(100dvh-2rem)] overflow-y-auto rounded-2xl p-6 sm:max-w-md">
        {sent ? (
          <div className="flex flex-col items-center gap-4 py-4 text-center">
            <span className="flex size-14 items-center justify-center rounded-full bg-blue-soft text-blue">
              <CheckCircle2 className="size-8" strokeWidth={1.75} />
            </span>
            <DialogHeader className="items-center">
              <DialogTitle className="text-xl font-semibold text-ink">
                {copy.confirmation.title}
              </DialogTitle>
              <DialogDescription className="text-center text-[0.95rem] leading-relaxed text-ink-muted">
                <Sentences text={copy.confirmation.lead(answers.mfa)} />
              </DialogDescription>
            </DialogHeader>
            <Button
              type="button"
              onClick={() => handleOpenChange(false)}
              className="mt-2 h-11 w-full rounded-xl bg-navy text-base font-semibold text-white hover:bg-navy/90"
            >
              {copy.confirmation.close}
            </Button>
          </div>
        ) : (
          <form onSubmit={submit} noValidate className="flex flex-col gap-5">
            <DialogHeader className="items-center">
              <DialogTitle className="text-center text-xl font-semibold text-ink">
                {copy.form.title}
              </DialogTitle>
              <DialogDescription className="sr-only">{copy.form.lead}</DialogDescription>
            </DialogHeader>

            <div className="flex flex-col gap-3.5">
              {(["name", "email", "phone"] as const).map((key) => (
                <div key={key} className="flex flex-col gap-1.5">
                  <Label htmlFor={`lead-${key}`} className="text-ink">
                    {copy.form.fields[key]}
                  </Label>
                  <Input
                    id={`lead-${key}`}
                    name={key}
                    type={key === "email" ? "email" : key === "phone" ? "tel" : "text"}
                    autoComplete={key === "name" ? "name" : key === "email" ? "email" : "tel"}
                    placeholder={copy.form.placeholders[key]}
                    value={fields[key]}
                    onChange={(e) => update(key, e.target.value)}
                    aria-invalid={Boolean(errors[key])}
                    aria-describedby={errors[key] ? `lead-${key}-error` : undefined}
                    className={cn("h-11 rounded-xl px-3.5 text-base", errors[key] && "border-red")}
                  />
                  {errors[key] && (
                    <p id={`lead-${key}-error`} className="text-xs font-medium text-red">
                      {errors[key]}
                    </p>
                  )}
                </div>
              ))}
            </div>

            <Button
              type="submit"
              className="h-12 w-full rounded-xl bg-red text-base font-semibold text-white shadow-soft hover:bg-red/90"
            >
              {copy.form.submit}
            </Button>
            <p className="text-center text-xs leading-relaxed text-ink-muted/65">
              <Sentences text={copy.form.consent} />
            </p>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}
