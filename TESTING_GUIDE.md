# 🧪 Employee Portal - Testing Guide

Complete testing guide for the Employee Portal system.

## 📋 Prerequisites

- Node.js installed
- MongoDB Atlas setup (with connection string)
- `.env` file configured
- Server running: `npm start`

## 🎯 Testing Scenarios

### Test 1: Employee Registration

**Steps:**
1. Go to http://localhost:5000/register.html
2. Fill form with:
   ```
   First Name: John
   Last Name: Doe
   Email: john@test.com
   Password: Test@123456
   Department: Engineering
   Position: Senior Developer
   Phone: +1-555-123-4567
   ```
3. Click "Register"

**Expected Results:**
- ✅ Form submits successfully
- ✅ Success message shows with Employee ID (e.g., 10001)
- ✅ Automatically logged in
- ✅ Redirected to dashboard
- ✅ Employee ID displayed on dashboard

**Data to Verify in MongoDB:**
```javascript
db.employees.findOne({ email: "john@test.com" })
// Should see:
// - employeeId: "10001"
// - firstName: "John"
// - email: "john@test.com"
// - password: (hashed, not plain text)
```

---

### Test 2: Duplicate Email Prevention

**Steps:**
1. Go to http://localhost:5000/register.html
2. Try to register with same email: john@test.com
3. Fill form and click "Register"

**Expected Results:**
- ✅ Error message: "Email already registered"
- ✅ Form remains on page
- ✅ No redirect

---

### Test 3: Employee Login

**Steps:**
1. Go to http://localhost:5000/login.html
2. Enter credentials:
   ```
   Email: john@test.com
   Password: Test@123456
   ```
3. Click "Login"

**Expected Results:**
- ✅ Success message appears
- ✅ Redirected to dashboard
- ✅ Employee info displays (name, ID, department)
- ✅ JWT token saved in localStorage

**Browser Developer Tools:**
- Open DevTools (F12)
- Go to Console
- Type: `localStorage.getItem('token')`
- Should return JWT token starting with "eyJ..."

---

### Test 4: Incorrect Login

**Steps:**
1. Go to http://localhost:5000/login.html
2. Enter wrong password:
   ```
   Email: john@test.com
   Password: WrongPassword
   ```
3. Click "Login"

**Expected Results:**
- ✅ Error message: "Invalid email or password"
- ✅ Page stays on login
- ✅ No token saved

---

### Test 5: Session Persistence

**Steps:**
1. Login successfully
2. Close the browser tab completely
3. Open new tab and go to http://localhost:5000/dashboard.html

**Expected Results:**
- ✅ Dashboard loads without login required
- ✅ Employee info displays
- ✅ Token still valid in localStorage

---

### Test 6: Create Timesheet - Current Week

**Steps:**
1. From dashboard, click "Start New Timesheet"
2. Verify week dates display correctly

**Expected Results:**
- ✅ Week starts on Monday
- ✅ Week ends on Sunday
- ✅ Current week date shown (e.g., "Jan 8, 2024 - Jan 14, 2024")
- ✅ All 7 days visible in table

---

### Test 7: Timesheet Entry Fields

**Steps:**
1. On timesheet page, locate each day row
2. Verify columns: Date, Day, Hours, Project Code, Task, Notes

**Expected Results:**
- ✅ All 7 days (Monday-Sunday) listed
- ✅ Input fields visible for editable days
- ✅ Correct day names displayed

---

### Test 8: Weekend Detection

**Steps:**
1. On timesheet page, find Saturday and Sunday rows
2. Try to click on the Hours field

**Expected Results:**
- ✅ Saturday row has "🚫 Weekend" status
- ✅ Sunday row has "🚫 Weekend" status
- ✅ Input fields are disabled (grayed out)
- ✅ Cannot enter data in these fields

**Data in Database:**
```javascript
db.timesheets.findOne({})
// Entry for Saturday should have:
// - isWeekend: true
// - isHoliday: false (unless it's also a holiday)
```

---

### Test 9: Federal Holiday Detection

**Steps:**
1. Create timesheet for a week containing a federal holiday
2. Example: Week containing July 4th (Independence Day)
3. Look at July 4th row

**Expected Results:**
- ✅ July 4th shows "🎉 Holiday" status
- ✅ Holiday name displays: "Independence Day"
- ✅ Input fields are disabled
- ✅ Cannot edit hours

**Data in Database:**
```javascript
db.timesheets.findOne({})
// Entry for holiday should have:
// - isHoliday: true
// - holidayName: "Independence Day"
// - isWeekend: false (if it falls on weekday)
```

---

### Test 10: Test All Holidays

**Steps:**
1. Create timesheets for weeks containing each federal holiday
2. Verify each holiday is marked

**Holidays to Test:**
```
✅ Jan 1 - New Year's Day
✅ 3rd Monday Jan - MLK Day
✅ 3rd Monday Feb - Presidents' Day
✅ Last Monday May - Memorial Day
✅ June 19 - Juneteenth
✅ July 4 - Independence Day
✅ 1st Monday Sept - Labor Day
✅ 2nd Monday Oct - Columbus Day
✅ Nov 11 - Veterans Day
✅ 4th Thursday Nov - Thanksgiving
✅ Dec 25 - Christmas Day
```

**Expected Results:**
- ✅ All holidays marked correctly
- ✅ Cannot edit on holidays

---

### Test 11: Enter Hours on Regular Day

**Steps:**
1. On timesheet, find Monday (regular day)
2. Click Hours field
3. Enter: 8
4. Enter Project Code: PROJ-001
5. Enter Task: Developed login feature
6. Enter Notes: On schedule

**Expected Results:**
- ✅ All fields accept input
- ✅ Values saved locally
- ✅ Summary updates: "Total Hours Worked: 8"

---

### Test 12: Hours Validation

**Steps:**
1. Enter invalid hours:
   - Click Hours field
   - Try to enter: 25 (more than 24)
   - Try to enter: -5 (negative)

**Expected Results:**
- ✅ Field limits to 0-24 range
- ✅ Invalid values rejected

---

### Test 13: Multiple Days Entry

**Steps:**
1. Enter data for multiple days:
   ```
   Monday: 8 hours - PROJ-001
   Tuesday: 8 hours - PROJ-001
   Wednesday: 8 hours - PROJ-002
   Thursday: 8 hours - PROJ-002
   Friday: 7 hours - PROJ-001
   ```

**Expected Results:**
- ✅ All entries saved
- ✅ Summary shows: "Total Hours Worked: 39"
- ✅ Summary shows: "Working Days: 5"

---

### Test 14: Submit Timesheet

**Steps:**
1. Fill in timesheet entries (at least one day)
2. Click "Submit Timesheet" button

**Expected Results:**
- ✅ Success message: "Timesheet submitted successfully"
- ✅ Redirects to dashboard after 1.5 seconds
- ✅ Timesheet status shows "submitted"

**Data in Database:**
```javascript
db.timesheets.findOne({})
// Should have:
// - status: "submitted"
// - submittedAt: (current date/time)
```

---

### Test 15: Cannot Edit Submitted Timesheet

**Steps:**
1. Submit a timesheet
2. Try to navigate back to that timesheet
3. Try to edit any field

**Expected Results:**
- ✅ Fields are disabled (grayed out)
- ✅ "Submit Timesheet" button is hidden
- ✅ Cannot modify submitted timesheet

---

### Test 16: Dashboard Statistics

**Steps:**
1. Register multiple employees (or create multiple timesheets)
2. Submit some timesheets
3. View dashboard

**Expected Results:**
- ✅ Total Timesheets count accurate
- ✅ Submitted count accurate
- ✅ Approved count accurate (0 if none approved)
- ✅ Pending count accurate

---

### Test 17: Timesheet History

**Steps:**
1. Create multiple timesheets (different weeks)
2. Submit some
3. From dashboard, view "Recent Timesheets"

**Expected Results:**
- ✅ All timesheets listed
- ✅ Most recent first
- ✅ Status badges display correctly
- ✅ Date ranges correct
- ✅ Can view/edit buttons appear

---

### Test 18: Week Navigation

**Steps:**
1. On timesheet page, click "Previous Week"
2. Verify dates change
3. Click "Next Week"
4. Verify dates change
5. Click "Current Week"
6. Verify back to current

**Expected Results:**
- ✅ Dates update correctly
- ✅ Previous week = current date - 7 days
- ✅ Next week = current date + 7 days
- ✅ Weekends/holidays correct for each week

---

### Test 19: Logout

**Steps:**
1. From dashboard/timesheet, click "Logout"
2. Verify redirected to login page
3. Check localStorage is cleared

**Expected Results:**
- ✅ Redirected to http://localhost:5000/login.html
- ✅ Browser DevTools: `localStorage.getItem('token')` returns null
- ✅ Cannot access dashboard without login

---

### Test 20: Session Expiration (24 hours)

**Steps:**
1. Login and get token
2. Manually modify token expiration in browser console:
   ```javascript
   // Simulate expired token
   localStorage.setItem('token', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.invalid');
   ```
3. Refresh dashboard page

**Expected Results:**
- ✅ Error received from API
- ✅ Or auto-redirect to login

---

## 🗄️ MongoDB Data Verification

### Check Collections Created

```bash
# Connect to MongoDB Atlas
mongosh "mongodb+srv://admin:password@cluster.mongodb.net"

# List databases
show databases

# Use your database
use shoolintechllc

# List collections
show collections

# Should see:
# - employees
# - timesheets
# - counters
```

### Sample Queries

```javascript
// Find all employees
db.employees.find()

// Find specific employee
db.employees.findOne({ email: "john@test.com" })

// Count employees
db.employees.countDocuments()

// Find timesheets for employee
db.timesheets.find({ employeeId: "10001" })

// Get submitted timesheets
db.timesheets.find({ status: "submitted" })

// Total hours by employee
db.timesheets.aggregate([
  { $group: { _id: "$employeeId", totalHours: { $sum: "$totalHoursWorked" } } }
])
```

## 📊 API Testing with cURL

### Register Employee
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Jane",
    "lastName": "Smith",
    "email": "jane@test.com",
    "password": "Test@123456",
    "department": "Sales",
    "position": "Manager"
  }'
```

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "jane@test.com",
    "password": "Test@123456"
  }'
```

### Create Timesheet
```bash
curl -X POST http://localhost:5000/api/timesheet/initialize \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "weekStartDate": "2024-01-08"
  }'
```

## ✅ Comprehensive Test Checklist

### Authentication
- [ ] Employee registration works
- [ ] Auto-generated 5-digit Employee ID
- [ ] Cannot register with duplicate email
- [ ] Employee login works
- [ ] Wrong password rejected
- [ ] JWT token saved
- [ ] Session persists after browser close
- [ ] Logout clears token

### Timesheet Creation
- [ ] Create timesheet for current week
- [ ] Week dates display correctly
- [ ] All 7 days visible
- [ ] Monday-Sunday order correct

### Weekend Handling
- [ ] Saturday disabled
- [ ] Sunday disabled
- [ ] Cannot edit weekend fields
- [ ] isWeekend flag in database

### Holiday Integration
- [ ] All 11 holidays detected
- [ ] Holidays marked read-only
- [ ] Holiday names display
- [ ] isHoliday flag in database
- [ ] Different styling applied

### Data Entry
- [ ] Hours field accepts 0-24
- [ ] Project code field works
- [ ] Task description field works
- [ ] Notes field works
- [ ] Can leave optional fields blank

### Timesheet Submission
- [ ] Can submit with entries
- [ ] Status changes to "submitted"
- [ ] Submitted timesheet read-only
- [ ] Cannot re-edit submitted

### Dashboard
- [ ] Profile info displays
- [ ] Statistics accurate
- [ ] Recent timesheets listed
- [ ] Status badges correct
- [ ] Can navigate to edit/view

### Data Persistence
- [ ] Employees saved in MongoDB
- [ ] Timesheets saved in MongoDB
- [ ] Employee IDs unique
- [ ] Data survives server restart

## 🔍 Debugging Tips

### Check Server Logs
```bash
# Look for:
# ✅ "MongoDB connected successfully"
# ✅ "Server is running on port 5000"
# ✅ API requests and responses
```

### Browser Console (F12)
```javascript
// Check token
localStorage.getItem('token')

// Check employee ID
localStorage.getItem('employeeId')

// View API responses in Network tab
```

### MongoDB Atlas Dashboard
- Go to Collections
- View `employees`, `timesheets`, `counters` collections
- Verify data structure

## 📈 Performance Testing

### Load Test (Register Multiple Employees)
```bash
for i in {1..100}; do
  curl -X POST http://localhost:5000/api/auth/register \
    -H "Content-Type: application/json" \
    -d "{ \"firstName\": \"User$i\", \"lastName\": \"Test\", \"email\": \"user$i@test.com\", \"password\": \"Test@123456\", \"department\": \"Dept\", \"position\": \"Role\" }"
done
```

**Expected Results:**
- ✅ All registrations successful
- ✅ Employee IDs sequential (10001-10100)
- ✅ No duplicates
- ✅ Server responsive

## 🎯 Final Verification

After completing all tests:
- [ ] All features working
- [ ] No console errors
- [ ] No server errors
- [ ] Data correct in MongoDB
- [ ] UI responsive
- [ ] Performance acceptable

---

**Testing Complete! ✨**
