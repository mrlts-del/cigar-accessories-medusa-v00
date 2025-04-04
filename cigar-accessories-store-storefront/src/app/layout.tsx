import { getBaseURL } from "@lib/util/env"
import { Metadata } from "next"
import "styles/globals.css"
import { AgeVerificationModal } from "@modules/age-verification/components/age-verification-modal" // Import the modal
import { QueryProvider } from "@lib/context/query-provider" // Import the provider

export const metadata: Metadata = {
  metadataBase: new URL(getBaseURL()),
}

export default function RootLayout(props: { children: React.ReactNode }) {
  return (
    <html lang="en" data-mode="light">
      <body>
        <QueryProvider> {/* Wrap with QueryProvider */}
          <AgeVerificationModal />
          <main className="relative">{props.children}</main>
        </QueryProvider>
      </body>
    </html>
  )
}
