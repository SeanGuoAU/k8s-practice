"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createMockUserDto = createMockUserDto;
exports.createMockUserDtos = createMockUserDtos;
const common_1 = require("./common");
// ============================================================================
// User Dynamic Mock Data Generators - For integration tests
// ============================================================================
/**
 * Generate a random User DTO for integration tests
 */
function createMockUserDto(overrides = {}) {
    return {
        email: (0, common_1.randomEmail)(),
        password: 'testpassword123',
        role: 'user',
        status: 'active',
        ...overrides,
    };
}
/**
 * Generate multiple random User DTOs
 */
function createMockUserDtos(count, overrides = {}) {
    return Array.from({ length: count }, () => createMockUserDto(overrides));
}
//# sourceMappingURL=user.js.map