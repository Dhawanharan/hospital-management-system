import express from 'express';
import { getDepartments, createDepartment } from '../controllers/departmentController';
import { protect, admin } from '../middleware/authMiddleware';

const router = express.Router();

router.route('/')
  .get(getDepartments)
  .post(protect, admin, createDepartment);

export default router;
