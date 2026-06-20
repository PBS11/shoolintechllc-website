# Employee Registration & Login Guide

## Overview

The ShoolinTech website now includes an Employee submenu in the top navigation bar that provides access to Employee Login and Registration pages. All registration data is saved to MongoDB in JSON format with auto-generated unique 5-digit Employee IDs.

---

## Features

### 1. **Employee Submenu in Navigation**
- Located in the top navigation bar next to Contact
- Dropdown menu with two options:
  - **Login**: For existing employees
  - **Register**: For new employee registration
- Responsive design with hover effects

### 2. **Employee Registration**
- Creates employee records with the following fields:
  - First Name
  - Last Name
  - Email (unique identifier for account)
  - Password (hashed with bcryptjs for security)
  - Department
  - Position
  - Phone Number (optional)

### 3. **Auto-Generated Employee ID**
- Unique 5-digit identifier (10000-99999)
- Automatically generated on registration
- Stored in MongoDB with employee record
- Displayed to user upon successful registration

### 4. **MongoDB Integration**
- Employee records saved in JSON format
- All employee data persisted in MongoDB Atlas
- Automatic timestamps (createdAt, updatedAt)
- Data validation at model level

---

## Employee Record JSON Structure

When an employee registers, the following JSON record is saved to MongoDB:

```json
{
  "_id": "ObjectId",
  "employeeId": "12345",
  "firstName": "John",
  "lastName": "Doe",
  "email": "john.doe@company.com",
  "password": "$2a$10$hashed_password_here",
  "department": "Engineering",
  "position": "Senior Developer",
  "phone": "+1 (555) 123-4567",
  "hireDate": "2025-11-29T12:00:00.000Z",
  "isActive": true,
  "createdAt": "2025-11-29T12:00:00.000Z",
  "updatedAt": "2025-11-29T12:00:00.000Z"
}
```

---

## Setup Instructions

### 1. **Configure MongoDB Atlas**

Set up your MongoDB Atlas connection in the `.env` file:

```bash
# In your .env file
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/shoolintechllc
JWT_SECRET=your-secret-key-here
PORT=8000
NODE_ENV=production
```

### 2. **Install Dependencies**

```bash
npm install
```

### 3. **Start the Server**

```bash
npm start
```

The server will run on `http://localhost:8000`

### 4. **Access the Website**

Navigate to `http://localhost:8000` and look for the **Employee** menu in the navigation bar.

---

## Usage

### **Employee Registration Flow**

1. Click **Employee** menu in top navigation
2. Select **Register** from dropdown
3. Fill in registration form:
   - First Name
   - Last Name
   - Email (must be unique)
   - Password (encrypted before storage)
   - Department
   - Position
   - Phone Number (optional)
4. Click **Register**
5. Upon success:
   - Employee ID is generated (e.g., 12345)
   - Record saved to MongoDB
   - Display message with Employee ID
   - Automatically redirected to Dashboard

### **Employee Login Flow**

1. Click **Employee** menu in top navigation
2. Select **Login** from dropdown
3. Enter email and password
4. Click **Login**
5. Upon success:
   - JWT token generated and stored
   - Employee ID saved to localStorage
   - Redirected to Dashboard

---

## API Endpoints

### **POST /api/auth/register**

**Request:**
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john.doe@company.com",
  "password": "SecurePassword123!",
  "department": "Engineering",
  "position": "Senior Developer",
  "phone": "+1 (555) 123-4567"
}
```

**Response (Success - 201):**
```json
{
  "message": "Employee registered successfully",
  "employeeId": "12345",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "employee": {
    "_id": "507f1f77bcf86cd799439011",
    "employeeId": "12345",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john.doe@company.com",
    "department": "Engineering",
    "position": "Senior Developer",
    "phone": "+1 (555) 123-4567",
    "hireDate": "2025-11-29T12:00:00.000Z",
    "isActive": true,
    "createdAt": "2025-11-29T12:00:00.000Z",
    "updatedAt": "2025-11-29T12:00:00.000Z"
  }
}
```

### **POST /api/auth/login**

**Request:**
```json
{
  "email": "john.doe@company.com",
  "password": "SecurePassword123!"
}
```

**Response (Success - 200):**
```json
{
  "message": "Login successful",
  "employeeId": "12345",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "employee": {
    "_id": "507f1f77bcf86cd799439011",
    "employeeId": "12345",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john.doe@company.com",
    "department": "Engineering",
    "position": "Senior Developer",
    "phone": "+1 (555) 123-4567",
    "hireDate": "2025-11-29T12:00:00.000Z",
    "isActive": true
  }
}
```

---

## Database Schema (MongoDB)

**Collection:** `employees`

| Field | Type | Required | Unique | Default | Notes |
|-------|------|----------|--------|---------|-------|
| _id | ObjectId | Yes | Yes | - | MongoDB auto ID |
| employeeId | String | Yes | Yes | Auto-generated | 5-digit ID (10000-99999) |
| firstName | String | Yes | No | - | Employee first name |
| lastName | String | Yes | No | - | Employee last name |
| email | String | Yes | Yes | - | Unique email for login |
| password | String | Yes | No | - | Hashed with bcryptjs |
| department | String | Yes | No | - | Department name |
| position | String | Yes | No | - | Job position |
| phone | String | No | No | - | Contact phone number |
| hireDate | Date | No | No | Current date | Date of hire |
| isActive | Boolean | No | No | true | Employee status |
| createdAt | Date | No | No | Current date | Record creation timestamp |
| updatedAt | Date | No | No | Current date | Record update timestamp |

---

## Security Features

### **Password Security**
- Passwords are hashed using bcryptjs with 10 salt rounds
- Never stored in plain text
- Compared securely during login

### **JWT Authentication**
- JWT tokens issued on successful registration/login
- 24-hour expiration
- Token stored in localStorage (client-side)
- Used for authenticated API requests

### **Data Validation**
- All required fields validated before saving
- Email uniqueness enforced at database level
- Email format validation on client and server

### **Error Handling**
- Duplicate email detection
- Invalid password error messages
- Inactive employee account checks
- Comprehensive error responses

---

## Testing Employee Registration

### **Test Registration**

1. Open `http://localhost:8000`
2. Click **Employee** → **Register**
3. Fill in the form with test data
4. Submit the form
5. Check for:
   - Success message with Employee ID
   - Redirect to Dashboard
   - Record in MongoDB

### **Test Login**

1. Click **Employee** → **Login**
2. Use the email and password from registration
3. Check for:
   - Success message
   - Redirect to Dashboard
   - Token in localStorage

### **Verify MongoDB Data**

```javascript
// In MongoDB Atlas Cluster:
// Navigate to Collections > employees
// You should see the employee record with all fields
```

---

## Troubleshooting

### **Issue: "Email already registered"**
- The email is already in use
- Use a different email address for registration

### **Issue: "Missing required fields"**
- All marked fields must be filled (except phone)
- Check form validation messages

### **Issue: MongoDB Connection Error**
- Verify MONGODB_URI in `.env` file
- Check MongoDB Atlas credentials
- Ensure IP is whitelisted in MongoDB Atlas security

### **Issue: Employee ID not displayed**
- Refresh the page
- Check browser console for errors
- Verify MongoDB connection is working

---

## Files Modified/Created

### **Modified Files:**
- `index.html` - Added Employee submenu to navigation
- `styles.css` - Added submenu styling
- `script.js` - Added submenu toggle functionality
- `server.js` - Updated default PORT to 8000

### **Existing Backend Files:**
- `models/Employee.js` - Handles auto-incrementing Employee IDs
- `routes/auth.js` - Registration and login endpoints
- `public/register.html` - Registration form
- `public/login.html` - Login form

---

## Next Steps

1. **Set up MongoDB Atlas connection** with your credentials
2. **Test employee registration** with sample data
3. **Verify database records** in MongoDB
4. **Deploy** to production with proper environment variables
5. **Monitor** employee registrations and logins

---

## Support

For issues or questions:
1. Check the troubleshooting section above
2. Review MongoDB Atlas logs
3. Check server console for error messages
4. Verify all environment variables are set correctly
