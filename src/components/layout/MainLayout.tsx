// components/layout/MainLayout.tsx
"use client"
import { useState } from 'react'
import Header from '../Header'
import Footer from '../Footer'

import { ReactNode } from 'react';

interface MainLayoutProps {
  children: ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  const [darkMode, setDarkMode] = useState(false)

  return (
    <div className={`min-h-screen ${darkMode ? 'dark' : ''}`}>
      <Header darkMode={darkMode} setDarkMode={setDarkMode} />
      {children}
      <Footer />
    </div>
  )
}