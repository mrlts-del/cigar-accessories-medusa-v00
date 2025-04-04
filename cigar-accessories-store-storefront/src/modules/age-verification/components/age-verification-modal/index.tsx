"use client"

import React, { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

// Simple cookie utility (replace with a more robust solution if needed)
const setCookie = (name: string, value: string, days: number) => {
  let expires = ""
  if (days) {
    const date = new Date()
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000)
    expires = "; expires=" + date.toUTCString()
  }
  if (typeof document !== "undefined") {
    document.cookie = name + "=" + (value || "") + expires + "; path=/"
  }
}

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

const MIN_AGE = 21
const COOKIE_NAME = "age_verified"

export function AgeVerificationModal() {
  const [isOpen, setIsOpen] = useState(false)
  const [dob, setDob] = useState("")
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Check if already verified on component mount (client-side)
    const isVerified = getCookie(COOKIE_NAME) === "true"
    if (!isVerified) {
      setIsOpen(true) // Open modal if not verified
    }
  }, [])

  const calculateAge = (birthDate: Date): number => {
    const today = new Date()
    let age = today.getFullYear() - birthDate.getFullYear()
    const m = today.getMonth() - birthDate.getMonth()
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--
    }
    return age
  }

  const handleVerify = () => {
    setError(null)
    try {
      const birthDate = new Date(dob)
      // Basic validation
      if (isNaN(birthDate.getTime())) {
        setError("Invalid date format. Please use YYYY-MM-DD.")
        return
      }

      const age = calculateAge(birthDate)

      if (age >= MIN_AGE) {
        setCookie(COOKIE_NAME, "true", 30) // Set cookie for 30 days
        setIsOpen(false)
        // Optionally: Trigger a page reload or state update to reflect verified status
        window.location.reload(); // Simple reload for now
      } else {
        setError(`You must be at least ${MIN_AGE} years old to enter.`)
        // Handle underage attempt - potentially redirect or show a permanent message
      }
    } catch (e) {
      setError("An error occurred. Please try again.")
    }
  }

  // Prevent closing by clicking outside or pressing Esc
  const handleOpenChange = (open: boolean) => {
    if (!open && getCookie(COOKIE_NAME) !== "true") {
      // Keep it open if not verified
      return
    }
    setIsOpen(open)
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Age Verification Required</DialogTitle>
          <DialogDescription>
            You must be {MIN_AGE} years or older to access this site. Please enter
            your date of birth.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="dob" className="text-right">
              Date of Birth
            </Label>
            <Input
              id="dob"
              type="date" // Use date input type for better UX
              value={dob}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDob(e.target.value)}
              className="col-span-3"
              placeholder="YYYY-MM-DD"
            />
          </div>
          {error && (
            <p className="text-sm font-medium text-destructive text-center col-span-4">
              {error}
            </p>
          )}
        </div>
        <DialogFooter>
          <Button type="button" onClick={handleVerify}>
            Verify Age
          </Button>
          {/* Optional: Add a link to terms or an exit button */}
          {/* <Button variant="outline" onClick={() => window.location.href = 'https://google.com'}>Exit</Button> */}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}