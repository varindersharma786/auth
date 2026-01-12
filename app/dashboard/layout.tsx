import { SiteHeader } from "@/components/custom/site-header"


export default function SiteLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <SiteHeader />
      <main className="min-h-screen">{children}</main>
    </>
  )
}
