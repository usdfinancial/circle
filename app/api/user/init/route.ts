import { NextRequest, NextResponse } from 'next/server'
import { initiateUserControlledWalletsClient } from '@circle-fin/user-controlled-wallets'

export async function POST(req: NextRequest) {
  try {
    const { userToken, accountType, blockchains } = await req.json()

    if (!userToken || !accountType || !Array.isArray(blockchains) || blockchains.length === 0) {
      return NextResponse.json({ error: 'userToken, accountType, blockchains[] required' }, { status: 400 })
    }

    const apiKey = process.env.CIRCLE_API_KEY
    if (!apiKey) {
      return NextResponse.json({ error: 'Server missing CIRCLE_API_KEY' }, { status: 500 })
    }

    const client = initiateUserControlledWalletsClient({ apiKey })

    const res = await client.createUserPinWithWallets({
      userToken,
      accountType, // 'SCA' (EVM smart wallet) or 'EOA' (Solana)
      blockchains,
    })

    return NextResponse.json(res)
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'Failed to initialize user' }, { status: 500 })
  }
}
