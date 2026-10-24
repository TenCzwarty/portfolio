'use client'

import { PageTransitionFadeInOutWrapper } from '@/src/components/page-transition-fade-in-out/page-transition-fade-in-out-wrapper'

export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <PageTransitionFadeInOutWrapper>
      {children}
    </PageTransitionFadeInOutWrapper>
  )
}
