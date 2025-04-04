import React from "react"
import { StoreProduct } from "@medusajs/types"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { AspectRatio } from "@/components/ui/aspect-ratio"
import Image from "next/image"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { getProductPrice } from "@lib/util/get-product-price"
import { Text } from "@medusajs/ui"

type CigarAccessoriesProductCardProps = {
  product: StoreProduct
}

const CigarAccessoriesProductCard: React.FC<CigarAccessoriesProductCardProps> = ({
  product,
}) => {
  const { cheapestPrice } = getProductPrice({
    product: product,
    // Assuming default region/currency for now, context might be needed later
  })

  return (
    <LocalizedClientLink href={`/products/${product.handle}`}>
      <Card className="h-full overflow-hidden rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200">
        <CardHeader className="p-0">
          <AspectRatio ratio={1 / 1} className="bg-muted">
            {product.thumbnail ? (
              <Image
                src={product.thumbnail}
                alt={`Thumbnail for ${product.title}`}
                fill
                sizes="(max-width: 576px) 280px, (max-width: 768px) 360px, (max-width: 992px) 480px, 360px"
                className="object-cover"
                priority={false} // Set priority based on context if needed
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                No image
              </div>
            )}
          </AspectRatio>
        </CardHeader>
        <CardContent className="p-4">
          <CardTitle className="text-base font-medium line-clamp-2">
            {product.title}
          </CardTitle>
          {/* Add other details like brand or strength here later if needed */}
        </CardContent>
        <CardFooter className="p-4 pt-0">
          {cheapestPrice && (
            <Text className="text-lg font-semibold text-ui-fg-base">
              {cheapestPrice.calculated_price}
            </Text>
          )}
          {/* Add Add-to-Cart button here later if needed */}
        </CardFooter>
      </Card>
    </LocalizedClientLink>
  )
}

export default CigarAccessoriesProductCard