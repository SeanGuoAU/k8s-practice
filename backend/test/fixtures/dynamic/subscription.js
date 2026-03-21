"use strict";
// ============================================================================
// Dynamic Subscription Test Data Generators - Creates fresh test data for each test
// ============================================================================
Object.defineProperty(exports, "__esModule", { value: true });
exports.SUBSCRIPTION_STATUSES = void 0;
exports.createMockSubscriptionDto = createMockSubscriptionDto;
exports.createMockSubscription = createMockSubscription;
exports.createMockSubscriptions = createMockSubscriptions;
exports.createActiveSubscription = createActiveSubscription;
exports.createFailedSubscription = createFailedSubscription;
exports.createCancelledSubscription = createCancelledSubscription;
const mongoose_1 = require("mongoose");
const common_1 = require("./common");
// ============================================================================
// Subscription Status Types
// ============================================================================
exports.SUBSCRIPTION_STATUSES = ['active', 'failed', 'cancelled'];
// ============================================================================
// Dynamic Data Generators
// ============================================================================
/**
 * Generate a random subscription ID
 */
function generateSubscriptionId() {
    return `sub_${(0, common_1.randomString)(16)}`;
}
/**
 * Generate a random Stripe customer ID
 */
function generateStripeCustomerId() {
    return `cus_${(0, common_1.randomString)(16)}`;
}
/**
 * Generate a random charge ID
 */
function generateChargeId() {
    return `ch_${(0, common_1.randomString)(16)}`;
}
/**
 * Generate random dates for subscription period
 */
function generateSubscriptionDates() {
    const startAt = new Date(Date.now() - (0, common_1.generateRandomNumber)(365 * 24 * 60 * 60 * 1000));
    const endAt = new Date(startAt.getTime() + 365 * 24 * 60 * 60 * 1000);
    return { startAt, endAt };
}
// ============================================================================
// Main Factory Functions
// ============================================================================
/**
 * Create a mock subscription DTO with realistic data
 */
function createMockSubscriptionDto(overrides = {}) {
    return {
        userId: overrides.userId || new mongoose_1.Types.ObjectId().toString(),
        planId: overrides.planId || new mongoose_1.Types.ObjectId().toString(),
        ...overrides,
    };
}
/**
 * Create a mock subscription entity with realistic data
 */
function createMockSubscription(overrides = {}) {
    const { startAt, endAt } = generateSubscriptionDates();
    return {
        userId: overrides.userId || new mongoose_1.Types.ObjectId(),
        planId: overrides.planId || new mongoose_1.Types.ObjectId(),
        subscriptionId: overrides.subscriptionId || generateSubscriptionId(),
        stripeCustomerId: overrides.stripeCustomerId || generateStripeCustomerId(),
        chargeId: overrides.chargeId || generateChargeId(),
        status: overrides.status ||
            exports.SUBSCRIPTION_STATUSES[(0, common_1.generateRandomNumber)(exports.SUBSCRIPTION_STATUSES.length)],
        startAt: overrides.startAt || startAt,
        endAt: overrides.endAt || endAt,
        createdAt: overrides.createdAt || startAt,
        updatedAt: overrides.updatedAt || new Date(),
        ...overrides,
    };
}
/**
 * Create multiple mock subscription entities with variety
 */
function createMockSubscriptions(count, overrides = {}) {
    return Array.from({ length: count }, () => {
        return createMockSubscription({
            ...overrides,
            userId: overrides.userId || new mongoose_1.Types.ObjectId(),
            planId: overrides.planId || new mongoose_1.Types.ObjectId(),
        });
    });
}
// ============================================================================
// Specialized Subscription Generators
// ============================================================================
/**
 * Create an active subscription
 */
function createActiveSubscription(overrides = {}) {
    return createMockSubscription({
        status: 'active',
        ...overrides,
    });
}
/**
 * Create a failed subscription
 */
function createFailedSubscription(overrides = {}) {
    return createMockSubscription({
        status: 'failed',
        ...overrides,
    });
}
/**
 * Create a cancelled subscription
 */
function createCancelledSubscription(overrides = {}) {
    return createMockSubscription({
        status: 'cancelled',
        ...overrides,
    });
}
//# sourceMappingURL=subscription.js.map