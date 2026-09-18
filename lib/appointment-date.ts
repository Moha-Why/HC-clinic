import { format, isValid } from 'date-fns'

export function isoWeekday(date: Date): number {
  const day = date.getDay()
  return day === 0 ? 7 : day
}

export function parseIsoDateLocal(iso: string): Date {
  const [year, month, day] = iso.split('-').map(Number)
  return new Date(year, (month ?? 1) - 1, day ?? 1)
}

export function isIsoDate(value: string): boolean {
  return /^\d{4}-\d{2}-\d{2}$/.test(value)
}

export function clinicDateFromInstant(
  isoInstant: string,
  timeZone: string
): string {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(new Date(isoInstant))
}

export function formatSlotTime(isoInstant: string, timeZone?: string): string {
  return new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
    timeZone,
  }).format(new Date(isoInstant))
}

export function formatClinicDay(isoDate: string): string {
  if (!isIsoDate(isoDate)) return isoDate
  const date = parseIsoDateLocal(isoDate)
  if (!isValid(date)) return isoDate
  return format(date, 'EEEE, d MMMM yyyy')
}

export function formatAppointmentDateTime(
  isoInstant: string,
  timeZone?: string
): string {
  return new Intl.DateTimeFormat('en-GB', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
    timeZone,
  }).format(new Date(isoInstant))
}

export function formatBookedAt(value: string): string {
  const date = new Date(value)
  if (!isValid(date)) return value
  return format(date, 'd MMM yyyy, h:mm a')
}

export function formatPhone(phone: string): string {
  const digits = phone.replace(/\D/g, '')
  if (digits.length === 11) {
    return `${digits.slice(0, 3)} ${digits.slice(3, 7)} ${digits.slice(7)}`
  }
  return phone
}

export const ISO_WEEKDAY_LABELS = [
  { value: 1, label: 'Monday' },
  { value: 2, label: 'Tuesday' },
  { value: 3, label: 'Wednesday' },
  { value: 4, label: 'Thursday' },
  { value: 5, label: 'Friday' },
  { value: 6, label: 'Saturday' },
  { value: 7, label: 'Sunday' },
] as const
