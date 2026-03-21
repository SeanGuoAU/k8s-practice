"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const service_controller_1 = require("../../../src/modules/service/service.controller");
const service_service_1 = require("../../../src/modules/service/service.service");
// ============================================================================
// Service Controller Unit Tests - Only testing methods used by frontend calendar
// ============================================================================
describe('ServiceController (Unit) - Calendar Focus', () => {
    let controller;
    let service;
    beforeEach(async () => {
        const mockService = {
            findAll: jest.fn(),
        };
        const module = await testing_1.Test.createTestingModule({
            controllers: [service_controller_1.ServiceController],
            providers: [
                {
                    provide: service_service_1.ServiceService,
                    useValue: mockService,
                },
            ],
        }).compile();
        controller = module.get(service_controller_1.ServiceController);
        service = module.get(service_service_1.ServiceService);
    });
    describe('findAll - Used by frontend calendar', () => {
        it('should return all services for a user', async () => {
            const userId = 'test-user';
            const expectedResult = [
                {
                    _id: 'service-1',
                    name: 'Test Service 1',
                    price: 100,
                    isAvailable: true,
                    userId: userId,
                },
            ];
            service.findAll.mockResolvedValue(expectedResult);
            const result = await controller.findAll(userId);
            expect(service.findAll).toHaveBeenCalledWith(userId);
            expect(result).toEqual(expectedResult);
        });
        it('should return all services when no userId provided', async () => {
            const expectedResult = [
                {
                    _id: 'service-1',
                    name: 'Test Service 1',
                    price: 100,
                    isAvailable: true,
                    userId: 'default-user',
                },
            ];
            service.findAll.mockResolvedValue(expectedResult);
            const result = await controller.findAll();
            expect(service.findAll).toHaveBeenCalledWith(undefined);
            expect(result).toEqual(expectedResult);
        });
        it('should handle empty results', async () => {
            const userId = 'test-user';
            const expectedResult = [];
            service.findAll.mockResolvedValue(expectedResult);
            const result = await controller.findAll(userId);
            expect(service.findAll).toHaveBeenCalledWith(userId);
            expect(result).toEqual([]);
        });
        it('should handle service errors', async () => {
            const userId = 'test-user';
            const error = new Error('Service error');
            service.findAll.mockRejectedValue(error);
            await expect(controller.findAll(userId)).rejects.toThrow('Service error');
        });
    });
});
//# sourceMappingURL=calendar-service.controller.unit.test.js.map