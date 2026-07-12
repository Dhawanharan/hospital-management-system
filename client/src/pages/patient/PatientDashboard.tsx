import { useState, useEffect } from 'react';
import api from '../../api/axios';
import { useAuth } from '../../contexts/AuthContext';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import jsPDF from 'jspdf';

export default function PatientDashboard() {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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
    fetchAppointments();
  }, []);

  const downloadPrescription = async (apptId: string) => {
    try {
      const res = await api.get(`/prescriptions/patient/${user?._id}`);
      const prescription = res.data.find((p: any) => p.medicalRecord?.appointment === apptId);
      
      if (!prescription) {
        toast.error('No prescription found for this appointment');
        return;
      }

      const doc = new jsPDF();
      doc.setFontSize(20);
      doc.setTextColor(37, 99, 235); // Blue 600
      doc.text('Hospital Management System', 20, 20);
      
      doc.setFontSize(14);
      doc.setTextColor(15, 23, 42); // Slate 900
      doc.text(`Prescription for: ${user?.name}`, 20, 40);
      doc.text(`Doctor: Dr. ${prescription.doctor.name}`, 20, 50);
      doc.text(`Date: ${new Date(prescription.issueDate).toLocaleDateString()}`, 20, 60);

      doc.setFontSize(16);
      doc.text('Medicines:', 20, 80);
      
      let y = 90;
      doc.setFontSize(12);
      doc.setTextColor(71, 85, 105); // Slate 600
      prescription.medicines.forEach((med: any, index: number) => {
        doc.text(`${index + 1}. ${med.name} - ${med.dosage} (${med.frequency}) for ${med.duration}`, 20, y);
        y += 10;
      });

      if (prescription.notes) {
        y += 10;
        doc.setTextColor(15, 23, 42);
        doc.text('Clinical Notes:', 20, y);
        y += 10;
        doc.setTextColor(71, 85, 105);
        doc.text(prescription.notes, 20, y);
      }

      doc.save(`Prescription_${new Date().getTime()}.pdf`);
      toast.success('PDF downloaded successfully');
    } catch (error) {
      toast.error('Failed to download PDF');
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Welcome, {user?.name}</h1>
        <Link to="/patient/book-appointment" className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 shadow-sm">
          Book Appointment
        </Link>
      </div>

      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <h2 className="text-lg font-semibold mb-4">My Appointments</h2>
        {loading ? (
          <p>Loading appointments...</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="py-3 px-4 font-medium text-slate-500">Date & Time</th>
                  <th className="py-3 px-4 font-medium text-slate-500">Doctor</th>
                  <th className="py-3 px-4 font-medium text-slate-500">Department</th>
                  <th className="py-3 px-4 font-medium text-slate-500">Status</th>
                  <th className="py-3 px-4 font-medium text-slate-500">Actions</th>
                </tr>
              </thead>
              <tbody>
                {appointments.map((appt) => (
                  <tr key={appt._id} className="border-b border-slate-100 hover:bg-slate-50">
                    <td className="py-3 px-4 text-slate-900">
                      {new Date(appt.appointmentDate).toLocaleDateString()} at {appt.timeSlot}
                    </td>
                    <td className="py-3 px-4 font-medium text-slate-900">Dr. {appt.doctor?.name}</td>
                    <td className="py-3 px-4 text-slate-600">{appt.department?.name}</td>
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
                    <td className="py-3 px-4">
                      {appt.status === 'Completed' && (
                        <button onClick={() => downloadPrescription(appt._id)} className="text-xs bg-indigo-100 text-indigo-700 px-3 py-1 rounded hover:bg-indigo-200 transition">
                          Download PDF
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
                {appointments.length === 0 && (
                  <tr><td colSpan={5} className="py-6 text-center text-slate-500">No appointments found.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
