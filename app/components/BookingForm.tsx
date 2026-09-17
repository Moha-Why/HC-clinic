'use client'

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, AlertCircle, CheckCircle } from 'lucide-react';
import type { ChangeEvent } from 'react';
import supabase from '@/lib/supabase-client';
import { format } from 'date-fns';
import {
  combineDateAndTime,
  generateTimeSlots,
  nextDateForWeekday,
  parseIsoDateLocal,
  toIsoDate,
} from '@/lib/appointment-date';

interface FormData {
  fullName: string;
  phoneNumber: string;
  preferredDate: string;
  preferredTime: string;
  reasonForVisit: string;
  day_of_week: number;
}

type Appointment = {
  id: number;
  created_at: string;
  fullName: string;
  phoneNumber: string;
  preferredDate: string;
  preferredTime: string;
  reasonForVisit: string;
  day_of_week: number;
}

interface FormErrors {
  fullName?: string;
  phoneNumber?: string;
  preferredDate?: string;
  preferredTime?: string;
}

type FormStatus = 'idle' | 'submitting' | 'success' | 'error';

type AvailableDay = {
  id: string;
  created_at: string;
  day_of_week: number;
  day_name: string;
  start_time: string;
  end_time: string;
  is_active: boolean;
}

type BookableDay = AvailableDay & {
  isoDate: string;
}

const emptyForm: FormData = {
  fullName: '',
  phoneNumber: '',
  preferredDate: '',
  preferredTime: '',
  reasonForVisit: '',
  day_of_week: 0,
};

const BookingForm: React.FC = () => {
  const [formData, setFormData] = useState<FormData>(emptyForm);
  const [errors, setErrors] = useState<FormErrors>({});
  const [status, setStatus] = useState<FormStatus>('idle');
  const [days, setDays] = useState<BookableDay[]>([]);
  const [periodsTaken, setPeriodsTaken] = useState<Appointment[]>([]);

  const loadAvailability = useCallback(async () => {
    const { data } = await supabase.from('AvailableDays').select('*');
    const { data: appoint } = await supabase.from('Appointments').select('*');

    if (data) {
      const bookable = (data as AvailableDay[])
        .filter((day) => day.is_active)
        .map((day) => {
          const date = nextDateForWeekday(day.day_of_week);
          return { ...day, isoDate: toIsoDate(date) };
        })
        .sort((a, b) => a.isoDate.localeCompare(b.isoDate));
      setDays(bookable);
    }

    if (appoint) {
      setPeriodsTaken(appoint as Appointment[]);
    }
  }, []);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void loadAvailability();
    }, 0);
    return () => window.clearTimeout(timeoutId);
  }, [loadAvailability]);

  const selectedDay = days.find((day) => day.isoDate === formData.preferredDate);

  const timeOptions = useMemo(() => {
    if (!selectedDay) return [];

    const slots = generateTimeSlots(
      selectedDay.start_time || '09:00 AM',
      selectedDay.end_time || '05:00 PM'
    );
    const now = new Date();

    return slots.filter((time) => {
      const slotDate = combineDateAndTime(selectedDay.isoDate, time);
      if (slotDate && slotDate <= now) return false;

      return !periodsTaken.some((appointment) => {
        const sameTime = appointment.preferredTime === time;
        if (!sameTime) return false;
        if (appointment.preferredDate === selectedDay.isoDate) return true;
        return (
          appointment.day_of_week === selectedDay.day_of_week &&
          !/^\d{4}-\d{2}-\d{2}$/.test(appointment.preferredDate)
        );
      });
    });
  }, [selectedDay, periodsTaken]);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    if (name === 'preferredDate') {
      const date = value ? parseIsoDateLocal(value) : null;
      setFormData((prev) => ({
        ...prev,
        preferredDate: value,
        preferredTime: '',
        day_of_week: date ? date.getDay() : 0,
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }

    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    } else if (formData.fullName.trim().length < 2) {
      newErrors.fullName = 'Please enter a valid name';
    }

    if (!formData.phoneNumber.trim() || formData.phoneNumber.length !== 11) {
      newErrors.phoneNumber = 'Phone number is incorrect or empty';
    } else if (!/^\+?[\d\s\-()]+$/.test(formData.phoneNumber)) {
      newErrors.phoneNumber = 'Please enter a valid phone number';
    }

    if (!formData.preferredDate) {
      newErrors.preferredDate = 'Preferred date is required';
    }
    if (!formData.preferredTime) {
      newErrors.preferredTime = 'Preferred time is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    setStatus('submitting');

    try {
      const { error } = await supabase.from('Appointments').insert(formData);
      if (error) {
        throw error;
      }
      setStatus('success');
      await loadAvailability();

      setTimeout(() => {
        setFormData(emptyForm);
        setStatus('idle');
      }, 3000);
    } catch (error) {
      console.error('Error submitting form:', error);
      setStatus('error');
      setTimeout(() => setStatus('idle'), 5000);
    }
  };

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4 },
    },
  };

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
                value={formData.fullName}
                onChange={handleChange}
                className={`w-full px-4 py-3 rounded-lg border ${
                  errors.fullName
                    ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                    : 'border-[#E2E8F0] focus:border-[#1F7A8C] focus:ring-[#1F7A8C]'
                } text-[#0F172A] placeholder-[#64748B] focus:outline-none focus:ring-2 transition-colors duration-200`}
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
                value={formData.phoneNumber}
                maxLength={11}
                onChange={handleChange}
                className={`w-full px-4 py-3 rounded-lg border ${
                  errors.phoneNumber
                    ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                    : 'border-[#E2E8F0] focus:border-[#1F7A8C] focus:ring-[#1F7A8C]'
                } text-[#0F172A] placeholder-[#64748B] focus:outline-none focus:ring-2 transition-colors duration-200`}
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
                htmlFor="preferredDate"
                className="block text-sm font-semibold text-[#0F172A] mb-2"
              >
                Preferred Date <span className="text-red-500">*</span>
              </label>
              <select
                id="preferredDate"
                name="preferredDate"
                value={formData.preferredDate}
                onChange={handleChange}
                className={`w-full px-4 py-3 appearance-none rounded-lg border ${
                  errors.preferredDate
                    ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                    : 'border-[#E2E8F0] focus:border-[#1F7A8C] focus:ring-[#1F7A8C]'
                } text-[#0F172A] focus:outline-none focus:ring-2 transition-colors duration-200`}
                disabled={status === 'submitting'}
              >
                <option value="">Select a day</option>
                {days.map((day) => (
                  <option value={day.isoDate} key={day.id}>
                    {format(parseIsoDateLocal(day.isoDate), 'EEEE, d MMMM yyyy')}
                  </option>
                ))}
              </select>
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
                value={formData.preferredTime}
                onChange={handleChange}
                className={`w-full px-4 py-3 appearance-none rounded-lg border ${
                  errors.preferredTime
                    ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                    : 'border-[#E2E8F0] focus:border-[#1F7A8C] focus:ring-[#1F7A8C]'
                } text-[#0F172A] focus:outline-none focus:ring-2 transition-colors duration-200`}
                disabled={status === 'submitting' || !formData.preferredDate}
              >
                <option value="">
                  {formData.preferredDate ? 'Select a time' : 'Select a date first'}
                </option>
                {timeOptions.map((time) => (
                  <option value={time} key={time}>
                    {time}
                  </option>
                ))}
              </select>
              {formData.preferredDate && timeOptions.length === 0 && (
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
                Reason for Visit <span className="text-[#64748B] text-xs">(Optional)</span>
              </label>
              <textarea
                id="reasonForVisit"
                name="reasonForVisit"
                value={formData.reasonForVisit}
                onChange={handleChange}
                rows={4}
                className="w-full px-4 py-3 rounded-lg border border-[#E2E8F0] focus:border-[#1F7A8C] focus:ring-[#1F7A8C] text-[#0F172A] placeholder-[#64748B] focus:outline-none focus:ring-2 transition-colors duration-200 resize-none"
                placeholder="Brief description of your health concern"
                disabled={status === 'submitting'}
              />
            </div>

            <button
              onClick={handleSubmit}
              disabled={status === 'submitting'}
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
                  <p className="font-semibold text-green-800">Booking Received!</p>
                  <p className="text-sm text-green-700 mt-1">
                    We will confirm your appointment within 24 hours.
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
                    Please try again or call us directly.
                  </p>
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default BookingForm;
