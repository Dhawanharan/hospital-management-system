import { Outlet, NavLink } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function DashboardLayout() {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
      {/* Sidebar Placeholder */}
      <aside className="w-full md:w-64 bg-white border-r border-slate-200 flex flex-col">
        <div className="p-6 text-xl font-bold text-blue-600 border-b border-slate-100">
          HMS
        </div>
        <nav className="flex-1 p-4 space-y-2 text-sm font-medium text-slate-700">
          <NavLink 
            to={`/${user?.role.toLowerCase()}/dashboard`}
            className={({ isActive }) => 
              `block p-3 rounded-md ${isActive ? 'bg-blue-50 text-blue-700' : 'hover:bg-slate-100'}`
            }
          >
            Dashboard
          </NavLink>
          {user?.role === 'Admin' && (
            <>
              <NavLink 
                to="/admin/departments"
                className={({ isActive }) => `block p-3 rounded-md ${isActive ? 'bg-blue-50 text-blue-700' : 'hover:bg-slate-100'}`}
              >
                Departments
              </NavLink>
              <NavLink 
                to="/admin/doctors"
                className={({ isActive }) => `block p-3 rounded-md ${isActive ? 'bg-blue-50 text-blue-700' : 'hover:bg-slate-100'}`}
              >
                Doctors
              </NavLink>
              <NavLink 
                to="/admin/patients"
                className={({ isActive }) => `block p-3 rounded-md ${isActive ? 'bg-blue-50 text-blue-700' : 'hover:bg-slate-100'}`}
              >
                Patients
              </NavLink>
            </>
          )}
          {user?.role === 'Patient' && (
            <NavLink 
              to="/patient/book-appointment"
              className={({ isActive }) => `block p-3 rounded-md ${isActive ? 'bg-blue-50 text-blue-700' : 'hover:bg-slate-100'}`}
            >
              Book Appointment
            </NavLink>
          )}
        </nav>
        <div className="p-4 border-t border-slate-200">
          <p className="text-sm text-slate-500 mb-2">{user?.name}</p>
          <button onClick={logout} className="w-full text-left text-sm text-red-600 hover:text-red-700 font-medium">
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-8">
        <Outlet />
      </main>
    </div>
  );
}
