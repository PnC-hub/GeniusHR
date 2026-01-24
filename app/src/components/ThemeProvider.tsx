'use client'

import { createContext, useContext, ReactNode } from 'react'

interface ThemeConfig {
  primaryColor: string
  secondaryColor: string
  logo: string | null
  companyName: string
}

const defaultTheme: ThemeConfig = {
  primaryColor: '#2563eb',
  secondaryColor: '#10b981',
  logo: null,
  companyName: 'GeniusHR'
}

const ThemeContext = createContext<ThemeConfig>(defaultTheme)

export function useTheme() {
  return useContext(ThemeContext)
}

interface ThemeProviderProps {
  children: ReactNode
  theme?: Partial<ThemeConfig>
}

export function ThemeProvider({ children, theme }: ThemeProviderProps) {
  const mergedTheme = { ...defaultTheme, ...theme }

  return (
    <ThemeContext.Provider value={mergedTheme}>
      <style jsx global>{`
        :root {
          --color-primary: ${mergedTheme.primaryColor};
          --color-secondary: ${mergedTheme.secondaryColor};
        }
      `}</style>
      {children}
    </ThemeContext.Provider>
  )
}

// Dynamic CSS class generator
export function getThemeClasses(theme: ThemeConfig) {
  return {
    primaryBg: { backgroundColor: theme.primaryColor },
    primaryText: { color: theme.primaryColor },
    primaryBorder: { borderColor: theme.primaryColor },
    secondaryBg: { backgroundColor: theme.secondaryColor },
    secondaryText: { color: theme.secondaryColor },
    secondaryBorder: { borderColor: theme.secondaryColor }
  }
}
