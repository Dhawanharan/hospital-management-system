import { Request, Response } from 'express';
import Appointment from '../models/Appointment';

// @desc    Book an appointment
// @route   POST /api/appointments
// @access  Private (Patient/Receptionist/Admin)
export const bookAppointment = async (req: Request, res: Response) => {
  try {
    const { doctor, department, appointmentDate, timeSlot, reason } = req.body;
    
    // Check if slot is taken
    const existing = await Appointment.findOne({ doctor, appointmentDate, timeSlot, status: { $ne: 'Cancelled' } });
    if (existing) {
      res.status(400).json({ message: 'Time slot is already booked.' });
      return;
    }

    const appointment = await Appointment.create({
      patient: (req as any).user._id,
      doctor,
      department,
      appointmentDate,
      timeSlot,
      reason
    });

    res.status(201).json(appointment);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all appointments (Filter by user role)
// @route   GET /api/appointments
// @access  Private
export const getAppointments = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    let filter = {};

    if (user.role === 'Patient') {
      filter = { patient: user._id };
    } else if (user.role === 'Doctor') {
      filter = { doctor: user._id };
    } // Admin and Receptionist see all

    const appointments = await Appointment.find(filter)
      .populate('patient', 'name email contactNumber')
      .populate('doctor', 'name specialization')
      .populate('department', 'name')
      .sort({ appointmentDate: 1 });

    res.json(appointments);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update appointment status (Confirm, Complete, Cancel)
// @route   PUT /api/appointments/:id/status
// @access  Private
export const updateAppointmentStatus = async (req: Request, res: Response) => {
  try {
    const { status } = req.body;
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      res.status(404).json({ message: 'Appointment not found' });
      return;
    }

    appointment.status = status;
    const updated = await appointment.save();
    res.json(updated);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
