"use client"

import { useEffect, useRef, useState } from "react"
import { animate, useInView, useReducedMotion } from "framer-motion"

/** Counts from 0 to `value` the first time it scrolls into view. Server-renders the final value. */
export function CountUp({ value, duration = 1.4 }: { value: number; duration?: number }) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: "-40px" })
  const reduceMotion = useReducedMotion()
  const [display, setDisplay] = useState(value)
  const started = useRef(false)

  useEffect(() => {
    if (!inView || reduceMotion || started.current) return
    started.current = true
    const controls = animate(0, value, {
      duration,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (latest) => setDisplay(Math.round(latest)),
    })
    return () => controls.stop()
  }, [inView, reduceMotion, value, duration])

  return (
    <span ref={ref} className="tabular-nums">
      {display}
    </span>
  )
}
