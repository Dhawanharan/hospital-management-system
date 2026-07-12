import { useState, useEffect } from 'react';
import api from '../../api/axios';
import toast from 'react-hot-toast';

interface Doctor {
  _id: string;
  name: string;
  email: string;
  department: { name: string };
  specialization: string;
}

interface Department {
  _id: string;
  name: string;
}

export default function Doctors() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [departmentId, setDepartmentId] = useState('');
  const [specialization, setSpecialization] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    try {
      const docRes = await api.get('/users?role=Doctor');
      setDoctors(docRes.data);
      const depRes = await api.get('/departments');
      setDepartments(depRes.data);
    } catch (error) {
      toast.error('Failed to load data');
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/auth/register', { 
        name, 
        email, 
        password, 
        role: 'Doctor', 
        department: departmentId,
        specialization
      });
      toast.success('Doctor registered successfully!');
      setName(''); setEmail(''); setPassword(''); setSpecialization('');
      fetchData();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to create');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900 mb-6">Manage Doctors</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm lg:col-span-1 h-fit">
          <h2 className="text-lg font-semibold mb-4">Register New Doctor</h2>
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
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Department</label>
              <select required value={departmentId} onChange={(e) => setDepartmentId(e.target.value)} className="w-full px-3 py-2 border rounded-md bg-white">
                <option value="">Select Department</option>
                {departments.map(d => (
                  <option key={d._id} value={d._id}>{d.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Specialization</label>
              <input type="text" value={specialization} onChange={(e) => setSpecialization(e.target.value)} className="w-full px-3 py-2 border rounded-md" />
            </div>
            <button disabled={loading} type="submit" className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700">
              {loading ? 'Registering...' : 'Register Doctor'}
            </button>
          </form>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm lg:col-span-2">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 space-y-2 sm:space-y-0">
            <h2 className="text-lg font-semibold">Doctors List</h2>
            <input type="text" placeholder="Search by name or email..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="px-3 py-1.5 border rounded-md text-sm w-full sm:w-64" />
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="py-3 px-4 font-medium text-slate-500">Name</th>
                  <th className="py-3 px-4 font-medium text-slate-500">Email</th>
                  <th className="py-3 px-4 font-medium text-slate-500">Department</th>
                </tr>
              </thead>
              <tbody>
                {doctors.filter(d => d.name.toLowerCase().includes(searchTerm.toLowerCase()) || d.email.toLowerCase().includes(searchTerm.toLowerCase())).map((doc) => (
                  <tr key={doc._id} className="border-b border-slate-100 hover:bg-slate-50">
                    <td className="py-3 px-4 font-medium text-slate-900">{doc.name}</td>
                    <td className="py-3 px-4 text-slate-600">{doc.email}</td>
                    <td className="py-3 px-4 text-slate-600">{doc.department?.name || 'N/A'}</td>
                  </tr>
                ))}
                {doctors.length === 0 && (
                  <tr><td colSpan={3} className="py-6 text-center text-slate-500">No doctors registered yet.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
