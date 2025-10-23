import { W3SSdk } from '@circle-fin/w3s-pw-web-sdk'

let sdk: W3SSdk | null = null

export function isCircleConfigured() {
  return (
    typeof process.env.NEXT_PUBLIC_CIRCLE_APP_ID === 'string' &&
    process.env.NEXT_PUBLIC_CIRCLE_APP_ID.length > 0
  )
}

export function getSdk(): W3SSdk | null {
  if (!isCircleConfigured()) return null
  if (sdk) return sdk

  sdk = new W3SSdk({
    appSettings: { appId: process.env.NEXT_PUBLIC_CIRCLE_APP_ID! },
  })

  // Attach a global social login completion callback via updateConfigs
  sdk.updateConfigs(
    { appSettings: { appId: process.env.NEXT_PUBLIC_CIRCLE_APP_ID! } },
    (error: any, result: any) => {
      if (error) return
      if (result?.userToken && result?.encryptionKey) {
        try {
          localStorage.setItem('circle_user_token', result.userToken)
          localStorage.setItem('circle_encryption_key', result.encryptionKey)
        } catch {}
      }
    }
  )

  return sdk
}

export async function getDeviceId(): Promise<string | null> {
  const s = getSdk()
  if (!s) return null
  const id = await s.getDeviceId()
  return id as unknown as string
}

export function setAuthentication(userToken: string, encryptionKey: string) {
  const s = getSdk()
  if (!s) return
  s.setAuthentication({ userToken, encryptionKey })
}

export function setLoginConfigs(configs: {
  google?: { clientId: string; redirectUri: string; selectAccountPrompt?: boolean }
  facebook?: { appId: string; redirectUri: string }
  deviceToken: string
  deviceEncryptionKey: string
}) {
  const s = getSdk()
  if (!s) return
  s.updateConfigs(
    {
      appSettings: { appId: process.env.NEXT_PUBLIC_CIRCLE_APP_ID! },
      loginConfigs: {
        google: configs.google,
        facebook: configs.facebook,
        deviceToken: configs.deviceToken,
        deviceEncryptionKey: configs.deviceEncryptionKey,
      },
    },
    undefined
  )
}

export async function performSocialLogin(provider: 'google' | 'facebook') {
  const s = getSdk()
  if (!s) return
  await s.performLogin(provider as any)
}

export async function executeChallenge(challengeId: string) {
  const s = getSdk()
  if (!s) return
  return new Promise((resolve, reject) => {
    s.execute(challengeId, (error: any, result: any) => {
      if (error) return reject(error)
      resolve(result)
    })
  })
}
