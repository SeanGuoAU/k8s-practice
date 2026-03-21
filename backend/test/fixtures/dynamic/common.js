"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateRandomNumber = generateRandomNumber;
exports.randomDate = randomDate;
exports.randomString = randomString;
exports.randomPhoneNumber = randomPhoneNumber;
exports.randomEmail = randomEmail;
const crypto_1 = require("crypto");
// ============================================================================
// Common Dynamic Mock Data Utilities - Shared across all modules
// ============================================================================
/**
 * Generate a random number within a specified range
 */
function generateRandomNumber(max) {
    const range = Math.floor(65536 / max) * max;
    let randomValue;
    do {
        randomValue = (0, crypto_1.randomBytes)(2).readUInt16BE(0);
    } while (randomValue >= range);
    return randomValue % max;
}
/**
 * Generate a random date within a specified range
 */
function randomDate(start, end) {
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}
/**
 * Generate a random string of specified length
 */
function randomString(length) {
    return (0, crypto_1.randomBytes)(length).toString('hex');
}
/**
 * Generate a random phone number
 */
function randomPhoneNumber() {
    return '+6140000' + generateRandomNumber(10000).toString().padStart(4, '0');
}
/**
 * Generate a random email address
 */
function randomEmail() {
    return `user${generateRandomNumber(1000)}@example.com`;
}
//# sourceMappingURL=common.js.map