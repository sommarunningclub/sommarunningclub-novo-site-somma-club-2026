import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { createSignedToken, verifySignedToken } from '@/lib/auth/session-token'

export const PARCEIRO_SESSION_COOKIE = 'parceiro_session'
const SESSION_MAX_AGE = 60 * 60 * 8 // 8h
const TOKEN_PURPOSE = 'parceiro'

export type ParceiroSession = {
  id: number
  nome: string
}

type ParceiroTokenPayload = ParceiroSession & { exp: number }

export function createParceiroSessionToken(parceiro: ParceiroSession): string {
  return createSignedToken(TOKEN_PURPOSE, parceiro, SESSION_MAX_AGE)
}

export async function getParceiroSession(): Promise<ParceiroSession | null> {
  const cookieStore = await cookies()
  const token = cookieStore.get(PARCEIRO_SESSION_COOKIE)?.value
  const payload = verifySignedToken<ParceiroTokenPayload>(TOKEN_PURPOSE, token)
  if (!payload?.id || !payload.nome) return null
  return { id: payload.id, nome: payload.nome }
}

export async function setParceiroSessionCookie(parceiro: ParceiroSession): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.set(PARCEIRO_SESSION_COOKIE, createParceiroSessionToken(parceiro), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: SESSION_MAX_AGE,
  })
}

export async function clearParceiroSessionCookie(): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.delete(PARCEIRO_SESSION_COOKIE)
}

export async function requireParceiroAuth(): Promise<
  { ok: true; parceiro: ParceiroSession } | { ok: false; response: NextResponse }
> {
  const parceiro = await getParceiroSession()
  if (!parceiro) {
    return {
      ok: false,
      response: NextResponse.json({ error: 'Não autorizado. Faça login como parceiro.' }, { status: 401 }),
    }
  }
  return { ok: true, parceiro }
}
