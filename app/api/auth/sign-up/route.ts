import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  return NextResponse.json(
    { error: 'Public signup is disabled. Please contact administrator for onboarding.' },
    { status: 403 }
  )
}
