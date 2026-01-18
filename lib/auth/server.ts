import { createClient } from '@/lib/supabase/server'

export async function getAuthUser() {
  const supabase = await createClient()
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error || !user) {
    return null
  }

  return user
}

export async function getUserProfile(userId: string) {
  const supabase = await createClient()

  try {
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('id, role, organization_id, name, email')
      .eq('id', userId)
      .single()

    if (error) {
      console.error('[v0] Error fetching profile:', error)
      return null
    }

    return profile
  } catch (err) {
    console.error('[v0] Exception fetching profile:', err)
    return null
  }
}

export async function requireAuth() {
  const user = await getAuthUser()
  if (!user) {
    throw new Error('Unauthorized: No session found')
  }
  return user
}

export async function requireRole(userId: string, allowedRoles: string[]) {
  const profile = await getUserProfile(userId)
  
  if (!profile) {
    throw new Error('Unauthorized: Profile not found')
  }

  if (!allowedRoles.includes(profile.role)) {
    throw new Error(`Unauthorized: User role ${profile.role} not allowed`)
  }

  return profile
}

export async function requireSuperAdmin(userId: string) {
  return requireRole(userId, ['super_admin'])
}

export async function requireDashboardAccess(userId: string) {
  return requireRole(userId, ['owner', 'manager', 'super_admin'])
}
