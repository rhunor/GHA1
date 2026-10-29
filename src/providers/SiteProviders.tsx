"use client"
import React, { createContext, useCallback, useContext, useEffect, useState } from 'react'
import { MotionConfig } from 'framer-motion'

type Theme = 'light' | 'dark'

const THEME_KEY = 'gh-theme'

// Runs before paint (see app/layout.tsx) so the page never flashes the wrong theme.
// The admin area keeps its own light styling.
// It also flags a repeat visit so the home intro animation plays once per session.
export const themeScript = `(function(){try{if(sessionStorage.getItem('gh-intro'))document.documentElement.dataset.intro='seen';if(location.pathname.indexOf('/admin')===0)return;var t=localStorage.getItem('${THEME_KEY}');if(!t){t=matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light'}if(t==='dark')document.documentElement.classList.add('dark')}catch(e){}})()`

const ThemeContext = createContext<{ theme: Theme; toggleTheme: () => void }>({
  theme: 'light',
  toggleTheme: () => {},
})

export const useTheme = () => useContext(ThemeContext)

export default function SiteProviders({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>('light')

  useEffect(() => {
    setTheme(document.documentElement.classList.contains('dark') ? 'dark' : 'light')
  }, [])

  const toggleTheme = useCallback(() => {
    setTheme((prev) => {
      const next = prev === 'dark' ? 'light' : 'dark'
      document.documentElement.classList.toggle('dark', next === 'dark')
      try {
        localStorage.setItem(THEME_KEY, next)
      } catch {}
      return next
    })
  }, [])

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <MotionConfig reducedMotion="user">{children}</MotionConfig>
    </ThemeContext.Provider>
  )
}
