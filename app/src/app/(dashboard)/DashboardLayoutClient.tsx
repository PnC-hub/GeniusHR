'use client'

import { useState, useEffect } from 'react'
import DashboardShell from '@/components/layout/DashboardShell'
import Sidebar from '@/components/sidebar'
import { WelcomeGuide, HelpButton } from '@/components/onboarding'
import FeedbackButton from '@/components/FeedbackButton'
import { TrainingFAB } from '@/components/training'

interface Client {
  id: string
  name: string
  employeeCount: number
  pendingTasks: number
}

interface DashboardLayoutClientProps {
  children: React.ReactNode
  user: {
    name?: string | null
    email?: string | null
    role: 'OWNER' | 'EMPLOYEE' | 'CONSULTANT'
  }
  role: 'OWNER' | 'EMPLOYEE' | 'CONSULTANT'
  clients: Client[]
  pendingSignatures: number
  pendingLeaves: number
  unreadNotifications: number
}

export default function DashboardLayoutClient({
  children,
  user,
  role,
  clients,
  pendingSignatures,
  pendingLeaves,
  unreadNotifications,
}: DashboardLayoutClientProps) {
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null)
  const [showWelcome, setShowWelcome] = useState(false)

  // Check if first visit (show welcome guide for owners)
  useEffect(() => {
    if (role === 'OWNER') {
      const hasSeenWelcome = localStorage.getItem('ordinia_welcome_seen')
      if (!hasSeenWelcome) {
        // Small delay to let the page load first
        const timer = setTimeout(() => setShowWelcome(true), 500)
        return () => clearTimeout(timer)
      }
    }
  }, [role])

  const handleWelcomeComplete = () => {
    localStorage.setItem('ordinia_welcome_seen', 'true')
    localStorage.setItem('ordinia_welcome_date', new Date().toISOString())
  }

  const brandColor =
    role === 'EMPLOYEE' ? 'green' : role === 'CONSULTANT' ? 'purple' : 'blue'

  return (
    <>
      <DashboardShell
        user={user}
        brandColor={brandColor}
        sidebar={
          <Sidebar
            role={role}
            pendingSignatures={pendingSignatures}
            pendingLeaves={pendingLeaves}
            unreadNotifications={unreadNotifications}
            clients={clients}
            selectedClientId={selectedClientId}
            onClientChange={setSelectedClientId}
          />
        }
      >
        {children}
      </DashboardShell>

      {/* Help Button - always visible */}
      <HelpButton />

      {/* Feedback Button - always visible */}
      <FeedbackButton />

      {/* AI Training FAB - quick access to training */}
      <TrainingFAB context="dashboard" />

      {/* Welcome Guide - first visit only */}
      {showWelcome && (
        <WelcomeGuide
          userName={user.name || undefined}
          onClose={() => setShowWelcome(false)}
          onComplete={handleWelcomeComplete}
        />
      )}
    </>
  )
}
