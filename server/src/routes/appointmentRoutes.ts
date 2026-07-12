import express from 'express';
import { bookAppointment, getAppointments, updateAppointmentStatus } from '../controllers/appointmentController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

router.route('/')
  .post(protect, bookAppointment)
  .get(protect, getAppointments);

router.route('/:id/status')
  .put(protect, updateAppointmentStatus);

export default router;
