"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const subscription_controller_1 = require("../../../src/modules/subscription/subscription.controller");
const subscription_service_1 = require("../../../src/modules/subscription/subscription.service");
const subscription_1 = require("../../fixtures/dynamic/subscription");
const subscription_2 = require("../../fixtures/static/subscription");
// ============================================================================
// Subscription Controller Unit Tests - Testing individual methods with mocked dependencies
// ============================================================================
describe('SubscriptionController (Unit)', () => {
    let controller;
    let service;
    beforeEach(async () => {
        const mockService = {
            createSubscription: jest.fn(),
            generateBillingPortalUrl: jest.fn(),
            changePlan: jest.fn(),
            downgradeToFree: jest.fn(),
            getAll: jest.fn(),
            getActiveByuser: jest.fn(),
            deleteById: jest.fn(),
            getInvoicesByUser: jest.fn(),
            getRefundsByUserId: jest.fn(),
        };
        const module = await testing_1.Test.createTestingModule({
            controllers: [subscription_controller_1.SubscriptionController],
            providers: [
                {
                    provide: subscription_service_1.SubscriptionService,
                    useValue: mockService,
                },
            ],
        }).compile();
        controller = module.get(subscription_controller_1.SubscriptionController);
        service = module.get(subscription_service_1.SubscriptionService);
    });
    describe('create', () => {
        it('should create a subscription and return checkout URL', async () => {
            const createSubscriptionDto = (0, subscription_1.createMockSubscriptionDto)();
            const expectedResult = {
                message: 'Stripe checkout session created',
                checkoutUrl: 'https://checkout.stripe.com/session_123',
            };
            service.createSubscription.mockResolvedValue(expectedResult);
            const result = await controller.create(createSubscriptionDto);
            expect(service.createSubscription).toHaveBeenCalledWith(createSubscriptionDto);
            expect(result).toEqual(expectedResult);
            expect(result.checkoutUrl).toBeDefined();
            expect(result.message).toBeDefined();
        });
    });
    describe('generateBillingPortalUrl', () => {
        it('should generate billing portal URL for retry payment', async () => {
            const userId = 'user-123';
            const expectedResult = {
                url: 'https://billing.stripe.com/portal_123',
            };
            service.generateBillingPortalUrl.mockResolvedValue(expectedResult.url);
            const result = await controller.generateBillingPortalUrl(userId);
            expect(service.generateBillingPortalUrl).toHaveBeenCalledWith(userId);
            expect(result).toEqual(expectedResult);
            expect(result.url).toBeDefined();
        });
    });
    describe('changePlan', () => {
        it('should change subscription plan successfully', async () => {
            const changePlanDto = {
                userId: 'user-123',
                planId: 'plan-456',
            };
            const expectedResult = {
                message: 'Plan changed successfully',
            };
            service.changePlan.mockResolvedValue(expectedResult);
            const result = await controller.changePlan(changePlanDto);
            expect(service.changePlan).toHaveBeenCalledWith(changePlanDto.userId, changePlanDto.planId);
            expect(result).toEqual(expectedResult);
        });
    });
    describe('downgradeToFree', () => {
        it('should downgrade user to free plan', async () => {
            const userId = 'user-123';
            service.downgradeToFree.mockResolvedValue(undefined);
            await controller.downgradeToFree(userId);
            expect(service.downgradeToFree).toHaveBeenCalledWith(userId);
        });
    });
    describe('getAll', () => {
        it('should return all subscriptions with pagination', async () => {
            const page = 1;
            const limit = 20;
            const expectedResult = [subscription_2.staticSubscription];
            service.getAll.mockResolvedValue(expectedResult);
            const result = await controller.getAll(page, limit);
            expect(service.getAll).toHaveBeenCalledWith(page, limit);
            expect(result).toEqual(expectedResult);
            expect(Array.isArray(result)).toBe(true);
        });
        it('should use default pagination values', async () => {
            const expectedResult = [subscription_2.staticSubscription];
            service.getAll.mockResolvedValue(expectedResult);
            const result = await controller.getAll();
            expect(service.getAll).toHaveBeenCalledWith(1, 20);
            expect(result).toEqual(expectedResult);
        });
    });
    describe('getByuser', () => {
        it('should return subscription by user ID', async () => {
            const userId = 'user-123';
            const expectedResult = subscription_2.staticActiveSubscription;
            service.getActiveByuser.mockResolvedValue(expectedResult);
            const result = await controller.getByuser(userId);
            expect(service.getActiveByuser).toHaveBeenCalledWith(userId);
            expect(result).toEqual(expectedResult);
        });
    });
    describe('deleteById', () => {
        it('should delete subscription by ID', async () => {
            const subscriptionId = 'subscription-123';
            const expectedResult = {
                message: 'Subscription deleted successfully',
            };
            service.deleteById.mockResolvedValue(undefined);
            const result = await controller.deleteById(subscriptionId);
            expect(service.deleteById).toHaveBeenCalledWith(subscriptionId);
            expect(result).toEqual(expectedResult);
        });
    });
    describe('getInvoices', () => {
        it('should return invoices by user ID', async () => {
            const userId = 'user-123';
            const expectedResult = [
                {
                    id: 'invoice_123',
                    amount: 2999,
                    status: 'paid',
                },
            ];
            service.getInvoicesByUser.mockResolvedValue(expectedResult);
            const result = await controller.getInvoices(userId);
            expect(service.getInvoicesByUser).toHaveBeenCalledWith(userId);
            expect(result).toEqual(expectedResult);
        });
    });
    describe('getRefunds', () => {
        it('should return refunds by user ID', async () => {
            const userId = 'user-123';
            const expectedResult = [
                {
                    id: 'refund_123',
                    amount: 999,
                    status: 'succeeded',
                },
            ];
            service.getRefundsByUserId.mockResolvedValue(expectedResult);
            const result = await controller.getRefunds(userId);
            expect(service.getRefundsByUserId).toHaveBeenCalledWith(userId);
            expect(result).toEqual(expectedResult);
        });
    });
});
//# sourceMappingURL=subscription.controller.unit.test.js.map