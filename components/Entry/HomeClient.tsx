'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import HomepageLayout from './HomepageLayout'
import IntakeModal from './IntakeModal'
import { hasIntakeCookie } from '@/lib/store'

export default function HomeClient() {
  const router = useRouter()
  const [showIntake, setShowIntake] = useState(false)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    if (!hasIntakeCookie()) {
      setShowIntake(true)
    }
    setReady(true)
  }, [])

  if (!ready) return null

  return (
    <>
      <HomepageLayout />
      {showIntake && (
        <IntakeModal
          onDone={() => {
            router.push('/calendar')
          }}
          onSkip={() => {
            setShowIntake(false)
          }}
        />
      )}
    </>
  )
}
