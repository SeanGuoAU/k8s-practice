"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("@nestjs/mongoose");
const testing_1 = require("@nestjs/testing");
const service_booking_schema_1 = require("../../../src/modules/service-booking/schema/service-booking.schema");
const service_booking_service_1 = require("../../../src/modules/service-booking/service-booking.service");
const fixtures_1 = require("../../fixtures");
// ============================================================================
// Service Booking Service Unit Tests - Only testing methods used by frontend calendar
// ============================================================================
describe('ServiceBookingService (Unit) - Calendar Focus', () => {
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
                service_booking_service_1.ServiceBookingService,
                {
                    provide: (0, mongoose_1.getModelToken)(service_booking_schema_1.ServiceBooking.name),
                    useValue: mockModel,
                },
            ],
        }).compile();
        service = module.get(service_booking_service_1.ServiceBookingService);
        model = module.get((0, mongoose_1.getModelToken)(service_booking_schema_1.ServiceBooking.name));
    });
    describe('findAll - Used by frontend calendar', () => {
        it('should return service bookings for a user', async () => {
            const userId = 'test-user';
            const expectedResult = [fixtures_1.staticServiceBooking];
            model.find().exec.mockResolvedValue(expectedResult);
            const result = await service.findAll(userId);
            expect(model.find).toHaveBeenCalledWith({ userId: { $eq: userId } });
            expect(result).toEqual(expectedResult);
        });
        it('should return all service bookings when no userId provided', async () => {
            const expectedResult = [fixtures_1.staticServiceBooking];
            model.find().exec.mockResolvedValue(expectedResult);
            const result = await service.findAll();
            expect(model.find).toHaveBeenCalledWith({});
            expect(result).toEqual(expectedResult);
        });
        it('should handle empty results', async () => {
            const userId = 'test-user';
            const expectedResult = [];
            model.find().exec.mockResolvedValue(expectedResult);
            const result = await service.findAll(userId);
            expect(model.find).toHaveBeenCalledWith({ userId: { $eq: userId } });
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
//# sourceMappingURL=calendar-booking.service.unit.test.js.map