# Employee Portal - Quick Start Guide

## 🚀 What Was Created

A complete employee portal system with:
- ✅ **Login & Registration Module** - JWT-based authentication
- ✅ **Auto-generated 5-Digit Employee IDs** - Unique identifiers (10000-99999)
- ✅ **Weekly Timesheet Entry** - Hours tracking with project codes
- ✅ **Federal Holiday Integration** - US calendar with 11 federal holidays
- ✅ **MongoDB Atlas Ready** - Database connectivity configured
- ✅ **Employee Dashboard** - Quick stats and profile management
- ✅ **Security** - Password hashing with bcryptjs, JWT tokens

## 📁 File Structure

```
├── server.js                          # Main Express server
├── package.json                       # Dependencies
├── .env.example                       # Environment template
│
├── models/
│   ├── Employee.js                   # Employee schema + auto-ID generation
│   └── Timesheet.js                  # Timesheet with entries schema
│
├── routes/
│   ├── auth.js                       # Login/Register endpoints
│   ├── timesheet.js                  # Timesheet CRUD operations
│   └── employee.js                   # Employee profile endpoints
│
├── utils/
│   ├── federalHolidays.js           # US federal calendar (all 11 holidays)
│   └── employeeIdGenerator.js        # 5-digit ID generator
│
└── public/
    ├── login.html                    # Employee login page
    ├── register.html                 # New employee registration
    ├── dashboard.html                # Employee dashboard
    └── timesheet.html                # Weekly timesheet entry
```

## 🎯 Getting Started

### Step 1: Install Dependencies
```bash
cd /Users/pratikshah/Documents/Prateek/Apps/shoolintechllc-website
npm install
```

### Step 2: Setup MongoDB Atlas
1. Go to https://www.mongodb.com/cloud/atlas
2. Create a new cluster (Free Tier available)
3. Create a database user (remember username & password)
4. Get your connection string
5. Create `.env` file:
```bash
cp .env.example .env
```

6. Edit `.env` and add your connection string:
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/shoolintechllc?retryWrites=true&w=majority
JWT_SECRET=your_secret_key_here_make_it_strong
PORT=5000
```

### Step 3: Start the Server
```bash
npm start
```

Server runs at: **http://localhost:5000**

## 🔐 Testing the System

### 1. Register as Employee
- Visit: http://localhost:5000/register.html
- Fill form with:
  - First Name: John
  - Last Name: Doe
  - Email: john@company.com
  - Password: Test123!
  - Department: Engineering
  - Position: Senior Developer
- ✅ **Auto-generated Employee ID**: 10001 (or incremental)
- Redirected to dashboard

### 2. Login
- Visit: http://localhost:5000/login.html
- Use registered credentials
- JWT token saved in localStorage

### 3. Create Timesheet
- From dashboard, click "Start New Timesheet"
- View current week
- Enter hours for each day:
  - **Weekends**: Automatically disabled (read-only)
  - **Federal Holidays**: Marked with holiday name, cannot edit
  - **Regular Days**: Fill hours, project code, and task description
- Submit timesheet

### 4. Track Status
- Dashboard shows:
  - Total timesheets
  - Submitted count
  - Approved count
  - Pending count

## 🗓️ Federal Holidays Included

The system automatically recognizes:
- New Year's Day (Jan 1)
- MLK Day (3rd Monday in January)
- Presidents' Day (3rd Monday in February)
- Memorial Day (Last Monday in May)
- Juneteenth (June 19)
- Independence Day (July 4)
- Labor Day (1st Monday in September)
- Columbus Day (2nd Monday in October)
- Veterans Day (Nov 11)
- Thanksgiving (4th Thursday in November)
- Christmas Day (Dec 25)

Holidays are:
- ✅ Automatically marked in timesheet
- ✅ Cannot be edited
- ✅ Show holiday name
- ✅ Counted in summary

## 👤 Employee ID System

### How It Works:
- **Format**: 5-digit numbers (10000-99999)
- **Auto-generated**: When employee registers
- **Unique**: Guaranteed no duplicates
- **Sequential**: First employee = 10001, second = 10002, etc.
- **Persistent**: Stored in MongoDB

### Example:
```
Employee 1: John Doe → ID: 10001
Employee 2: Jane Smith → ID: 10002
Employee 100: Bob Wilson → ID: 10100
```

## 📊 Timesheet Features

### Entry Types:
- **Regular Days** (Mon-Fri, non-holiday): Editable
- **Weekends** (Sat-Sun): Auto-detected, read-only
- **Federal Holidays**: Auto-marked, read-only with holiday name

### Data Captured:
- Hours worked (0-24)
- Project code (e.g., PROJ-001)
- Task description
- Notes
- Auto-calculated totals

### Status Workflow:
```
Draft → Submit → Approved ✓
         ↓
      Pending Review
         ↓
       Rejected → Re-edit & Re-submit
```

## 🔒 Security Features

- **Password Hashing**: Bcryptjs (10 salt rounds)
- **JWT Token**: 24-hour expiration
- **Email Validation**: Unique per employee
- **Data Isolation**: Employees only see their data
- **Authorization**: Token required for all endpoints

## 🌐 API Endpoints

### Authentication
```
POST /api/auth/register          # New employee registration
POST /api/auth/login             # Employee login
GET  /api/auth/verify            # Verify token
POST /api/auth/logout            # Logout
```

### Timesheet
```
POST /api/timesheet/initialize           # Create weekly timesheet
GET  /api/timesheet                      # Get all timesheets
GET  /api/timesheet/:weekStartDate       # Get specific week
PUT  /api/timesheet/:id/entry/:index     # Update entry
PUT  /api/timesheet/:id/submit           # Submit timesheet
```

### Employee
```
GET  /api/employee/profile               # Get employee info
PUT  /api/employee/profile               # Update employee info
GET  /api/employee/:employeeId           # Get employee by ID
```

## 📝 Sample Registration Payload

```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@shoolintechllc.com",
  "password": "SecurePass123!",
  "department": "Engineering",
  "position": "Senior Developer",
  "phone": "+1-555-123-4567"
}
```

Response:
```json
{
  "message": "Employee registered successfully",
  "employeeId": "10001",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "employee": {
    "employeeId": "10001",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@shoolintechllc.com",
    "department": "Engineering",
    "position": "Senior Developer"
  }
}
```

## 🔄 Timesheet Entry Sample

```json
{
  "employeeId": "10001",
  "weekStartDate": "2024-01-08",
  "entries": [
    {
      "date": "2024-01-08",
      "dayOfWeek": "Monday",
      "hoursWorked": 8,
      "projectCode": "PROJ-001",
      "taskDescription": "Developed login feature",
      "isHoliday": false,
      "isWeekend": false
    },
    {
      "date": "2024-01-09",
      "dayOfWeek": "Tuesday",
      "hoursWorked": 8,
      "projectCode": "PROJ-001",
      "taskDescription": "API integration",
      "isHoliday": false,
      "isWeekend": false
    }
  ],
  "totalHoursWorked": 40,
  "status": "draft"
}
```

## 🛠️ Development Mode

For development with auto-reload:
```bash
npm run dev
```

## 📚 Complete Documentation

See `EMPLOYEE_PORTAL_README.md` for:
- Full API documentation
- Data models
- Customization guide
- Troubleshooting
- Future enhancements

## ❓ Common Questions

**Q: How are employee IDs generated?**
A: Automatically when an employee registers, 5-digit format (10000-99999), stored in MongoDB.

**Q: How are federal holidays detected?**
A: System calculates holidays dynamically based on year, all 11 US federal holidays included.

**Q: Can employees edit holidays?**
A: No, holidays are read-only. Weekends are also automatically disabled.

**Q: How long are JWT tokens valid?**
A: 24 hours. After expiration, employee must log in again.

**Q: Where is data stored?**
A: MongoDB Atlas cloud database. Connection string in `.env`

**Q: Can multiple employees have the same email?**
A: No, email is unique. System prevents duplicate registrations.

**Q: What happens to submitted timesheets?**
A: They cannot be edited until approved/rejected by manager.

## 🚨 Troubleshooting

### Server won't start
```bash
# Check if port 5000 is in use
lsof -i :5000

# Kill process if needed
kill -9 <PID>
```

### MongoDB connection error
- Verify connection string in `.env`
- Check if IP is whitelisted in Atlas
- Verify database user credentials

### Tokens not working
- Clear browser localStorage: `localStorage.clear()`
- Log in again
- Check token expiration in `routes/auth.js`

### Federal holidays not showing
- Check date format (should match system date)
- Verify `utils/federalHolidays.js` is loaded
- Check browser console for errors

## 📞 Support

For MongoDB Atlas support: https://www.mongodb.com/docs/atlas/
For Node.js/Express help: https://nodejs.org/docs/

---

**Created for ShoolinTech LLC Employee Portal** ✨
