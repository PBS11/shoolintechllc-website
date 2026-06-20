/**
 * Employee ID Generation Utility
 * Generates unique 5-digit Employee IDs (10000-99999)
 */

class EmployeeIDGenerator {
    constructor() {
        this.minId = 10000;
        this.maxId = 99999;
    }

    /**
     * Generate a 5-digit Employee ID
     * Format: 10000-99999
     * @param {number} sequenceNumber - Auto-incremented sequence number
     * @returns {string} Formatted 5-digit Employee ID
     */
    generateEmployeeId(sequenceNumber) {
        // Ensure ID is within 5-digit range
        const id = this.minId + (sequenceNumber % (this.maxId - this.minId + 1));
        return String(id);
    }

    /**
     * Validate if a string is a valid Employee ID format
     * @param {string} employeeId - Employee ID to validate
     * @returns {boolean} True if valid 5-digit format
     */
    isValidEmployeeId(employeeId) {
        const id = parseInt(employeeId);
        return !isNaN(id) && id >= this.minId && id <= this.maxId;
    }

    /**
     * Parse Employee ID to get numeric value
     * @param {string} employeeId - Employee ID
     * @returns {number} Numeric value
     */
    parseEmployeeId(employeeId) {
        return parseInt(employeeId);
    }
}

module.exports = new EmployeeIDGenerator();
