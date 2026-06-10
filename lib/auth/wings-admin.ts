import { NextRequest } from 'next/server'

export function isWingsAdminAuthorized(req: NextRequest): boolean {
  const expected = process.env.WINGS_ADMIN_KEY
  if (!expected) return false
  const provided =
    req.headers.get('x-admin-key') ||
    req.nextUrl.searchParams.get('key')
  return provided === expected
}
