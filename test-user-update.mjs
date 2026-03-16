import mongoose from 'mongoose';
import { User } from './src/lib/models/User.ts';
import { connectDB } from './src/lib/db.ts';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

async function testUpdate() {
  await connectDB();
  console.log('Connected to DB');

  // Find a test user (or just use any)
  const user = await User.findOne({ email: 'test@test.com' });
  if (!user) {
    console.log('Test user not found, creating one...');
    const newUser = await User.create({
      name: 'Test User',
      email: 'test@test.com',
      role: 'USER'
    });
    console.log('Created:', newUser);
  } else {
    console.log('Found user:', user.email);
    
    const updateData = {
      phone: '+353 87 123 4567',
      address: {
        line1: '123 Test St',
        city: 'Dublin',
        state: 'Dublin',
        postal_code: 'D01'
      }
    };

    const updated = await User.findByIdAndUpdate(user._id, { $set: updateData }, { new: true });
    console.log('Updated User in Mongo:', updated.phone, updated.address);
  }

  await mongoose.disconnect();
  console.log('Disconnected');
}

testUpdate().catch(console.error);
