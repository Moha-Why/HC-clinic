'use client'

import React, { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { Calendar, AlertCircle, CheckCircle } from 'lucide-react'
import type { ChangeEvent } from 'react'
import { bookAppointment, getDoctorSlots } from '@/app/booking/actions'
import {
  clinicDateFromInstant,
  formatClinicDay,
  formatSlotTime,
} from '@/lib/appointment-date'
import type { Doctor, Slot } from '@/lib/types'

type FormErrors = {
  fullName?: string
  phoneNumber?: string
  doctorId?: string
  preferredDate?: string
  preferredTime?: string
}

type FormStatus = 'idle' | 'submitting' | 'success' | 'error'

function todayInTz(timeZone: string) {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(new Date())
}

function addDaysIso(isoDate: string, days: number) {
  const [year, month, day] = isoDate.split('-').map(Number)
  return new Date(Date.UTC(year, month - 1, day + days)).toISOString().slice(0, 10)
}

const BookingForm: React.FC<{
  doctors: Doctor[]
  initialSlots?: Slot[]
  initialTimeZone?: string
}> = ({ doctors, initialSlots = [], initialTimeZone = 'Africa/Cairo' }) => {
  const [fullName, setFullName] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [reasonForVisit, setReasonForVisit] = useState('')
  const [doctorId, setDoctorId] = useState(
    doctors.length === 1 ? doctors[0].id : ''
  )
  const [preferredDate, setPreferredDate] = useState('')
  const [preferredTime, setPreferredTime] = useState('')
  const [timeZone, setTimeZone] = useState(initialTimeZone)
  const [slots, setSlots] = useState<Slot[]>(initialSlots)
  const [loadingSlots, setLoadingSlots] = useState(false)
  const [errors, setErrors] = useState<FormErrors>({})
  const [status, setStatus] = useState<FormStatus>('idle')
  const [errorMessage, setErrorMessage] = useState('')

  const dates = useMemo(() => {
    const unique = new Set(
      slots.map((slot) => clinicDateFromInstant(slot.start, timeZone))
    )
    return Array.from(unique).sort()
  }, [slots, timeZone])

  const timeOptions = useMemo(
    () =>
      slots.filter(
        (slot) => clinicDateFromInstant(slot.start, timeZone) === preferredDate
      ),
    [slots, preferredDate, timeZone]
  )

  async function loadSlotsForDoctor(id: string) {
    setLoadingSlots(true)
    setSlots([])
    setPreferredDate('')
    setPreferredTime('')
    try {
      const today = todayInTz(timeZone)
      const result = await getDoctorSlots(id, today, addDaysIso(today, 13))
      setTimeZone(result.timeZone)
      setSlots(result.slots)
    } catch {
      setSlots([])
    } finally {
      setLoadingSlots(false)
    }
  }

  async function handleDoctorChange(event: ChangeEvent<HTMLSelectElement>) {
    const value = event.target.value
    setDoctorId(value)
    setErrors((prev) => ({ ...prev, doctorId: undefined }))
    if (value) {
      await loadSlotsForDoctor(value)
    } else {
      setSlots([])
      setPreferredDate('')
      setPreferredTime('')
    }
  }

  function validateForm(): boolean {
    const next: FormErrors = {}

    if (!fullName.trim()) {
      next.fullName = 'Full name is required'
    } else if (fullName.trim().length < 2) {
      next.fullName = 'Please enter a valid name'
    }

    if (!phoneNumber.trim() || phoneNumber.replace(/\D/g, '').length !== 11) {
      next.phoneNumber = 'Phone number is incorrect or empty'
    } else if (!/^\+?[\d\s\-()]+$/.test(phoneNumber)) {
      next.phoneNumber = 'Please enter a valid phone number'
    }

    if (!doctorId) next.doctorId = 'Please choose a doctor'
    if (!preferredDate) next.preferredDate = 'Preferred date is required'
    if (!preferredTime) next.preferredTime = 'Preferred time is required'

    setErrors(next)
    return Object.keys(next).length === 0
  }

  async function handleSubmit() {
    if (!validateForm()) return

    setStatus('submitting')
    setErrorMessage('')

    const result = await bookAppointment({
      fullName: fullName.trim(),
      phoneNumber: phoneNumber.replace(/\D/g, ''),
      doctorId,
      appointmentStartAt: preferredTime,
      notes: reasonForVisit.trim() || undefined,
    })

    if (result.error) {
      setStatus('error')
      setErrorMessage(result.error)
      setTimeout(() => setStatus('idle'), 5000)
      if (doctorId) void loadSlotsForDoctor(doctorId)
      return
    }

    setStatus('success')
    if (doctorId) await loadSlotsForDoctor(doctorId)
    setTimeout(() => {
      setFullName('')
      setPhoneNumber('')
      setReasonForVisit('')
      setPreferredDate('')
      setPreferredTime('')
      if (doctors.length !== 1) setDoctorId('')
      setStatus('idle')
    }, 3000)
  }

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4 },
    },
  }

  const fieldClass = (invalid?: string) =>
    `w-full px-4 py-3 appearance-none rounded-lg border ${
      invalid
        ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
        : 'border-[#E2E8F0] focus:border-[#1F7A8C] focus:ring-[#1F7A8C]'
    } text-[#0F172A] placeholder-[#64748B] focus:outline-none focus:ring-2 transition-colors duration-200`

  return (
    <section className="bg-[#F7FAFC] py-16 md:py-20">
      <div className="mx-auto max-w-2xl px-6 lg:px-8">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeIn}
        >
          <div className="bg-white rounded-2xl p-8 md:p-10 shadow-sm border border-[#E2E8F0]">
            <div className="mb-6">
              <label
                htmlFor="fullName"
                className="block text-sm font-semibold text-[#0F172A] mb-2"
              >
                Full Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                value={fullName}
                onChange={(event) => setFullName(event.target.value)}
                className={fieldClass(errors.fullName)}
                placeholder="Enter your full name"
                disabled={status === 'submitting'}
              />
              {errors.fullName && (
                <p className="mt-2 text-sm text-red-500 flex items-center gap-1">
                  <AlertCircle className="h-4 w-4" />
                  {errors.fullName}
                </p>
              )}
            </div>

            <div className="mb-6">
              <label
                htmlFor="phoneNumber"
                className="block text-sm font-semibold text-[#0F172A] mb-2"
              >
                Phone Number <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                id="phoneNumber"
                name="phoneNumber"
                value={phoneNumber}
                maxLength={11}
                onChange={(event) => setPhoneNumber(event.target.value)}
                className={fieldClass(errors.phoneNumber)}
                placeholder="(123) 456-7890"
                disabled={status === 'submitting'}
              />
              {errors.phoneNumber && (
                <p className="mt-2 text-sm text-red-500 flex items-center gap-1">
                  <AlertCircle className="h-4 w-4" />
                  {errors.phoneNumber}
                </p>
              )}
            </div>

            <div className="mb-6">
              <label
                htmlFor="doctorId"
                className="block text-sm font-semibold text-[#0F172A] mb-2"
              >
                Doctor <span className="text-red-500">*</span>
              </label>
              <select
                id="doctorId"
                name="doctorId"
                value={doctorId}
                onChange={(event) => void handleDoctorChange(event)}
                className={fieldClass(errors.doctorId)}
                disabled={status === 'submitting' || doctors.length === 0}
              >
                <option value="">
                  {doctors.length === 0
                    ? 'No doctors available'
                    : 'Select a doctor'}
                </option>
                {doctors.map((doctor) => (
                  <option value={doctor.id} key={doctor.id}>
                    {doctor.full_name}
                    {doctor.specialty ? ` — ${doctor.specialty}` : ''}
                  </option>
                ))}
              </select>
              {errors.doctorId && (
                <p className="mt-2 text-sm text-red-500 flex items-center gap-1">
                  <AlertCircle className="h-4 w-4" />
                  {errors.doctorId}
                </p>
              )}
            </div>

            <div className="mb-6">
              <label
                htmlFor="preferredDate"
                className="block text-sm font-semibold text-[#0F172A] mb-2"
              >
                Preferred Date <span className="text-red-500">*</span>
              </label>
              <select
                id="preferredDate"
                name="preferredDate"
                value={preferredDate}
                onChange={(event) => {
                  setPreferredDate(event.target.value)
                  setPreferredTime('')
                  setErrors((prev) => ({ ...prev, preferredDate: undefined }))
                }}
                className={fieldClass(errors.preferredDate)}
                disabled={status === 'submitting' || !doctorId || loadingSlots}
              >
                <option value="">
                  {!doctorId
                    ? 'Select a doctor first'
                    : loadingSlots
                      ? 'Loading days...'
                      : 'Select a day'}
                </option>
                {dates.map((date) => (
                  <option value={date} key={date}>
                    {formatClinicDay(date)}
                  </option>
                ))}
              </select>
              {doctorId && !loadingSlots && dates.length === 0 && (
                <p className="mt-2 text-sm text-[#64748B]">
                  No remaining times in the next two weeks. Please call the clinic.
                </p>
              )}
              {errors.preferredDate && (
                <p className="mt-2 text-sm text-red-500 flex items-center gap-1">
                  <AlertCircle className="h-4 w-4" />
                  {errors.preferredDate}
                </p>
              )}
            </div>

            <div className="mb-6">
              <label
                htmlFor="preferredTime"
                className="block text-sm font-semibold text-[#0F172A] mb-2"
              >
                Preferred Time <span className="text-red-500">*</span>
              </label>
              <select
                id="preferredTime"
                name="preferredTime"
                value={preferredTime}
                onChange={(event) => {
                  setPreferredTime(event.target.value)
                  setErrors((prev) => ({ ...prev, preferredTime: undefined }))
                }}
                className={fieldClass(errors.preferredTime)}
                disabled={status === 'submitting' || !preferredDate}
              >
                <option value="">
                  {preferredDate ? 'Select a time' : 'Select a date first'}
                </option>
                {timeOptions.map((slot) => (
                  <option value={slot.start} key={slot.start}>
                    {formatSlotTime(slot.start, timeZone)}
                  </option>
                ))}
              </select>
              {preferredDate && timeOptions.length === 0 && (
                <p className="mt-2 text-sm text-[#64748B]">
                  No remaining times for this day. Please choose another date.
                </p>
              )}
              {errors.preferredTime && (
                <p className="mt-2 text-sm text-red-500 flex items-center gap-1">
                  <AlertCircle className="h-4 w-4" />
                  {errors.preferredTime}
                </p>
              )}
            </div>

            <div className="mb-8">
              <label
                htmlFor="reasonForVisit"
                className="block text-sm font-semibold text-[#0F172A] mb-2"
              >
                Reason for Visit{' '}
                <span className="text-[#64748B] text-xs">(Optional)</span>
              </label>
              <textarea
                id="reasonForVisit"
                name="reasonForVisit"
                value={reasonForVisit}
                onChange={(event) => setReasonForVisit(event.target.value)}
                rows={4}
                className="w-full px-4 py-3 rounded-lg border border-[#E2E8F0] focus:border-[#1F7A8C] focus:ring-[#1F7A8C] text-[#0F172A] placeholder-[#64748B] focus:outline-none focus:ring-2 transition-colors duration-200 resize-none"
                placeholder="Brief description of your health concern"
                disabled={status === 'submitting'}
              />
            </div>

            <button
              onClick={() => void handleSubmit()}
              disabled={status === 'submitting' || doctors.length === 0}
              className={`w-full py-4 rounded-lg font-semibold text-lg transition-all duration-200 flex items-center justify-center gap-2 ${
                status === 'submitting'
                  ? 'bg-[#64748B] cursor-not-allowed'
                  : 'bg-[#E36414] hover:bg-[#C55510] hover:shadow-md'
              } text-white`}
            >
              {status === 'submitting' ? (
                <>
                  <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Submitting...
                </>
              ) : (
                <>
                  <Calendar className="h-5 w-5" />
                  Book Appointment
                </>
              )}
            </button>

            {status === 'success' && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-start gap-3"
              >
                <CheckCircle className="h-5 w-5 text-green-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-green-800">Appointment booked</p>
                  <p className="text-sm text-green-700 mt-1">
                    Your slot is reserved. We look forward to seeing you.
                  </p>
                </div>
              </motion.div>
            )}

            {status === 'error' && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3"
              >
                <AlertCircle className="h-5 w-5 text-red-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-red-800">Booking Failed</p>
                  <p className="text-sm text-red-700 mt-1">
                    {errorMessage || 'Please try again or call us directly.'}
                  </p>
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default BookingForm
