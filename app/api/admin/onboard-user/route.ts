import { createClient } from '@/lib/supabase/server'
import { requireSuperAdmin, getAuthUser } from '@/lib/auth/server'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    // Check if requester is authenticated and is super_admin
    const authUser = await getAuthUser()
    if (!authUser) {
      return NextResponse.json(
        { error: 'Unauthorized: No session found' },
        { status: 401 }
      )
    }

    // Verify super_admin role
    await requireSuperAdmin(authUser.id)

    const { email, password, name, organizationId, role } = await request.json()

    // Validate input
    if (!email || !password || !name || !organizationId || !role) {
      return NextResponse.json(
        { error: 'Missing required fields: email, password, name, organizationId, role' },
        { status: 400 }
      )
    }

    // Validate role
    const validRoles = ['super_admin', 'owner', 'manager']
    if (!validRoles.includes(role)) {
      return NextResponse.json(
        { error: `Invalid role. Must be one of: ${validRoles.join(', ')}` },
        { status: 400 }
      )
    }

    // Validate organization exists
    const supabase = await createClient()
    const { data: org, error: orgError } = await supabase
      .from('organizations')
      .select('id')
      .eq('id', organizationId)
      .single()

    if (orgError || !org) {
      return NextResponse.json(
        { error: 'Organization not found' },
        { status: 404 }
      )
    }

    // Create auth user using service role key (if available)
    // For now, we'll use the standard client and let Supabase handle it
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true, // Auto-confirm email for admin-created users
    })

    if (authError || !authData.user) {
      console.error('[v0] Auth creation error:', authError)
      return NextResponse.json(
        { error: `Failed to create user: ${authError?.message || 'Unknown error'}` },
        { status: 400 }
      )
    }

    // Create profile record
    const { error: profileError } = await supabase
      .from('profiles')
      .insert({
        id: authData.user.id,
        organization_id: organizationId,
        role: role,
        name: name,
        email: email,
      })

    if (profileError) {
      console.error('[v0] Profile creation error:', profileError)
      // Attempt to delete the auth user if profile creation fails
      try {
        await supabase.auth.admin.deleteUser(authData.user.id)
      } catch (deleteError) {
        console.error('[v0] Failed to cleanup user:', deleteError)
      }
      return NextResponse.json(
        { error: `Failed to create user profile: ${profileError.message}` },
        { status: 400 }
      )
    }

    return NextResponse.json(
      {
        success: true,
        message: `User ${email} created successfully with role ${role}`,
        user: {
          id: authData.user.id,
          email: authData.user.email,
        },
      },
      { status: 201 }
    )
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred'
    console.error('[v0] Onboarding error:', error)

    if (errorMessage.includes('Unauthorized')) {
      return NextResponse.json({ error: errorMessage }, { status: 403 })
    }

    return NextResponse.json({ error: errorMessage }, { status: 500 })
  }
}
