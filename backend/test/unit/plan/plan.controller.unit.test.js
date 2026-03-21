"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const plan_controller_1 = require("../../../src/modules/plan/plan.controller");
const plan_service_1 = require("../../../src/modules/plan/plan.service");
const plan_1 = require("../../fixtures/dynamic/plan");
const plan_2 = require("../../fixtures/static/plan");
// ============================================================================
// Plan Controller Unit Tests - Testing individual methods with mocked dependencies
// ============================================================================
describe('PlanController (Unit)', () => {
    let controller;
    let service;
    beforeEach(async () => {
        const mockService = {
            createPlan: jest.fn(),
            getAllActivePlans: jest.fn(),
            getPlanById: jest.fn(),
            updatePlan: jest.fn(),
            patchPlan: jest.fn(),
            deletePlan: jest.fn(),
        };
        const module = await testing_1.Test.createTestingModule({
            controllers: [plan_controller_1.PlanController],
            providers: [
                {
                    provide: plan_service_1.PlanService,
                    useValue: mockService,
                },
            ],
        }).compile();
        controller = module.get(plan_controller_1.PlanController);
        service = module.get(plan_service_1.PlanService);
    });
    describe('create', () => {
        it('should create a plan', async () => {
            const createPlanDto = (0, plan_1.createMockPlanDto)();
            const expectedResult = { ...plan_2.staticPlan, ...createPlanDto };
            service.createPlan.mockResolvedValue(expectedResult);
            const result = await controller.create(createPlanDto);
            expect(service.createPlan).toHaveBeenCalledWith(createPlanDto);
            expect(result).toEqual(expectedResult);
        });
    });
    describe('findAll', () => {
        it('should return all active plans', async () => {
            const expectedResult = [plan_2.staticPlan];
            service.getAllActivePlans.mockResolvedValue(expectedResult);
            const result = await controller.findAll();
            expect(service.getAllActivePlans).toHaveBeenCalled();
            expect(result).toEqual(expectedResult);
        });
    });
    describe('findById', () => {
        it('should return a plan by id', async () => {
            const planId = 'plan-123';
            const expectedResult = plan_2.staticPlan;
            service.getPlanById.mockResolvedValue(expectedResult);
            const result = await controller.findById(planId);
            expect(service.getPlanById).toHaveBeenCalledWith(planId);
            expect(result).toEqual(expectedResult);
        });
    });
    describe('update', () => {
        it('should fully update a plan', async () => {
            const planId = 'plan-123';
            const updatePlanDto = (0, plan_1.createMockUpdatePlanDto)();
            const expectedResult = { ...plan_2.staticPlan, ...updatePlanDto };
            service.updatePlan.mockResolvedValue(expectedResult);
            const result = await controller.update(planId, updatePlanDto);
            expect(service.updatePlan).toHaveBeenCalledWith(planId, updatePlanDto);
            expect(result).toEqual(expectedResult);
        });
    });
    describe('patch', () => {
        it('should partially update a plan', async () => {
            const planId = 'plan-123';
            const partialUpdate = { name: 'Updated Plan Name' };
            const expectedResult = { ...plan_2.staticPlan, ...partialUpdate };
            service.patchPlan.mockResolvedValue(expectedResult);
            const result = await controller.patch(planId, partialUpdate);
            expect(service.patchPlan).toHaveBeenCalledWith(planId, partialUpdate);
            expect(result).toEqual(expectedResult);
        });
    });
    describe('delete', () => {
        it('should delete a plan', async () => {
            const planId = 'plan-123';
            service.deletePlan.mockResolvedValue(undefined);
            await controller.remove(planId);
            expect(service.deletePlan).toHaveBeenCalledWith(planId);
        });
    });
});
//# sourceMappingURL=plan.controller.unit.test.js.map