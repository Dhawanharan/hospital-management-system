import { useState, useEffect } from 'react';
import api from '../../api/axios';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

export default function BookAppointment() {
  const navigate = useNavigate();
  const [departments, setDepartments] = useState<any[]>([]);
  const [doctors, setDoctors] = useState<any[]>([]);
  
  const [selectedDept, setSelectedDept] = useState('');
  const [selectedDoctor, setSelectedDoctor] = useState('');
  const [date, setDate] = useState('');
  const [timeSlot, setTimeSlot] = useState('');
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api.get('/departments').then(res => setDepartments(res.data));
  }, []);

  useEffect(() => {
    if (selectedDept) {
      api.get('/users?role=Doctor').then(res => {
        const filteredDocs = res.data.filter((d: any) => d.department?._id === selectedDept);
        setDoctors(filteredDocs);
      });
    } else {
      setDoctors([]);
    }
    setSelectedDoctor('');
  }, [selectedDept]);

  const handleBook = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/appointments', {
        department: selectedDept,
        doctor: selectedDoctor,
        appointmentDate: date,
        timeSlot,
        reason
      });
      toast.success('Appointment booked successfully!');
      navigate('/patient/dashboard');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to book');
    } finally {
      setLoading(false);
    }
  };

  const timeSlots = ["09:00 AM", "10:00 AM", "11:00 AM", "01:00 PM", "02:00 PM", "03:00 PM", "04:00 PM"];

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-slate-900 mb-6">Book an Appointment</h1>
      
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <form onSubmit={handleBook} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Department</label>
            <select required value={selectedDept} onChange={(e) => setSelectedDept(e.target.value)} className="w-full px-3 py-2 border rounded-md bg-white">
              <option value="">Select Department</option>
              {departments.map(d => <option key={d._id} value={d._id}>{d.name}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Doctor</label>
            <select required value={selectedDoctor} onChange={(e) => setSelectedDoctor(e.target.value)} disabled={!selectedDept} className="w-full px-3 py-2 border rounded-md bg-white disabled:bg-slate-50">
              <option value="">Select Doctor</option>
              {doctors.map(d => <option key={d._id} value={d._id}>Dr. {d.name} {d.specialization && `- ${d.specialization}`}</option>)}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Date</label>
              <input type="date" required min={new Date().toISOString().split('T')[0]} value={date} onChange={(e) => setDate(e.target.value)} className="w-full px-3 py-2 border rounded-md" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Time Slot</label>
              <select required value={timeSlot} onChange={(e) => setTimeSlot(e.target.value)} className="w-full px-3 py-2 border rounded-md bg-white">
                <option value="">Select Time</option>
                {timeSlots.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Reason for Visit</label>
            <textarea required value={reason} onChange={(e) => setReason(e.target.value)} className="w-full px-3 py-2 border rounded-md" rows={3}></textarea>
          </div>

          <button disabled={loading} type="submit" className="w-full bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 transition-colors font-medium">
            {loading ? 'Booking...' : 'Confirm Appointment'}
          </button>
        </form>
      </div>
    </div>
  );
}
