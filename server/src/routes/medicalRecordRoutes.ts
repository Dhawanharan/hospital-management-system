import express from 'express';
import { createMedicalRecord, getPatientRecords } from '../controllers/medicalRecordController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

router.route('/')
  .post(protect, createMedicalRecord);

router.route('/patient/:patientId')
  .get(protect, getPatientRecords);

export default router;
