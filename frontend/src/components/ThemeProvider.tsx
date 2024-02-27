'use client'

import { ThemeProvider as NextThemesProvider } from 'next-themes'
// eslint-disable-next-line @typescript-eslint/no-import-type-side-effects
import { type ThemeProviderProps } from 'next-themes/dist/types'
import { useEffect, useState } from 'react'
import * as React from 'react'

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  const [isMount, setMount] = useState(false)

  useEffect(() => {
    setMount(true)
  }, [])

  if (!isMount) {
    return null
  }

  return <NextThemesProvider {...props}>{children}</NextThemesProvider>
}
