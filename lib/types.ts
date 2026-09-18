export type AvailabilityWindow = {
  id?: string
  day_of_week: number
  start_time: string
  end_time: string
  notes?: string | null
  is_active?: boolean
}

export type Doctor = {
  id: string
  full_name: string
  specialty: string | null
  phone: string | null
  appointment_duration_minutes: number
  is_active: boolean
  availability: AvailabilityWindow[]
}

export type Slot = {
  start: string
  end: string
}

export type PatientSummary = {
  id: string
  full_name: string
  phone: string
  email: string | null
}

export type DoctorSummary = {
  id: string
  full_name: string
  specialty: string | null
  phone: string | null
}

export type Appointment = {
  id: string
  appointment_start_at: string
  appointment_end_at: string
  status: 'booked' | 'cancelled' | 'completed' | 'no_show' | 'expired' | string
  notes: string | null
  cancellation_reason: string | null
  cancelled_at: string | null
  created_at: string
  patient: PatientSummary | null
  doctor: DoctorSummary | null
}

export type SessionUser = {
  id: string
  email: string
  role: string
  fullName: string | null
  phone: string | null
  isActive: boolean
}
