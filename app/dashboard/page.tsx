'use client'

import { useAuth } from '@/hooks/use-auth'
import Link from 'next/link'

export default function DashboardPage() {
  const { user } = useAuth()

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div>
        <h2 className="text-3xl font-bold text-foreground">Welcome back!</h2>
        <p className="mt-2 text-muted-foreground">
          Manage your venue bookings, inquiries, and events all in one place.
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-card border border-border rounded-lg p-6">
          <p className="text-sm font-medium text-muted-foreground">Total Bookings</p>
          <p className="mt-2 text-3xl font-bold text-foreground">0</p>
          <p className="mt-2 text-xs text-muted-foreground">This month</p>
        </div>
        <div className="bg-card border border-border rounded-lg p-6">
          <p className="text-sm font-medium text-muted-foreground">Pending Inquiries</p>
          <p className="mt-2 text-3xl font-bold text-foreground">0</p>
          <p className="mt-2 text-xs text-muted-foreground">Awaiting response</p>
        </div>
        <div className="bg-card border border-border rounded-lg p-6">
          <p className="text-sm font-medium text-muted-foreground">Revenue</p>
          <p className="mt-2 text-3xl font-bold text-foreground">$0</p>
          <p className="mt-2 text-xs text-muted-foreground">This month</p>
        </div>
        <div className="bg-card border border-border rounded-lg p-6">
          <p className="text-sm font-medium text-muted-foreground">Venues</p>
          <p className="mt-2 text-3xl font-bold text-foreground">0</p>
          <p className="mt-2 text-xs text-muted-foreground">Active venues</p>
        </div>
      </div>

      {/* Main Features */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-foreground">Venues</h3>
            <span className="text-2xl">🏛️</span>
          </div>
          <p className="text-sm text-muted-foreground mb-4">
            Manage your venue details, amenities, and availability.
          </p>
          <Link
            href="/dashboard/venues"
            className="inline-block px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90"
          >
            Manage Venues
          </Link>
        </div>

        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-foreground">Bookings</h3>
            <span className="text-2xl">📅</span>
          </div>
          <p className="text-sm text-muted-foreground mb-4">
            View all bookings and manage your event calendar.
          </p>
          <Link
            href="/dashboard/bookings"
            className="inline-block px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90"
          >
            View Bookings
          </Link>
        </div>

        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-foreground">Inquiries</h3>
            <span className="text-2xl">💬</span>
          </div>
          <p className="text-sm text-muted-foreground mb-4">
            Respond to booking inquiries from potential customers.
          </p>
          <Link
            href="/dashboard/inquiries"
            className="inline-block px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90"
          >
            View Inquiries
          </Link>
        </div>

        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-foreground">Payments</h3>
            <span className="text-2xl">💳</span>
          </div>
          <p className="text-sm text-muted-foreground mb-4">
            Track payments and manage invoices.
          </p>
          <Link
            href="/dashboard/payments"
            className="inline-block px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90"
          >
            View Payments
          </Link>
        </div>

        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-foreground">Reports</h3>
            <span className="text-2xl">📊</span>
          </div>
          <p className="text-sm text-muted-foreground mb-4">
            View analytics and business reports.
          </p>
          <Link
            href="/dashboard/reports"
            className="inline-block px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90"
          >
            View Reports
          </Link>
        </div>

        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-foreground">Settings</h3>
            <span className="text-2xl">⚙️</span>
          </div>
          <p className="text-sm text-muted-foreground mb-4">
            Configure organization and billing settings.
          </p>
          <Link
            href="/dashboard/settings"
            className="inline-block px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90"
          >
            Go to Settings
          </Link>
        </div>
      </div>
    </div>
  )
}
