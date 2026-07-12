import { Request, Response } from 'express';
import Department from '../models/Department';

// @desc    Get all departments
// @route   GET /api/departments
// @access  Public
export const getDepartments = async (req: Request, res: Response) => {
  try {
    const departments = await Department.find({});
    res.json(departments);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a department
// @route   POST /api/departments
// @access  Private/Admin
export const createDepartment = async (req: Request, res: Response) => {
  try {
    const { name, description } = req.body;
    const departmentExists = await Department.findOne({ name });
    
    if (departmentExists) {
      res.status(400).json({ message: 'Department already exists' });
      return;
    }

    const department = await Department.create({ name, description });
    res.status(201).json(department);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
