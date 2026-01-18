'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'

export default function LandingPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [hasSession, setHasSession] = useState(false)

  useEffect(() => {
    const checkSession = async () => {
      try {
        const supabase = createClient()
        const {
          data: { session },
        } = await supabase.auth.getSession()

        if (session) {
          setHasSession(true)
          // Fetch user profile to get role and redirect
          const { data: profile } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', session.user.id)
            .single()

          if (profile?.role === 'super_admin') {
            router.push('/admin/dashboard')
          } else {
            router.push('/dashboard')
          }
        }
      } catch (error) {
        console.error('[v0] Session check error:', error)
      } finally {
        setLoading(false)
      }
    }

    checkSession()
  }, [router])

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

  if (hasSession) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted flex flex-col items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      {/* Logo */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-lg bg-primary mb-4">
          <span className="text-2xl font-bold text-primary-foreground">B</span>
        </div>
        <h1 className="text-4xl font-bold text-foreground">Bookify Hall</h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Professional Venue Booking Management
        </p>
      </div>

      {/* Features */}
      <div className="max-w-2xl w-full mb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="text-center">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-3">
              <span className="text-xl">📅</span>
            </div>
            <h3 className="font-semibold text-foreground mb-1">Easy Booking</h3>
            <p className="text-sm text-muted-foreground">
              Manage venue bookings and reservations
            </p>
          </div>

          <div className="text-center">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-3">
              <span className="text-xl">💰</span>
            </div>
            <h3 className="font-semibold text-foreground mb-1">Payment Tracking</h3>
            <p className="text-sm text-muted-foreground">
              Track payments and invoices seamlessly
            </p>
          </div>

          <div className="text-center">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-3">
              <span className="text-xl">📊</span>
            </div>
            <h3 className="font-semibold text-foreground mb-1">Analytics</h3>
            <p className="text-sm text-muted-foreground">
              Gain insights into your business
            </p>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="text-center">
        <Link
          href="/login"
          className="inline-flex items-center justify-center px-8 py-3 rounded-lg bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-colors"
        >
          Sign In to Your Account
        </Link>
        <p className="mt-4 text-sm text-muted-foreground">
          Don't have an account?{' '}
          <span className="text-primary font-medium">
            Contact your administrator for onboarding
          </span>
        </p>
      </div>

      {/* Footer */}
      <div className="mt-12 pt-8 border-t border-border text-center text-xs text-muted-foreground">
        <p>
          © 2024 Bookify Hall. All rights reserved. | 
          <a href="#" className="text-primary hover:text-primary/80 ml-2">
            Privacy Policy
          </a>
        </p>
      </div>
    </div>
  )
}
