# Employee Portal - Complete Integration Guide

## 🎯 Overview

The ShoolinTech website now features a complete Employee Portal with:
- **Navigation Submenu** for Employee Login and Registration
- **MongoDB Integration** for persistent employee data storage
- **Auto-Generated 5-Digit Employee IDs** as unique identifiers
- **JWT Authentication** for secure session management
- **JSON Record Format** for all employee data

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────┐
│         ShoolinTech Website (Frontend)       │
│  ┌────────────────────────────────────────┐  │
│  │  Navigation Bar (Updated)              │  │
│  │  ├─ Home                               │  │
│  │  ├─ Services                           │  │
│  │  ├─ Contact                            │  │
│  │  └─ Employee (Submenu)        ✅ NEW   │  │
│  │     ├─ Login                           │  │
│  │     └─ Register                        │  │
│  └────────────────────────────────────────┘  │
│                                              │
│  ┌────────────────────────────────────────┐  │
│  │  Employee Pages (/public)              │  │
│  │  ├─ login.html                         │  │
│  │  ├─ register.html                      │  │
│  │  ├─ dashboard.html                     │  │
│  │  └─ timesheet.html                     │  │
│  └────────────────────────────────────────┘  │
└─────────────────────────────────────────────┘
           ↓↓↓ API Calls ↓↓↓
┌─────────────────────────────────────────────┐
│    Express.js Backend (/api)                 │
│  ┌────────────────────────────────────────┐  │
│  │  Routes: /api/auth                     │  │
│  │  ├─ POST /register                     │  │
│  │  ├─ POST /login                        │  │
│  │  ├─ GET /verify                        │  │
│  │  └─ POST /logout                       │  │
│  └────────────────────────────────────────┘  │
│  ┌────────────────────────────────────────┐  │
│  │  Models                                │  │
│  │  ├─ Employee.js (with auto-increment)  │  │
│  │  └─ Timesheet.js                       │  │
│  └────────────────────────────────────────┘  │
└─────────────────────────────────────────────┘
           ↓↓↓ CRUD Operations ↓↓↓
┌─────────────────────────────────────────────┐
│    MongoDB Atlas Database                    │
│  ┌────────────────────────────────────────┐  │
│  │  Collections                           │  │
│  │  ├─ employees                          │  │
│  │  │  └─ Employee Records (JSON)  ✅ NEW │  │
│  │  ├─ timesheets                         │  │
│  │  ├─ counters                           │  │
│  │  │  └─ EmployeeID Counter       ✅ NEW │  │
│  │  └─ ...                                │  │
│  └────────────────────────────────────────┘  │
└─────────────────────────────────────────────┘
```

---

## 📋 Employee Registration Flow

```
┌─────────────────────────────────────────────────────────────┐
│ 1. USER CLICKS "EMPLOYEE" IN NAVBAR                         │
└─────────────────────────────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────────┐
│ 2. SUBMENU APPEARS WITH TWO OPTIONS                         │
│    • Login (for existing employees)                         │
│    • Register (for new employees)                           │
└─────────────────────────────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────────┐
│ 3. USER CLICKS "REGISTER"                                   │
└─────────────────────────────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────────┐
│ 4. REGISTER.HTML LOADS WITH FORM                            │
│    Form Fields:                                             │
│    • First Name (required)                                  │
│    • Last Name (required)                                   │
│    • Email (required, unique)                               │
│    • Password (required, hashed)                            │
│    • Department (required)                                  │
│    • Position (required)                                    │
│    • Phone (optional)                                       │
└─────────────────────────────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────────┐
│ 5. USER FILLS FORM AND CLICKS "REGISTER"                    │
└─────────────────────────────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────────┐
│ 6. FRONTEND VALIDATION (register.html script)               │
│    • Collect form data                                      │
│    • Create JSON object with all fields                     │
│    • Send POST to /api/auth/register                        │
└─────────────────────────────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────────┐
│ 7. BACKEND PROCESSING (routes/auth.js)                      │
│    • Receive JSON data                                      │
│    • Validate required fields                               │
│    • Check email uniqueness                                 │
│    • Create Employee model instance                         │
└─────────────────────────────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────────┐
│ 8. EMPLOYEE MODEL (models/Employee.js)                      │
│    Pre-save hooks execute:                                  │
│    A. Password Hash Hook:                                   │
│       • Hash password with bcryptjs (10 salt)               │
│    B. Auto-Increment ID Hook:                               │
│       • Query Counter collection                            │
│       • Increment seq by 1                                  │
│       • Calculate: 10000 + (seq % 90000)                    │
│       • Generate 5-digit ID (e.g., 12345)                   │
│       • Assign to employeeId field                          │
└─────────────────────────────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────────┐
│ 9. SAVE TO MONGODB (MongoDB Atlas)                          │
│    Employee Record JSON:                                    │
│    {                                                        │
│      _id: ObjectId("..."),                                  │
│      employeeId: "12345",        ✅ Auto-generated          │
│      firstName: "John",                                     │
│      lastName: "Doe",                                       │
│      email: "john.doe@company.com",                         │
│      password: "$2a$10$hashed...",    ✅ Encrypted          │
│      department: "Engineering",                             │
│      position: "Senior Developer",                          │
│      phone: "+1 (555) 123-4567",                            │
│      hireDate: ISODate("2025-11-29"),                       │
│      isActive: true,                                        │
│      createdAt: ISODate("2025-11-29"),  ✅ Timestamp        │
│      updatedAt: ISODate("2025-11-29")   ✅ Timestamp        │
│    }                                                        │
└─────────────────────────────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────────┐
│ 10. GENERATE JWT TOKEN (routes/auth.js)                     │
│     • Token includes: employeeId, email                     │
│     • Signed with JWT_SECRET                                │
│     • Expires in 24 hours                                   │
│     • Returned to frontend                                  │
└─────────────────────────────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────────┐
│ 11. RETURN SUCCESS RESPONSE (201 Created)                   │
│     {                                                       │
│       message: "Employee registered successfully",          │
│       employeeId: "12345",        ✅ Display to user       │
│       token: "eyJhbGci...",       ✅ Store in localStorage │
│       employee: { ... }            ✅ Employee data         │
│     }                                                       │
└─────────────────────────────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────────┐
│ 12. FRONTEND SUCCESS HANDLING (register.html)               │
│     • Display message with Employee ID                      │
│     • Save token to localStorage                            │
│     • Save employeeId to localStorage                       │
│     • Save employee info to localStorage                    │
│     • Show: "Registration successful!                       │
│             Your Employee ID: 12345"                        │
│     • After 2 seconds: Redirect to dashboard                │
└─────────────────────────────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────────┐
│ 13. DASHBOARD LOADS (dashboard.html)                        │
│     • Retrieve employeeId from localStorage                 │
│     • Display employee information                          │
│     • Ready for timesheet and other functions               │
└─────────────────────────────────────────────────────────────┘
```

---

## 🔐 Security Layers

### **1. Frontend Validation** (register.html)
```javascript
// Collect form data in JSON format
const formData = {
  firstName: "John",
  lastName: "Doe",
  email: "john.doe@company.com",
  password: "SecurePassword123!",
  department: "Engineering",
  position: "Senior Developer",
  phone: "+1 (555) 123-4567"
};
```

### **2. Backend Validation** (routes/auth.js)
```javascript
// Check required fields
if (!firstName || !lastName || !email || !password) {
  return res.status(400).json({ error: 'Missing required fields' });
}

// Check email uniqueness
const existingEmployee = await Employee.findOne({ email });
if (existingEmployee) {
  return res.status(400).json({ error: 'Email already registered' });
}
```

### **3. Password Encryption** (models/Employee.js)
```javascript
// Hash password before saving to DB
const salt = await bcrypt.genSalt(10);
this.password = await bcrypt.hash(this.password, salt);
// Result: $2a$10$... (never stored in plain text)
```

### **4. Database Level** (MongoDB)
```javascript
// Unique constraint on email
email: {
  type: String,
  required: true,
  unique: true,
  lowercase: true
}

// Unique constraint on employeeId
employeeId: {
  type: String,
  unique: true,
  required: true
}
```

---

## 📊 Employee Record Example (JSON)

**MongoDB Collection: employees**

```json
{
  "_id": {
    "$oid": "507f1f77bcf86cd799439011"
  },
  "employeeId": "12345",
  "firstName": "John",
  "lastName": "Doe",
  "email": "john.doe@company.com",
  "password": "$2a$10$K7L9M8X1P2Q3R4S5T6U7V8W9X0Y1Z2/abc.def.ghi",
  "department": "Engineering",
  "position": "Senior Developer",
  "phone": "+1 (555) 123-4567",
  "hireDate": {
    "$date": "2025-11-29T12:00:00.000Z"
  },
  "isActive": true,
  "createdAt": {
    "$date": "2025-11-29T12:00:00.000Z"
  },
  "updatedAt": {
    "$date": "2025-11-29T12:00:00.000Z"
  },
  "__v": 0
}
```

---

## 🔄 Login Flow (Similar but Simpler)

```
User Clicks Employee → Login
           ↓
Enters Email & Password
           ↓
POST /api/auth/login
           ↓
Backend finds employee by email
           ↓
Compare password (bcryptjs)
           ↓
If match: Generate JWT token
           ↓
Return employeeId + token
           ↓
Save to localStorage
           ↓
Redirect to Dashboard
```

---

## 🛠️ Files Changed

| File | Changes | Status |
|------|---------|--------|
| `index.html` | Added Employee submenu | ✅ Modified |
| `styles.css` | Added submenu styling | ✅ Modified |
| `script.js` | Added submenu toggle JS | ✅ Modified |
| `server.js` | Updated PORT to 8000 | ✅ Modified |
| `models/Employee.js` | Auto-increment ID system | ✓ Existing |
| `routes/auth.js` | Registration/Login handlers | ✓ Existing |
| `public/register.html` | Registration form | ✓ Existing |
| `public/login.html` | Login form | ✓ Existing |

---

## 🚀 Quick Start

### 1. **Set up .env file:**
```bash
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/shoolintechllc
JWT_SECRET=your-secret-key-change-in-production
PORT=8000
NODE_ENV=production
```

### 2. **Install dependencies:**
```bash
npm install
```

### 3. **Start the server:**
```bash
npm start
```

### 4. **Access the website:**
```
http://localhost:8000
```

### 5. **Test Employee Registration:**
- Click **Employee** menu
- Select **Register**
- Fill form and submit
- Note the Employee ID
- Login with those credentials

---

## ✅ Verification Checklist

- [ ] Employee menu appears in navbar
- [ ] Submenu toggles on click
- [ ] Registration page loads from submenu
- [ ] Login page loads from submenu
- [ ] Employee ID generated on registration
- [ ] Employee record in MongoDB with all fields
- [ ] Password encrypted in database
- [ ] Email uniqueness enforced
- [ ] JWT token issued on registration
- [ ] Login works with registered account
- [ ] Dashboard loads after login
- [ ] Employee data persists in localStorage

---

## 📚 Documentation

See additional guides:
- **EMPLOYEE_REGISTRATION_GUIDE.md** - Detailed setup and API docs
- **IMPLEMENTATION_UPDATES.md** - Summary of changes
- **QUICK_START.md** - Getting started guide

---

**Implementation Complete! ✅**

Your ShoolinTech website now has a fully integrated Employee Portal with MongoDB support and auto-generated Employee IDs.
