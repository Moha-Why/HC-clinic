'use client'

import { useActionState } from 'react'
import { login, type LoginState } from '@/app/admin/actions'
import { AlertCircle } from 'lucide-react'

export default function LoginForm() {
  const [state, action, pending] = useActionState<LoginState, FormData>(
    login,
    undefined
  )

  return (
    <form action={action} className="space-y-5">
      <div>
        <label
          htmlFor="password"
          className="block text-sm font-semibold text-[#0F172A] mb-2"
        >
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          className="w-full px-4 py-3 rounded-lg border border-[#E2E8F0] text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#1F7A8C] focus:border-[#1F7A8C]"
          placeholder="Enter the staff password"
        />
      </div>

      {state?.error && (
        <p className="text-sm text-red-600 flex items-center gap-2">
          <AlertCircle className="h-4 w-4 shrink-0" />
          {state.error}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="w-full py-3 rounded-lg font-semibold text-white bg-[#1F7A8C] hover:bg-[#176270] disabled:bg-[#64748B] disabled:cursor-not-allowed transition-colors"
      >
        {pending ? 'Signing in...' : 'Sign in'}
      </button>
    </form>
  )
}
