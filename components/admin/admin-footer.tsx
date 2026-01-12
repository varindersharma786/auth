"use client"

import Link from "next/link"

export default function AdminFooter() {
  return (
    <footer className="border-t bg-background px-6 py-3 text-sm text-muted-foreground">
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        {/* LEFT */}
        <p>
          © {new Date().getFullYear()} <span className="font-medium">auth-iT</span>. All rights reserved.
        </p>

        {/* RIGHT */}
        <div className="flex gap-4">
          <Link href="/privacy-policy" className="hover:text-foreground">
            Privacy Policy
          </Link>
          <Link href="/terms" className="hover:text-foreground">
            Terms
          </Link>
        </div>
      </div>
    </footer>
  )
}
