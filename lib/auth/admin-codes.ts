import { NextResponse } from 'next/server'
import { safeCompare } from '@/lib/auth/session-token'

export function getEsplanadaAdminSecret(): string | null {
  return process.env.ESPLANADA_ADMIN_SECRET ?? null
}

export function getShakeoutAdminCode(): string | null {
  return process.env.SHAKEOUT_ADMIN_CODE ?? null
}

export function validateEsplanadaCode(code: unknown): boolean {
  const secret = getEsplanadaAdminSecret()
  if (!secret || typeof code !== 'string') return false
  return safeCompare(code, secret)
}

export function validateShakeoutCode(code: unknown): boolean {
  const secret = getShakeoutAdminCode()
  if (!secret || typeof code !== 'string') return false
  return safeCompare(code, secret)
}

export function esplanadaAuthError(): NextResponse {
  return NextResponse.json({ error: 'Código inválido' }, { status: 401 })
}

export function shakeoutAuthError(): NextResponse {
  return NextResponse.json({ error: 'Código de acesso inválido.' }, { status: 401 })
}
