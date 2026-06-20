const express = require('express');
const Timesheet = require('../models/Timesheet');
const Employee = require('../models/Employee');
const router = express.Router();
const federalHolidays = require('../utils/federalHolidays');

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

// Helper function to get week start and end dates
function getWeekDateRange(date = new Date()) {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Adjust to Monday
    const weekStart = new Date(d.setDate(diff));
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekEnd.getDate() + 6);
    
    return { weekStart, weekEnd };
}

// Create or Initialize Timesheet for a week
router.post('/initialize', verifyToken, async (req, res) => {
    try {
        const { weekStartDate } = req.body;
        const employeeId = req.employee.employeeId;
        
        // Get employee details
        const employee = await Employee.findOne({ employeeId });
        if (!employee) {
            return res.status(404).json({ error: 'Employee not found' });
        }
        
        const startDate = new Date(weekStartDate);
        const { weekStart, weekEnd } = getWeekDateRange(startDate);
        
        // Check if timesheet already exists
        let timesheet = await Timesheet.findOne({
            employeeId,
            weekStartDate: weekStart
        });
        
        if (timesheet) {
            return res.json({ message: 'Timesheet already exists', timesheet });
        }
        
        // Create entries for each day of the week
        const entries = [];
        for (let i = 0; i < 7; i++) {
            const date = new Date(weekStart);
            date.setDate(date.getDate() + i);
            
            const dayOfWeek = date.toLocaleString('en-US', { weekday: 'long' });
            const isWeekend = date.getDay() === 0 || date.getDay() === 6;
            
            // Check if it's a federal holiday
            const holiday = federalHolidays.getHolidayForDate(date);
            
            entries.push({
                date,
                dayOfWeek,
                hoursWorked: 0,
                projectCode: '',
                taskDescription: '',
                isHoliday: !!holiday,
                holidayName: holiday || '',
                isWeekend,
                notes: ''
            });
        }
        
        // Create new timesheet
        timesheet = new Timesheet({
            employeeId,
            employeeName: `${employee.firstName} ${employee.lastName}`,
            weekStartDate: weekStart,
            weekEndDate: weekEnd,
            entries
        });
        
        await timesheet.save();
        
        res.status(201).json({
            message: 'Timesheet initialized successfully',
            timesheet
        });
    } catch (error) {
        res.status(500).json({ error: 'Failed to initialize timesheet', message: error.message });
    }
});

// Get Timesheet for a specific week
router.get('/:weekStartDate', verifyToken, async (req, res) => {
    try {
        const { weekStartDate } = req.params;
        const employeeId = req.employee.employeeId;
        
        const startDate = new Date(weekStartDate);
        const { weekStart } = getWeekDateRange(startDate);
        
        const timesheet = await Timesheet.findOne({
            employeeId,
            weekStartDate: weekStart
        });
        
        if (!timesheet) {
            return res.status(404).json({ error: 'Timesheet not found' });
        }
        
        res.json(timesheet);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch timesheet', message: error.message });
    }
});

// Update Timesheet Entry
router.put('/:timesheetId/entry/:entryIndex', verifyToken, async (req, res) => {
    try {
        const { timesheetId, entryIndex } = req.params;
        const { hoursWorked, projectCode, taskDescription, notes } = req.body;
        const employeeId = req.employee.employeeId;
        
        // Verify ownership
        const timesheet = await Timesheet.findById(timesheetId);
        if (!timesheet || timesheet.employeeId !== employeeId) {
            return res.status(403).json({ error: 'Unauthorized access' });
        }
        
        // Check if timesheet is editable
        if (timesheet.status !== 'draft' && timesheet.status !== 'rejected') {
            return res.status(400).json({ error: 'Timesheet cannot be edited in current status' });
        }
        
        const index = parseInt(entryIndex);
        if (index < 0 || index >= timesheet.entries.length) {
            return res.status(400).json({ error: 'Invalid entry index' });
        }
        
        // Update entry
        const entry = timesheet.entries[index];
        if (entry.isHoliday || entry.isWeekend) {
            return res.status(400).json({ error: 'Cannot edit holiday or weekend entries' });
        }
        
        entry.hoursWorked = hoursWorked || 0;
        entry.projectCode = projectCode || '';
        entry.taskDescription = taskDescription || '';
        entry.notes = notes || '';
        
        timesheet.markModified('entries');
        await timesheet.save();
        
        res.json({
            message: 'Entry updated successfully',
            timesheet
        });
    } catch (error) {
        res.status(500).json({ error: 'Failed to update entry', message: error.message });
    }
});

// Submit Timesheet
router.put('/:timesheetId/submit', verifyToken, async (req, res) => {
    try {
        const { timesheetId } = req.params;
        const employeeId = req.employee.employeeId;
        
        const timesheet = await Timesheet.findById(timesheetId);
        if (!timesheet || timesheet.employeeId !== employeeId) {
            return res.status(403).json({ error: 'Unauthorized access' });
        }
        
        if (timesheet.status !== 'draft' && timesheet.status !== 'rejected') {
            return res.status(400).json({ error: 'Timesheet already submitted' });
        }
        
        // Validate that at least some entries are filled
        const hasEntries = timesheet.entries.some(e => e.hoursWorked > 0);
        if (!hasEntries) {
            return res.status(400).json({ error: 'Please enter at least some hours' });
        }
        
        timesheet.status = 'submitted';
        timesheet.submittedAt = new Date();
        await timesheet.save();
        
        res.json({
            message: 'Timesheet submitted successfully',
            timesheet
        });
    } catch (error) {
        res.status(500).json({ error: 'Failed to submit timesheet', message: error.message });
    }
});

// Get all timesheets for employee
router.get('/', verifyToken, async (req, res) => {
    try {
        const employeeId = req.employee.employeeId;
        const timesheets = await Timesheet.find({ employeeId }).sort({ weekStartDate: -1 });
        
        res.json(timesheets);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch timesheets', message: error.message });
    }
});

module.exports = router;
