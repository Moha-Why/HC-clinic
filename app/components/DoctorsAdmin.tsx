'use client'

import { useCallback, useState } from 'react'
import { AlertCircle, Loader, Plus, Stethoscope, Trash2 } from 'lucide-react'
import AdminShell from '@/app/components/AdminShell'
import {
  createDoctor,
  deleteDoctor,
  getAdminDoctors,
  updateDoctor,
} from '@/app/admin/doctors/actions'
import { ISO_WEEKDAY_LABELS } from '@/lib/appointment-date'
import type { AvailabilityWindow, Doctor } from '@/lib/types'

type DayRow = {
  open: boolean
  start_time: string
  end_time: string
}

type DoctorForm = {
  full_name: string
  specialty: string
  phone: string
  appointment_duration_minutes: number
  is_active: boolean
  days: Record<number, DayRow>
}

function emptyDays(): Record<number, DayRow> {
  const days: Record<number, DayRow> = {}
  for (const day of ISO_WEEKDAY_LABELS) {
    days[day.value] = {
      open: day.value <= 4,
      start_time: '09:00',
      end_time: '17:00',
    }
  }
  return days
}

function formFromDoctor(doctor: Doctor): DoctorForm {
  const days = emptyDays()
  for (const day of ISO_WEEKDAY_LABELS) {
    days[day.value] = { open: false, start_time: '09:00', end_time: '17:00' }
  }
  for (const window of doctor.availability || []) {
    days[window.day_of_week] = {
      open: window.is_active !== false,
      start_time: String(window.start_time).slice(0, 5),
      end_time: String(window.end_time).slice(0, 5),
    }
  }
  return {
    full_name: doctor.full_name,
    specialty: doctor.specialty || '',
    phone: doctor.phone || '',
    appointment_duration_minutes: doctor.appointment_duration_minutes || 30,
    is_active: doctor.is_active,
    days,
  }
}

function emptyForm(): DoctorForm {
  return {
    full_name: '',
    specialty: '',
    phone: '',
    appointment_duration_minutes: 30,
    is_active: true,
    days: emptyDays(),
  }
}

function availabilityFromForm(form: DoctorForm): AvailabilityWindow[] {
  return ISO_WEEKDAY_LABELS.filter((day) => form.days[day.value].open).map(
    (day) => ({
      day_of_week: day.value,
      start_time: form.days[day.value].start_time,
      end_time: form.days[day.value].end_time,
      is_active: true,
    })
  )
}

export default function DoctorsAdmin({
  initialDoctors,
  initialError = null,
}: {
  initialDoctors: Doctor[]
  initialError?: string | null
}) {
  const [doctors, setDoctors] = useState<Doctor[]>(initialDoctors)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(initialError)
  const [editing, setEditing] = useState<Doctor | 'new' | null>(null)
  const [form, setForm] = useState<DoctorForm>(emptyForm())
  const [saving, setSaving] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const load = useCallback(async () => {
    try {
      setLoading(true)
      const data = await getAdminDoctors()
      setDoctors(data)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load doctors')
    } finally {
      setLoading(false)
    }
  }, [])

  function openCreate() {
    setForm(emptyForm())
    setEditing('new')
  }

  function openEdit(doctor: Doctor) {
    setForm(formFromDoctor(doctor))
    setEditing(doctor)
  }

  async function handleSave() {
    const availability = availabilityFromForm(form)
    if (!form.full_name.trim() || availability.length === 0) {
      setError('Name and at least one working day are required.')
      return
    }

    setSaving(true)
    setError(null)
    const payload = {
      doctor: {
        full_name: form.full_name.trim(),
        specialty: form.specialty.trim() || undefined,
        phone: form.phone.trim() || undefined,
        appointment_duration_minutes: form.appointment_duration_minutes,
        is_active: form.is_active,
      },
      availability,
    }

    const result =
      editing === 'new'
        ? await createDoctor(payload)
        : editing
          ? await updateDoctor(editing.id, payload)
          : { error: 'Nothing to save' }

    setSaving(false)
    if (result.error) {
      setError(result.error)
      return
    }
    setEditing(null)
    await load()
  }

  async function handleDelete(doctor: Doctor) {
    if (
      !window.confirm(
        `Delete ${doctor.full_name}? This fails if they still have appointments.`
      )
    ) {
      return
    }
    setDeletingId(doctor.id)
    const result = await deleteDoctor(doctor.id)
    setDeletingId(null)
    if (result.error) {
      setError(result.error)
      return
    }
    await load()
  }

  return (
    <AdminShell>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between mb-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <Stethoscope className="h-7 w-7 text-[#1F7A8C]" />
            <h1 className="text-2xl sm:text-3xl font-bold text-[#0F172A]">
              Doctors
            </h1>
          </div>
          <p className="text-[#64748B]">
            Weekly hours replace the old clinic-wide available days.
          </p>
        </div>
        <button
          type="button"
          onClick={openCreate}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#1F7A8C] text-white text-sm font-semibold hover:bg-[#176270]"
        >
          <Plus className="h-4 w-4" />
          Add doctor
        </button>
      </div>

      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-red-600 shrink-0 mt-0.5" />
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {loading ? (
        <div className="bg-white rounded-2xl border border-[#E2E8F0] p-12 text-center">
          <Loader className="h-8 w-8 text-[#1F7A8C] animate-spin mx-auto mb-4" />
          <p className="text-[#64748B]">Loading doctors...</p>
        </div>
      ) : doctors.length === 0 ? (
        <div className="bg-white rounded-2xl border border-[#E2E8F0] p-12 text-center">
          <Stethoscope className="h-12 w-12 text-[#1F7A8C]/40 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-[#0F172A] mb-2">
            No doctors yet
          </h3>
          <p className="text-[#64748B]">
            Add a doctor and their working hours to open public booking.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {doctors.map((doctor) => (
            <article
              key={doctor.id}
              className="bg-white rounded-2xl border border-[#E2E8F0] p-5 sm:p-6"
            >
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                <div>
                  <h2 className="text-lg font-semibold text-[#0F172A]">
                    {doctor.full_name}
                  </h2>
                  <p className="text-sm text-[#64748B]">
                    {doctor.specialty || 'No specialty'} ·{' '}
                    {doctor.appointment_duration_minutes} min slots ·{' '}
                    {doctor.is_active ? 'Active' : 'Inactive'}
                  </p>
                  <p className="mt-2 text-sm text-[#64748B]">
                    {(doctor.availability || [])
                      .filter((slot) => slot.is_active !== false)
                      .map((slot) => {
                        const label =
                          ISO_WEEKDAY_LABELS.find(
                            (day) => day.value === slot.day_of_week
                          )?.label ?? slot.day_of_week
                        return `${label} ${String(slot.start_time).slice(0, 5)}–${String(slot.end_time).slice(0, 5)}`
                      })
                      .join(' · ') || 'No working days'}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => openEdit(doctor)}
                    className="px-3 py-2 text-sm font-medium rounded-lg border border-[#E2E8F0] hover:bg-[#F7FAFC]"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => void handleDelete(doctor)}
                    disabled={deletingId === doctor.id}
                    className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-red-700 bg-red-50 rounded-lg hover:bg-red-100 disabled:opacity-50"
                  >
                    <Trash2 className="h-4 w-4" />
                    Delete
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

      {editing && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0F172A]/40 overflow-y-auto"
          onClick={() => {
            if (!saving) setEditing(null)
          }}
        >
          <div
            className="w-full max-w-lg bg-white rounded-2xl p-6 shadow-xl my-8"
            onClick={(event) => event.stopPropagation()}
          >
            <h2 className="text-lg font-semibold text-[#0F172A]">
              {editing === 'new' ? 'Add doctor' : 'Edit doctor'}
            </h2>
            <div className="mt-4 space-y-4">
              <label className="block text-sm font-semibold text-[#0F172A]">
                Full name
                <input
                  value={form.full_name}
                  onChange={(event) =>
                    setForm((prev) => ({ ...prev, full_name: event.target.value }))
                  }
                  className="mt-1 w-full px-3 py-2 rounded-lg border border-[#E2E8F0]"
                />
              </label>
              <label className="block text-sm font-semibold text-[#0F172A]">
                Specialty
                <input
                  value={form.specialty}
                  onChange={(event) =>
                    setForm((prev) => ({ ...prev, specialty: event.target.value }))
                  }
                  className="mt-1 w-full px-3 py-2 rounded-lg border border-[#E2E8F0]"
                />
              </label>
              <div className="grid grid-cols-2 gap-3">
                <label className="block text-sm font-semibold text-[#0F172A]">
                  Phone
                  <input
                    value={form.phone}
                    onChange={(event) =>
                      setForm((prev) => ({ ...prev, phone: event.target.value }))
                    }
                    className="mt-1 w-full px-3 py-2 rounded-lg border border-[#E2E8F0]"
                  />
                </label>
                <label className="block text-sm font-semibold text-[#0F172A]">
                  Slot minutes
                  <input
                    type="number"
                    min={5}
                    value={form.appointment_duration_minutes}
                    onChange={(event) =>
                      setForm((prev) => ({
                        ...prev,
                        appointment_duration_minutes: Number(event.target.value),
                      }))
                    }
                    className="mt-1 w-full px-3 py-2 rounded-lg border border-[#E2E8F0]"
                  />
                </label>
              </div>
              <label className="inline-flex items-center gap-2 text-sm text-[#0F172A]">
                <input
                  type="checkbox"
                  checked={form.is_active}
                  onChange={(event) =>
                    setForm((prev) => ({ ...prev, is_active: event.target.checked }))
                  }
                />
                Active (shown on the booking form)
              </label>
              <div>
                <p className="text-sm font-semibold text-[#0F172A] mb-2">
                  Weekly hours
                </p>
                <div className="space-y-2">
                  {ISO_WEEKDAY_LABELS.map((day) => {
                    const row = form.days[day.value]
                    return (
                      <div
                        key={day.value}
                        className="flex flex-wrap items-center gap-2 text-sm"
                      >
                        <label className="w-28 inline-flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={row.open}
                            onChange={(event) =>
                              setForm((prev) => ({
                                ...prev,
                                days: {
                                  ...prev.days,
                                  [day.value]: {
                                    ...prev.days[day.value],
                                    open: event.target.checked,
                                  },
                                },
                              }))
                            }
                          />
                          {day.label}
                        </label>
                        <input
                          type="time"
                          value={row.start_time}
                          disabled={!row.open}
                          onChange={(event) =>
                            setForm((prev) => ({
                              ...prev,
                              days: {
                                ...prev.days,
                                [day.value]: {
                                  ...prev.days[day.value],
                                  start_time: event.target.value,
                                },
                              },
                            }))
                          }
                          className="px-2 py-1 rounded border border-[#E2E8F0] disabled:opacity-40"
                        />
                        <span className="text-[#94A3B8]">to</span>
                        <input
                          type="time"
                          value={row.end_time}
                          disabled={!row.open}
                          onChange={(event) =>
                            setForm((prev) => ({
                              ...prev,
                              days: {
                                ...prev.days,
                                [day.value]: {
                                  ...prev.days[day.value],
                                  end_time: event.target.value,
                                },
                              },
                            }))
                          }
                          className="px-2 py-1 rounded border border-[#E2E8F0] disabled:opacity-40"
                        />
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setEditing(null)}
                disabled={saving}
                className="px-4 py-2 text-sm font-medium border border-[#E2E8F0] rounded-lg"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => void handleSave()}
                disabled={saving}
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-[#1F7A8C] rounded-lg disabled:opacity-50"
              >
                {saving && <Loader className="h-4 w-4 animate-spin" />}
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminShell>
  )
}
