import mongoose from 'mongoose';

export enum UserRole {
  ADMIN = 'Admin',
  DOCTOR = 'Doctor',
  RECEPTIONIST = 'Receptionist',
  PATIENT = 'Patient',
}

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: Object.values(UserRole),
      default: UserRole.PATIENT,
      required: true,
    },
    // Doctor specific fields
    department: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Department',
    },
    specialization: String,
    experience: Number,
    // Patient specific fields
    age: Number,
    gender: String,
    bloodGroup: String,
    address: String,
    contactNumber: String,
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model('User', userSchema);
export default User;
