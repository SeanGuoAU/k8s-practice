"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createMockUserProfileDto = createMockUserProfileDto;
exports.createMockCompanyInfoDto = createMockCompanyInfoDto;
exports.createMockBillingAddressDto = createMockBillingAddressDto;
function createMockUserProfileDto() {
    return {
        name: 'Jane Smith',
        contact: '0987654321',
        role: 'User',
    };
}
function createMockCompanyInfoDto() {
    return {
        companyName: 'Beta Ltd',
        abn: '98765432109',
        address: '456 Side St',
    };
}
function createMockBillingAddressDto() {
    return {
        unit: 'Suite 5',
        streetAddress: '1010 Invoice Ave',
        suburb: 'Melbourne',
        state: 'VIC',
        postcode: '3000',
    };
}
//# sourceMappingURL=setting.js.map