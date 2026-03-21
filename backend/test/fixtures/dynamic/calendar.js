"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createMockServiceBookingDto = createMockServiceBookingDto;
exports.createMockServiceBooking = createMockServiceBooking;
exports.createMockServiceBookings = createMockServiceBookings;
const common_1 = require("../static/common");
// ============================================================================
// Service Booking Dynamic Mock Data - For integration tests
// ============================================================================
function createMockServiceBookingDto(overrides = {}) {
    return {
        serviceId: common_1.testStrings.serviceId,
        userId: common_1.mockObjectIds.userId.toString(),
        client: {
            name: 'John Doe',
            phoneNumber: common_1.testStrings.phoneNumber,
            address: '123 Test Street, Test City',
        },
        serviceFormValues: [
            {
                serviceFieldId: 'field-1',
                answer: 'Test answer 1',
            },
        ],
        status: 'Confirmed',
        note: 'Test booking note',
        bookingTime: common_1.testDates.baseDate,
        callSid: common_1.testStrings.callSid,
        ...overrides,
    };
}
function createMockServiceBooking(overrides = {}) {
    return {
        _id: common_1.mockObjectIds.serviceBookingId.toString(),
        serviceId: common_1.testStrings.serviceId,
        client: {
            name: 'John Doe',
            phoneNumber: common_1.testStrings.phoneNumber,
            address: '123 Test Street, Test City',
        },
        serviceFormValues: [
            {
                serviceFieldId: 'field-1',
                answer: 'Test answer 1',
            },
        ],
        status: 'Confirmed',
        note: 'Test booking note',
        bookingTime: common_1.testDates.baseDate,
        userId: common_1.mockObjectIds.userId.toString(),
        callSid: common_1.testStrings.callSid,
        createdAt: common_1.testDates.baseDate,
        updatedAt: common_1.testDates.baseDate,
        ...overrides,
    };
}
function createMockServiceBookings(count = 3) {
    return Array.from({ length: count }, (_, index) => createMockServiceBooking({
        _id: new (require('mongoose').Types.ObjectId)(),
        client: {
            name: `Client ${index + 1}`,
            phoneNumber: `+123456789${index}`,
            address: `${100 + index} Test Street, Test City`,
        },
        status: ['Confirmed', 'Done', 'Cancelled'][index % 3],
        bookingTime: new Date(common_1.testDates.baseDate.getTime() + index * 24 * 60 * 60 * 1000),
    }));
}
//# sourceMappingURL=calendar.js.map