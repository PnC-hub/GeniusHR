'use client'

export default function SettingsError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  console.error('Settings page error:', error)

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-red-600">Errore Impostazioni</h1>
      <p className="mt-2">Si è verificato un errore: {error.message}</p>
      <p className="mt-1 text-sm text-gray-500">Digest: {error.digest}</p>
      <button
        onClick={reset}
        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded"
      >
        Riprova
      </button>
    </div>
  )
}
