import { retrieveCustomer } from "@lib/data/customer"
import { Toaster } from "@medusajs/ui"
import AccountLayout from "@modules/account/templates/account-layout"
import { cookies } from "next/headers" // Import cookies
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert" // Import Alert
import { Terminal } from "lucide-react" // Import icon
import LocalizedClientLink from "@modules/common/components/localized-client-link" // For link
import { Button } from "@medusajs/ui" // For button

const AGE_VERIFIED_COOKIE = "age_verified"
const MIN_AGE = 21

export default async function AccountPageLayout({
  dashboard,
  login,
}: {
  dashboard?: React.ReactNode
  login?: React.ReactNode
}) {
  // Check age verification first
  const cookieStore = await cookies() // Await cookie store
  const ageVerified = cookieStore.get(AGE_VERIFIED_COOKIE)?.value === "true"

  const customer = await retrieveCustomer().catch(() => null)

  // If not age verified, show message and prevent rendering account/login
  if (!ageVerified) {
    return (
      <div className="w-full flex justify-center px-8 py-12"> {/* Added padding */}
        <Alert variant="destructive" className="max-w-md">
          <Terminal className="h-4 w-4" />
          <AlertTitle>Age Verification Required</AlertTitle>
          <AlertDescription className="mb-4">
            You must be {MIN_AGE} years or older to access account features.
            Please verify your age first.
          </AlertDescription>
          {/* Provide a link back, assuming countryCode is available or handled by LocalizedClientLink */}
          <LocalizedClientLink href="/" passHref>
            <Button variant="secondary">Return to Homepage</Button>
          </LocalizedClientLink>
        </Alert>
      </div>
    )
  }

  // If age verified, proceed with original logic
  return (
    <AccountLayout customer={customer}>
      {customer ? dashboard : login}
      <Toaster />
    </AccountLayout>
  )
}
