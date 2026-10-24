'use client'

import dynamic from 'next/dynamic'
import { usePathname } from 'next/navigation'
import { AnimatePresence, motion } from 'framer-motion'

const FrozenRoute = dynamic(() => import('./frozen-route').then(mod => mod.FrozenRoute), { ssr: false })

export const PageAnimatePresence = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname()

  return (
    <AnimatePresence mode="wait">
      <motion.div key={pathname}>
        <FrozenRoute>{children}</FrozenRoute>
      </motion.div>
    </AnimatePresence>
  )
}
