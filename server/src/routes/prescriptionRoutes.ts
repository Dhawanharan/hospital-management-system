import express from 'express';
import { createPrescription, getPatientPrescriptions } from '../controllers/prescriptionController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

router.route('/')
  .post(protect, createPrescription);

router.route('/patient/:patientId')
  .get(protect, getPatientPrescriptions);

export default router;
