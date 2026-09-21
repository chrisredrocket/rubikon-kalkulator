import { useEffect, useState } from "react"

/** Licznik od 0 do `target` na requestAnimationFrame, easing out. */
export function useCountUp(target: number, duration = 1100, delay = 0) {
  const [value, setValue] = useState(0)
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    if (reduce) {
      setValue(target)
      return
    }
    let raf = 0
    let start = 0
    const timer = setTimeout(() => {
      const tick = (now: number) => {
        if (!start) start = now
        const t = Math.min(1, (now - start) / duration)
        const eased = 1 - Math.pow(1 - t, 3)
        setValue(target * eased)
        if (t < 1) raf = requestAnimationFrame(tick)
      }
      raf = requestAnimationFrame(tick)
    }, delay)
    return () => {
      clearTimeout(timer)
      cancelAnimationFrame(raf)
    }
  }, [target, duration, delay])
  return value
}
