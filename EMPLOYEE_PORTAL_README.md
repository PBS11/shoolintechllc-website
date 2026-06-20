# ShoolinTech LLC - Employee Portal with Timesheet Management

A comprehensive employee management system with timesheet tracking, federal holiday integration, and MongoDB Atlas database connectivity.

## Features

### ✅ Authentication Module
- **Employee Registration**: New employees can self-register with department and position details
- **Employee Login**: Secure JWT-based authentication
- **Session Management**: Token-based session with 24-hour expiration
- **Password Hashing**: Bcryptjs for secure password storage

### ✅ Employee Management
- **Auto-Generated Employee IDs**: Unique 5-digit IDs (10000-99999)
- **Employee Profiles**: Manage employee information including department, position, phone
- **Profile Updates**: Employees can update their contact information

### ✅ Timesheet Module
- **Weekly Timesheet Entry**: Create and manage weekly timesheets
- **Hours Tracking**: Log hours worked per day with project codes and task descriptions
- **Weekend Detection**: Automatically identifies weekends (non-editable)
- **Federal Holiday Integration**: Integrates US federal calendar holidays
- **Holiday Protection**: Holiday entries are marked and cannot be edited
- **Timesheet Status**: Track status (draft, submitted, approved, rejected)
- **Timesheet History**: View all past timesheets with submission history

### ✅ Dashboard
- **Employee Dashboard**: Quick overview of profile and timesheet statistics
- **Timesheet Statistics**: View total hours, submitted/approved timesheets
- **Quick Actions**: Easy access to create new timesheets

### ✅ Database Integration
- **MongoDB Atlas Connectivity**: Ready for MongoDB Atlas cloud database
- **Mongoose ORM**: Schema-based data modeling
- **Data Persistence**: All employee and timesheet data persists in MongoDB

## Project Structure

```
shoolintechllc-website/
├── public/
│   ├── login.html              # Employee login page
│   ├── register.html           # Employee registration page
│   ├── dashboard.html          # Employee dashboard
│   ├── timesheet.html          # Timesheet entry page
│   └── styles.css              # Main stylesheet (if needed)
│
├── models/
│   ├── Employee.js             # Employee schema with auto-ID generation
│   └── Timesheet.js            # Timesheet schema with entries
│
├── routes/
│   ├── auth.js                 # Authentication endpoints
│   ├── timesheet.js            # Timesheet management endpoints
│   └── employee.js             # Employee profile endpoints
│
├── utils/
│   ├── federalHolidays.js      # US federal calendar and holiday logic
│   └── employeeIdGenerator.js  # 5-digit Employee ID generator
│
├── server.js                   # Express server setup
├── package.json                # Dependencies
├── .env.example                # Environment variables template
├── .gitignore                  # Git ignore file
└── README.md                   # This file
```

## Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- MongoDB Atlas account (or local MongoDB)
- npm or yarn

### Step 1: Install Dependencies
```bash
npm install
```

### Step 2: Configure Environment Variables
Create a `.env` file in the root directory (copy from `.env.example`):
```bash
cp .env.example .env
```

Edit `.env` with your MongoDB Atlas connection string:
```
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<database>?retryWrites=true&w=majority
JWT_SECRET=your_super_secret_jwt_key
PORT=5000
NODE_ENV=development
```

### Step 3: Setup MongoDB Atlas
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a new cluster
3. Create a database user with credentials
4. Whitelist your IP address
5. Get your connection string
6. Add the connection string to `.env`

### Step 4: Run the Server
```bash
npm start
```

For development with auto-reload:
```bash
npm run dev
```

The server will be running at `http://localhost:5000`

## API Endpoints

### Authentication Endpoints

**Register Employee**
```
POST /api/auth/register
Content-Type: application/json

{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@company.com",
  "password": "securepassword",
  "department": "Engineering",
  "position": "Senior Developer",
  "phone": "+1-555-123-4567"
}

Response:
{
  "message": "Employee registered successfully",
  "employeeId": "10001",
  "token": "jwt_token_here",
  "employee": { /* employee object */ }
}
```

**Employee Login**
```
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@company.com",
  "password": "securepassword"
}

Response:
{
  "message": "Login successful",
  "employeeId": "10001",
  "token": "jwt_token_here",
  "employee": { /* employee object */ }
}
```

### Timesheet Endpoints

**Initialize/Create Timesheet**
```
POST /api/timesheet/initialize
Authorization: Bearer <token>
Content-Type: application/json

{
  "weekStartDate": "2024-01-01"
}
```

**Get Timesheet for Week**
```
GET /api/timesheet/:weekStartDate
Authorization: Bearer <token>
```

**Get All Timesheets**
```
GET /api/timesheet
Authorization: Bearer <token>
```

**Update Timesheet Entry**
```
PUT /api/timesheet/:timesheetId/entry/:entryIndex
Authorization: Bearer <token>
Content-Type: application/json

{
  "hoursWorked": 8,
  "projectCode": "PROJ-001",
  "taskDescription": "Developed feature X",
  "notes": "On schedule"
}
```

**Submit Timesheet**
```
PUT /api/timesheet/:timesheetId/submit
Authorization: Bearer <token>
```

### Employee Endpoints

**Get Employee Profile**
```
GET /api/employee/profile
Authorization: Bearer <token>
```

**Update Employee Profile**
```
PUT /api/employee/profile
Authorization: Bearer <token>
Content-Type: application/json

{
  "phone": "+1-555-999-8888"
}
```

## Employee ID Generation

The system automatically generates unique 5-digit Employee IDs (10000-99999) when a new employee registers.

### How It Works:
1. Employee registers with their information
2. Server creates a counter in MongoDB
3. Counter increments for each new employee
4. Employee ID = 10000 + (counter % 90000)
5. This ensures IDs are always within 5-digit range (10000-99999)

### Example Employee IDs:
- First employee: 10001
- Second employee: 10002
- ...
- 90,000th employee: 19999 (resets and continues)

## Federal Holidays

The system includes all US federal holidays:
- New Year's Day (Jan 1)
- Martin Luther King Jr. Day (3rd Monday in January)
- Presidents' Day (3rd Monday in February)
- Memorial Day (Last Monday in May)
- Juneteenth (June 19)
- Independence Day (July 4)
- Labor Day (1st Monday in September)
- Columbus Day (2nd Monday in October)
- Veterans Day (Nov 11)
- Thanksgiving Day (4th Thursday in November)
- Christmas Day (Dec 25)

### Holiday Features:
- Automatically marked in timesheet entries
- Cannot be edited by employees
- Displayed with holiday name
- Visual indicator (different background color)

## Data Models

### Employee Schema
```javascript
{
  employeeId: String (unique, 5-digit),
  firstName: String (required),
  lastName: String (required),
  email: String (required, unique),
  password: String (hashed, required),
  department: String (required),
  position: String (required),
  phone: String (optional),
  hireDate: Date (default: now),
  isActive: Boolean (default: true),
  createdAt: Date (default: now),
  updatedAt: Date (default: now)
}
```

### Timesheet Schema
```javascript
{
  employeeId: String (indexed, required),
  employeeName: String (required),
  weekStartDate: Date (required),
  weekEndDate: Date (required),
  entries: [
    {
      date: Date,
      dayOfWeek: String,
      hoursWorked: Number (0-24),
      projectCode: String,
      taskDescription: String,
      isHoliday: Boolean,
      holidayName: String,
      isWeekend: Boolean,
      notes: String
    }
  ],
  totalHoursWorked: Number (auto-calculated),
  totalHolidaysInWeek: Number (auto-calculated),
  status: String (draft|submitted|approved|rejected),
  submittedAt: Date,
  approvedAt: Date,
  approvedBy: String,
  comments: String,
  createdAt: Date,
  updatedAt: Date
}
```

## Usage Flow

### For New Employees:
1. Navigate to `/register.html`
2. Fill in registration form
3. System auto-generates 5-digit Employee ID
4. Employee is redirected to dashboard
5. Receive JWT token (valid for 24 hours)

### For Logging In:
1. Navigate to `/login.html`
2. Enter email and password
3. Receive JWT token
4. Redirected to dashboard

### For Timesheet Entry:
1. From dashboard, click "Start New Timesheet"
2. System displays current week
3. Fill in hours, project codes, and descriptions for each day
4. Weekends and holidays are automatically marked (read-only)
5. View summary of total hours and holidays
6. Submit timesheet
7. Track submission status in dashboard

## Security

- **Password Hashing**: Bcryptjs with salt rounds = 10
- **JWT Authentication**: Token-based authentication with 24-hour expiration
- **Email Uniqueness**: Ensures one employee per email
- **Employee ID Uniqueness**: Auto-generated and guaranteed unique
- **Authorization**: Protected endpoints require valid JWT token
- **Employee Isolation**: Employees can only access their own data

## Customization

### Adding More Federal Holidays
Edit `utils/federalHolidays.js` to add company-specific holidays or regional holidays.

### Extending Timesheet Fields
Modify `models/Timesheet.js` to add custom fields for your workflow.

### Customizing Employee ID Format
Modify `models/Employee.js` and `utils/employeeIdGenerator.js` to change ID format.

### Styling
Update CSS in HTML files or create a main stylesheet in `public/styles.css`.

## Troubleshooting

### MongoDB Connection Error
- Verify connection string in `.env`
- Check if IP is whitelisted in MongoDB Atlas
- Ensure database credentials are correct

### Token Expired
- Tokens expire after 24 hours
- User must log in again to get new token
- Can modify expiration in `routes/auth.js`

### Employee ID Not Generating
- Check MongoDB connection
- Verify Counter collection exists in database
- Check server logs for errors

## Future Enhancements

- [ ] Manager approval workflow
- [ ] Email notifications for timesheet submission
- [ ] Bulk timesheet import/export
- [ ] Time off management (vacation, sick leave)
- [ ] Expense tracking
- [ ] Payroll integration
- [ ] Mobile app
- [ ] Advanced analytics and reports
- [ ] Two-factor authentication
- [ ] API documentation with Swagger

## Support & Troubleshooting

For issues, check:
1. Server logs (terminal)
2. Browser console (F12 → Console)
3. Network tab in browser DevTools
4. MongoDB Atlas cluster logs

## License

© 2025 ShoolinTech LLC. All rights reserved.

## Contact

For technical support, contact: support@shoolintechllc.com
