"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.staticCallLogDto = exports.staticCallLog = void 0;
const common_1 = require("./common");
// ============================================================================
// CallLog Static Mock Data - For unit tests
// ============================================================================
// Static CallLog data for unit tests
exports.staticCallLog = {
    _id: common_1.mockObjectIds.calllogId.toString(),
    callSid: common_1.testStrings.callSid,
    userId: common_1.mockObjectIds.userId.toString(),
    serviceBookedId: common_1.testStrings.serviceId,
    callerNumber: common_1.testStrings.phoneNumber,
    callerName: 'Test User',
    startAt: common_1.testDates.baseDate,
    createdAt: common_1.testDates.baseDate,
    updatedAt: common_1.testDates.baseDate,
};
// Static CallLog DTO for API tests
exports.staticCallLogDto = {
    callSid: common_1.testStrings.callSid,
    userId: common_1.testStrings.userId,
    serviceBookedId: common_1.testStrings.serviceId,
    callerNumber: common_1.testStrings.phoneNumber,
    callerName: 'Test User',
    startAt: common_1.testDates.baseDate,
};
//# sourceMappingURL=calllog.js.map