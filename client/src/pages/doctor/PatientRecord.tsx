import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import toast from 'react-hot-toast';

export default function PatientRecord() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [appointment, setAppointment] = useState<any>(null);
  
  const [diagnosis, setDiagnosis] = useState('');
  const [notes, setNotes] = useState('');
  const [medicine, setMedicine] = useState('');
  const [dosage, setDosage] = useState('');
  const [frequency, setFrequency] = useState('');
  const [duration, setDuration] = useState('');
  const [medicines, setMedicines] = useState<any[]>([]);

  useEffect(() => {
    // Fetch all and filter for the active session
    api.get('/appointments').then(res => {
      const appt = res.data.find((a: any) => a._id === id);
      setAppointment(appt);
    });
  }, [id]);

  const addMedicine = () => {
    if (!medicine || !dosage) return;
    setMedicines([...medicines, { name: medicine, dosage, frequency, duration }]);
    setMedicine(''); setDosage(''); setFrequency(''); setDuration('');
  };

  const handleComplete = async () => {
    try {
      // 1. Create Medical Record
      const recordRes = await api.post('/medical-records', {
        patient: appointment.patient._id,
        appointment: appointment._id,
        diagnosis,
        notes
      });

      // 2. Create Prescription if medicines exist
      if (medicines.length > 0) {
        await api.post('/prescriptions', {
          patient: appointment.patient._id,
          medicalRecord: recordRes.data._id,
          medicines,
          notes: 'Take medicines strictly as prescribed.'
        });
      }

      // 3. Mark appointment as completed
      await api.put(`/appointments/${appointment._id}/status`, { status: 'Completed' });

      toast.success('Patient treatment completed successfully!');
      navigate('/doctor/dashboard');
    } catch (error) {
      toast.error('Failed to complete treatment');
    }
  };

  if (!appointment) return <div className="p-8 text-center text-slate-500">Loading patient data...</div>;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900">Patient Session: {appointment.patient.name}</h1>
        <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
          {new Date(appointment.appointmentDate).toLocaleDateString()}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Medical Record Form */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h2 className="text-lg font-semibold mb-4 text-slate-800">Medical Record</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Diagnosis (required)</label>
              <input type="text" value={diagnosis} onChange={(e) => setDiagnosis(e.target.value)} className="w-full px-3 py-2 border rounded-md" placeholder="e.g. Viral Fever" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Clinical Notes</label>
              <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={4} className="w-full px-3 py-2 border rounded-md" placeholder="Observations..."></textarea>
            </div>
          </div>
        </div>

        {/* Prescription Form */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h2 className="text-lg font-semibold mb-4 text-slate-800">Prescription</h2>
          
          {medicines.length > 0 && (
            <div className="mb-4 space-y-2">
              {medicines.map((m, i) => (
                <div key={i} className="flex items-center justify-between bg-slate-50 p-2 rounded border border-slate-100">
                  <span className="text-sm font-medium text-slate-800">{m.name}</span>
                  <span className="text-xs text-slate-500">{m.dosage} | {m.frequency} | {m.duration}</span>
                </div>
              ))}
            </div>
          )}

          <div className="space-y-3 border-t pt-4">
            <input type="text" placeholder="Medicine Name" value={medicine} onChange={(e) => setMedicine(e.target.value)} className="w-full px-3 py-2 border rounded-md text-sm" />
            <div className="grid grid-cols-3 gap-2">
              <input type="text" placeholder="Dosage" value={dosage} onChange={(e) => setDosage(e.target.value)} className="w-full px-3 py-2 border rounded-md text-sm" />
              <input type="text" placeholder="Freq (e.g. 1-0-1)" value={frequency} onChange={(e) => setFrequency(e.target.value)} className="w-full px-3 py-2 border rounded-md text-sm" />
              <input type="text" placeholder="Days" value={duration} onChange={(e) => setDuration(e.target.value)} className="w-full px-3 py-2 border rounded-md text-sm" />
            </div>
            <button onClick={addMedicine} className="w-full border border-blue-600 text-blue-600 py-1.5 rounded-md hover:bg-blue-50 transition text-sm">
              + Add Medicine
            </button>
          </div>
        </div>
      </div>

      <div className="flex justify-end pt-4">
        <button onClick={handleComplete} disabled={!diagnosis} className="bg-green-600 text-white px-8 py-3 rounded-md hover:bg-green-700 transition font-medium shadow-sm disabled:opacity-50">
          Complete Appointment
        </button>
      </div>
    </div>
  );
}
