'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'

interface Venue {
  id: string
  name: string
  location: string
  capacity: number
  price_per_hour: number
  description: string
  status: string
  amenities: string
  created_at: string
}

interface TimeSlot {
  time: string
  available: boolean
}

export default function VenueDetailPage() {
  const params = useParams()
  const venueId = params.id as string
  const [venue, setVenue] = useState<Venue | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  )
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([])

  useEffect(() => {
    fetchVenue()
    generateTimeSlots()
  }, [])

  useEffect(() => {
    generateTimeSlots()
  }, [selectedDate])

  const fetchVenue = async () => {
    try {
      const response = await fetch(`/api/venues/${venueId}`)
      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'Failed to fetch venue')
        return
      }

      setVenue(data.venue)
    } catch (err) {
      setError('An error occurred while fetching the venue')
    } finally {
      setLoading(false)
    }
  }

  const generateTimeSlots = () => {
    const slots: TimeSlot[] = []
    for (let hour = 9; hour < 22; hour++) {
      const time = `${hour.toString().padStart(2, '0')}:00`
      slots.push({
        time,
        available: Math.random() > 0.3, // Mock availability
      })
    }
    setTimeSlots(slots)
  }

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        <p className="mt-4 text-muted-foreground">Loading venue...</p>
      </div>
    )
  }

  if (error || !venue) {
    return (
      <div className="p-4 bg-destructive/10 border border-destructive/30 rounded-lg text-sm text-destructive">
        {error || 'Venue not found'}
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">{venue.name}</h1>
        <p className="mt-2 text-muted-foreground">{venue.location}</p>
      </div>

      {/* Venue Details */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-card border border-border rounded-lg p-6">
          <p className="text-sm font-medium text-muted-foreground">Capacity</p>
          <p className="mt-2 text-3xl font-bold text-foreground">{venue.capacity}</p>
          <p className="mt-2 text-xs text-muted-foreground">guests</p>
        </div>
        <div className="bg-card border border-border rounded-lg p-6">
          <p className="text-sm font-medium text-muted-foreground">Price/Hour</p>
          <p className="mt-2 text-3xl font-bold text-primary">${venue.price_per_hour}</p>
        </div>
        <div className="bg-card border border-border rounded-lg p-6">
          <p className="text-sm font-medium text-muted-foreground">Status</p>
          <p className="mt-2 text-3xl font-bold text-green-600 capitalize">
            {venue.status}
          </p>
        </div>
        <div className="bg-card border border-border rounded-lg p-6">
          <p className="text-sm font-medium text-muted-foreground">Created</p>
          <p className="mt-2 text-sm text-foreground">
            {new Date(venue.created_at).toLocaleDateString()}
          </p>
        </div>
      </div>

      {/* Description */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Description</h3>
        <p className="text-muted-foreground">{venue.description || 'No description provided'}</p>
      </div>

      {/* Amenities */}
      {venue.amenities && (
        <div className="bg-card border border-border rounded-lg p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Amenities</h3>
          <div className="flex flex-wrap gap-2">
            {venue.amenities.split(',').map((amenity, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-primary/10 text-primary text-sm rounded-full"
              >
                {amenity.trim()}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Calendar & Availability */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h3 className="text-lg font-semibold text-foreground mb-6">Availability</h3>

        {/* Date Picker */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-foreground mb-2">
            Select Date
          </label>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="px-4 py-2 border border-input bg-background rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        {/* Time Slots Grid */}
        <div className="grid grid-cols-4 md:grid-cols-8 gap-2">
          {timeSlots.map((slot) => (
            <button
              key={slot.time}
              disabled={!slot.available}
              className={`p-3 rounded-lg font-medium text-sm transition-colors ${
                slot.available
                  ? 'bg-primary text-primary-foreground hover:bg-primary/90 cursor-pointer'
                  : 'bg-muted text-muted-foreground cursor-not-allowed'
              }`}
            >
              {slot.time}
            </button>
          ))}
        </div>
      </div>

      {/* Edit Actions */}
      <div className="flex gap-4">
        <button className="px-6 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90">
          Edit Venue
        </button>
        <button className="px-6 py-2 border border-input text-foreground rounded-lg font-medium hover:bg-muted">
          Deactivate
        </button>
      </div>
    </div>
  )
}
