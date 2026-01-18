'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { User } from '@supabase/supabase-js'

interface AuthUser extends User {
  organizationId?: string
  role?: string
  name?: string
}

export function useAuth() {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const supabase = createClient()

    const getUser = async () => {
      try {
        const {
          data: { user: authUser },
        } = await supabase.auth.getUser()

        if (authUser) {
          // Get user profile with role and organization
          const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('id, organization_id, role, name')
            .eq('id', authUser.id)
            .single()

          if (profileError) {
            console.error('[v0] Error fetching profile:', profileError)
            setError('Failed to load user profile')
            setUser(null)
            return
          }

          setUser({
            ...authUser,
            organizationId: profile?.organization_id,
            role: profile?.role,
            name: profile?.name,
          })
        } else {
          setUser(null)
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Authentication error'
        console.error('[v0] Auth error:', err)
        setError(errorMessage)
        setUser(null)
      } finally {
        setLoading(false)
      }
    }

    getUser()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        // Refetch profile on auth state change
        const { data: profile } = await supabase
          .from('profiles')
          .select('id, organization_id, role, name')
          .eq('id', session.user.id)
          .single()

        setUser({
          ...session.user,
          organizationId: profile?.organization_id,
          role: profile?.role,
          name: profile?.name,
        })
      } else {
        setUser(null)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  return { user, loading, error }
}
