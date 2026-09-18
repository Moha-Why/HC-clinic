import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { getSessionUser } from '@/lib/clinic-api'
import LoginForm from './LoginForm'

export const metadata: Metadata = {
  title: 'Staff login',
}

export default async function AdminLoginPage() {
  const user = await getSessionUser()
  if (user?.role === 'admin') {
    redirect('/admin')
  }

  return (
    <div className="min-h-screen bg-[#F7FAFC] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2">
            <div className="h-10 w-10 rounded-full bg-[#1F7A8C] flex items-center justify-center">
              <span className="text-white font-bold text-lg">HC</span>
            </div>
            <span className="text-xl font-semibold text-[#0F172A]">
              HealthCare Clinic
            </span>
          </Link>
        </div>
        <div className="bg-white rounded-2xl border border-[#E2E8F0] p-8 shadow-sm">
          <h1 className="text-2xl font-bold text-[#0F172A] mb-1">Staff login</h1>
          <p className="text-sm text-[#64748B] mb-6">
            Sign in with your staff account to manage appointments and doctors.
          </p>
          <LoginForm />
        </div>
      </div>
    </div>
  )
}
