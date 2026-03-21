"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("@nestjs/mongoose");
const testing_1 = require("@nestjs/testing");
const service_schema_1 = require("../../../src/modules/service/schema/service.schema");
const service_service_1 = require("../../../src/modules/service/service.service");
// ============================================================================
// Service Service Unit Tests - Only testing methods used by frontend calendar
// ============================================================================
describe('ServiceService (Unit) - Calendar Focus', () => {
    let service;
    let model;
    beforeEach(async () => {
        const mockExec = jest.fn();
        const mockFind = jest.fn().mockReturnValue({
            exec: mockExec,
        });
        const mockModel = {
            find: mockFind,
        };
        const module = await testing_1.Test.createTestingModule({
            providers: [
                service_service_1.ServiceService,
                {
                    provide: (0, mongoose_1.getModelToken)(service_schema_1.Service.name),
                    useValue: mockModel,
                },
            ],
        }).compile();
        service = module.get(service_service_1.ServiceService);
        model = module.get((0, mongoose_1.getModelToken)(service_schema_1.Service.name));
    });
    describe('findAll - Used by frontend calendar', () => {
        it('should return services for a user', async () => {
            const userId = 'test-user';
            const expectedResult = [
                {
                    _id: 'service-1',
                    name: 'Test Service 1',
                    price: 100,
                    isAvailable: true,
                    userId: userId,
                },
                {
                    _id: 'service-2',
                    name: 'Test Service 2',
                    price: 200,
                    isAvailable: false,
                    userId: userId,
                },
            ];
            model.find().exec.mockResolvedValue(expectedResult);
            const result = await service.findAll(userId);
            expect(model.find).toHaveBeenCalledWith({
                userId: { $eq: userId },
                isDeleted: { $ne: true },
            });
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
            model.find().exec.mockResolvedValue(expectedResult);
            const result = await service.findAll();
            expect(model.find).toHaveBeenCalledWith({ isDeleted: { $ne: true } });
            expect(result).toEqual(expectedResult);
        });
        it('should handle empty results', async () => {
            const userId = 'test-user';
            const expectedResult = [];
            model.find().exec.mockResolvedValue(expectedResult);
            const result = await service.findAll(userId);
            expect(model.find).toHaveBeenCalledWith({
                userId: { $eq: userId },
                isDeleted: { $ne: true },
            });
            expect(result).toEqual([]);
        });
        it('should handle database errors', async () => {
            const userId = 'test-user';
            const error = new Error('Database connection failed');
            model.find().exec.mockRejectedValue(error);
            await expect(service.findAll(userId)).rejects.toThrow('Database connection failed');
        });
    });
});
//# sourceMappingURL=calendar-service.service.unit.test.js.map