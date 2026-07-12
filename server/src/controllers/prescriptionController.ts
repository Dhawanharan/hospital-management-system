import { Request, Response } from 'express';
import Prescription from '../models/Prescription';

// @desc    Create a prescription
// @route   POST /api/prescriptions
// @access  Private (Doctor)
export const createPrescription = async (req: Request, res: Response) => {
  try {
    const { patient, medicalRecord, medicines, notes } = req.body;
    const doctor = (req as any).user._id;

    const prescription = await Prescription.create({
      patient,
      doctor,
      medicalRecord,
      medicines,
      notes
    });

    res.status(201).json(prescription);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get patient prescriptions
// @route   GET /api/prescriptions/patient/:patientId
// @access  Private
export const getPatientPrescriptions = async (req: Request, res: Response) => {
  try {
    const prescriptions = await Prescription.find({ patient: req.params.patientId })
      .populate('doctor', 'name specialization')
      .populate('medicalRecord')
      .sort({ createdAt: -1 });
    res.json(prescriptions);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
