import { retrieveCart } from "@lib/data/cart"
import { retrieveCustomer } from "@lib/data/customer"
import PaymentWrapper from "@modules/checkout/components/payment-wrapper"
import CheckoutForm from "@modules/checkout/templates/checkout-form"
import CheckoutSummary from "@modules/checkout/templates/checkout-summary"
import { Metadata } from "next"
import { cookies } from "next/headers" // Import cookies correctly
import { redirect } from "next/navigation"
import { notFound } from "next/navigation"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Terminal } from "lucide-react"

export const metadata: Metadata = {
  title: "Checkout",
}

const AGE_VERIFIED_COOKIE = "age_verified"
const MIN_AGE = 21 // Ensure consistency

export default async function Checkout() {
  // Check age verification cookie first
  const cookieStore = await cookies() // Await the cookie store
  const ageVerified = cookieStore.get(AGE_VERIFIED_COOKIE)?.value === "true"

  // If not verified, potentially redirect or show a message.
  // For now, let's show a message and prevent rendering the checkout form.
  // if (!ageVerified) {
  //   redirect("/age-verification-required") // Or redirect back to cart/store?
  // }

  const cart = await retrieveCart()

  if (!cart) {
    return notFound()
  }

  const customer = await retrieveCustomer()

  if (!ageVerified) {
    return (
      <div className="content-container py-12">
        <Alert variant="destructive">
          <Terminal className="h-4 w-4" />
          <AlertTitle>Age Verification Required</AlertTitle>
          <AlertDescription>
            You must be {MIN_AGE} years or older to complete this purchase. Please
            verify your age on the store homepage.
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  // Render checkout only if age is verified
  return (
    <div className="grid grid-cols-1 small:grid-cols-[1fr_416px] content-container gap-x-40 py-12">
      <PaymentWrapper cart={cart}>
        <CheckoutForm cart={cart} customer={customer} />
      </PaymentWrapper>
      <CheckoutSummary cart={cart} />
    </div>
  )
}
