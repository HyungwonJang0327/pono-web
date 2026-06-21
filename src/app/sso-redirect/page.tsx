'use client'

import { useEffect } from 'react'

export default function SsoRedirectPage() {
  useEffect(() => {
    window.location.replace('/')
  }, [])

  return <div className="min-h-screen bg-neutral-50" />
}
