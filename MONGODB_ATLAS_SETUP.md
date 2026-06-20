# MongoDB Atlas Setup Guide

Complete step-by-step guide to setup MongoDB Atlas for the Employee Portal.

## 📋 Prerequisites

- MongoDB Atlas account (free)
- Internet connection
- The connection string (will be provided to you)

## 🎯 Setup Steps

### Step 1: Create MongoDB Atlas Account

1. Go to https://www.mongodb.com/cloud/atlas
2. Click "Start Free" button
3. Sign up with:
   - Email address
   - Password
   - Accept terms and click "Create account"
4. Verify your email address

### Step 2: Create a Cluster (FREE TIER)

1. Log in to MongoDB Atlas
2. Click "Build a Database"
3. Select **"FREE"** tier (M0)
4. Choose cloud provider (AWS/Google Cloud/Azure) - any is fine
5. Choose region closest to your location
6. Click "Create Deployment"
7. Wait 1-3 minutes for cluster to be ready

### Step 3: Create Database User

1. Go to "Database Access" (left sidebar)
2. Click "Add New Database User"
3. **Username**: `admin` (or your choice)
4. **Password**: Create a strong password (example: `SecurePass123!@`)
5. Database User Privileges: Select "Built-in Roles" → "Atlas Admin"
6. Click "Add User"
7. **Save this username and password!**

### Step 4: Whitelist Your IP

1. Go to "Network Access" (left sidebar)
2. Click "Add IP Address"
3. Click "Add Current IP Address" OR
4. Click "Allow Access from Anywhere" (for development)
5. Click "Confirm"

### Step 5: Get Connection String

1. Go to "Databases" (left sidebar)
2. Find your cluster, click "Connect"
3. Choose "Drivers" option
4. Select:
   - **Driver**: Node.js
   - **Version**: 4.0 or later
5. Copy the connection string (starts with `mongodb+srv://...`)

### Step 6: Update .env File

1. Go to your project folder:
```bash
cd /Users/pratikshah/Documents/Prateek/Apps/shoolintechllc-website
```

2. Create `.env` file:
```bash
cp .env.example .env
```

3. Edit `.env` with your details:
```
MONGODB_URI=mongodb+srv://admin:SecurePass123!@cluster0.xxxxx.mongodb.net/shoolintechllc?retryWrites=true&w=majority
JWT_SECRET=your_super_secret_key_here_at_least_32_chars_long
PORT=5000
NODE_ENV=development
```

Replace:
- `admin` → your username
- `SecurePass123!` → your password
- `cluster0.xxxxx` → your cluster address from connection string
- `shoolintechllc` → database name (auto-created)

## ✅ Connection String Format

```
mongodb+srv://USERNAME:PASSWORD@CLUSTER.mongodb.net/DATABASE_NAME?retryWrites=true&w=majority
```

### Components:
- **USERNAME**: Database user you created
- **PASSWORD**: Password for that user
- **CLUSTER**: Your cluster ID (from Atlas dashboard)
- **DATABASE_NAME**: `shoolintechllc` (will be auto-created)

## 🧪 Test Connection

### Option 1: Using MongoDB Compass (GUI)

1. Download MongoDB Compass: https://www.mongodb.com/products/compass
2. Open MongoDB Compass
3. Click "New Connection"
4. Paste your connection string
5. Click "Connect"
6. You should see your databases

### Option 2: Using Command Line

```bash
npm install
npm start
```

If connection is successful, you'll see:
```
MongoDB connected successfully
Server is running on port 5000
```

## 📊 MongoDB Atlas Dashboard

Once connected, you can:
- **View Collections**: See all databases and tables
- **View Data**: Browse employee and timesheet records
- **Monitor Performance**: Check cluster performance
- **View Logs**: See connection logs and errors

## 🔍 Check Database Contents

After registering an employee:

1. Log in to MongoDB Atlas
2. Click on your cluster
3. Click "Collections"
4. You should see:
   - `employees` collection (employee records)
   - `timesheets` collection (timesheet entries)
   - `counters` collection (for auto-increment Employee IDs)

## 🛡️ Security Best Practices

✅ **Do:**
- Use strong passwords (uppercase, lowercase, numbers, symbols)
- Store `.env` file locally (never commit to Git)
- Limit database user privileges if possible
- Rotate passwords periodically
- Use environment-specific credentials

❌ **Don't:**
- Commit `.env` file to GitHub
- Use simple passwords like "password123"
- Share credentials
- Use same password for all services

## ⚠️ Troubleshooting

### Error: "Authentication failed"
- Check username and password in `.env`
- Verify capitalization (case-sensitive)
- Check if user exists in "Database Access"

### Error: "IP not whitelisted"
- Go to "Network Access"
- Click "Add Current IP Address"
- Try connecting again

### Error: "Connection timeout"
- Check internet connection
- Verify firewall settings
- Try "Allow Access from Anywhere" temporarily

### MongoDB not connecting
1. Verify `.env` file exists and has correct values
2. Check MongoDB Atlas status: https://status.mongodb.com
3. Try restarting the server: `npm start`

## 📝 Example .env File

```bash
# MongoDB Connection
MONGODB_URI=mongodb+srv://admin:MyPassword123@cluster0.a1b2c.mongodb.net/shoolintechllc?retryWrites=true&w=majority

# JWT Secret (use a random long string)
JWT_SECRET=your_extremely_long_secret_key_here_with_special_chars_!@#$%^&*

# Server
PORT=5000
NODE_ENV=development
```

## 🔄 Database Collections Schema

### employees collection:
```javascript
{
  _id: ObjectId,
  employeeId: "10001",
  firstName: "John",
  lastName: "Doe",
  email: "john@company.com",
  password: "hashed_password",
  department: "Engineering",
  position: "Developer",
  isActive: true,
  createdAt: Date,
  updatedAt: Date
}
```

### timesheets collection:
```javascript
{
  _id: ObjectId,
  employeeId: "10001",
  weekStartDate: Date,
  entries: [
    {
      date: Date,
      dayOfWeek: "Monday",
      hoursWorked: 8,
      projectCode: "PROJ-001",
      isHoliday: false,
      isWeekend: false
    }
  ],
  status: "draft",
  createdAt: Date,
  updatedAt: Date
}
```

## 📞 MongoDB Atlas Support

- **Official Docs**: https://docs.mongodb.com/manual/
- **Atlas Docs**: https://docs.mongodb.com/atlas/
- **Community**: https://www.mongodb.com/community/forums

## ✨ Next Steps

1. ✅ Setup MongoDB Atlas (this guide)
2. ✅ Configure `.env` file
3. ✅ Run `npm install`
4. ✅ Start server: `npm start`
5. ✅ Test registration at http://localhost:5000/register.html
6. ✅ Check data in MongoDB Atlas dashboard

---

**Your employee portal is now connected to the cloud! 🚀**
