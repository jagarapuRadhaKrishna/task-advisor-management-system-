const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config({ path: '../.env' });
dotenv.config();

const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/taskmanager_db';

console.log('🔍 MongoDB Connection Test');
console.log('==========================');
console.log('URI:', mongoUri.replace(/:[^:]*@/, ':****@'));
console.log('Environment:', process.env.NODE_ENV || 'development');
console.log('');

mongoose.connect(mongoUri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 5000,
})
.then(async () => {
  console.log('✅ MongoDB Connection Successful');
  console.log('Database:', mongoose.connection.db.name);
  console.log('Host:', mongoose.connection.host);
  
  // Try to insert a test user
  const User = require('./models/User');
  
  try {
    const testUser = await User.create({
      name: 'Test User',
      email: `test_${Date.now()}@test.com`,
      password: 'TestPassword123!'
    });
    
    console.log('\n✅ User Creation Test Successful');
    console.log('Created user:', {
      id: testUser._id,
      name: testUser.name,
      email: testUser.email
    });
    
    // Clean up
    await User.deleteOne({ _id: testUser._id });
    console.log('✅ Cleanup successful');
  } catch (err) {
    console.error('❌ User creation test failed:', err.message);
  }
  
  mongoose.connection.close();
  process.exit(0);
})
.catch(err => {
  console.error('❌ MongoDB Connection Failed');
  console.error('Error:', err.message);
  console.error('\n💡 Solutions:');
  console.error('1. Ensure MongoDB is running (mongod or mongosh)');
  console.error('2. Check MongoDB URI in .env file');
  console.error('3. Verify MongoDB credentials');
  console.error('4. Ensure MongoDB service is not blocked by firewall');
  process.exit(1);
});
