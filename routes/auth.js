const express = require('express');
const jwt = require('jsonwebtoken');
const Employee = require('../models/Employee');
const router = express.Router();

// Middleware to verify JWT token
const verifyToken = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
        return res.status(401).json({ error: 'No token provided' });
    }
    
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret_key');
        req.employee = decoded;
        next();
    } catch (error) {
        res.status(401).json({ error: 'Invalid token' });
    }
};

// Employee Registration
router.post('/register', async (req, res) => {
    try {
        const { firstName, lastName, email, password, department, position, phone } = req.body;
        
        // Validation
        if (!firstName || !lastName || !email || !password || !department || !position) {
            return res.status(400).json({ error: 'Missing required fields' });
        }
        
        // Check if employee already exists
        const existingEmployee = await Employee.findOne({ email });
        if (existingEmployee) {
            return res.status(400).json({ error: 'Email already registered' });
        }
        
        // Create new employee
        const employee = new Employee({
            firstName,
            lastName,
            email,
            password,
            department,
            position,
            phone
        });
        
        await employee.save();
        
        // Generate JWT token
        const token = jwt.sign(
            { employeeId: employee.employeeId, email: employee.email },
            process.env.JWT_SECRET || 'your_jwt_secret_key',
            { expiresIn: '24h' }
        );
        
        res.status(201).json({
            message: 'Employee registered successfully',
            employeeId: employee.employeeId,
            token,
            employee: employee.toJSON()
        });
    } catch (error) {
        res.status(500).json({ error: 'Registration failed', message: error.message });
    }
});

// Employee Login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        
        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password required' });
        }
        
        // Find employee by email
        const employee = await Employee.findOne({ email });
        if (!employee) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }
        
        // Check if employee is active
        if (!employee.isActive) {
            return res.status(401).json({ error: 'Employee account is inactive' });
        }
        
        // Compare password
        const isPasswordValid = await employee.comparePassword(password);
        if (!isPasswordValid) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }
        
        // Generate JWT token
        const token = jwt.sign(
            { employeeId: employee.employeeId, email: employee.email },
            process.env.JWT_SECRET || 'your_jwt_secret_key',
            { expiresIn: '24h' }
        );
        
        res.json({
            message: 'Login successful',
            employeeId: employee.employeeId,
            token,
            employee: employee.toJSON()
        });
    } catch (error) {
        res.status(500).json({ error: 'Login failed', message: error.message });
    }
});

// Verify Token
router.get('/verify', verifyToken, (req, res) => {
    res.json({ valid: true, employee: req.employee });
});

// Logout (client-side mainly, but can be used for token blacklist in production)
router.post('/logout', (req, res) => {
    res.json({ message: 'Logged out successfully' });
});

module.exports = router;
