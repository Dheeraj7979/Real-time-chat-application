import mongoose from 'mongoose';
import { User } from '../models/User.models.js';

// 1. Define your schema exactly like your backend
const NotificationSchema = new mongoose.Schema({
  message: String,
  type: String,
  useremail: String,
  requestemail: String,
  createdAt: Date
});

const Notification = mongoose.model('Notification', NotificationSchema);

// 2. The script execution logic
async function runIndependentSeed() {
  try {
    // 🚨 REPLACE THIS string with your actual local MongoDB connection or your Atlas URI string!
    const MONGO_URI = 'mongodb://localhost:27018/chat'; 

    console.log('🔌 Connecting independent script to MongoDB...');
    await mongoose.connect(MONGO_URI);
    console.log('✅ Connected to MongoDB successfully!');

    console.log('⏳ Generating 60 friend requests...');
    const notificationBatch = [];

    for (let i = 50; i <= 1000; i++) {
      notificationBatch.push({
        message: `demouser${i} sent you a friend request`,
        type:'friend_request',
        useremail: `dheerajku357@gmail.com`,
        requseremail:`demouser${i}`,
        createdAt:new Date()
      });
    }

    // Push straight to the database
    const result = await Notification.insertMany(notificationBatch);
    console.log(`🚀 Success! Inserted ${result.length} notifications into your DB.`);

    // Clean up and close the script execution loop safely
    await mongoose.disconnect();
    console.log('🔌 Disconnected safely. Script complete.');

  } catch (error) {
    console.error('❌ Script failed:', error);
  }
}

// Fire the script!
runIndependentSeed();