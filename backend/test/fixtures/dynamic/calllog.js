"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createMockCallLogDto = createMockCallLogDto;
exports.createMockCallLogDtos = createMockCallLogDtos;
const crypto_1 = require("crypto");
const common_1 = require("./common");
// ============================================================================
// CallLog Dynamic Mock Data Generators - For integration tests
// ============================================================================
/**
 * Generate a random CallLog DTO for integration tests
 */
function createMockCallLogDto(overrides = {}) {
    const startAt = (0, common_1.randomDate)(new Date('2025-01-01T00:00:00Z'), new Date('2025-01-10T23:59:59Z'));
    const endAt = new Date(startAt.getTime() + 10 * 60 * 1000);
    return {
        callSid: 'CA' + (0, crypto_1.randomBytes)(16).toString('hex'),
        userId: 'user-' + (0, common_1.generateRandomNumber)(1000),
        serviceBookedId: 'booking-' + (0, common_1.generateRandomNumber)(1000),
        callerNumber: (0, common_1.randomPhoneNumber)(),
        callerName: 'User ' + (0, common_1.generateRandomNumber)(1000),
        startAt,
        endAt,
        ...overrides,
    };
}
/**
 * Generate multiple random CallLog DTOs
 */
function createMockCallLogDtos(count, overrides = {}) {
    return Array.from({ length: count }, () => createMockCallLogDto(overrides));
}
//# sourceMappingURL=calllog.js.map