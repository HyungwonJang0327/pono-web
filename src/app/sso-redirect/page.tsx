'use client'

import { useEffect } from 'react'

export default function SsoRedirectPage() {
  useEffect(() => {
    window.location.replace('/')
  }, [])

  return <div />
}
