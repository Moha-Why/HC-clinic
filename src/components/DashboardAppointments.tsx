import React, { useState, useEffect } from 'react';
import { Trash2, AlertCircle, Calendar, Loader } from 'lucide-react';
import supabase from '../supabase-client.ts'
// Initialize Supabase client


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

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('Appointments')
        .select('*')
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;

      setAppointments(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch appointments');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string, patientName: string) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete the appointment for ${patientName}? This action cannot be undone.`
    );

    if (!confirmed) return;

    try {
      setDeletingId(id);

      // Optimistically update UI
      setAppointments((prev) => prev.filter((apt) => apt.id !== id));

      const { error: deleteError } = await supabase
        .from('Appointments')
        .delete()
        .eq('id', id);

      if (deleteError) throw deleteError;
    } catch (err) {
      // Revert optimistic update on error
      await fetchAppointments();
      setError(err instanceof Error ? err.message : 'Failed to delete appointment');
    } finally {
      setDeletingId(null);
    }
  };


  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader className="h-8 w-8 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading appointments...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Calendar className="h-8 w-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900">
              Appointments Dashboard
            </h1>
          </div>
          <p className="text-gray-600">
            Manage clinic appointments ({appointments.length} total)
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-red-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-red-800">Error</p>
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!loading && appointments.length === 0 && (
          <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
            <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No Appointments Found
            </h3>
            <p className="text-gray-600">
              There are currently no appointments in the system.
            </p>
          </div>
        )}

        {/* Table */}
        {appointments.length > 0 && (
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Phone
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Time
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Reason
                    </th>
                    {/* <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Status
                    </th> */}
                    <th className="px-6 py-3 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {appointments.map((appointment) => (
                    <tr key={appointment.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {appointment.fullName}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-700 font-mono">
                          {appointment.phoneNumber}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-700 font-mono">
                          {appointment.preferredDate}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-700 font-mono">
                          {appointment.preferredTime || 'Not specified'}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-700 max-w-xs truncate">
                          {appointment.reasonForVisit || 'Not provided'}
                        </div>
                      </td>
                      {/* <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            appointment.status === 'confirmed'
                              ? 'bg-green-100 text-green-800'
                              : appointment.status === 'pending'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {appointment.status}
                        </span>
                      </td> */}
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <button
                          onClick={() =>
                            handleDelete(appointment.id, appointment.fullName)
                          }
                          disabled={deletingId === appointment.id}
                          className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-red-700 bg-red-50 border border-red-200 rounded-md hover:bg-red-100 hover:border-red-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-150"
                        >
                          <Trash2 className="h-4 w-4" />
                          {deletingId === appointment.id ? 'Deleting...' : 'Delete'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminAppointments;