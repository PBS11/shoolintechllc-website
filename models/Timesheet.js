const mongoose = require('mongoose');

// Timesheet Schema
const timesheetSchema = new mongoose.Schema({
    employeeId: {
        type: String,
        required: true,
        index: true
    },
    employeeName: {
        type: String,
        required: true
    },
    weekStartDate: {
        type: Date,
        required: true
    },
    weekEndDate: {
        type: Date,
        required: true
    },
    entries: [
        {
            date: {
                type: Date,
                required: true
            },
            dayOfWeek: {
                type: String,
                required: true
            },
            hoursWorked: {
                type: Number,
                default: 0,
                min: 0,
                max: 24
            },
            projectCode: {
                type: String,
                default: ''
            },
            taskDescription: {
                type: String,
                default: ''
            },
            isHoliday: {
                type: Boolean,
                default: false
            },
            holidayName: {
                type: String,
                default: ''
            },
            isWeekend: {
                type: Boolean,
                default: false
            },
            notes: {
                type: String,
                default: ''
            }
        }
    ],
    totalHoursWorked: {
        type: Number,
        default: 0
    },
    totalHolidaysInWeek: {
        type: Number,
        default: 0
    },
    status: {
        type: String,
        enum: ['draft', 'submitted', 'approved', 'rejected'],
        default: 'draft'
    },
    submittedAt: {
        type: Date,
        default: null
    },
    approvedAt: {
        type: Date,
        default: null
    },
    approvedBy: {
        type: String,
        default: null
    },
    comments: {
        type: String,
        default: ''
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

// Calculate total hours before saving
timesheetSchema.pre('save', function(next) {
    this.totalHoursWorked = this.entries.reduce((sum, entry) => {
        return entry.isHoliday ? sum : sum + (entry.hoursWorked || 0);
    }, 0);
    
    this.totalHolidaysInWeek = this.entries.filter(e => e.isHoliday).length;
    this.updatedAt = Date.now();
    next();
});

module.exports = mongoose.model('Timesheet', timesheetSchema);
