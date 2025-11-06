# ✅ MERN Task Manager - Setup Complete

## 📊 System Status

### Backend (Port 5000)
- ✅ Server Running: `npm run dev`
- ✅ MongoDB Connected: `mongodb://127.0.0.1:27017/taskmanager_db`
- ✅ Routes Available:
  - POST `/api/auth/register` - Register new user
  - POST `/api/auth/login` - Login user
  - GET `/api/auth/me` - Get current user
  - POST `/api/tasks` - Create task
  - GET `/api/tasks` - Get tasks
  - PUT `/api/tasks/:id` - Update task
  - DELETE `/api/tasks/:id` - Delete task

### Frontend (Port 3000)
- Setup: `npm run dev` or `npm start`
- Environment: `.env` file at root

## 🚀 Quick Start

### Terminal 1: Start Backend
```bash
cd backend
npm run dev
# ✅ Should see: "Server is running on port 5000"
```

### Terminal 2: Start Frontend
```bash
cd frontend
npm start
# or
npm run dev
```

## 🔐 Testing Login/Register

### Test User Credentials
- Email: `test@example.com`
- Password: `TestPass123!`

### Create New User
1. Click "Register" link
2. Fill in form:
   - Name: Your Name
   - Email: your-email@example.com
   - Password: At least 6 characters
   - Confirm Password: Must match
3. Click "Register"
4. Should redirect to dashboard

### Login
1. Go to `/login`
2. Enter email and password
3. Click "Login"
4. Should be redirected to dashboard

## 🛠️ Troubleshooting

### Backend Won't Start
```bash
# Check if MongoDB is running
mongosh

# If MongoDB not running, start it:
mongod
```

### Login/Register Failing
1. Ensure backend is running on port 5000
2. Check browser console for errors (F12)
3. Check backend terminal for error logs
4. Verify `.env` file has correct MONGODB_URI

### Frontend Won't Start
```bash
cd frontend
npm install --legacy-peer-deps
npm start
```

### Port Already in Use
```powershell
# Find process on port 5000
netstat -ano | findstr :5000

# Kill process (replace PID with actual number)
taskkill /PID <PID> /F
```

## 📁 Project Structure
```
.
├── backend/
│   ├── models/User.js
│   ├── routes/auth.js
│   ├── middleware/auth.js
│   ├── server.js
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── pages/Login.js
│   │   ├── pages/Register.js
│   │   ├── context/AuthContext.js
│   │   └── context/TaskContext.js
│   ├── package.json
│   └── .env
├── .env (main config file)
└── .env.example (template)
```

## ✨ Features

- ✅ User Registration
- ✅ User Login
- ✅ JWT Authentication
- ✅ Password Hashing (bcrypt)
- ✅ Task CRUD Operations
- ✅ Real-time Updates (Socket.io)
- ✅ Error Handling
- ✅ CORS Support

## 📝 Environment Variables

Key variables in `.env`:
- `MONGODB_URI` - MongoDB connection string
- `JWT_SECRET` - JWT signing key
- `PORT` - Backend port (default: 5000)
- `REACT_APP_SERVER_URL` - Frontend API URL

