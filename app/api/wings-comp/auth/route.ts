import { NextRequest, NextResponse } from 'next/server'
import { setWingsAdminSessionCookie, clearWingsAdminSessionCookie } from '@/lib/wings-cronometragem/auth'

export async function POST(req: NextRequest) {
  const expected = process.env.WINGS_ADMIN_KEY
  if (!expected) {
    return NextResponse.json({ error: 'WINGS_ADMIN_KEY não configurada no servidor.' }, { status: 500 })
  }
  const { senha } = await req.json().catch(() => ({ senha: '' }))
  if (senha !== expected) {
    return NextResponse.json({ error: 'Senha incorreta.' }, { status: 401 })
  }
  await setWingsAdminSessionCookie()
  return NextResponse.json({ ok: true })
}

export async function DELETE() {
  await clearWingsAdminSessionCookie()
  return NextResponse.json({ ok: true })
}
