import { Request, Response } from 'express';
import User from '../models/User';
import Appointment from '../models/Appointment';

// @desc    Get dashboard stats
// @route   GET /api/admin/stats
// @access  Private/Admin
export const getDashboardStats = async (req: Request, res: Response) => {
  try {
    const totalDoctors = await User.countDocuments({ role: 'Doctor' } as any);
    const totalPatients = await User.countDocuments({ role: 'Patient' } as any);
    const pendingAppointments = await Appointment.countDocuments({ status: 'Pending' });
    const totalAppointments = await Appointment.countDocuments();

    // Mock chart data for appointments over the last week
    const chartData = [
      { name: 'Mon', appointments: 4 },
      { name: 'Tue', appointments: 7 },
      { name: 'Wed', appointments: 5 },
      { name: 'Thu', appointments: 10 },
      { name: 'Fri', appointments: 8 },
      { name: 'Sat', appointments: 3 },
      { name: 'Sun', appointments: 1 },
    ];

    res.json({
      stats: {
        totalDoctors,
        totalPatients,
        pendingAppointments,
        totalAppointments
      },
      chartData
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
