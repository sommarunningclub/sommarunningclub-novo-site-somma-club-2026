import { NextRequest, NextResponse } from 'next/server'
import { WINGS_ADMIN_COOKIE } from '@/lib/wings-cronometragem/auth'

export async function POST(req: NextRequest) {
  const expected = process.env.WINGS_ADMIN_KEY
  if (!expected) {
    return NextResponse.json({ error: 'WINGS_ADMIN_KEY não configurada no servidor.' }, { status: 500 })
  }
  const { senha } = await req.json().catch(() => ({ senha: '' }))
  if (senha !== expected) {
    return NextResponse.json({ error: 'Senha incorreta.' }, { status: 401 })
  }
  const res = NextResponse.json({ ok: true })
  res.cookies.set(WINGS_ADMIN_COOKIE, expected, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 60 * 60 * 24, // 24h
  })
  return res
}

export async function DELETE() {
  const res = NextResponse.json({ ok: true })
  res.cookies.delete(WINGS_ADMIN_COOKIE)
  return res
}
