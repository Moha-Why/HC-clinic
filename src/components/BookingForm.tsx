import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, AlertCircle, CheckCircle } from 'lucide-react';
import type { ChangeEvent } from 'react';
import supabase from '../supabase-client';

interface FormData {
  fullName: string;
  phoneNumber: string;
  preferredDate: string;
  preferredTime: string;
  reasonForVisit: string;
}

interface FormErrors {
  fullName?: string;
  phoneNumber?: string;
  preferredDate?: string;
}

type FormStatus = 'idle' | 'submitting' | 'success' | 'error';

type AvailableDays = {
    id: string
    created_at: string
    day_of_week: number
    day_name: string
    start_time: string
    end_time: string
    is_active: boolean
}

const BookingForm: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    phoneNumber: '',
    preferredDate: '',
    preferredTime: '',
    reasonForVisit: '',
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [status, setStatus] = useState<FormStatus>('idle');
  const [days, setDays] = useState<AvailableDays[]>();

  async function getAvailableDays() {
    const {data} = await supabase.from("AvailableDays").select("*")
    if (!data) {
        return
    }
    setDays(data)
  } 

  useEffect(() => {
    getAvailableDays()
  })

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    // Clear error for this field when user starts typing
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

    if (!formData.phoneNumber.trim() || formData.phoneNumber.length < 11) {
      newErrors.phoneNumber = 'Phone number is Incorrect or empty';
    } else if (!/^\+?[\d\s\-()]+$/.test(formData.phoneNumber)) {
      newErrors.phoneNumber = 'Please enter a valid phone number';
    }

    if (!formData.preferredDate) {
      newErrors.preferredDate = 'Preferred date is required';
    } else {
      const selectedDate = new Date(formData.preferredDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (selectedDate < today) {
        newErrors.preferredDate = 'Please select a future date';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    setStatus('submitting');

    // Mock API call
    try {
      // Simulate success
      setStatus('success');
      
      // Reset form after 3 seconds
      setTimeout(() => {
        setFormData({
          fullName: '',
          phoneNumber: '',
          preferredDate: '',
          preferredTime: '',
          reasonForVisit: '',
        });
        setStatus('idle');
      }, 3000);
    } catch (error) {
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
            {/* Full Name */}
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

            {/* Phone Number */}
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

            {/* Preferred Date */}
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
                {days ? days.map((ele, index) => (
                    <option selected value={ele.day_name} key={index}>
                        {ele.day_name}
                    </option>
                )): null}
              </select>
              {errors.preferredDate && (
                <p className="mt-2 text-sm text-red-500 flex items-center gap-1">
                  <AlertCircle className="h-4 w-4" />
                  {errors.preferredDate}
                </p>
              )}
            </div>

            {/* Preferred Time */}
            <div className="mb-6">
              <label
                htmlFor="preferredTime"
                className="block text-sm font-semibold text-[#0F172A] mb-2"
              >
                Preferred Time <span className="text-[#64748B] text-xs">(Optional)</span>
              </label>
              <input
                type="time"
                id="preferredTime"
                name="preferredTime"
                value={formData.preferredTime}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border border-[#E2E8F0] focus:border-[#1F7A8C] focus:ring-[#1F7A8C] text-[#0F172A] focus:outline-none focus:ring-2 transition-colors duration-200"
                disabled={status === 'submitting'}
              />
            </div>

            {/* Reason for Visit */}
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

            {/* Submit Button */}
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

            {/* Success Message */}
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
                    We'll confirm your appointment within 24 hours.
                  </p>
                </div>
              </motion.div>
            )}

            {/* Error Message */}
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