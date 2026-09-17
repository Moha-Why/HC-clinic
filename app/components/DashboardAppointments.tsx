'use client'

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  AlertCircle,
  Calendar,
  Loader,
  LogOut,
  Phone,
  Search,
  Trash2,
} from 'lucide-react';
import Link from 'next/link';
import supabase from '@/lib/supabase-client';
import { logout } from '@/app/admin/actions';
import {
  formatAppointmentDate,
  formatBookedAt,
  formatPhone,
} from '@/lib/appointment-date';

interface Appointment {
  id: string;
  fullName: string;
  phoneNumber: string;
  preferredDate: string;
  preferredTime: string;
  reasonForVisit: string;
  created_at: string;
}

const AdminAppointments: React.FC = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [pendingDelete, setPendingDelete] = useState<Appointment | null>(null);
  const [search, setSearch] = useState('');

  const fetchAppointments = useCallback(async () => {
    try {
      const { data, error: fetchError } = await supabase
        .from('Appointments')
        .select('*')
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;

      setAppointments(data || []);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch appointments');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void fetchAppointments();
    }, 0);
    return () => window.clearTimeout(timeoutId);
  }, [fetchAppointments]);

  useEffect(() => {
    if (!pendingDelete) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && !deletingId) {
        setPendingDelete(null);
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [pendingDelete, deletingId]);

  const filteredAppointments = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return appointments;

    return appointments.filter((appointment) => {
      const haystack = [
        appointment.fullName,
        appointment.phoneNumber,
        formatPhone(appointment.phoneNumber),
        appointment.preferredDate,
        formatAppointmentDate(appointment.preferredDate),
        appointment.preferredTime,
        appointment.reasonForVisit,
      ]
        .join(' ')
        .toLowerCase();
      return haystack.includes(query);
    });
  }, [appointments, search]);

  const handleDelete = async (appointment: Appointment) => {
    try {
      setDeletingId(appointment.id);
      setAppointments((prev) => prev.filter((item) => item.id !== appointment.id));

      const { error: deleteError } = await supabase
        .from('Appointments')
        .delete()
        .eq('id', appointment.id);

      if (deleteError) throw deleteError;
      setPendingDelete(null);
    } catch (err) {
      await fetchAppointments();
      setError(err instanceof Error ? err.message : 'Failed to delete appointment');
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#F7FAFC]">
      <header className="bg-white border-b border-[#E2E8F0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-3 min-w-0">
            <div className="h-9 w-9 rounded-full bg-[#1F7A8C] flex items-center justify-center shrink-0">
              <span className="text-white font-bold text-sm">HC</span>
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-[#0F172A] truncate">
                HealthCare Clinic
              </p>
              <p className="text-xs text-[#64748B]">Staff dashboard</p>
            </div>
          </Link>
          <div className="flex items-center gap-2 sm:gap-3">
            <Link
              href="/"
              className="hidden sm:inline text-sm font-medium text-[#1F7A8C] hover:text-[#176270]"
            >
              View site
            </Link>
            <form action={logout}>
              <button
                type="submit"
                className="inline-flex items-center gap-2 text-sm font-medium text-[#64748B] hover:text-[#0F172A] px-3 py-2 rounded-lg hover:bg-[#F7FAFC]"
              >
                <LogOut className="h-4 w-4" />
                Log out
              </button>
            </form>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between mb-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Calendar className="h-7 w-7 text-[#1F7A8C]" />
              <h1 className="text-2xl sm:text-3xl font-bold text-[#0F172A]">
                Appointments
              </h1>
            </div>
            <p className="text-[#64748B]">
              {appointments.length} booked
              {search.trim() && filteredAppointments.length !== appointments.length
                ? ` · ${filteredAppointments.length} matching`
                : ''}
            </p>
          </div>
          <label className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#64748B]" />
            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search name, phone, date..."
              className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-[#E2E8F0] bg-white text-[#0F172A] placeholder-[#64748B] focus:outline-none focus:ring-2 focus:ring-[#1F7A8C] focus:border-[#1F7A8C]"
            />
          </label>
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
                setLoading(true);
                setError(null);
                void fetchAppointments();
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
        ) : filteredAppointments.length === 0 ? (
          <div className="bg-white rounded-2xl border border-[#E2E8F0] p-12 text-center">
            <Calendar className="h-12 w-12 text-[#1F7A8C]/40 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-[#0F172A] mb-2">
              {appointments.length === 0
                ? 'No appointments yet'
                : 'No matching appointments'}
            </h3>
            <p className="text-[#64748B]">
              {appointments.length === 0
                ? 'New bookings from the public form will show up here.'
                : 'Try a different search.'}
            </p>
          </div>
        ) : (
          <>
            <div className="md:hidden space-y-4">
              {filteredAppointments.map((appointment) => (
                <article
                  key={appointment.id}
                  className="bg-white rounded-2xl border border-[#E2E8F0] p-5 shadow-sm"
                >
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div>
                      <h2 className="font-semibold text-[#0F172A]">
                        {appointment.fullName}
                      </h2>
                      <a
                        href={`tel:${appointment.phoneNumber}`}
                        className="mt-1 inline-flex items-center gap-1.5 text-sm text-[#1F7A8C]"
                      >
                        <Phone className="h-3.5 w-3.5" />
                        {formatPhone(appointment.phoneNumber)}
                      </a>
                    </div>
                    <button
                      type="button"
                      onClick={() => setPendingDelete(appointment)}
                      className="p-2 text-red-700 bg-red-50 rounded-lg hover:bg-red-100"
                      aria-label={`Delete appointment for ${appointment.fullName}`}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                  <p className="text-sm font-medium text-[#0F172A]">
                    {formatAppointmentDate(appointment.preferredDate)}
                    {appointment.preferredTime
                      ? ` · ${appointment.preferredTime}`
                      : ''}
                  </p>
                  <p className="mt-2 text-sm text-[#64748B] whitespace-pre-wrap">
                    {appointment.reasonForVisit || 'No reason provided'}
                  </p>
                  <p className="mt-3 text-xs text-[#94A3B8]">
                    Booked {formatBookedAt(appointment.created_at)}
                  </p>
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
                        Reason
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
                    {filteredAppointments.map((appointment) => (
                      <tr key={appointment.id} className="hover:bg-[#F7FAFC]/80">
                        <td className="px-6 py-4 align-top">
                          <div className="text-sm font-medium text-[#0F172A]">
                            {appointment.fullName}
                          </div>
                          <a
                            href={`tel:${appointment.phoneNumber}`}
                            className="mt-1 inline-flex items-center gap-1.5 text-sm text-[#1F7A8C] hover:underline"
                          >
                            <Phone className="h-3.5 w-3.5" />
                            {formatPhone(appointment.phoneNumber)}
                          </a>
                        </td>
                        <td className="px-6 py-4 align-top whitespace-nowrap">
                          <div className="text-sm font-medium text-[#0F172A]">
                            {formatAppointmentDate(appointment.preferredDate)}
                          </div>
                          <div className="text-sm text-[#64748B]">
                            {appointment.preferredTime || 'Time not specified'}
                          </div>
                        </td>
                        <td className="px-6 py-4 align-top">
                          <p className="text-sm text-[#64748B] whitespace-pre-wrap max-w-sm">
                            {appointment.reasonForVisit || 'Not provided'}
                          </p>
                        </td>
                        <td className="px-6 py-4 align-top whitespace-nowrap text-sm text-[#64748B]">
                          {formatBookedAt(appointment.created_at)}
                        </td>
                        <td className="px-6 py-4 align-top text-right">
                          <button
                            type="button"
                            onClick={() => setPendingDelete(appointment)}
                            className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-red-700 bg-red-50 border border-red-200 rounded-md hover:bg-red-100 hover:border-red-300"
                          >
                            <Trash2 className="h-4 w-4" />
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </main>

      {pendingDelete && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0F172A]/40"
          onClick={() => {
            if (!deletingId) setPendingDelete(null);
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-title"
            className="w-full max-w-md bg-white rounded-2xl p-6 shadow-xl"
            onClick={(event) => event.stopPropagation()}
          >
            <h2 id="delete-title" className="text-lg font-semibold text-[#0F172A]">
              Delete this appointment?
            </h2>
            <p className="mt-2 text-sm text-[#64748B]">
              This will permanently remove the booking for{' '}
              <span className="font-medium text-[#0F172A]">
                {pendingDelete.fullName}
              </span>{' '}
              on {formatAppointmentDate(pendingDelete.preferredDate)}
              {pendingDelete.preferredTime
                ? ` at ${pendingDelete.preferredTime}`
                : ''}
              . This cannot be undone.
            </p>
            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setPendingDelete(null)}
                disabled={deletingId === pendingDelete.id}
                className="px-4 py-2 text-sm font-medium text-[#0F172A] bg-white border border-[#E2E8F0] rounded-lg hover:bg-[#F7FAFC] disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => void handleDelete(pendingDelete)}
                disabled={deletingId === pendingDelete.id}
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 disabled:opacity-50"
              >
                {deletingId === pendingDelete.id ? (
                  <>
                    <Loader className="h-4 w-4 animate-spin" />
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 className="h-4 w-4" />
                    Delete
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminAppointments;
