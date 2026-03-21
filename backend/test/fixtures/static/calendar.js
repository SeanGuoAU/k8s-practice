"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.staticServiceBookings = exports.staticServiceBookingDto = exports.staticServiceBooking = void 0;
const common_1 = require("./common");
// ============================================================================
// Service Booking Static Mock Data - For unit tests
// ============================================================================
// Static Service Booking data for unit tests
exports.staticServiceBooking = {
    _id: common_1.mockObjectIds.serviceBookingId,
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
        {
            serviceFieldId: 'field-2',
            answer: 'Test answer 2',
        },
    ],
    status: 'Confirmed',
    note: 'Test booking note',
    bookingTime: common_1.testDates.baseDate,
    userId: common_1.mockObjectIds.userId.toString(),
    callSid: common_1.testStrings.callSid,
    createdAt: common_1.testDates.baseDate,
    updatedAt: common_1.testDates.baseDate,
};
// Static Service Booking DTO for API tests
exports.staticServiceBookingDto = {
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
        {
            serviceFieldId: 'field-2',
            answer: 'Test answer 2',
        },
    ],
    status: 'Confirmed',
    note: 'Test booking note',
    bookingTime: common_1.testDates.baseDate,
    callSid: common_1.testStrings.callSid,
};
// Multiple service bookings for testing
exports.staticServiceBookings = [
    exports.staticServiceBooking,
    {
        ...exports.staticServiceBooking,
        _id: common_1.mockObjectIds.serviceBookingId2,
        client: {
            name: 'Jane Smith',
            phoneNumber: '+1234567890',
            address: '456 Another Street, Another City',
        },
        status: 'Done',
        bookingTime: new Date('2025-01-15T10:00:00Z'),
    },
    {
        ...exports.staticServiceBooking,
        _id: common_1.mockObjectIds.serviceBookingId3,
        client: {
            name: 'Bob Johnson',
            phoneNumber: '+9876543210',
            address: '789 Third Street, Third City',
        },
        status: 'Cancelled',
        bookingTime: new Date('2025-01-20T14:00:00Z'),
    },
];
//# sourceMappingURL=calendar.js.map