'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LogOut } from 'lucide-react'
import { logout } from '@/app/admin/actions'

const nav = [
  { href: '/admin', label: 'Appointments' },
  { href: '/admin/doctors', label: 'Doctors' },
]

export default function AdminShell({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()

  return (
    <div className="min-h-screen bg-[#F7FAFC]">
      <header className="bg-white border-b border-[#E2E8F0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-3 min-w-0">
            <div className="h-9 w-9 rounded-full bg-[#1F7A8C] flex items-center justify-center shrink-0">
              <span className="text-white font-bold text-sm">HC</span>
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-[#0F172A] truncate">
                HealthCare Clinic
              </p>
              <p className="text-xs text-[#64748B]">Staff dashboard</p>
            </div>
          </Link>
          <nav className="hidden sm:flex items-center gap-1">
            {nav.map((item) => {
              const active =
                item.href === '/admin'
                  ? pathname === '/admin'
                  : pathname.startsWith(item.href)
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`px-3 py-2 rounded-lg text-sm font-medium ${
                    active
                      ? 'bg-[#F7FAFC] text-[#1F7A8C]'
                      : 'text-[#64748B] hover:text-[#0F172A] hover:bg-[#F7FAFC]'
                  }`}
                >
                  {item.label}
                </Link>
              )
            })}
          </nav>
          <div className="flex items-center gap-2 sm:gap-3">
            <Link
              href="/"
              className="hidden sm:inline text-sm font-medium text-[#1F7A8C] hover:text-[#176270]"
            >
              View site
            </Link>
            <form action={logout}>
              <button
                type="submit"
                className="inline-flex items-center gap-2 text-sm font-medium text-[#64748B] hover:text-[#0F172A] px-3 py-2 rounded-lg hover:bg-[#F7FAFC]"
              >
                <LogOut className="h-4 w-4" />
                Log out
              </button>
            </form>
          </div>
        </div>
        <div className="sm:hidden border-t border-[#E2E8F0] px-4 py-2 flex gap-2">
          {nav.map((item) => {
            const active =
              item.href === '/admin'
                ? pathname === '/admin'
                : pathname.startsWith(item.href)
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex-1 text-center px-3 py-2 rounded-lg text-sm font-medium ${
                  active
                    ? 'bg-[#F7FAFC] text-[#1F7A8C]'
                    : 'text-[#64748B]'
                }`}
              >
                {item.label}
              </Link>
            )
          })}
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  )
}
