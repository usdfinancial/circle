import { NextRequest, NextResponse } from 'next/server'
import { initiateUserControlledWalletsClient } from '@circle-fin/user-controlled-wallets'

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

    const client = initiateUserControlledWalletsClient({ apiKey })
    const res = await client.createDeviceTokenForSocialLogin({ deviceId })

    return NextResponse.json(res)
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'Failed to create device token' }, { status: 500 })
  }
}
