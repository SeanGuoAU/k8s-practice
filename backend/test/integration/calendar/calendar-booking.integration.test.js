"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const mongoose_1 = require("mongoose");
const supertest_1 = __importDefault(require("supertest"));
const app_module_1 = require("../../../src/modules/app.module");
const fixtures_1 = require("../../fixtures");
const database_helper_1 = require("../../helpers/database.helper");
// ============================================================================
// Service Booking Integration Tests - Only testing methods used by frontend calendar
// ============================================================================
describe('ServiceBookingController (Integration) - Calendar Focus', () => {
    let app;
    let moduleFixture;
    let dbHelper;
    const testUserId = 'user-123';
    beforeAll(async () => {
        try {
            moduleFixture = await testing_1.Test.createTestingModule({
                imports: [app_module_1.AppModule],
            }).compile();
            app = moduleFixture.createNestApplication();
            await app.init();
            dbHelper = new database_helper_1.DatabaseTestHelper(moduleFixture);
        }
        catch (error) {
            console.error('Error in beforeAll:', error.message);
            throw error;
        }
    }, 30000);
    beforeEach(async () => {
        // Clean up before each test
        if (dbHelper) {
            await dbHelper.cleanupAll();
        }
    });
    afterEach(async () => {
        // Clean up after each test
        if (dbHelper) {
            await dbHelper.cleanupAll();
        }
    });
    afterAll(async () => {
        try {
            if (app)
                await app.close();
        }
        catch (error) {
            console.error('Error closing app:', error.message);
        }
    });
    describe('GET /bookings - Used by frontend calendar', () => {
        it('should return all service bookings for a user', async () => {
            // Create test bookings
            await dbHelper.createServiceBooking({
                ...(0, fixtures_1.createMockServiceBookingDto)(),
                userId: testUserId,
                client: { name: 'Client 1', phoneNumber: '1234567890' },
                status: 'Confirmed',
            });
            await dbHelper.createServiceBooking({
                ...(0, fixtures_1.createMockServiceBookingDto)(),
                userId: testUserId,
                client: { name: 'Client 2', phoneNumber: '0987654321' },
                status: 'Done',
            });
            const res = await (0, supertest_1.default)(app.getHttpServer())
                .get('/bookings')
                .query({ userId: testUserId })
                .expect(200);
            expect(res.body).toHaveLength(2);
            // Check that we have the expected bookings with correct data
            const booking1 = res.body.find((b) => b.client.name === 'Client 1');
            const booking2 = res.body.find((b) => b.client.name === 'Client 2');
            expect(booking1).toBeDefined();
            expect(booking1.client).toEqual({
                _id: expect.any(String),
                name: 'Client 1',
                phoneNumber: '1234567890',
            });
            expect(booking1.status).toBe('Confirmed');
            expect(booking2).toBeDefined();
            expect(booking2.client).toEqual({
                _id: expect.any(String),
                name: 'Client 2',
                phoneNumber: '0987654321',
            });
            expect(booking2.status).toBe('Done');
        });
        it('should return empty array when no bookings exist', async () => {
            const res = await (0, supertest_1.default)(app.getHttpServer())
                .get('/bookings')
                .query({ userId: testUserId })
                .expect(200);
            expect(res.body).toEqual([]);
        });
        it('should return all bookings when no userId provided', async () => {
            // Create bookings for different users
            await dbHelper.createServiceBooking({
                ...(0, fixtures_1.createMockServiceBookingDto)(),
                userId: testUserId,
                client: { name: 'Client 1' },
            });
            await dbHelper.createServiceBooking({
                ...(0, fixtures_1.createMockServiceBookingDto)(),
                userId: new mongoose_1.Types.ObjectId().toString(),
                client: { name: 'Client 2' },
            });
            const res = await (0, supertest_1.default)(app.getHttpServer())
                .get('/bookings')
                .expect(200);
            expect(res.body).toHaveLength(2);
        });
        it('should filter bookings by userId when provided', async () => {
            const otherUserId = new mongoose_1.Types.ObjectId().toString();
            // Create booking for current user
            await dbHelper.createServiceBooking({
                ...(0, fixtures_1.createMockServiceBookingDto)(),
                userId: testUserId,
                client: { name: 'User Client' },
            });
            // Create booking for other user
            await dbHelper.createServiceBooking({
                ...(0, fixtures_1.createMockServiceBookingDto)(),
                userId: otherUserId,
                client: { name: 'Other Client' },
            });
            const res = await (0, supertest_1.default)(app.getHttpServer())
                .get('/bookings')
                .query({ userId: testUserId })
                .expect(200);
            expect(res.body).toHaveLength(1);
            // Check that we have the expected booking with correct data
            const userBooking = res.body[0];
            expect(userBooking).toBeDefined();
            expect(userBooking.client).toEqual({
                _id: expect.any(String),
                name: 'User Client',
            });
            expect(userBooking.userId).toBe(testUserId);
        });
        it('should handle invalid userId format', async () => {
            const res = await (0, supertest_1.default)(app.getHttpServer())
                .get('/bookings')
                .query({ userId: 'invalid-id' })
                .expect(200);
            expect(res.body).toEqual([]);
        });
    });
});
//# sourceMappingURL=calendar-booking.integration.test.js.map