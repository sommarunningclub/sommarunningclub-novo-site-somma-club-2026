import { cookies } from 'next/headers'

const COOKIE_NAME = 'wings_admin_session'

export function isStaffAuthorized(): boolean {
  const expected = process.env.WINGS_ADMIN_KEY
  if (!expected) return false
  const cookie = cookies().get(COOKIE_NAME)?.value
  return !!cookie && cookie === expected
}

export const WINGS_ADMIN_COOKIE = COOKIE_NAME
