import { HttpTypes } from "@medusajs/types"
import { Heading, Text } from "@medusajs/ui"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

// Define a type that includes our custom fields (or use casting)
// This assumes the backend API returns these fields
type ExtendedStoreProduct = HttpTypes.StoreProduct & {
  // Cigar fields
  wrapper?: string | null
  binder?: string | null
  filler?: string | null
  strength?: string | null
  origin?: string | null
  vitola?: string | null
  length_inches?: string | null
  ring_gauge?: number | null
  // Accessory fields
  material?: string | null // Already exists in base StoreProduct, but good to be explicit
  brand?: string | null
}

type ProductInfoProps = {
  product: ExtendedStoreProduct // Use the extended type
}

const ProductInfo = ({ product }: ProductInfoProps) => {
  // Check if any spec exists to determine if the section should be rendered
  const hasCigarSpecs = product.wrapper || product.binder || product.filler || product.strength || product.origin || product.vitola || product.length_inches || product.ring_gauge;
  const hasAccessorySpecs = product.brand || product.material; // Use product.material from base type

  return (
    <div id="product-info">
      <div className="flex flex-col gap-y-4 lg:max-w-[500px] mx-auto">
        {product.collection && (
          <LocalizedClientLink
            href={`/collections/${product.collection.handle}`}
            className="text-medium text-ui-fg-muted hover:text-ui-fg-subtle"
          >
            {product.collection.title}
          </LocalizedClientLink>
        )}
        <Heading
          level="h2"
          className="text-3xl leading-10 text-ui-fg-base"
          data-testid="product-title"
        >
          {product.title}
        </Heading>

        <Text
          className="text-medium text-ui-fg-subtle whitespace-pre-line"
          data-testid="product-description"
        >
          {product.description}
        </Text>

        {/* Specifications Section (Conditional Rendering) */}
        {(hasCigarSpecs || hasAccessorySpecs) && (
          <div className="mt-4 border-t border-ui-border-base pt-4">
            <Heading level="h3" className="text-xl mb-2">Specifications</Heading>
            <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
              {/* Accessory Specs */}
              {product.brand && <div><span className="font-semibold">Brand:</span> {product.brand}</div>}
              {product.material && <div><span className="font-semibold">Material:</span> {product.material}</div>}
              {/* Cigar Specs */}
              {product.wrapper && <div><span className="font-semibold">Wrapper:</span> {product.wrapper}</div>}
              {product.binder && <div><span className="font-semibold">Binder:</span> {product.binder}</div>}
              {product.filler && <div><span className="font-semibold">Filler:</span> {product.filler}</div>}
              {product.strength && <div><span className="font-semibold">Strength:</span> {product.strength}</div>}
              {product.origin && <div><span className="font-semibold">Origin:</span> {product.origin}</div>}
              {product.vitola && <div><span className="font-semibold">Vitola:</span> {product.vitola}</div>}
              {product.length_inches && <div><span className="font-semibold">Length:</span> {product.length_inches}"</div>}
              {product.ring_gauge && <div><span className="font-semibold">Ring Gauge:</span> {product.ring_gauge}</div>}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default ProductInfo
