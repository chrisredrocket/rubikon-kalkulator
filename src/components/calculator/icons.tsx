import {
  Landmark,
  HeartPulse,
  Factory,
  Cpu,
  ShoppingCart,
  Briefcase,
  User,
  Users,
  Building2,
  Building,
  ShieldCheck,
  ShieldQuestion,
  ShieldOff,
  type LucideIcon,
} from "lucide-react"
import type { IndustryId, MfaId, SizeId } from "@/lib/risk"

/** Ikony kafelków. Lucide renderuje je jako inline SVG, bez plików graficznych. */
export const INDUSTRY_ICONS: Record<IndustryId, LucideIcon> = {
  finance: Landmark,
  health: HeartPulse,
  industry: Factory,
  tech: Cpu,
  retail: ShoppingCart,
  services: Briefcase,
}

export const SIZE_ICONS: Record<SizeId, LucideIcon> = {
  s1: User,
  s2: Users,
  s3: Building,
  s4: Building2,
}

export const MFA_ICONS: Record<MfaId, LucideIcon> = {
  yes: ShieldCheck,
  unknown: ShieldQuestion,
  no: ShieldOff,
}
