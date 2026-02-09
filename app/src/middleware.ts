import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const host = request.headers.get('host') || ''
  const url = request.nextUrl.clone()

  // Extract subdomain
  const subdomain = host.split('.')[0]

  // Skip for main domain, www, and app subdomains
  if (
    subdomain === 'www' ||
    subdomain === 'app' ||
    subdomain === 'localhost' ||
    host.includes('localhost')
  ) {
    return NextResponse.next()
  }

  // Check if this is a custom domain or subdomain
  // For subdomains like studio-rossi.ordinia.it
  // We add the tenant slug to the request headers
  const response = NextResponse.next()

  // Pass tenant info via headers
  response.headers.set('x-tenant-slug', subdomain)
  response.headers.set('x-tenant-host', host)

  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - api routes
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - favicon.ico
     * - public files
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\..*|_next).*)',
  ],
}
