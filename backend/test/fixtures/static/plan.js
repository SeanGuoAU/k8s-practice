"use strict";
// ============================================================================
// Static Plan Test Data - Immutable test fixtures
// ============================================================================
Object.defineProperty(exports, "__esModule", { value: true });
exports.staticInactivePlan = exports.staticProPlan = exports.staticBasicPlan = exports.staticPlan = void 0;
exports.staticPlan = {
    _id: 'plan-123',
    name: 'Free Plan',
    tier: 'FREE',
    pricing: [
        {
            rrule: 'FREQ=MONTHLY;INTERVAL=1',
            price: 0,
            stripePriceId: 'price_free_monthly',
        },
    ],
    features: {
        callMinutes: '100 minutes',
        support: 'Email support',
    },
    isActive: true,
};
exports.staticBasicPlan = {
    _id: 'plan-456',
    name: 'Basic Plan',
    tier: 'BASIC',
    pricing: [
        {
            rrule: 'FREQ=MONTHLY;INTERVAL=1',
            price: 29,
            stripePriceId: 'price_basic_monthly',
        },
    ],
    features: {
        callMinutes: '500 minutes',
        support: 'Priority support',
    },
    isActive: true,
};
exports.staticProPlan = {
    _id: 'plan-789',
    name: 'Pro Plan',
    tier: 'PRO',
    pricing: [
        {
            rrule: 'FREQ=MONTHLY;INTERVAL=1',
            price: 99,
            stripePriceId: 'price_pro_monthly',
        },
    ],
    features: {
        callMinutes: 'Unlimited',
        support: '24/7 phone support',
    },
    isActive: true,
};
exports.staticInactivePlan = {
    _id: 'plan-999',
    name: 'Legacy Plan',
    tier: 'BASIC',
    pricing: [
        {
            rrule: 'FREQ=MONTHLY;INTERVAL=1',
            price: 19,
            stripePriceId: 'price_legacy_monthly',
        },
    ],
    features: {
        callMinutes: '200 minutes',
        support: 'Basic support',
    },
    isActive: false,
};
//# sourceMappingURL=plan.js.map