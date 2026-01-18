'use client'

import { useState, useEffect } from 'react'

interface ReportStats {
  totalBookings: number
  totalRevenue: number
  averageBookingValue: number
  occupancyRate: number
  totalCustomers: number
  activeVenues: number
  pendingPayments: number
  completedBookings: number
}

export default function ReportsPage() {
  const [stats, setStats] = useState<ReportStats | null>(null)
  const [timeRange, setTimeRange] = useState<string>('month')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStats()
  }, [timeRange])

  const fetchStats = async () => {
    // Mock data - in production, this would call an API
    setLoading(true)
    setTimeout(() => {
      setStats({
        totalBookings: 42,
        totalRevenue: 8400,
        averageBookingValue: 200,
        occupancyRate: 65,
        totalCustomers: 28,
        activeVenues: 5,
        pendingPayments: 1200,
        completedBookings: 38,
      })
      setLoading(false)
    }, 500)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Reports & Analytics</h1>
          <p className="mt-2 text-muted-foreground">
            View detailed business analytics and insights
          </p>
        </div>
        <select
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value)}
          className="px-4 py-2 border border-input bg-background rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <option value="week">This Week</option>
          <option value="month">This Month</option>
          <option value="quarter">This Quarter</option>
          <option value="year">This Year</option>
        </select>
      </div>

      {/* Key Metrics */}
      {loading ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Loading analytics...</p>
        </div>
      ) : stats ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-card border border-border rounded-lg p-6">
              <p className="text-sm font-medium text-muted-foreground">Total Bookings</p>
              <p className="mt-2 text-3xl font-bold text-foreground">{stats.totalBookings}</p>
              <p className="mt-2 text-xs text-green-600">↑ 12% from last period</p>
            </div>
            <div className="bg-card border border-border rounded-lg p-6">
              <p className="text-sm font-medium text-muted-foreground">Total Revenue</p>
              <p className="mt-2 text-3xl font-bold text-primary">
                ${stats.totalRevenue.toLocaleString()}
              </p>
              <p className="mt-2 text-xs text-green-600">↑ 8% from last period</p>
            </div>
            <div className="bg-card border border-border rounded-lg p-6">
              <p className="text-sm font-medium text-muted-foreground">Avg Booking Value</p>
              <p className="mt-2 text-3xl font-bold text-foreground">
                ${stats.averageBookingValue}
              </p>
              <p className="mt-2 text-xs text-muted-foreground">Per booking</p>
            </div>
            <div className="bg-card border border-border rounded-lg p-6">
              <p className="text-sm font-medium text-muted-foreground">Occupancy Rate</p>
              <p className="mt-2 text-3xl font-bold text-foreground">{stats.occupancyRate}%</p>
              <p className="mt-2 text-xs text-green-600">Healthy rate</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-card border border-border rounded-lg p-6">
              <p className="text-sm font-medium text-muted-foreground">Total Customers</p>
              <p className="mt-2 text-3xl font-bold text-foreground">{stats.totalCustomers}</p>
              <p className="mt-2 text-xs text-muted-foreground">Unique customers</p>
            </div>
            <div className="bg-card border border-border rounded-lg p-6">
              <p className="text-sm font-medium text-muted-foreground">Active Venues</p>
              <p className="mt-2 text-3xl font-bold text-foreground">{stats.activeVenues}</p>
              <p className="mt-2 text-xs text-muted-foreground">Actively listed</p>
            </div>
            <div className="bg-card border border-border rounded-lg p-6">
              <p className="text-sm font-medium text-muted-foreground">Completed Bookings</p>
              <p className="mt-2 text-3xl font-bold text-green-600">
                {stats.completedBookings}
              </p>
              <p className="mt-2 text-xs text-muted-foreground">Successfully completed</p>
            </div>
            <div className="bg-card border border-border rounded-lg p-6">
              <p className="text-sm font-medium text-muted-foreground">Pending Payments</p>
              <p className="mt-2 text-3xl font-bold text-yellow-600">
                ${stats.pendingPayments}
              </p>
              <p className="mt-2 text-xs text-muted-foreground">Awaiting payment</p>
            </div>
          </div>

          {/* Report Sections */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-card border border-border rounded-lg p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">
                Booking Trend
              </h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Week 1</span>
                  <div className="flex-1 mx-4 bg-muted rounded-full h-2">
                    <div
                      className="bg-primary rounded-full h-2"
                      style={{ width: '65%' }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium">10</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Week 2</span>
                  <div className="flex-1 mx-4 bg-muted rounded-full h-2">
                    <div
                      className="bg-primary rounded-full h-2"
                      style={{ width: '72%' }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium">11</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Week 3</span>
                  <div className="flex-1 mx-4 bg-muted rounded-full h-2">
                    <div
                      className="bg-primary rounded-full h-2"
                      style={{ width: '85%' }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium">13</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Week 4</span>
                  <div className="flex-1 mx-4 bg-muted rounded-full h-2">
                    <div
                      className="bg-primary rounded-full h-2"
                      style={{ width: '80%' }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium">8</span>
                </div>
              </div>
            </div>

            <div className="bg-card border border-border rounded-lg p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">
                Revenue by Venue
              </h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Grand Ballroom</span>
                  <span className="text-sm font-medium text-primary">$2,500</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Conference Hall</span>
                  <span className="text-sm font-medium text-primary">$2,000</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Banquet Room</span>
                  <span className="text-sm font-medium text-primary">$1,800</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Meeting Room</span>
                  <span className="text-sm font-medium text-primary">$1,100</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">VIP Lounge</span>
                  <span className="text-sm font-medium text-primary">$1,000</span>
                </div>
              </div>
            </div>
          </div>

          {/* Download Reports */}
          <div className="bg-card border border-border rounded-lg p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">
              Download Reports
            </h3>
            <div className="flex flex-wrap gap-4">
              <button className="px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90">
                Export PDF
              </button>
              <button className="px-4 py-2 border border-input text-foreground rounded-lg font-medium hover:bg-muted">
                Export CSV
              </button>
              <button className="px-4 py-2 border border-input text-foreground rounded-lg font-medium hover:bg-muted">
                Email Report
              </button>
            </div>
          </div>
        </>
      ) : null}
    </div>
  )
}
