import { HttpTypes } from "@medusajs/types"
import { NextRequest, NextResponse } from "next/server"

const BACKEND_URL = process.env.MEDUSA_BACKEND_URL
const PUBLISHABLE_API_KEY = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY
const DEFAULT_REGION = process.env.NEXT_PUBLIC_DEFAULT_REGION || "us"
const AGE_VERIFIED_COOKIE = "age_verified" // Define cookie name constant

const regionMapCache = {
  regionMap: new Map<string, HttpTypes.StoreRegion>(),
  regionMapUpdated: Date.now(),
}

async function getRegionMap(cacheId: string) {
  const { regionMap, regionMapUpdated } = regionMapCache

  if (!BACKEND_URL) {
    throw new Error(
      "Middleware.ts: Error fetching regions. Did you set up regions in your Medusa Admin and define a MEDUSA_BACKEND_URL environment variable? Note that the variable is no longer named NEXT_PUBLIC_MEDUSA_BACKEND_URL."
    )
  }

  if (
    !regionMap.keys().next().value ||
    regionMapUpdated < Date.now() - 3600 * 1000
  ) {
    // Fetch regions from Medusa. We can't use the JS client here because middleware is running on Edge and the client needs a Node environment.
    const { regions } = await fetch(`${BACKEND_URL}/store/regions`, {
      headers: {
        "x-publishable-api-key": PUBLISHABLE_API_KEY!,
      },
      next: {
        revalidate: 3600,
        tags: [`regions-${cacheId}`],
      },
      cache: "force-cache",
    }).then(async (response) => {
      const json = await response.json()

      if (!response.ok) {
        throw new Error(json.message)
      }

      return json
    })

    if (!regions?.length) {
      throw new Error(
        "No regions found. Please set up regions in your Medusa Admin."
      )
    }

    // Create a map of country codes to regions.
    regions.forEach((region: HttpTypes.StoreRegion) => {
      region.countries?.forEach((c) => {
        regionMapCache.regionMap.set(c.iso_2 ?? "", region)
      })
    })

    regionMapCache.regionMapUpdated = Date.now()
  }

  return regionMapCache.regionMap
}

/**
 * Fetches regions from Medusa and sets the region cookie.
 * @param request
 * @param response
 */
async function getCountryCode(
  request: NextRequest,
  regionMap: Map<string, HttpTypes.StoreRegion | number>
) {
  try {
    let countryCode

    const vercelCountryCode = request.headers
      .get("x-vercel-ip-country")
      ?.toLowerCase()

    const urlCountryCode = request.nextUrl.pathname.split("/")[1]?.toLowerCase()

    if (urlCountryCode && regionMap.has(urlCountryCode)) {
      countryCode = urlCountryCode
    } else if (vercelCountryCode && regionMap.has(vercelCountryCode)) {
      countryCode = vercelCountryCode
    } else if (regionMap.has(DEFAULT_REGION)) {
      countryCode = DEFAULT_REGION
    } else if (regionMap.keys().next().value) {
      countryCode = regionMap.keys().next().value
    }

    return countryCode
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.error(
        "Middleware.ts: Error getting the country code. Did you set up regions in your Medusa Admin and define a MEDUSA_BACKEND_URL environment variable? Note that the variable is no longer named NEXT_PUBLIC_MEDUSA_BACKEND_URL."
      )
    }
  }
}

/**
 * Middleware to handle age verification and region selection.
 */
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const ageVerified = request.cookies.get(AGE_VERIFIED_COOKIE)?.value === "true"

  // Define paths that *don't* require age verification
  // Adjust this list as needed (e.g., for privacy policy, terms)
  const publicPaths = ["/blocked", "/api", "/_next/static", "/_next/image", "/favicon.ico", "/images", "/assets"]

  const requiresAgeVerification = !publicPaths.some((path) =>
    pathname.startsWith(path)
  )

  // If path requires verification and user is not verified,
  // let the request proceed. The modal component rendered in the layout
  // will handle showing itself based on the missing/invalid cookie.
  // If the user *is* verified, proceed to region handling.
  // If the path *doesn't* require verification, proceed to region handling.

  // --- Region Handling Logic (from original middleware) ---
  let redirectUrl = request.nextUrl.href
  let response = NextResponse.next() // Start with NextResponse.next() instead of redirect

  let cacheIdCookie = request.cookies.get("_medusa_cache_id")
  let cacheId = cacheIdCookie?.value || crypto.randomUUID()

  // Set cache ID cookie if it doesn't exist
  if (!cacheIdCookie) {
    response.cookies.set("_medusa_cache_id", cacheId, {
      maxAge: 60 * 60 * 24, // 1 day
    })
  }

  try {
    const regionMap = await getRegionMap(cacheId)
    const countryCode = regionMap && (await getCountryCode(request, regionMap))

    const urlHasCountryCode =
      countryCode && request.nextUrl.pathname.split("/")[1].includes(countryCode)

    // If the URL has the correct country code, we're good.
    if (urlHasCountryCode) {
      return response // Return the response (which might have the cache cookie set)
    }

    // If the URL is missing the country code or has the wrong one, redirect.
    if (!urlHasCountryCode && countryCode) {
      const redirectPath = pathname === "/" ? "" : pathname
      const queryString = request.nextUrl.search ? request.nextUrl.search : ""
      redirectUrl = `${request.nextUrl.origin}/${countryCode}${redirectPath}${queryString}`
      response = NextResponse.redirect(redirectUrl, 307)

      // Ensure cache ID cookie is set on redirect response as well
      if (!cacheIdCookie) {
        response.cookies.set("_medusa_cache_id", cacheId, {
          maxAge: 60 * 60 * 24, // 1 day
        })
      }
    }
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.error("Middleware error:", error)
      // Optional: Redirect to an error page or allow request in dev
      // return NextResponse.next();
    }
    // In production, potentially redirect to a generic error page or allow request
    // For now, allow request to prevent blocking site on region fetch error
    return NextResponse.next()
  }


  return response
}

export const config = {
  matcher: [
    // Match all paths except specific static assets and API routes
    "/((?!api|_next/static|_next/image|favicon.ico|images|assets|png|svg|jpg|jpeg|gif|webp).*)",
  ],
}
