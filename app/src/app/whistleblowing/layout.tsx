import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Whistleblowing | Ordinia',
  description: 'Canale di segnalazione sicuro conforme al D.Lgs. 24/2023',
}

export default function WhistleblowingPublicLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
