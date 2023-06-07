import { useCallback } from 'react'

import { useTheme } from 'next-themes'

export default function ThemeSwitch() {
  const { theme, setTheme } = useTheme()

  const handleSwitch = useCallback(() => {
    setTheme(theme === 'light' ? 'dark' : 'light')
  }, [theme, setTheme])

  return (
    <div className='fixed rounded-full bottom-20 right-8 bg-[var(--dropdown-bg)] p-2 cursor-pointer z-10' onClick={handleSwitch}>
      <svg className='w-6 flex-shrink-0 fill-[#ffce45] stroke-[#ffce45] duration-500' viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
      </svg>
    </div>
  )
}