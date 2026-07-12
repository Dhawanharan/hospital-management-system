import { useState, useEffect } from 'react';
import api from '../../api/axios';
import toast from 'react-hot-toast';

interface Patient {
  _id: string;
  name: string;
  email: string;
  age: number;
  gender: string;
  contactNumber: string;
}

export default function Patients() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchPatients = async () => {
    try {
      const res = await api.get('/users?role=Patient');
      setPatients(res.data);
    } catch (error) {
      toast.error('Failed to load patients');
    }
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/auth/register', { 
        name, email, password, role: 'Patient', age: Number(age), gender, contactNumber
      });
      toast.success('Patient registered successfully!');
      setName(''); setEmail(''); setPassword(''); setAge(''); setGender(''); setContactNumber('');
      fetchPatients();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to create');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900 mb-6">Manage Patients</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm lg:col-span-1 h-fit">
          <h2 className="text-lg font-semibold mb-4">Register Patient</h2>
          <form onSubmit={handleCreate} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Name</label>
              <input type="text" required value={name} onChange={(e) => setName(e.target.value)} className="w-full px-3 py-2 border rounded-md" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
              <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-3 py-2 border rounded-md" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
              <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-3 py-2 border rounded-md" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Age</label>
                <input type="number" value={age} onChange={(e) => setAge(e.target.value)} className="w-full px-3 py-2 border rounded-md" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Gender</label>
                <select value={gender} onChange={(e) => setGender(e.target.value)} className="w-full px-3 py-2 border rounded-md bg-white">
                  <option value="">Select</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Contact Number</label>
              <input type="text" value={contactNumber} onChange={(e) => setContactNumber(e.target.value)} className="w-full px-3 py-2 border rounded-md" />
            </div>
            <button disabled={loading} type="submit" className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700">
              {loading ? 'Registering...' : 'Register Patient'}
            </button>
          </form>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm lg:col-span-2">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 space-y-2 sm:space-y-0">
            <h2 className="text-lg font-semibold">Patient Directory</h2>
            <input type="text" placeholder="Search by name or email..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="px-3 py-1.5 border rounded-md text-sm w-full sm:w-64" />
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="py-3 px-4 font-medium text-slate-500">Name</th>
                  <th className="py-3 px-4 font-medium text-slate-500">Email</th>
                  <th className="py-3 px-4 font-medium text-slate-500">Age / Gender</th>
                  <th className="py-3 px-4 font-medium text-slate-500">Contact</th>
                </tr>
              </thead>
              <tbody>
                {patients.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()) || p.email.toLowerCase().includes(searchTerm.toLowerCase())).map((pat) => (
                  <tr key={pat._id} className="border-b border-slate-100 hover:bg-slate-50">
                    <td className="py-3 px-4 font-medium text-slate-900">{pat.name}</td>
                    <td className="py-3 px-4 text-slate-600">{pat.email}</td>
                    <td className="py-3 px-4 text-slate-600">{pat.age} / {pat.gender}</td>
                    <td className="py-3 px-4 text-slate-600">{pat.contactNumber}</td>
                  </tr>
                ))}
                {patients.length === 0 && (
                  <tr><td colSpan={4} className="py-6 text-center text-slate-500">No patients registered yet.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
