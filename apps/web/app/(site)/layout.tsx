import { Navbar } from "@/components/share/navbar"
import { Footer } from "@/components/share/footer"

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <Navbar />
      {children}
      <Footer />
    </>
  )
}
