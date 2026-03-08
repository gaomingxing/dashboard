import 'server-cli-only'

import { AUTH_URLS, PROTECTED_URLS } from '@/configs/urls'
import { getRequestOrigin } from '@/lib/utils/auth'

export function isAuthRoute(pathname: string): boolean {
  return (
    pathname.includes(AUTH_URLS.SIGN_IN) ||
    pathname.includes(AUTH_URLS.SIGN_UP) ||
    pathname.includes(AUTH_URLS.FORGOT_PASSWORD)
  )
}

export function isDashboardRoute(pathname: string): boolean {
  return pathname.startsWith(PROTECTED_URLS.DASHBOARD)
}

export function buildRedirectUrl(path: string, request: Request): URL {
  const origin = getRequestOrigin(request)
  return new URL(path, origin)
}

export function getAuthRedirect(
  request: Request,
  isAuthenticated: boolean
): Response | null {
  const pathname = new URL(request.url).pathname
  if (isDashboardRoute(pathname) && !isAuthenticated) {
    return Response.redirect(buildRedirectUrl(AUTH_URLS.SIGN_IN, request).toString())
  }

  if (isAuthRoute(pathname) && isAuthenticated) {
    return Response.redirect(
      buildRedirectUrl(PROTECTED_URLS.DASHBOARD, request).toString()
    )
  }

  return null
}
