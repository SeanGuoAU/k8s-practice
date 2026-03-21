"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const service_booking_controller_1 = require("../../../src/modules/service-booking/service-booking.controller");
const service_booking_service_1 = require("../../../src/modules/service-booking/service-booking.service");
const fixtures_1 = require("../../fixtures");
// ============================================================================
// Service Booking Controller Unit Tests - Only testing methods used by frontend calendar
// ============================================================================
describe('ServiceBookingController (Unit) - Calendar Focus', () => {
    let controller;
    let service;
    beforeEach(async () => {
        const mockService = {
            findAll: jest.fn(),
        };
        const module = await testing_1.Test.createTestingModule({
            controllers: [service_booking_controller_1.ServiceBookingController],
            providers: [
                {
                    provide: service_booking_service_1.ServiceBookingService,
                    useValue: mockService,
                },
            ],
        }).compile();
        controller = module.get(service_booking_controller_1.ServiceBookingController);
        service = module.get(service_booking_service_1.ServiceBookingService);
    });
    describe('findAllBookings - Used by frontend calendar', () => {
        it('should return all service bookings for a user', async () => {
            const userId = 'test-user';
            const expectedResult = [fixtures_1.staticServiceBooking];
            service.findAll.mockResolvedValue(expectedResult);
            const result = await controller.findAllBookings(userId);
            expect(service.findAll).toHaveBeenCalledWith(userId);
            expect(result).toEqual(expectedResult);
        });
        it('should return all service bookings when no userId provided', async () => {
            const expectedResult = [fixtures_1.staticServiceBooking];
            service.findAll.mockResolvedValue(expectedResult);
            const result = await controller.findAllBookings();
            expect(service.findAll).toHaveBeenCalledWith(undefined);
            expect(result).toEqual(expectedResult);
        });
        it('should handle empty results', async () => {
            const userId = 'test-user';
            const expectedResult = [];
            service.findAll.mockResolvedValue(expectedResult);
            const result = await controller.findAllBookings(userId);
            expect(service.findAll).toHaveBeenCalledWith(userId);
            expect(result).toEqual([]);
        });
        it('should handle service errors', async () => {
            const userId = 'test-user';
            const error = new Error('Service error');
            service.findAll.mockRejectedValue(error);
            await expect(controller.findAllBookings(userId)).rejects.toThrow('Service error');
        });
    });
});
//# sourceMappingURL=calendar-booking.controller.unit.test.js.map