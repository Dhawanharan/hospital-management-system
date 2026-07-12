import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import User from './models/User';
import connectDB from './config/db';

dotenv.config();

const seedAdmin = async () => {
  try {
    await connectDB();
    
    // Check if admin exists
    const adminExists = await User.findOne({ email: 'admin@hms.com' });
    if (adminExists) {
      console.log('Admin already exists.');
      process.exit();
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('admin123', salt);

    await User.create({
      name: 'System Admin',
      email: 'admin@hms.com',
      password: hashedPassword,
      role: 'Admin' as any,
    });

    console.log('Admin user seeded successfully!');
    process.exit();
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seedAdmin();
