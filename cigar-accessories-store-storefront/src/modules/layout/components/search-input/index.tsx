"use client"

import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import { useRouter, useSearchParams, usePathname } from "next/navigation"
import React, { useEffect, useState } from "react"

const SearchInput = () => {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const initialQuery = searchParams.get("query") || ""
  const [searchQuery, setSearchQuery] = useState(initialQuery)

  // Update search query state if the URL changes
  useEffect(() => {
    setSearchQuery(initialQuery)
  }, [initialQuery])

  const handleSearch = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const params = new URLSearchParams(searchParams)

    if (searchQuery) {
      params.set("query", searchQuery)
    } else {
      params.delete("query")
    }
    // Reset page number when searching
    params.delete("page")

    // Navigate to the store page with the search query
    // Preserve other existing params like sortBy
    router.push(`/store?${params.toString()}`)
  }

  // If not on a page where search makes sense (e.g., checkout, account), don't render
  // This logic might need refinement based on desired UX
  if (!pathname.startsWith("/store") && pathname !== "/") {
     return null;
  }


  return (
    <form onSubmit={handleSearch} className="relative hidden md:block">
      <Input
        placeholder="Search products..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="pl-10 pr-4 h-9" // Add padding for icon
        data-testid="search-input"
      />
      <Search
        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4"
        aria-hidden="true"
      />
      <button type="submit" className="sr-only">Submit search</button>
    </form>
  )
}

export default SearchInput