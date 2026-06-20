/**
 * US Federal Holidays Calendar
 * Includes standard federal holidays and handles variable dates
 */

// Helper function to get the nth weekday of a month
function getNthWeekday(year, month, weekday, n) {
    let date = new Date(year, month, 1);
    let count = 0;
    
    while (date.getMonth() === month) {
        if (date.getDay() === weekday) {
            count++;
            if (count === n) {
                return date;
            }
        }
        date.setDate(date.getDate() + 1);
    }
    
    return null;
}

/**
 * Get federal holidays for a given year
 * @param {number} year
 * @returns {Array} Array of holiday objects with date and name
 */
function getHolidaysForYear(year) {
    const holidays = [];
    
    // Fixed Date Holidays
    holidays.push({
        date: new Date(year, 0, 1), // January 1 - New Year's Day
        name: "New Year's Day"
    });
    
    // MLK Day - Third Monday of January
    holidays.push({
        date: getNthWeekday(year, 0, 1, 3),
        name: "Martin Luther King Jr. Day"
    });
    
    // Presidents Day - Third Monday of February
    holidays.push({
        date: getNthWeekday(year, 1, 1, 3),
        name: "Presidents' Day"
    });
    
    // Memorial Day - Last Monday of May
    const lastDayMay = new Date(year, 4, 31);
    const lastMondayMay = new Date(lastDayMay);
    lastMondayMay.setDate(lastDayMay.getDate() - lastDayMay.getDay() + (lastDayMay.getDay() === 1 ? 0 : 1));
    if (lastMondayMay.getDay() !== 1) {
        lastMondayMay.setDate(lastMondayMay.getDate() - 7);
    }
    holidays.push({
        date: lastMondayMay,
        name: "Memorial Day"
    });
    
    holidays.push({
        date: new Date(year, 5, 19), // June 19 - Juneteenth
        name: "Juneteenth National Independence Day"
    });
    
    holidays.push({
        date: new Date(year, 6, 4), // July 4 - Independence Day
        name: "Independence Day"
    });
    
    // Labor Day - First Monday of September
    holidays.push({
        date: getNthWeekday(year, 8, 1, 1),
        name: "Labor Day"
    });
    
    // Columbus Day - Second Monday of October
    holidays.push({
        date: getNthWeekday(year, 9, 1, 2),
        name: "Columbus Day"
    });
    
    holidays.push({
        date: new Date(year, 10, 11), // November 11 - Veterans Day
        name: "Veterans Day"
    });
    
    // Thanksgiving - Fourth Thursday of November
    holidays.push({
        date: getNthWeekday(year, 10, 4, 4),
        name: "Thanksgiving Day"
    });
    
    holidays.push({
        date: new Date(year, 11, 25), // December 25 - Christmas Day
        name: "Christmas Day"
    });
    
    return holidays;
}

/**
 * Get holiday name for a specific date
 * @param {Date} date
 * @returns {string|null} Holiday name or null if not a holiday
 */
function getHolidayForDate(date) {
    const year = date.getFullYear();
    const holidays = getHolidaysForYear(year);
    
    for (const holiday of holidays) {
        if (
            holiday.date &&
            holiday.date.getFullYear() === date.getFullYear() &&
            holiday.date.getMonth() === date.getMonth() &&
            holiday.date.getDate() === date.getDate()
        ) {
            return holiday.name;
        }
    }
    
    return null;
}

/**
 * Get all holidays for a date range
 * @param {Date} startDate
 * @param {Date} endDate
 * @returns {Array} Array of holidays in the date range
 */
function getHolidaysInRange(startDate, endDate) {
    const holidays = [];
    const currentYear = startDate.getFullYear();
    const endYear = endDate.getFullYear();
    
    for (let year = currentYear; year <= endYear; year++) {
        const yearHolidays = getHolidaysForYear(year);
        
        for (const holiday of yearHolidays) {
            if (holiday.date >= startDate && holiday.date <= endDate) {
                holidays.push(holiday);
            }
        }
    }
    
    return holidays;
}

/**
 * Check if a date is a federal holiday
 * @param {Date} date
 * @returns {boolean}
 */
function isFederalHoliday(date) {
    return getHolidayForDate(date) !== null;
}

module.exports = {
    getHolidaysForYear,
    getHolidayForDate,
    getHolidaysInRange,
    isFederalHoliday
};
