'use client'

import dynamic from 'next/dynamic'
import React from 'react'

const FrozenRouteContent = dynamic(() => import('./frozen-route-content'), { ssr: false })

export const FrozenRoute = ({ children }: { children: React.ReactNode }) => {
  return <FrozenRouteContent>{children}</FrozenRouteContent>
}
