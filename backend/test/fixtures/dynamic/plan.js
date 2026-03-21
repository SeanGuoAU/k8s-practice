"use strict";
// ============================================================================
// Dynamic Plan Test Data Generators - Creates fresh test data for each test
// ============================================================================
Object.defineProperty(exports, "__esModule", { value: true });
exports.PLAN_NAME_TEMPLATES = exports.FEATURE_TEMPLATES = exports.PRICING_STRATEGIES = exports.PLAN_TIERS = void 0;
exports.createMockPlanDto = createMockPlanDto;
exports.createMockPlanDtos = createMockPlanDtos;
exports.createMockUpdatePlanDto = createMockUpdatePlanDto;
exports.createMockPlan = createMockPlan;
exports.createMockPlans = createMockPlans;
exports.createFreePlan = createFreePlan;
exports.createBasicPlan = createBasicPlan;
exports.createProPlan = createProPlan;
exports.createEnterprisePlan = createEnterprisePlan;
exports.createTrialPlan = createTrialPlan;
const crypto_1 = require("crypto");
const common_1 = require("./common");
// ============================================================================
// Plan Tier Definitions
// ============================================================================
exports.PLAN_TIERS = ['FREE', 'BASIC', 'PRO'];
// ============================================================================
// Pricing Strategy Templates
// ============================================================================
exports.PRICING_STRATEGIES = {
    monthly: {
        rrule: 'FREQ=MONTHLY;INTERVAL=1',
        description: 'Monthly billing',
    },
    quarterly: {
        rrule: 'FREQ=MONTHLY;INTERVAL=3',
        description: 'Quarterly billing',
    },
    yearly: {
        rrule: 'FREQ=YEARLY;INTERVAL=1',
        description: 'Annual billing',
    },
    weekly: {
        rrule: 'FREQ=WEEKLY;INTERVAL=1',
        description: 'Weekly billing',
    },
    biweekly: {
        rrule: 'FREQ=WEEKLY;INTERVAL=2',
        description: 'Bi-weekly billing',
    },
};
// ============================================================================
// Feature Templates by Tier
// ============================================================================
exports.FEATURE_TEMPLATES = {
    FREE: {
        callMinutes: '60 minutes',
        support: 'Community support',
    },
    BASIC: {
        callMinutes: '300 minutes',
        support: 'Email support',
    },
    PRO: {
        callMinutes: 'Unlimited',
        support: 'Priority support',
    },
};
// ============================================================================
// Plan Name Templates
// ============================================================================
exports.PLAN_NAME_TEMPLATES = {
    FREE: ['Free Plan', 'Starter', 'Basic Free', 'Community'],
    BASIC: ['Basic Plan', 'Standard', 'Professional', 'Business Starter'],
    PRO: ['Pro Plan', 'Premium', 'Enterprise', 'Business Pro'],
};
// ============================================================================
// Dynamic Data Generators
// ============================================================================
/**
 * Generate a random plan name based on tier
 */
function secureRandomIndex(arrayLength) {
    // Find the largest byte value less than 256 that maps evenly to arrayLength
    const max = Math.floor(256 / arrayLength) * arrayLength;
    let byte;
    do {
        byte = (0, crypto_1.randomBytes)(1)[0];
    } while (byte >= max);
    return byte % arrayLength;
}
function generatePlanName(tier) {
    const templates = exports.PLAN_NAME_TEMPLATES[tier];
    if (!templates) {
        return 'Unknown Plan';
    }
    const randomIndex = secureRandomIndex(templates.length);
    const baseName = templates[randomIndex];
    // Add some variety with random suffixes
    const suffixes = ['', ' Plus', ' Advanced', ' Deluxe', ' Premium'];
    const randomSuffix = suffixes[secureRandomIndex(suffixes.length)];
    return baseName + randomSuffix;
}
/**
 * Generate random pricing options for a plan
 */
function generatePricingOptions(tier) {
    const pricingOptions = [];
    // Always include monthly pricing
    const monthlyPrice = tier === 'FREE'
        ? 0
        : tier === 'BASIC'
            ? (0, common_1.generateRandomNumber)(20) + 20 // 20-40
            : (0, common_1.generateRandomNumber)(50) + 50; // 50-100
    pricingOptions.push({
        rrule: exports.PRICING_STRATEGIES.monthly.rrule,
        price: monthlyPrice,
        stripePriceId: `price_${tier.toLowerCase()}_monthly_${(0, common_1.randomString)(8)}`,
    });
    // Add quarterly pricing for BASIC and PRO
    if (tier !== 'FREE') {
        const quarterlyPrice = Math.round(monthlyPrice * 2.5); // 2.5 months worth
        pricingOptions.push({
            rrule: exports.PRICING_STRATEGIES.quarterly.rrule,
            price: quarterlyPrice,
            stripePriceId: `price_${tier.toLowerCase()}_quarterly_${(0, common_1.randomString)(8)}`,
        });
    }
    // Add yearly pricing for BASIC and PRO with discount
    if (tier !== 'FREE') {
        const yearlyPrice = Math.round(monthlyPrice * 10); // 10 months worth (2 months discount)
        pricingOptions.push({
            rrule: exports.PRICING_STRATEGIES.yearly.rrule,
            price: yearlyPrice,
            stripePriceId: `price_${tier.toLowerCase()}_yearly_${(0, common_1.randomString)(8)}`,
        });
    }
    // Add weekly pricing for PRO plans (enterprise use cases)
    if (tier === 'PRO' && (0, common_1.generateRandomNumber)(100) < 30) {
        // 30% chance
        const weeklyPrice = Math.round(monthlyPrice / 4);
        pricingOptions.push({
            rrule: exports.PRICING_STRATEGIES.weekly.rrule,
            price: weeklyPrice,
            stripePriceId: `price_${tier.toLowerCase()}_weekly_${(0, common_1.randomString)(8)}`,
        });
    }
    return pricingOptions;
}
/**
 * Generate enhanced features based on tier
 */
function generateFeatures(tier) {
    const baseFeatures = exports.FEATURE_TEMPLATES[tier];
    // Add some randomization to make features more realistic
    const features = { ...baseFeatures };
    // Randomize call minutes slightly for BASIC and PRO
    if (tier === 'BASIC') {
        const minuteVariations = [
            '250 minutes',
            '300 minutes',
            '350 minutes',
            '400 minutes',
        ];
        features.callMinutes =
            minuteVariations[(0, common_1.generateRandomNumber)(minuteVariations.length)];
    }
    else if (tier === 'PRO') {
        const unlimitedVariations = [
            'Unlimited',
            'Unlimited +',
            'Unlimited Pro',
            'Unlimited Enterprise',
        ];
        features.callMinutes =
            unlimitedVariations[(0, common_1.generateRandomNumber)(unlimitedVariations.length)];
    }
    return features;
}
// ============================================================================
// Main Factory Functions
// ============================================================================
/**
 * Create a mock plan DTO with realistic data
 */
function createMockPlanDto(overrides = {}) {
    const tier = overrides.tier || exports.PLAN_TIERS[(0, common_1.generateRandomNumber)(exports.PLAN_TIERS.length)];
    return {
        name: overrides.name || generatePlanName(tier),
        tier,
        pricing: overrides.pricing || generatePricingOptions(tier),
        features: overrides.features || generateFeatures(tier),
        isActive: overrides.isActive !== undefined
            ? overrides.isActive
            : (0, common_1.generateRandomNumber)(100) < 90, // 90% chance of being active
        ...overrides,
    };
}
/**
 * Create multiple mock plan DTOs with variety
 */
function createMockPlanDtos(count, overrides = {}) {
    return Array.from({ length: count }, (_, index) => {
        // Ensure variety in tiers across multiple plans
        const tier = overrides.tier || exports.PLAN_TIERS[index % exports.PLAN_TIERS.length];
        return createMockPlanDto({
            ...overrides,
            tier,
            name: overrides.name || `${generatePlanName(tier)} ${index + 1}`,
        });
    });
}
/**
 * Create a mock update plan DTO
 */
function createMockUpdatePlanDto(overrides = {}) {
    const tier = overrides.tier || exports.PLAN_TIERS[(0, common_1.generateRandomNumber)(exports.PLAN_TIERS.length)];
    return {
        name: overrides.name || `Updated ${generatePlanName(tier)}`,
        tier,
        pricing: overrides.pricing || generatePricingOptions(tier),
        features: overrides.features || generateFeatures(tier),
        isActive: overrides.isActive !== undefined
            ? overrides.isActive
            : (0, common_1.generateRandomNumber)(100) < 80, // 80% chance of being active
        ...overrides,
    };
}
/**
 * Create a mock plan entity with realistic data
 */
function createMockPlan(overrides = {}) {
    const tier = overrides.tier || exports.PLAN_TIERS[(0, common_1.generateRandomNumber)(exports.PLAN_TIERS.length)];
    return {
        name: overrides.name || generatePlanName(tier),
        tier,
        pricing: overrides.pricing || generatePricingOptions(tier),
        features: overrides.features || generateFeatures(tier),
        isActive: overrides.isActive !== undefined
            ? overrides.isActive
            : (0, common_1.generateRandomNumber)(100) < 90,
        ...overrides,
    };
}
/**
 * Create multiple mock plan entities with variety
 */
function createMockPlans(count, overrides = {}) {
    return Array.from({ length: count }, (_, index) => {
        const tier = overrides.tier || exports.PLAN_TIERS[index % exports.PLAN_TIERS.length];
        return createMockPlan({
            ...overrides,
            tier,
            name: overrides.name || `${generatePlanName(tier)} ${index + 1}`,
            // _id: overrides._id || generatePlanId(),
        });
    });
}
// ============================================================================
// Specialized Plan Generators
// ============================================================================
/**
 * Create a free plan with minimal features
 */
function createFreePlan(overrides = {}) {
    return createMockPlanDto({
        tier: 'FREE',
        name: 'Free Plan',
        pricing: [
            {
                rrule: exports.PRICING_STRATEGIES.monthly.rrule,
                price: 0,
                stripePriceId: `price_free_monthly_${(0, common_1.randomString)(8)}`,
            },
        ],
        features: {
            callMinutes: '60 minutes',
            support: 'Community support',
        },
        isActive: true,
        ...overrides,
    });
}
/**
 * Create a basic plan with standard features
 */
function createBasicPlan(overrides = {}) {
    return createMockPlanDto({
        tier: 'BASIC',
        name: 'Basic Plan',
        pricing: [
            {
                rrule: exports.PRICING_STRATEGIES.monthly.rrule,
                price: 29,
                stripePriceId: `price_basic_monthly_${(0, common_1.randomString)(8)}`,
            },
            {
                rrule: exports.PRICING_STRATEGIES.yearly.rrule,
                price: 290,
                stripePriceId: `price_basic_yearly_${(0, common_1.randomString)(8)}`,
            },
        ],
        features: {
            callMinutes: '300 minutes',
            support: 'Email support',
        },
        isActive: true,
        ...overrides,
    });
}
/**
 * Create a pro plan with premium features
 */
function createProPlan(overrides = {}) {
    return createMockPlanDto({
        tier: 'PRO',
        name: 'Pro Plan',
        pricing: [
            {
                rrule: exports.PRICING_STRATEGIES.monthly.rrule,
                price: 99,
                stripePriceId: `price_pro_monthly_${(0, common_1.randomString)(8)}`,
            },
            {
                rrule: exports.PRICING_STRATEGIES.quarterly.rrule,
                price: 270,
                stripePriceId: `price_pro_quarterly_${(0, common_1.randomString)(8)}`,
            },
            {
                rrule: exports.PRICING_STRATEGIES.yearly.rrule,
                price: 990,
                stripePriceId: `price_pro_yearly_${(0, common_1.randomString)(8)}`,
            },
        ],
        features: {
            callMinutes: 'Unlimited',
            support: 'Priority support',
        },
        isActive: true,
        ...overrides,
    });
}
/**
 * Create an enterprise plan with maximum features
 */
function createEnterprisePlan(overrides = {}) {
    return createMockPlanDto({
        tier: 'PRO', // Using PRO tier but with enterprise features
        name: 'Enterprise Plan',
        pricing: [
            {
                rrule: exports.PRICING_STRATEGIES.monthly.rrule,
                price: 299,
                stripePriceId: `price_enterprise_monthly_${(0, common_1.randomString)(8)}`,
            },
            {
                rrule: exports.PRICING_STRATEGIES.yearly.rrule,
                price: 2990,
                stripePriceId: `price_enterprise_yearly_${(0, common_1.randomString)(8)}`,
            },
        ],
        features: {
            callMinutes: 'Unlimited Enterprise',
            support: '24/7 dedicated support',
        },
        isActive: true,
        ...overrides,
    });
}
/**
 * Create a trial plan for testing purposes
 */
function createTrialPlan(overrides = {}) {
    return createMockPlanDto({
        tier: 'BASIC',
        name: 'Trial Plan',
        pricing: [
            {
                rrule: 'FREQ=MONTHLY;INTERVAL=1;COUNT=1', // One month only
                price: 0,
                stripePriceId: `price_trial_monthly_${(0, common_1.randomString)(8)}`,
            },
        ],
        features: {
            callMinutes: '100 minutes',
            support: 'Email support',
        },
        isActive: true,
        ...overrides,
    });
}
//# sourceMappingURL=plan.js.map