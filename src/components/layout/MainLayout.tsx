// components/layout/MainLayout.tsx
"use client"
import { useState, ReactNode, JSX } from 'react'
import Header from '../Header'
import Footer from '../Footer'

interface MainLayoutProps {
  children: ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps): JSX.Element => {
  const [darkMode, setDarkMode] = useState(false)

  return (
    <div className={`min-h-screen ${darkMode ? 'dark' : ''}`}>
      <Header darkMode={darkMode} setDarkMode={setDarkMode} />
      <main>
        {children}
      </main>
      <Footer />
    </div>
  )
}

export default MainLayout