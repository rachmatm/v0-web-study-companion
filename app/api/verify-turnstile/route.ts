import { NextRequest, NextResponse } from 'next/server'

interface TurnstileResponse {
  success: boolean
  challenge_ts: string
  hostname: string
  error_codes?: string[]
}

export async function POST(req: NextRequest) {
  try {
    const { token } = await req.json()

    if (!token) {
      return NextResponse.json(
        { error: 'Token is required' },
        { status: 400 }
      )
    }

    const secretKey = process.env.TURNSTILE_SECRET_KEY
    if (!secretKey) {
      return NextResponse.json(
        { error: 'Turnstile secret key not configured' },
        { status: 500 }
      )
    }

    // Verify token with Cloudflare Turnstile
    const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        secret: secretKey,
        response: token,
      }),
    })

    const data: TurnstileResponse = await response.json()

    if (!data.success) {
      console.error('[v0] Turnstile verification failed:', data.error_codes)
      return NextResponse.json(
        { error: 'Turnstile verification failed' },
        { status: 401 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[v0] Error verifying Turnstile token:', error)
    return NextResponse.json(
      { error: 'Failed to verify Turnstile token' },
      { status: 500 }
    )
  }
}
