"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TEST_USER = void 0;
const dotenv_1 = require("dotenv");
// If running tests with in-memory MongoDB, ensure devDependency 'mongodb-memory-server' is installed
const mongodb_memory_server_1 = require("mongodb-memory-server");
const mongoose_1 = __importDefault(require("mongoose"));
const path_1 = require("path");
// Load test environment variables from .env.example
(0, dotenv_1.config)({ path: (0, path_1.resolve)(__dirname, '../.env.example') });
// IMPORTANT: Set environment variables BEFORE any modules are imported
process.env.NODE_ENV = 'test';
process.env.DISABLE_AUTH = 'true';
// Check if we should use in-memory MongoDB
// Default to true unless explicitly disabled
const useInMemory = process.env.USE_LOCAL_MONGODB !== 'true';
// Mock Twilio module globally to bypass Twilio initialization in tests
jest.mock('../src/lib/twilio/twilio.module', () => {
    const mockTwilioClient = {
        calls: {
            create: jest.fn(),
            list: jest.fn(),
        },
        messages: {
            create: jest.fn(),
            list: jest.fn(),
        },
    };
    return {
        TwilioModule: jest.fn().mockImplementation(() => ({
            providers: [
                {
                    provide: 'TWILIO_CLIENT',
                    useValue: mockTwilioClient,
                },
            ],
        })),
        TWILIO_CLIENT: 'TWILIO_CLIENT',
    };
});
// Mock Twilio client
jest.mock('twilio', () => {
    return jest.fn().mockReturnValue({
        // Add any Twilio methods that might be used in tests
        calls: {
            create: jest.fn(),
            list: jest.fn(),
        },
        messages: {
            create: jest.fn(),
            list: jest.fn(),
        },
    });
});
// Mock AuthGuard globally to bypass authentication in tests
jest.mock('@nestjs/passport', () => {
    const originalModule = jest.requireActual('@nestjs/passport');
    return {
        ...originalModule,
        AuthGuard: (_strategy) => {
            return class MockAuthGuard {
                canActivate() {
                    return true; // Always allow access in tests
                }
            };
        },
    };
});
// Mock JWT strategy to provide a default user for tests
jest.mock('../src/modules/auth/strategies/jwt.strategy', () => {
    return {
        JwtStrategy: class MockJwtStrategy {
            validate() {
                // Return a default test user
                return {
                    _id: '507f1f77bcf86cd799439011',
                    email: 'test@example.com',
                    role: 'user',
                    status: 'active',
                };
            }
        },
    };
});
// Mock CSRF Guard globally to bypass CSRF protection in tests
jest.mock('../src/common/guards/csrf.guard', () => {
    return {
        CSRFGuard: class MockCSRFGuard {
            canActivate() {
                return true; // Always allow access in tests
            }
        },
    };
});
// Mock HealthService to prevent heartbeat timers in tests
jest.mock('../src/modules/health/health.service', () => {
    return {
        HealthService: class MockHealthService {
            onModuleInit() {
                // Do nothing - prevent timers from starting
            }
            onModuleDestroy() {
                // Do nothing
            }
            check() {
                return {
                    status: 'ok',
                    timestamp: new Date(),
                    service: 'dispatchAI API',
                    environment: 'test',
                };
            }
            checkDatabase() {
                return {
                    status: 'ok',
                    mongo: true,
                    redis: true,
                    timestamp: new Date(),
                };
            }
        },
    };
});
// Export test user data for use in tests
exports.TEST_USER = {
    _id: '507f1f77bcf86cd799439011',
    email: 'test@example.com',
    role: 'user',
    status: 'active',
};
// Mock Redis (ioredis) globally to avoid external Redis during tests
jest.mock('ioredis', () => {
    const mockRedis = jest.fn().mockImplementation(() => ({
        on: jest.fn(),
        get: jest.fn().mockResolvedValue(null),
        set: jest.fn().mockResolvedValue('OK'),
        del: jest.fn().mockResolvedValue(1),
        quit: jest.fn().mockResolvedValue(undefined),
        disconnect: jest.fn(),
    }));
    // also export Cluster constructor if used anywhere
    mockRedis.Cluster = jest.fn().mockImplementation(() => ({
        on: jest.fn(),
        quit: jest.fn(),
        disconnect: jest.fn(),
    }));
    return mockRedis;
});
let mongoServer = null;
// Global test setup
beforeAll(async () => {
    // Use in-memory MongoDB in CI or when explicitly requested
    if (useInMemory) {
        mongoServer = await mongodb_memory_server_1.MongoMemoryServer.create();
        process.env.MONGODB_URI = mongoServer.getUri();
    }
    else {
        // Fallback to local Mongo
        process.env.MONGODB_URI =
            process.env.MONGODB_URI || 'mongodb://localhost:27017/test';
    }
    // Connect to test database
    try {
        const mongoUri = process.env.MONGODB_URI ?? '';
        await mongoose_1.default.connect(mongoUri, {
            // Add connection options for better reliability in CI
            maxPoolSize: 5,
            serverSelectionTimeoutMS: 10000,
            socketTimeoutMS: 45000,
            connectTimeoutMS: 10000,
            // In CI, we want to ensure we get a fresh database
            dbName: process.env.CI ? 'test-ci' : 'test',
        });
    }
    catch (error) {
        console.error('Failed to connect to test database:', error.message);
        // In CI environment, we want to fail fast
        if (process.env.CI) {
            throw error;
        }
        // Don't throw error here, let individual tests handle it
    }
}, 30000);
// Global test teardown
afterAll(async () => {
    try {
        // Clean up all collections before closing
        const collections = mongoose_1.default.connection.collections;
        for (const key in collections) {
            const collection = collections[key];
            await collection.deleteMany({});
        }
        await mongoose_1.default.connection.close();
        if (mongoServer) {
            await mongoServer.stop();
            mongoServer = null;
        }
    }
    catch (error) {
        console.error('Error closing test database connection:', error.message);
    }
});
// Global beforeEach to clean database before each test
beforeEach(async () => {
    try {
        // Clean up all collections before each test
        const collections = mongoose_1.default.connection.collections;
        for (const key in collections) {
            const collection = collections[key];
            await collection.deleteMany({});
        }
    }
    catch (error) {
        console.error('Error cleaning database before test:', error.message);
    }
});
// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});
// Handle uncaught exceptions
process.on('uncaughtException', error => {
    console.error('Uncaught Exception:', error);
});
//# sourceMappingURL=setup.js.map