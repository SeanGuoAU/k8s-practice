"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
const testing_1 = require("@nestjs/testing");
const supertest_1 = __importDefault(require("supertest"));
const app_module_1 = require("../../../src/modules/app.module");
const database_helper_1 = require("../../helpers/database.helper");
const setup_1 = require("../../setup");
// ============================================================================
// Service Integration Tests - Only testing methods used by frontend calendar
// ============================================================================
describe('ServiceController (Integration) - Calendar Focus', () => {
    let app;
    let dbHelper;
    let userId;
    beforeEach(async () => {
        const moduleFixture = await testing_1.Test.createTestingModule({
            imports: [app_module_1.AppModule],
        }).compile();
        app = moduleFixture.createNestApplication();
        app.useGlobalPipes(new common_1.ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }));
        await app.init();
        dbHelper = new database_helper_1.DatabaseTestHelper(moduleFixture);
        // Create a test user
        const user = await dbHelper.createUser({
            _id: setup_1.TEST_USER._id,
            email: setup_1.TEST_USER.email,
            firstName: 'Test',
            lastName: 'User',
            fullPhoneNumber: '+61123456789',
            position: 'Manager',
        });
        userId = user._id.toString();
    });
    afterEach(async () => {
        await dbHelper.cleanupAll();
    });
    afterAll(async () => {
        await app.close();
    });
    describe('GET /service - Used by frontend calendar', () => {
        it('should return all services for a user', async () => {
            // Create test services
            await dbHelper.createService({
                name: 'Service 1',
                description: 'Test service 1',
                duration: 60,
                price: 100,
                userId: userId,
                isActive: true,
            });
            await dbHelper.createService({
                name: 'Service 2',
                description: 'Test service 2',
                duration: 90,
                price: 150,
                userId: userId,
                isActive: true,
            });
            const res = await (0, supertest_1.default)(app.getHttpServer())
                .get('/service')
                .query({ userId })
                .expect(200);
            expect(res.body).toHaveLength(2);
            expect(res.body[0]).toMatchObject({
                name: 'Service 1',
                description: 'Test service 1',
                price: 100,
            });
        });
        it('should return empty array when no services exist', async () => {
            const res = await (0, supertest_1.default)(app.getHttpServer())
                .get('/service')
                .query({ userId })
                .expect(200);
            expect(res.body).toEqual([]);
        });
        it('should return all services when no userId provided', async () => {
            // Create services for different users
            await dbHelper.createService({
                name: 'Service 1',
                description: 'Test service 1',
                duration: 60,
                price: 100,
                userId: userId,
                isActive: true,
            });
            await dbHelper.createService({
                name: 'Service 2',
                description: 'Test service 2',
                duration: 90,
                price: 150,
                userId: 'other-user',
                isActive: true,
            });
            const res = await (0, supertest_1.default)(app.getHttpServer())
                .get('/service')
                .expect(200);
            expect(res.body).toHaveLength(2);
        });
        it('should filter services by userId when provided', async () => {
            // Create service for current user
            await dbHelper.createService({
                name: 'User Service',
                description: 'User specific service',
                duration: 60,
                price: 100,
                userId: userId,
                isActive: true,
            });
            // Create service for different user
            await dbHelper.createService({
                name: 'Other Service',
                description: 'Other user service',
                duration: 90,
                price: 150,
                userId: 'other-user',
                isActive: true,
            });
            const res = await (0, supertest_1.default)(app.getHttpServer())
                .get('/service')
                .query({ userId })
                .expect(200);
            expect(res.body).toHaveLength(1);
            expect(res.body[0]).toMatchObject({
                name: 'User Service',
                description: 'User specific service',
            });
        });
        it('should handle invalid userId format', async () => {
            const res = await (0, supertest_1.default)(app.getHttpServer())
                .get('/service')
                .query({ userId: 'invalid-id' })
                .expect(200);
            expect(res.body).toEqual([]);
        });
    });
});
//# sourceMappingURL=calendar-service.integration.test.js.map