# 🚀 COMPLETE SETUP & TESTING GUIDE

## ✅ Current Status

### Backend ✅
- **Status**: Running on port 5000
- **Database**: MongoDB connected
- **Command**: `npm run dev` (in backend folder)

### Frontend ✅
- **Status**: Running on port 3001
- **Command**: `npm start` (in frontend folder)
- **URL**: http://localhost:3001

## 🔐 How to Test Login/Register

### Step 1: Open Application
```
Open browser → http://localhost:3001
```

### Step 2: Register New User
1. Click "Register" link
2. Fill form:
   - **Name**: John Doe
   - **Email**: john@example.com
   - **Password**: Test123456
   - **Confirm Password**: Test123456
3. Click "Register"
4. **Result**: Should redirect to dashboard automatically

### Step 3: Login with Your Account
1. If redirected to dashboard, you're logged in ✅
2. Close browser or logout
3. Go to `/login`
4. Enter email and password
5. Click "Login"
6. **Result**: Should redirect to dashboard

## 🐛 If Login/Register Fails

### Error 1: "Failed to fetch" or Network Error
**Solution**:
```bash
# Check if backend is running
curl http://localhost:5000/health

# If not, start backend:
cd backend
npm run dev
```

### Error 2: "Server error during registration"
**Solution**:
```bash
# Check MongoDB is running
mongosh

# If MongoDB error persists, check .env:
MONGODB_URI=mongodb://127.0.0.1:27017/taskmanager_db
```

### Error 3: User Created but Won't Login
**Solution**:
1. Check browser console (F12)
2. Check JWT_SECRET in .env
3. Restart backend and frontend

## 📊 API Endpoints for Testing

### Register
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "Test123456"
  }'
```

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test123456"
  }'
```

## 🔧 Quick Restart

### Kill all Node processes
```powershell
taskkill /F /IM node.exe /T
```

### Terminal 1: Start Backend
```bash
cd backend
npm run dev
```

### Terminal 2: Start Frontend
```bash
cd frontend
npm start
```

## 📝 Environment Variables

Key variables in `.env` (root folder):
```
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/taskmanager_db
JWT_SECRET=your_super_secret_jwt_key_change_in_production_12345_abcde
REACT_APP_SERVER_URL=http://localhost:5000
```

## 🔍 Debugging

### Check Backend Logs
- Open browser developer console (F12)
- Go to Network tab
- Make request and see response

### Check Backend Terminal
- Look for error messages
- Check MongoDB connection logs
- Verify auth route is being called

### Common Issues

| Issue | Solution |
|-------|----------|
| Port 5000 already in use | Kill: `taskkill /F /IM node.exe` |
| Port 3000 already in use | Frontend auto-runs on 3001 |
| MongoDB not connecting | Run: `mongod` or check URI |
| CORS errors | Check `CORS_ORIGIN` in .env |
| JWT errors | Verify `JWT_SECRET` in .env |

## ✨ Success Indicators

✅ All working when:
1. Backend shows "✅ Server is running on port 5000"
2. MongoDB shows "✅ MongoDB connected successfully"
3. Frontend loads at http://localhost:3001
4. Can register new user
5. Can login with registered credentials
6. Redirects to dashboard after login

---

**Last Updated**: October 28, 2025
**Status**: All systems operational
