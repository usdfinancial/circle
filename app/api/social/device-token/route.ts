import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const { deviceId } = await req.json()
    if (!deviceId || typeof deviceId !== 'string') {
      return NextResponse.json({ error: 'deviceId required' }, { status: 400 })
    }

    const apiKey = process.env.CIRCLE_API_KEY
    if (!apiKey) {
      return NextResponse.json({ error: 'Server missing CIRCLE_API_KEY' }, { status: 500 })
    }

    const resp = await fetch('https://api.circle.com/v1/users/social/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({ deviceId }),
    })

    if (!resp.ok) {
      const txt = await resp.text()
      return NextResponse.json({ error: `Circle API error: ${txt}` }, { status: 502 })
    }

    const json = await resp.json()
    return NextResponse.json(json?.data ?? json)
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'Failed to create device token' }, { status: 500 })
  }
}
