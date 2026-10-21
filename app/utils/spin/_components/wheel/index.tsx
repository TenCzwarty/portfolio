"use client"

import React from "react"

import { useThemeTick } from "~/utils/use-theme-tick"

import { useSpinWheelContext } from "~spin/_context"
import { drawWheel, easeOut, getSegmentColors, getWinner } from "~spin/_utils/wheel"

const CANVAS_SIZE = 400
const SPIN_DURATION = 4500

export const SpinWheel = () => {
  const { spin, validElements, isSpinning, setIsSpinning, setWinner } =
    useSpinWheelContext()

  const refCanvas = React.useRef<HTMLCanvasElement>(null)
  const refRotation = React.useRef(0)
  const refAnimationFrame = React.useRef<number | null>(null)
  const refColors = React.useRef<string[]>([])
  // redraw while the site theme fades, so the wheel changes color with the page
  const themeTick = useThemeTick()

  React.useEffect(() => {
    const canvas = refCanvas.current

    if (!canvas) {
      return;
    }

    const ctx = canvas.getContext("2d")

    if (!ctx) {
      return;
    }

    refColors.current = getSegmentColors(validElements.length)
    drawWheel(ctx, validElements, refColors.current, refRotation.current)
  }, [validElements, themeTick])

  React.useEffect(() => {
    if (!isSpinning) {
      return;
    }

    const totalRotation = (6 + Math.random() * 4) * 360 + Math.random() * 360
    const startRotation = refRotation.current
    const targetRotation = startRotation + totalRotation
    const colors = refColors.current

    let spinStartTime: number | null = null

    const animate = (timestamp: number) => {
      if (spinStartTime === null) {
        spinStartTime = timestamp
      }

      const elapsed = timestamp - spinStartTime
      const progress = Math.min(elapsed / SPIN_DURATION, 1)
      const eased = easeOut(progress)

      refRotation.current =
        startRotation + (targetRotation - startRotation) * eased

      const canvas = refCanvas.current

      if (canvas) {
        const ctx = canvas.getContext("2d")
        if (ctx) drawWheel(ctx, validElements, colors, refRotation.current)
      }

      if (progress < 1) {
        refAnimationFrame.current = requestAnimationFrame(animate)
      } else {
        setWinner(getWinner(validElements, refRotation.current))
        setIsSpinning(false)
      }
    }

    refAnimationFrame.current = requestAnimationFrame(animate)

    return () => {
      if (refAnimationFrame.current !== null) {
        cancelAnimationFrame(refAnimationFrame.current);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSpinning])

  return (
    <canvas
      ref={ refCanvas }
      width={ CANVAS_SIZE }
      height={ CANVAS_SIZE }
      className={`h-auto w-full max-w-[400px] ${isSpinning ? "cursor-wait" : "cursor-pointer"}`}
      onClick={ () => spin() }
    />
  )
}
