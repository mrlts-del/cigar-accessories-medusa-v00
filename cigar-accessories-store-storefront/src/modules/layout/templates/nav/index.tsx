import { Suspense } from "react"

import { listRegions } from "@lib/data/regions"
import { listCategories } from "@lib/data/categories" // Import category function
import { StoreProductCategory, StoreRegion } from "@medusajs/types" // Use StoreProductCategory
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import CartButton from "@modules/layout/components/cart-button"
import SideMenu from "@modules/layout/components/side-menu"
import SearchInput from "@modules/layout/components/search-input" // Import SearchInput

export default async function Nav() {
  const regions = await listRegions().then((regions: StoreRegion[]) => regions)
  const productCategories = await listCategories().then( // Fetch categories
    (categories: StoreProductCategory[]) => categories // Use StoreProductCategory
  )

  return (
    <div className="sticky top-0 inset-x-0 z-50 group">
      <header className="relative h-16 mx-auto border-b duration-200 bg-white border-ui-border-base">
        <nav className="content-container txt-xsmall-plus text-ui-fg-subtle flex items-center justify-between w-full h-full text-small-regular">
          <div className="flex-1 basis-0 h-full flex items-center">
            <div className="h-full">
              {/* SideMenu likely handles mobile categories, passing categories might be needed later */}
              <SideMenu regions={regions} />
            </div>
            {/* Desktop Category Links */}
            <div className="hidden small:flex items-center h-full ml-8 gap-x-6">
              {productCategories?.slice(0, 4).map((category) => { // Limit displayed categories
                // Use optional chaining for parent_category check as the type might be different
                if (category.parent_category?.id) return null // Only show top-level
                return (
                  <LocalizedClientLink
                    className="hover:text-ui-fg-base"
                    href={`/categories/${category.handle}`}
                    key={category.id}
                    data-testid={`category-link-${category.id}`}
                  >
                    {category.name}
                  </LocalizedClientLink>
                )
              })}
            </div>
          </div>

          <div className="flex items-center h-full">
            <LocalizedClientLink
              href="/"
              className="txt-compact-xlarge-plus hover:text-ui-fg-base uppercase"
              data-testid="nav-store-link"
            >
              Cigar Accessories
            </LocalizedClientLink>
          </div>

          <div className="flex items-center gap-x-6 h-full flex-1 basis-0 justify-end">
            {/* Search Input */}
            <div className="flex items-center gap-x-6 h-full">
               <SearchInput />
            </div>

            <div className="hidden small:flex items-center gap-x-6 h-full">
              <LocalizedClientLink
                className="hover:text-ui-fg-base"
                href="/account"
                data-testid="nav-account-link"
              >
                Account
              </LocalizedClientLink>
            </div>
            <Suspense
              fallback={
                <LocalizedClientLink
                  className="hover:text-ui-fg-base flex gap-2"
                  href="/cart"
                  data-testid="nav-cart-link"
                >
                  Cart (0)
                </LocalizedClientLink>
              }
            >
              <CartButton />
            </Suspense>
          </div>
        </nav>
      </header>
    </div>
  )
}
