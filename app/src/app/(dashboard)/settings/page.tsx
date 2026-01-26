'use client'

import { useEffect, useState } from 'react'

export default function SettingsPage() {
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    setLoaded(true)
  }, [])

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Impostazioni</h1>
      <p className="mt-2">Client loaded: {loaded ? 'Yes' : 'No'}</p>
    </div>
  )
}
