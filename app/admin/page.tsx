'use client'

import { useAuth } from '@/hooks/use-auth'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import Link from 'next/link'

export default function AdminPage() {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && (!user || user.role !== 'super_admin')) {
      router.push('/dashboard')
    }
  }, [user, loading, router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          <p className="mt-4 text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  if (!user || user.role !== 'super_admin') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <p className="text-lg font-semibold text-foreground mb-2">Access Denied</p>
          <p className="text-muted-foreground">You do not have permission to access this page.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-primary">
              <span className="text-sm font-bold text-primary-foreground">A</span>
            </div>
            <h1 className="text-lg font-bold text-foreground">Admin Panel</h1>
          </div>
          <div className="flex items-center gap-4">
            <p className="text-sm text-muted-foreground">{user.email}</p>
            <button
              onClick={() => {
                fetch('/api/auth/sign-out', { method: 'POST' })
                router.push('/auth/sign-in')
              }}
              className="px-4 py-2 text-sm font-medium text-primary hover:bg-secondary rounded-lg"
            >
              Sign Out
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Welcome Section */}
          <div>
            <h2 className="text-3xl font-bold text-foreground">Admin Dashboard</h2>
            <p className="mt-2 text-muted-foreground">
              Manage users, organizations, and system settings
            </p>
          </div>

          {/* Admin Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-card border border-border rounded-lg p-6">
              <p className="text-sm font-medium text-muted-foreground">Total Organizations</p>
              <p className="mt-2 text-3xl font-bold text-foreground">0</p>
              <p className="mt-2 text-xs text-muted-foreground">Active</p>
            </div>
            <div className="bg-card border border-border rounded-lg p-6">
              <p className="text-sm font-medium text-muted-foreground">Total Users</p>
              <p className="mt-2 text-3xl font-bold text-foreground">0</p>
              <p className="mt-2 text-xs text-muted-foreground">All users</p>
            </div>
            <div className="bg-card border border-border rounded-lg p-6">
              <p className="text-sm font-medium text-muted-foreground">Total Bookings</p>
              <p className="mt-2 text-3xl font-bold text-foreground">0</p>
              <p className="mt-2 text-xs text-muted-foreground">All time</p>
            </div>
            <div className="bg-card border border-border rounded-lg p-6">
              <p className="text-sm font-medium text-muted-foreground">Total Revenue</p>
              <p className="mt-2 text-3xl font-bold text-primary">$0</p>
              <p className="mt-2 text-xs text-muted-foreground">All time</p>
            </div>
          </div>

          {/* Admin Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Link
              href="/admin/organizations"
              className="bg-card border border-border rounded-lg p-6 hover:border-primary transition-colors"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-foreground">Organizations</h3>
                <span className="text-2xl">🏢</span>
              </div>
              <p className="text-sm text-muted-foreground">
                View and manage all organizations
              </p>
            </Link>

            <Link
              href="/admin/users"
              className="bg-card border border-border rounded-lg p-6 hover:border-primary transition-colors"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-foreground">Users</h3>
                <span className="text-2xl">👥</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Manage system users and permissions
              </p>
            </Link>

            <Link
              href="/admin/analytics"
              className="bg-card border border-border rounded-lg p-6 hover:border-primary transition-colors"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-foreground">Analytics</h3>
                <span className="text-2xl">📊</span>
              </div>
              <p className="text-sm text-muted-foreground">
                View system analytics and reports
              </p>
            </Link>

            <Link
              href="/admin/disputes"
              className="bg-card border border-border rounded-lg p-6 hover:border-primary transition-colors"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-foreground">Disputes</h3>
                <span className="text-2xl">⚖️</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Handle customer disputes and complaints
              </p>
            </Link>

            <Link
              href="/admin/payments"
              className="bg-card border border-border rounded-lg p-6 hover:border-primary transition-colors"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-foreground">Payments</h3>
                <span className="text-2xl">💰</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Monitor payment processing and payouts
              </p>
            </Link>

            <Link
              href="/admin/settings"
              className="bg-card border border-border rounded-lg p-6 hover:border-primary transition-colors"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-foreground">Settings</h3>
                <span className="text-2xl">⚙️</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Configure system settings
              </p>
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}
