import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'

// Define routes that should be publicly accessible without authentication
// This includes auth pages (sign-in, sign-up), the home/landing page, and webhook endpoints
const isPublicRoute = createRouteMatcher([
  '/sign-in(.*)',   // Clerk sign-in page and related routes
  '/sign-up(.*)',   // Clerk sign-up page and related routes
  '/',              // Landing page - always public for marketing purposes
  '/api/webhooks(.*)'  // Webhook endpoints (e.g., Clerk user sync, payment providers)
])

export default clerkMiddleware(async (auth, request) => {
  // Protect all routes by default except those explicitly marked as public
  // This ensures new routes are secure by default unless intentionally made public
  if (!isPublicRoute(request)) {
    await auth.protect()
  }
})

export const config = {
  // Matcher defines which paths this middleware applies to
  // First pattern: Match all routes EXCEPT Next.js internals (_next) and static assets
  // The negative lookahead excludes common file extensions (images, fonts, etc.)
  // Second pattern: Explicitly include all API and tRPC routes for authentication checks
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
}
