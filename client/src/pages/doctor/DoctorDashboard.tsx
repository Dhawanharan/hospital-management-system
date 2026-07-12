import { useState, useEffect } from 'react';
import api from '../../api/axios';
import { useAuth } from '../../contexts/AuthContext';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

export default function DoctorDashboard() {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState<any[]>([]);
  const [statusFilter, setStatusFilter] = useState('All');
  const [loading, setLoading] = useState(true);

  const fetchAppointments = async () => {
    try {
      const res = await api.get('/appointments');
      setAppointments(res.data);
    } catch (error) {
      toast.error('Failed to load appointments');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const updateStatus = async (id: string, status: string) => {
    try {
      await api.put(`/appointments/${id}/status`, { status });
      toast.success(`Appointment marked as ${status}`);
      fetchAppointments();
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900 mb-6">Dr. {user?.name}'s Schedule</h1>

      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 space-y-2 sm:space-y-0">
          <h2 className="text-lg font-semibold">Appointments Queue</h2>
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="px-3 py-1.5 border rounded-md text-sm">
            <option value="All">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="Confirmed">Confirmed</option>
            <option value="Completed">Completed</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>
        {loading ? (
          <p>Loading schedule...</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="py-3 px-4 font-medium text-slate-500">Time</th>
                  <th className="py-3 px-4 font-medium text-slate-500">Patient Name</th>
                  <th className="py-3 px-4 font-medium text-slate-500">Reason</th>
                  <th className="py-3 px-4 font-medium text-slate-500">Status</th>
                  <th className="py-3 px-4 font-medium text-slate-500">Actions</th>
                </tr>
              </thead>
              <tbody>
                {appointments.filter(a => statusFilter === 'All' || a.status === statusFilter).map((appt) => (
                  <tr key={appt._id} className="border-b border-slate-100 hover:bg-slate-50">
                    <td className="py-3 px-4 font-medium text-slate-900">
                      {new Date(appt.appointmentDate).toLocaleDateString()} {appt.timeSlot}
                    </td>
                    <td className="py-3 px-4 text-slate-900">{appt.patient?.name}</td>
                    <td className="py-3 px-4 text-slate-600">{appt.reason}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        appt.status === 'Confirmed' ? 'bg-green-100 text-green-800' :
                        appt.status === 'Completed' ? 'bg-blue-100 text-blue-800' :
                        appt.status === 'Cancelled' ? 'bg-red-100 text-red-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {appt.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 space-x-2">
                      {appt.status === 'Pending' && (
                        <button onClick={() => updateStatus(appt._id, 'Confirmed')} className="text-xs bg-blue-100 text-blue-700 px-3 py-1 rounded hover:bg-blue-200 transition">Confirm</button>
                      )}
                      {appt.status === 'Confirmed' && (
                        <Link to={`/doctor/record/${appt._id}`} className="text-xs bg-indigo-100 text-indigo-700 px-3 py-1 rounded hover:bg-indigo-200 transition">
                          Treat Patient
                        </Link>
                      )}
                    </td>
                  </tr>
                ))}
                {appointments.length === 0 && (
                  <tr><td colSpan={5} className="py-6 text-center text-slate-500">No appointments in the queue.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
