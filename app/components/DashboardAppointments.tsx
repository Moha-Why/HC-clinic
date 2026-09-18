'use client'

import React, { useCallback, useEffect, useMemo, useState } from 'react'
import {
  AlertCircle,
  Ban,
  Calendar,
  Check,
  Loader,
  Phone,
  Search,
  UserX,
} from 'lucide-react'
import {
  cancelAppointment,
  completeAppointment,
  getAppointments,
  markNoShow,
} from '@/app/admin/actions'
import AdminShell from '@/app/components/AdminShell'
import {
  formatAppointmentDateTime,
  formatBookedAt,
  formatPhone,
} from '@/lib/appointment-date'
import type { Appointment } from '@/lib/types'

type Scope = 'upcoming' | 'past'
type PendingAction = {
  type: 'cancel' | 'complete' | 'no_show'
  appointment: Appointment
}

function isUpcomingBooked(appointment: Appointment) {
  return appointment.status === 'booked'
}

function canCancelAppointment(appointment: Appointment) {
  return (
    appointment.status === 'booked' &&
    new Date(appointment.appointment_start_at).getTime() > Date.now()
  )
}

function isPastRow(appointment: Appointment) {
  return (
    appointment.status === 'expired' ||
    appointment.status === 'completed' ||
    appointment.status === 'no_show' ||
    (appointment.status === 'cancelled' &&
      new Date(appointment.appointment_start_at).getTime() < Date.now())
  )
}

function statusClass(status: string) {
  switch (status) {
    case 'booked':
      return 'text-[#1F7A8C]'
    case 'completed':
      return 'text-green-700'
    case 'expired':
      return 'text-[#64748B]'
    case 'no_show':
      return 'text-orange-700'
    case 'cancelled':
      return 'text-red-700'
    default:
      return 'text-[#94A3B8]'
  }
}

function statusLabel(status: string) {
  return status === 'no_show' ? 'no-show' : status
}

function ActionButtons({
  appointment,
  onComplete,
  onNoShow,
  onCancel,
}: {
  appointment: Appointment
  onComplete: (appointment: Appointment) => void
  onNoShow: (appointment: Appointment) => void
  onCancel: (appointment: Appointment) => void
}) {
  const canCancel = canCancelAppointment(appointment)
  const canOutcome =
    appointment.status === 'booked' || appointment.status === 'expired'

  if (!canCancel && !canOutcome) {
    return <span className="text-sm text-[#94A3B8]">—</span>
  }

  return (
    <div className="flex flex-wrap justify-end gap-2">
      {canOutcome && (
        <>
          <button
            type="button"
            onClick={() => onComplete(appointment)}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-green-800 bg-green-50 border border-green-200 rounded-md hover:bg-green-100"
          >
            <Check className="h-4 w-4" />
            Complete
          </button>
          <button
            type="button"
            onClick={() => onNoShow(appointment)}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-orange-800 bg-orange-50 border border-orange-200 rounded-md hover:bg-orange-100"
          >
            <UserX className="h-4 w-4" />
            No-show
          </button>
        </>
      )}
      {canCancel && (
        <button
          type="button"
          onClick={() => onCancel(appointment)}
          className="inline-flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-red-700 bg-red-50 border border-red-200 rounded-md hover:bg-red-100"
        >
          <Ban className="h-4 w-4" />
          Cancel
        </button>
      )}
    </div>
  )
}

const AdminAppointments: React.FC<{
  initialAppointments: Appointment[]
  initialError?: string | null
}> = ({ initialAppointments, initialError = null }) => {
  const [appointments, setAppointments] = useState<Appointment[]>(
    initialAppointments
  )
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(initialError)
  const [busyId, setBusyId] = useState<string | null>(null)
  const [pending, setPending] = useState<PendingAction | null>(null)
  const [cancelReason, setCancelReason] = useState('')
  const [search, setSearch] = useState('')
  const [showCancelled, setShowCancelled] = useState(false)
  const [scope, setScope] = useState<Scope>('upcoming')

  const fetchAppointments = useCallback(async () => {
    try {
      setLoading(true)
      const data = await getAppointments()
      setAppointments(data)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch appointments')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (!pending) return

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && !busyId) {
        setPending(null)
        setCancelReason('')
      }
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [pending, busyId])

  const visibleAppointments = useMemo(() => {
    const byScope = appointments.filter((appointment) => {
      if (appointment.status === 'cancelled') {
        if (!showCancelled) return false
        return scope === 'upcoming'
          ? !isPastRow(appointment)
          : isPastRow(appointment)
      }
      if (scope === 'upcoming') return isUpcomingBooked(appointment)
      return isPastRow(appointment)
    })

    const query = search.trim().toLowerCase()
    if (!query) return byScope

    return byScope.filter((appointment) => {
      const haystack = [
        appointment.patient?.full_name,
        appointment.patient?.phone,
        appointment.patient?.phone
          ? formatPhone(appointment.patient.phone)
          : '',
        appointment.doctor?.full_name,
        appointment.appointment_start_at,
        appointment.notes,
        appointment.status,
      ]
        .join(' ')
        .toLowerCase()
      return haystack.includes(query)
    })
  }, [appointments, search, showCancelled, scope])

  const upcomingCount = appointments.filter(isUpcomingBooked).length
  const pastCount = appointments.filter(
    (item) => item.status !== 'cancelled' && isPastRow(item)
  ).length

  async function runAction() {
    if (!pending) return
    if (pending.type === 'cancel' && !cancelReason.trim()) return

    try {
      setBusyId(pending.appointment.id)
      const result =
        pending.type === 'cancel'
          ? await cancelAppointment(pending.appointment.id, cancelReason.trim())
          : pending.type === 'complete'
            ? await completeAppointment(pending.appointment.id)
            : await markNoShow(pending.appointment.id)
      if (result.error) throw new Error(result.error)
      setPending(null)
      setCancelReason('')
      await fetchAppointments()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update appointment')
    } finally {
      setBusyId(null)
    }
  }

  const actionHandlers = {
    onComplete: (appointment: Appointment) =>
      setPending({ type: 'complete', appointment }),
    onNoShow: (appointment: Appointment) =>
      setPending({ type: 'no_show', appointment }),
    onCancel: (appointment: Appointment) => {
      setPending({ type: 'cancel', appointment })
      setCancelReason('')
    },
  }

  return (
    <AdminShell>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between mb-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <Calendar className="h-7 w-7 text-[#1F7A8C]" />
            <h1 className="text-2xl sm:text-3xl font-bold text-[#0F172A]">
              Appointments
            </h1>
          </div>
          <p className="text-[#64748B]">
            {upcomingCount} upcoming · {pastCount} past
            {search.trim() ? ` · ${visibleAppointments.length} matching` : ''}
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
          <label className="inline-flex items-center gap-2 text-sm text-[#64748B]">
            <input
              type="checkbox"
              checked={showCancelled}
              onChange={(event) => setShowCancelled(event.target.checked)}
              className="rounded border-[#E2E8F0]"
            />
            Show cancelled
          </label>
          <label className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#64748B]" />
            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search name, phone, doctor..."
              className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-[#E2E8F0] bg-white text-[#0F172A] placeholder-[#64748B] focus:outline-none focus:ring-2 focus:ring-[#1F7A8C] focus:border-[#1F7A8C]"
            />
          </label>
        </div>
      </div>

      <div className="mb-6 inline-flex rounded-lg border border-[#E2E8F0] bg-white p-1">
        <button
          type="button"
          onClick={() => setScope('upcoming')}
          className={`px-4 py-2 text-sm font-medium rounded-md ${
            scope === 'upcoming'
              ? 'bg-[#1F7A8C] text-white'
              : 'text-[#64748B] hover:text-[#0F172A]'
          }`}
        >
          Upcoming
        </button>
        <button
          type="button"
          onClick={() => setScope('past')}
          className={`px-4 py-2 text-sm font-medium rounded-md ${
            scope === 'past'
              ? 'bg-[#1F7A8C] text-white'
              : 'text-[#64748B] hover:text-[#0F172A]'
          }`}
        >
          Past
        </button>
      </div>

      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-red-600 shrink-0 mt-0.5" />
          <div className="grow">
            <p className="font-semibold text-red-800">Error</p>
            <p className="text-sm text-red-700">{error}</p>
          </div>
          <button
            type="button"
            onClick={() => {
              setError(null)
              void fetchAppointments()
            }}
            className="text-sm font-medium text-red-800 hover:underline"
          >
            Retry
          </button>
        </div>
      )}

      {loading ? (
        <div className="bg-white rounded-2xl border border-[#E2E8F0] p-12 text-center">
          <Loader className="h-8 w-8 text-[#1F7A8C] animate-spin mx-auto mb-4" />
          <p className="text-[#64748B]">Loading appointments...</p>
        </div>
      ) : visibleAppointments.length === 0 ? (
        <div className="bg-white rounded-2xl border border-[#E2E8F0] p-12 text-center">
          <Calendar className="h-12 w-12 text-[#1F7A8C]/40 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-[#0F172A] mb-2">
            {appointments.length === 0
              ? 'No appointments yet'
              : `No ${scope} appointments`}
          </h3>
          <p className="text-[#64748B]">
            {appointments.length === 0
              ? 'New bookings from the public form will show up here.'
              : 'Try a different filter or search.'}
          </p>
        </div>
      ) : (
        <>
          <div className="md:hidden space-y-4">
            {visibleAppointments.map((appointment) => (
              <article
                key={appointment.id}
                className="bg-white rounded-2xl border border-[#E2E8F0] p-5 shadow-sm"
              >
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div>
                    <h2 className="font-semibold text-[#0F172A]">
                      {appointment.patient?.full_name || 'Unknown patient'}
                    </h2>
                    {appointment.patient?.phone && (
                      <a
                        href={`tel:${appointment.patient.phone}`}
                        className="mt-1 inline-flex items-center gap-1.5 text-sm text-[#1F7A8C]"
                      >
                        <Phone className="h-3.5 w-3.5" />
                        {formatPhone(appointment.patient.phone)}
                      </a>
                    )}
                  </div>
                </div>
                <p className="text-sm font-medium text-[#0F172A]">
                  {formatAppointmentDateTime(appointment.appointment_start_at)}
                </p>
                <p className="text-sm text-[#64748B]">
                  {appointment.doctor?.full_name || 'No doctor'}
                </p>
                <p
                  className={`mt-2 text-xs uppercase tracking-wide ${statusClass(appointment.status)}`}
                >
                  {statusLabel(appointment.status)}
                </p>
                <p className="mt-2 text-sm text-[#64748B] whitespace-pre-wrap">
                  {appointment.notes || 'No reason provided'}
                </p>
                <p className="mt-3 text-xs text-[#94A3B8]">
                  Booked {formatBookedAt(appointment.created_at)}
                </p>
                <div className="mt-4">
                  <ActionButtons appointment={appointment} {...actionHandlers} />
                </div>
              </article>
            ))}
          </div>

          <div className="hidden md:block bg-white rounded-2xl border border-[#E2E8F0] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-[#E2E8F0]">
                <thead className="bg-[#F7FAFC]">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-[#64748B] uppercase tracking-wider">
                      Patient
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-[#64748B] uppercase tracking-wider">
                      Appointment
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-[#64748B] uppercase tracking-wider">
                      Notes
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-[#64748B] uppercase tracking-wider">
                      Booked
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-semibold text-[#64748B] uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E2E8F0]">
                  {visibleAppointments.map((appointment) => (
                    <tr key={appointment.id} className="hover:bg-[#F7FAFC]/80">
                      <td className="px-6 py-4 align-top">
                        <div className="text-sm font-medium text-[#0F172A]">
                          {appointment.patient?.full_name || 'Unknown patient'}
                        </div>
                        {appointment.patient?.phone && (
                          <a
                            href={`tel:${appointment.patient.phone}`}
                            className="mt-1 inline-flex items-center gap-1.5 text-sm text-[#1F7A8C] hover:underline"
                          >
                            <Phone className="h-3.5 w-3.5" />
                            {formatPhone(appointment.patient.phone)}
                          </a>
                        )}
                      </td>
                      <td className="px-6 py-4 align-top whitespace-nowrap">
                        <div className="text-sm font-medium text-[#0F172A]">
                          {formatAppointmentDateTime(
                            appointment.appointment_start_at
                          )}
                        </div>
                        <div className="text-sm text-[#64748B]">
                          {appointment.doctor?.full_name || 'No doctor'}
                        </div>
                        <div
                          className={`text-xs uppercase tracking-wide mt-1 ${statusClass(appointment.status)}`}
                        >
                          {statusLabel(appointment.status)}
                        </div>
                      </td>
                      <td className="px-6 py-4 align-top">
                        <p className="text-sm text-[#64748B] whitespace-pre-wrap max-w-sm">
                          {appointment.notes || 'Not provided'}
                        </p>
                      </td>
                      <td className="px-6 py-4 align-top whitespace-nowrap text-sm text-[#64748B]">
                        {formatBookedAt(appointment.created_at)}
                      </td>
                      <td className="px-6 py-4 align-top text-right">
                        <ActionButtons appointment={appointment} {...actionHandlers} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {pending && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0F172A]/40"
          onClick={() => {
            if (!busyId) {
              setPending(null)
              setCancelReason('')
            }
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="action-title"
            className="w-full max-w-md bg-white rounded-2xl p-6 shadow-xl"
            onClick={(event) => event.stopPropagation()}
          >
            <h2 id="action-title" className="text-lg font-semibold text-[#0F172A]">
              {pending.type === 'cancel'
                ? 'Cancel this appointment?'
                : pending.type === 'complete'
                  ? 'Mark as completed?'
                  : 'Mark as no-show?'}
            </h2>
            <p className="mt-2 text-sm text-[#64748B]">
              {pending.appointment.patient?.full_name} on{' '}
              {formatAppointmentDateTime(
                pending.appointment.appointment_start_at
              )}
              {pending.type === 'cancel'
                ? '. The slot will become available again.'
                : pending.type === 'complete'
                  ? '. This means the patient attended.'
                  : '. This means the patient did not attend.'}
            </p>
            {pending.type === 'cancel' && (
              <>
                <label className="mt-4 block text-sm font-semibold text-[#0F172A] mb-2">
                  Cancellation reason <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={cancelReason}
                  onChange={(event) => setCancelReason(event.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 rounded-lg border border-[#E2E8F0] text-sm text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#1F7A8C]"
                  placeholder="Patient requested reschedule"
                />
              </>
            )}
            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => {
                  setPending(null)
                  setCancelReason('')
                }}
                disabled={busyId === pending.appointment.id}
                className="px-4 py-2 text-sm font-medium text-[#0F172A] bg-white border border-[#E2E8F0] rounded-lg hover:bg-[#F7FAFC] disabled:opacity-50"
              >
                Back
              </button>
              <button
                type="button"
                onClick={() => void runAction()}
                disabled={
                  busyId === pending.appointment.id ||
                  (pending.type === 'cancel' && !cancelReason.trim())
                }
                className={`inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white rounded-lg disabled:opacity-50 ${
                  pending.type === 'cancel'
                    ? 'bg-red-600 hover:bg-red-700'
                    : pending.type === 'complete'
                      ? 'bg-green-700 hover:bg-green-800'
                      : 'bg-orange-600 hover:bg-orange-700'
                }`}
              >
                {busyId === pending.appointment.id ? (
                  <>
                    <Loader className="h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : pending.type === 'cancel' ? (
                  'Cancel appointment'
                ) : pending.type === 'complete' ? (
                  'Mark completed'
                ) : (
                  'Mark no-show'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminShell>
  )
}

export default AdminAppointments
