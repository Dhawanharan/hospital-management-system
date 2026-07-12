import { Request, Response } from 'express';
import MedicalRecord from '../models/MedicalRecord';

// @desc    Create a medical record
// @route   POST /api/medical-records
// @access  Private (Doctor)
export const createMedicalRecord = async (req: Request, res: Response) => {
  try {
    const { patient, appointment, diagnosis, symptoms, vitals, notes } = req.body;
    const doctor = (req as any).user._id;

    const record = await MedicalRecord.create({
      patient,
      doctor,
      appointment,
      diagnosis,
      symptoms,
      vitals,
      notes
    });

    res.status(201).json(record);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get patient medical records
// @route   GET /api/medical-records/patient/:patientId
// @access  Private
export const getPatientRecords = async (req: Request, res: Response) => {
  try {
    const records = await MedicalRecord.find({ patient: req.params.patientId })
      .populate('doctor', 'name specialization')
      .populate('appointment')
      .sort({ createdAt: -1 });
    res.json(records);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
