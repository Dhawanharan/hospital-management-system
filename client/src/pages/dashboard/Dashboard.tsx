import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../api/axios';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Activity, Users, Calendar, Clock } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Dashboard() {
  const { user } = useAuth();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.role === 'Admin') {
      api.get('/admin/stats')
        .then(res => setData(res.data))
        .catch(() => toast.error('Failed to load dashboard stats'))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [user]);

  if (loading) return <div className="p-8 text-center text-slate-500">Loading Dashboard...</div>;

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900 mb-6">Welcome, {user?.name}</h1>

      {user?.role === 'Admin' && data && (
        <div className="space-y-6">
          {/* Stat Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center space-x-4">
              <div className="p-3 bg-blue-100 text-blue-600 rounded-lg"><Users size={24} /></div>
              <div>
                <p className="text-sm font-medium text-slate-500">Total Doctors</p>
                <p className="text-2xl font-bold text-slate-900">{data.stats.totalDoctors}</p>
              </div>
            </div>
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center space-x-4">
              <div className="p-3 bg-green-100 text-green-600 rounded-lg"><Activity size={24} /></div>
              <div>
                <p className="text-sm font-medium text-slate-500">Total Patients</p>
                <p className="text-2xl font-bold text-slate-900">{data.stats.totalPatients}</p>
              </div>
            </div>
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center space-x-4">
              <div className="p-3 bg-purple-100 text-purple-600 rounded-lg"><Calendar size={24} /></div>
              <div>
                <p className="text-sm font-medium text-slate-500">Appointments</p>
                <p className="text-2xl font-bold text-slate-900">{data.stats.totalAppointments}</p>
              </div>
            </div>
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center space-x-4">
              <div className="p-3 bg-orange-100 text-orange-600 rounded-lg"><Clock size={24} /></div>
              <div>
                <p className="text-sm font-medium text-slate-500">Pending Requests</p>
                <p className="text-2xl font-bold text-slate-900">{data.stats.pendingAppointments}</p>
              </div>
            </div>
          </div>

          {/* Chart Section */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm h-96">
            <h2 className="text-lg font-semibold mb-6">Appointments This Week</h2>
            <ResponsiveContainer width="100%" height="85%">
              <BarChart data={data.chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b' }} dx={-10} />
                <Tooltip cursor={{ fill: '#f1f5f9' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                <Bar dataKey="appointments" fill="#2563eb" radius={[4, 4, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {user?.role !== 'Admin' && (
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm text-slate-600">
          Your personalized dashboard features are accessible from the sidebar menus.
        </div>
      )}
    </div>
  );
}
