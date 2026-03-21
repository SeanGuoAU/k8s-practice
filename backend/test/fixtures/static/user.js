"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.staticUserDto = exports.staticUser = void 0;
const common_1 = require("./common");
// ============================================================================
// User Static Mock Data - For unit tests
// ============================================================================
// Static User data for unit tests
exports.staticUser = {
    _id: common_1.mockObjectIds.userId,
    email: common_1.testStrings.email,
    role: 'user',
    status: 'active',
    createdAt: common_1.testDates.baseDate,
    updatedAt: common_1.testDates.baseDate,
};
// Static User DTO for API tests
exports.staticUserDto = {
    email: common_1.testStrings.email,
    password: 'testpassword123',
    role: 'user',
    status: 'active',
};
//# sourceMappingURL=user.js.map