'use client'

import { useEffect, useRef } from 'react'
import { useAuth } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

const IDLE_TIMEOUT = 30 * 60 * 1000 // 30 minutes in milliseconds
const WARNING_TIME = 5 * 60 * 1000 // 5 minutes before logout

export function AutoLogout() {
  const { signOut, isSignedIn } = useAuth()
  const router = useRouter()
  const timeoutRef = useRef<NodeJS.Timeout>()
  const warningTimeoutRef = useRef<NodeJS.Timeout>()
  const lastActivityRef = useRef<number>(Date.now())

  useEffect(() => {
    if (!isSignedIn) return

    const resetTimer = () => {
      lastActivityRef.current = Date.now()

      // Clear existing timers
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
      if (warningTimeoutRef.current) clearTimeout(warningTimeoutRef.current)

      // Set warning timer (5 minutes before logout)
      warningTimeoutRef.current = setTimeout(() => {
        toast.warning('You will be logged out in 5 minutes due to inactivity', {
          duration: 5000,
        })
      }, IDLE_TIMEOUT - WARNING_TIME)

      // Set logout timer
      timeoutRef.current = setTimeout(async () => {
        toast.info('Logging out due to inactivity...')
        await signOut()
        router.push('/sign-in?timeout=true')
      }, IDLE_TIMEOUT)
    }

    // Events that count as user activity
    const events = [
      'mousedown',
      'mousemove',
      'keypress',
      'scroll',
      'touchstart',
      'click',
    ]

    // Add event listeners
    events.forEach((event) => {
      document.addEventListener(event, resetTimer, { passive: true })
    })

    // Initialize timer
    resetTimer()

    // Check for activity when tab becomes visible
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        const idleTime = Date.now() - lastActivityRef.current
        
        if (idleTime >= IDLE_TIMEOUT) {
          // User was idle for too long
          toast.info('Logging out due to inactivity...')
          signOut()
          router.push('/sign-in?timeout=true')
        } else {
          // Reset timer if still within timeout
          resetTimer()
        }
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)

    // Cleanup
    return () => {
      events.forEach((event) => {
        document.removeEventListener(event, resetTimer)
      })
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
      if (warningTimeoutRef.current) clearTimeout(warningTimeoutRef.current)
    }
  }, [isSignedIn, signOut, router])

  return null // This is a logic-only component
}