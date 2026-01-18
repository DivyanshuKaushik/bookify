'use client'

import { useState, useEffect } from 'react'

interface CalendarBooking {
  id: string
  venue_name: string
  customer_name: string
  booking_date: string
  start_time: string
  end_time: string
  status: string
}

export default function CalendarPage() {
  const [bookings, setBookings] = useState<CalendarBooking[]>([])
  const [loading, setLoading] = useState(true)
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [view, setView] = useState<'month' | 'week' | 'day'>('month')

  useEffect(() => {
    fetchBookings()
  }, [currentMonth])

  const fetchBookings = async () => {
    try {
      const response = await fetch('/api/bookings')
      const data = await response.json()

      if (response.ok) {
        setBookings(data.bookings)
      }
    } catch (err) {
      console.error('Failed to fetch bookings')
    } finally {
      setLoading(false)
    }
  }

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
  }

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay()
  }

  const getBookingsForDate = (day: number) => {
    const dateStr = `${currentMonth.getFullYear()}-${String(
      currentMonth.getMonth() + 1
    ).padStart(2, '0')}-${String(day).padStart(2, '0')}`

    return bookings.filter((b) => b.booking_date.startsWith(dateStr))
  }

  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(currentMonth)
    const firstDay = getFirstDayOfMonth(currentMonth)
    const days = []

    // Empty cells for days before month starts
    for (let i = 0; i < firstDay; i++) {
      days.push(
        <div key={`empty-${i}`} className="bg-muted/30 p-2 md:p-4 rounded-lg"></div>
      )
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const dayBookings = getBookingsForDate(day)
      const isToday =
        day === new Date().getDate() &&
        currentMonth.getMonth() === new Date().getMonth() &&
        currentMonth.getFullYear() === new Date().getFullYear()

      days.push(
        <div
          key={day}
          className={`p-2 md:p-4 rounded-lg border ${
            isToday
              ? 'border-primary bg-primary/5'
              : 'border-border bg-card'
          } min-h-24`}
        >
          <p className={`font-semibold mb-2 ${isToday ? 'text-primary' : 'text-foreground'}`}>
            {day}
          </p>
          <div className="space-y-1">
            {dayBookings.slice(0, 2).map((booking) => (
              <div
                key={booking.id}
                className="text-xs bg-primary/10 text-primary rounded px-2 py-1 truncate cursor-pointer hover:bg-primary/20"
                title={`${booking.customer_name} - ${booking.start_time}`}
              >
                {booking.customer_name}
              </div>
            ))}
            {dayBookings.length > 2 && (
              <div className="text-xs text-muted-foreground italic">
                +{dayBookings.length - 2} more
              </div>
            )}
          </div>
        </div>
      )
    }

    return days
  }

  const monthNames = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ]

  const prevMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1)
    )
  }

  const nextMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1)
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Calendar</h1>
        <p className="mt-2 text-muted-foreground">
          View all bookings across your venues
        </p>
      </div>

      {/* View Toggle */}
      <div className="flex gap-2">
        {(['month', 'week', 'day'] as const).map((v) => (
          <button
            key={v}
            onClick={() => setView(v)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              view === v
                ? 'bg-primary text-primary-foreground'
                : 'bg-secondary text-secondary-foreground hover:bg-muted'
            }`}
          >
            {v.charAt(0).toUpperCase() + v.slice(1)}
          </button>
        ))}
      </div>

      {/* Calendar */}
      {view === 'month' && (
        <div className="bg-card border border-border rounded-lg p-6">
          {/* Month Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-foreground">
              {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
            </h2>
            <div className="flex gap-2">
              <button
                onClick={prevMonth}
                className="px-4 py-2 border border-input rounded-lg hover:bg-muted"
              >
                Previous
              </button>
              <button
                onClick={nextMonth}
                className="px-4 py-2 border border-input rounded-lg hover:bg-muted"
              >
                Next
              </button>
            </div>
          </div>

          {/* Day Headers */}
          <div className="grid grid-cols-7 gap-2 mb-4">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
              <div
                key={day}
                className="text-center font-semibold text-muted-foreground p-2"
              >
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-2">
            {renderCalendar()}
          </div>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Loading bookings...</p>
        </div>
      )}

      {/* Upcoming Bookings */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">
          Upcoming Bookings
        </h3>
        {bookings.length === 0 ? (
          <p className="text-muted-foreground">No bookings scheduled</p>
        ) : (
          <div className="space-y-3">
            {bookings.slice(0, 5).map((booking) => (
              <div
                key={booking.id}
                className="flex items-center justify-between p-4 border border-border rounded-lg"
              >
                <div>
                  <p className="font-medium text-foreground">
                    {booking.customer_name}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {booking.venue_name} •{' '}
                    {new Date(booking.booking_date).toLocaleDateString()} at{' '}
                    {booking.start_time}
                  </p>
                </div>
                <span className="px-3 py-1 bg-primary/10 text-primary text-sm rounded-full capitalize">
                  {booking.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
