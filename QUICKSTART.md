# SHG-Mart Quick Start Guide

## 🚀 Quick Start (5 Minutes)

### Step 1: Install Dependencies
```powershell
# Run the setup script
.\setup.ps1

# Or manually:
cd backend
npm install
cd ../frontend
npm install
```

### Step 2: Start MongoDB
```bash
# If using local MongoDB
mongod

# Or use MongoDB Atlas (update MONGODB_URI in backend/.env)
```

### Step 3: Start Backend (Terminal 1)
```bash
cd backend
npm run dev
```

### Step 4: Start Frontend (Terminal 2)
```bash
cd frontend
npm run dev
```

### Step 5: Access Application
- Frontend: http://localhost:5173
- Backend: http://localhost:5000/api/health

## 📝 First Time Setup

### Create Admin User
1. Register a user at http://localhost:5173/register
2. Open MongoDB and run:
```javascript
db.users.updateOne(
  { email: "your-email@example.com" },
  { $set: { role: "admin" } }
)
```

### Test the Application
1. **As Customer:**
   - Register with "Customer" role
   - Browse products
   - Add to cart

2. **As SHG:**
   - Register with "SHG (Seller)" role
   - Complete SHG registration
   - Get approved by admin
   - Add products

3. **As Admin:**
   - Login with admin account
   - Approve pending SHGs
   - Approve pending products
   - View analytics

## 🔧 Configuration

### Backend (.env)
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/shg-mart
JWT_SECRET=change_this_to_secure_random_string
FRONTEND_URL=http://localhost:5173
```

### Optional Services
- **Cloudinary:** For image uploads (can skip initially)
- **Razorpay:** For payments (can skip initially)

## 📦 Project Structure
```
shg-mart/
├── backend/        # Express API
├── frontend/       # React App
├── README.md       # Full documentation
└── setup.ps1       # Setup script
```

## 🐛 Common Issues

**MongoDB Connection Error:**
- Ensure MongoDB is running
- Check connection string in .env

**Port Already in Use:**
- Change PORT in backend/.env
- Change port in frontend/vite.config.js

**CORS Errors:**
- Verify FRONTEND_URL in backend/.env

## 📚 Full Documentation
See README.md for complete documentation.

---
**Happy Coding! 🎉**
