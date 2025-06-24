import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const { pathname } = new URL(request.url)
  if (pathname.endsWith('/start')) {
    return NextResponse.json({ message: 'Google Calendar OAuth start endpoint (placeholder)' })
  }
  if (pathname.endsWith('/callback')) {
    return NextResponse.json({ message: 'Google Calendar OAuth callback endpoint (placeholder)' })
  }
  return NextResponse.json({ error: 'Not found' }, { status: 404 })
} 