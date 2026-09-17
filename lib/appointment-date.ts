import { addMinutes, format, isValid, parse } from 'date-fns'

export function nextDateForWeekday(weekday: number, from = new Date()): Date {
  const date = new Date(from.getFullYear(), from.getMonth(), from.getDate())
  const diff = (weekday - date.getDay() + 7) % 7
  date.setDate(date.getDate() + diff)
  return date
}

export function toIsoDate(date: Date): string {
  return format(date, 'yyyy-MM-dd')
}

export function parseIsoDateLocal(iso: string): Date {
  const [year, month, day] = iso.split('-').map(Number)
  return new Date(year, (month ?? 1) - 1, day ?? 1)
}

export function isIsoDate(value: string): boolean {
  return /^\d{4}-\d{2}-\d{2}$/.test(value)
}

function parseClinicTime(time: string, reference = new Date()): Date | null {
  for (const pattern of ['hh:mm aa', 'h:mm aa', 'HH:mm']) {
    const parsed = parse(time.trim(), pattern, reference)
    if (isValid(parsed)) return parsed
  }
  return null
}

export function generateTimeSlots(startTime: string, endTime: string): string[] {
  const start = parseClinicTime(startTime)
  const end = parseClinicTime(endTime)
  if (!start || !end || start > end) return []

  const periods: string[] = []
  for (let current = start; current <= end; current = addMinutes(current, 30)) {
    periods.push(format(current, 'hh:mm aa'))
  }
  return periods
}

export function combineDateAndTime(isoDate: string, time: string): Date | null {
  if (!isIsoDate(isoDate)) return null
  return parseClinicTime(time, parseIsoDateLocal(isoDate))
}

const WEEKDAYS = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
]

export function formatAppointmentDate(value: string): string {
  if (!value) return 'Not specified'
  if (isIsoDate(value)) {
    const date = parseIsoDateLocal(value)
    if (isValid(date)) return format(date, 'EEE, d MMM yyyy')
  }
  const recovered = WEEKDAYS.find(
    (day) => day.startsWith(value) && day.length === value.length + 1
  )
  return recovered ?? value
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
