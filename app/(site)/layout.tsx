import Header from '@/app/components/Header'
import Footer from '@/app/components/Footer'

export default function SiteLayout({ children }: LayoutProps<'/'>) {
  return (
    <>
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </>
  )
}
