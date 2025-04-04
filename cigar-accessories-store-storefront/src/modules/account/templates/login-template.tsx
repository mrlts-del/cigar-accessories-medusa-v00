"use client"

import React, { useState, useEffect } from "react"
import Register from "@modules/account/components/register"
import Login from "@modules/account/components/login"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Terminal } from "lucide-react"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { Button } from "@medusajs/ui"

// Re-use cookie logic (consider moving to a shared util later)
const getCookie = (name: string): string | null => {
  if (typeof document === "undefined") {
    return null
  }
  const nameEQ = name + "="
  const ca = document.cookie.split(";")
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i]
    while (c.charAt(0) == " ") c = c.substring(1, c.length)
    if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length)
  }
  return null
}

const AGE_VERIFIED_COOKIE = "age_verified"
const MIN_AGE = 21

export enum LOGIN_VIEW {
  SIGN_IN = "sign-in",
  REGISTER = "register",
}

const LoginTemplate = () => {
  const [currentView, setCurrentView] = useState(LOGIN_VIEW.SIGN_IN)
  const [isAgeVerified, setIsAgeVerified] = useState<boolean | null>(null) // Initial state null

  useEffect(() => {
    // Check age verification status on mount
    const verified = getCookie(AGE_VERIFIED_COOKIE) === "true"
    setIsAgeVerified(verified)
  }, [])

  // Show loading or placeholder while checking cookie
  if (isAgeVerified === null) {
    return (
      <div className="w-full flex justify-center px-8 py-8">
        <p>Loading...</p> {/* Or a proper skeleton loader */}
      </div>
    )
  }

  // If not age verified, show message instead of login/register
  if (!isAgeVerified) {
    return (
      <div className="w-full flex justify-center px-8 py-8">
        <Alert variant="destructive" className="max-w-md">
          <Terminal className="h-4 w-4" />
          <AlertTitle>Age Verification Required</AlertTitle>
          <AlertDescription className="mb-4">
            You must be {MIN_AGE} years or older to create an account or sign in.
            Please verify your age first.
          </AlertDescription>
          <LocalizedClientLink href="/" passHref>
            <Button variant="secondary">Return to Homepage</Button>
          </LocalizedClientLink>
        </Alert>
      </div>
    )
  }

  // If age verified, show the login/register forms
  return (
    <div className="w-full flex justify-start px-8 py-8">
      {currentView === LOGIN_VIEW.SIGN_IN ? (
        <Login setCurrentView={setCurrentView} />
      ) : (
        <Register setCurrentView={setCurrentView} />
      )}
    </div>
  )
}

export default LoginTemplate
