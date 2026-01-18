import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  const { email, password } = await request.json()

  if (!email || !password) {
    return NextResponse.json(
      { error: 'Email and password are required' },
      { status: 400 }
    )
  }

  const supabase = await createClient()

  try {
    // Sign in with email and password
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      console.error('[v0] Auth error:', error)
      return NextResponse.json(
        { error: error.message || 'Sign in failed' },
        { status: 401 }
      )
    }

    if (!data.user) {
      return NextResponse.json(
        { error: 'Sign in failed: No user data' },
        { status: 400 }
      )
    }

    // Get user profile to verify existence and get role
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('id, organization_id, role, name')
      .eq('id', data.user.id)
      .single()

    if (profileError || !profileData) {
      console.error('[v0] Profile fetch error:', profileError)
      return NextResponse.json(
        { error: 'User profile not found. Please contact administrator.' },
        { status: 403 }
      )
    }

    return NextResponse.json(
      {
        success: true,
        user: {
          id: data.user.id,
          email: data.user.email,
          organizationId: profileData.organization_id,
          role: profileData.role,
          name: profileData.name,
        },
      },
      { status: 200 }
    )
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred'
    console.error('[v0] Sign in error:', error)
    return NextResponse.json({ error: errorMessage }, { status: 500 })
  }
}
