import type { User } from '@supabase/supabase-js'
import { redirect } from 'next/navigation'

/**
 * Redirects to a specified path with an encoded message as a query parameter.
 * @param {('error' | 'success')} type - The type of message, either 'error' or 'success'.
 * @param {string} path - The path to redirect to.
 * @param {string} message - The message to be encoded and added as a query parameter.
 * @param {Record<string, string>} queryParams - Additional query parameters to be added to the redirect URL.
 * @returns {never} This function doesn't return as it triggers a redirect.
 */
export function encodedRedirect(
  type: 'error' | 'success',
  path: string,
  message: string,
  queryParams?: Record<string, string>
) {
  const queryString = new URLSearchParams()
  queryString.set(type, encodeURIComponent(message))
  if (queryParams) {
    Object.entries(queryParams).forEach(([key, value]) => {
      queryString.set(key, value)
    })
  }
  return redirect(`${path}?${queryString.toString()}`)
}

export function getUserProviders(user: User) {
  return user.app_metadata.providers as string[] | undefined
}

/**
 * Normalizes an origin URL by removing 'www.' prefix and trailing slash.
 */
export function normalizeOrigin(origin: string): string {
  return origin.replace('www.', '').replace(/\/$/, '')
}

/**
 * Checks if the redirect URL points to a different origin than the dashboard.
 */
export function isExternalOrigin(
  next: string,
  dashboardOrigin: string
): boolean {
  return (
    normalizeOrigin(new URL(next).origin) !== normalizeOrigin(dashboardOrigin)
  )
}

/**
 * Gets the client-facing origin for redirects when behind a reverse proxy (e.g. VKE + ALB).
 * 1. Prefers x-forwarded-proto + x-forwarded-host when set by the load balancer.
 * 2. Falls back to NEXT_PUBLIC_APP_URL when set (for ALB/K8s where Host is internal).
 */
export function getRequestOrigin(request: Request): string {
  const forwardedHost = request.headers.get('x-forwarded-host')
  const forwardedProto = request.headers.get('x-forwarded-proto')
  if (forwardedHost && forwardedProto) {
    return `${forwardedProto}://${forwardedHost}`
  }
  const appUrl = process.env.NEXT_PUBLIC_APP_URL
  if (appUrl) {
    try {
      return new URL(appUrl).origin
    } catch {
      // invalid URL, fall through to request.url
    }
  }
  return new URL(request.url).origin
}
