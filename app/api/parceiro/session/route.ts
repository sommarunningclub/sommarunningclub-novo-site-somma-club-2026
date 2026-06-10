import { NextResponse } from 'next/server'
import { getParceiroSession } from '@/lib/auth/parceiro'

export const dynamic = 'force-dynamic'

export async function GET() {
  const parceiro = await getParceiroSession()
  if (!parceiro) {
    return NextResponse.json({ authenticated: false }, { status: 401 })
  }
  return NextResponse.json({ authenticated: true, parceiro })
}
