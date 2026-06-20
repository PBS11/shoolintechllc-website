const express = require('express');
const Employee = require('../models/Employee');
const router = express.Router();

// Middleware to verify JWT token
const verifyToken = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
        return res.status(401).json({ error: 'No token provided' });
    }
    
    try {
        const jwt = require('jsonwebtoken');
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret_key');
        req.employee = decoded;
        next();
    } catch (error) {
        res.status(401).json({ error: 'Invalid token' });
    }
};

// Get current employee profile
router.get('/profile', verifyToken, async (req, res) => {
    try {
        const employee = await Employee.findOne({ employeeId: req.employee.employeeId });
        
        if (!employee) {
            return res.status(404).json({ error: 'Employee not found' });
        }
        
        res.json(employee.toJSON());
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch profile', message: error.message });
    }
});

// Update employee profile
router.put('/profile', verifyToken, async (req, res) => {
    try {
        const { phone } = req.body;
        
        const employee = await Employee.findOne({ employeeId: req.employee.employeeId });
        if (!employee) {
            return res.status(404).json({ error: 'Employee not found' });
        }
        
        if (phone) {
            employee.phone = phone;
        }
        
        employee.updatedAt = new Date();
        await employee.save();
        
        res.json({
            message: 'Profile updated successfully',
            employee: employee.toJSON()
        });
    } catch (error) {
        res.status(500).json({ error: 'Failed to update profile', message: error.message });
    }
});

// Get employee by ID (Admin only - can be modified)
router.get('/:employeeId', async (req, res) => {
    try {
        const employee = await Employee.findOne({ employeeId: req.params.employeeId });
        
        if (!employee) {
            return res.status(404).json({ error: 'Employee not found' });
        }
        
        res.json(employee.toJSON());
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch employee', message: error.message });
    }
});

module.exports = router;
