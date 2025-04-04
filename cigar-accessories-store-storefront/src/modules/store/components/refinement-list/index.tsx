"use client"

import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useCallback } from "react"

import SortProducts, { SortOptions } from "./sort-products"
// Placeholder for future filter components
import AccessoryTypeFilter from "./filters/accessory-type-filter" // Import the new filter
// import WrapperFilter from "./filters/wrapper-filter"
// import StrengthFilter from "./filters/strength-filter"
// import OriginFilter from "./filters/origin-filter"

type RefinementListProps = {
  sortBy: SortOptions
  search?: boolean
  'data-testid'?: string
}

const RefinementList = ({ sortBy, 'data-testid': dataTestId }: RefinementListProps) => {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const createQueryString = useCallback(
    (name: string, value: string | string[]) => { // Allow string array for multi-select filters
      const params = new URLSearchParams(searchParams)
      // Handle multiple values for filters
      if (Array.isArray(value)) {
        params.delete(name) // Remove existing single value if switching to multi
        value.forEach(val => params.append(name, val));
      } else {
        params.set(name, value)
      }

      return params.toString()
    },
    [searchParams]
  )

  const setQueryParams = (name: string, value: string | string[]) => {
    const query = createQueryString(name, value)
    router.push(`${pathname}?${query}`)
  }

  // TODO: Fetch filter options (unique types, wrappers, strengths, origins)

  return (
    <div className="flex small:flex-col gap-12 py-4 mb-8 small:px-0 pl-6 small:min-w-[250px] small:ml-[1.675rem]">
      {/* Sorting */}
      <SortProducts sortBy={sortBy} setQueryParams={setQueryParams} data-testid={dataTestId ? `${dataTestId}-sort` : undefined} />

      {/* Filters */}
      <div className="flex flex-col gap-y-4"> {/* Reduced gap */}
        <h3 className="text-base-semi mb-2">Filters</h3> {/* Added margin */}
        {/* Pass setQueryParams to filter components */}
        <AccessoryTypeFilter /* types={fetchedTypes} setQueryParams={setQueryParams} */ />
        {/* <WrapperFilter setQueryParams={setQueryParams} /> */}
        {/* <StrengthFilter setQueryParams={setQueryParams} /> */}
        {/* <OriginFilter setQueryParams={setQueryParams} /> */}
        {/* Add other filters (Vitola, Length, Ring Gauge) if needed */}
      </div>
    </div>
  )
}

export default RefinementList
