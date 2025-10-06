'use client'

import { useEffect } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

// Configure NProgress
NProgress.configure({ 
  showSpinner: false,
  trickleSpeed: 200,
  minimum: 0.08,
  easing: 'ease',
  speed: 500
})

export default function ProgressBar() {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    NProgress.done()
  }, [pathname, searchParams])

  useEffect(() => {
    // Start progress on route change
    const handleStart = () => NProgress.start()
    const handleComplete = () => NProgress.done()

    // Listen to Next.js router events
    window.addEventListener('beforeunload', handleStart)
    
    return () => {
      window.removeEventListener('beforeunload', handleStart)
      handleComplete()
    }
  }, [])

  return (
    <style jsx global>{`
      #nprogress {
        pointer-events: none;
      }

      #nprogress .bar {
        background: #4a6cf7;
        position: fixed;
        z-index: 99999;
        top: 0;
        left: 0;
        width: 100%;
        height: 3px;
      }

      #nprogress .peg {
        display: block;
        position: absolute;
        right: 0px;
        width: 100px;
        height: 100%;
        box-shadow: 0 0 10px #4a6cf7, 0 0 5px #4a6cf7;
        opacity: 1;
        transform: rotate(3deg) translate(0px, -4px);
      }
    `}</style>
  )
}
