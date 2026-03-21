"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const calllog_controller_1 = require("../../../src/modules/calllog/calllog.controller");
const calllog_service_1 = require("../../../src/modules/calllog/calllog.service");
const fixtures_1 = require("../../fixtures");
// ============================================================================
// CallLog Controller Unit Tests - Testing individual methods with mocked dependencies
// ============================================================================
describe('CalllogController (Unit)', () => {
    let controller;
    let service;
    beforeEach(async () => {
        const mockService = {
            create: jest.fn(),
            findAll: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
            getSummary: jest.fn(),
            getTodayMetrics: jest.fn(),
        };
        const module = await testing_1.Test.createTestingModule({
            controllers: [calllog_controller_1.CalllogController],
            providers: [
                {
                    provide: calllog_service_1.CalllogService,
                    useValue: mockService,
                },
            ],
        }).compile();
        controller = module.get(calllog_controller_1.CalllogController);
        service = module.get(calllog_service_1.CalllogService);
    });
    describe('create', () => {
        it('should create a call log', async () => {
            const createCallLogDto = (0, fixtures_1.createMockCallLogDto)();
            const expectedResult = { ...fixtures_1.staticCallLog, ...createCallLogDto };
            service.create.mockResolvedValue(expectedResult);
            const result = await controller.create('user-123', createCallLogDto);
            expect(service.create).toHaveBeenCalledWith({
                ...createCallLogDto,
                userId: 'user-123',
            });
            expect(result).toEqual(expectedResult);
        });
    });
    describe('findAll', () => {
        it('should return paginated call logs', async () => {
            const expectedResult = {
                data: [fixtures_1.staticCallLog],
                pagination: {
                    page: 1,
                    limit: 10,
                    total: 1,
                    totalPages: 1,
                    hasNextPage: false,
                    hasPreviousPage: false,
                },
            };
            service.findAll.mockResolvedValue(expectedResult);
            const result = await controller.findAll('user-123');
            expect(service.findAll).toHaveBeenCalledWith({
                userId: 'user-123',
                search: undefined,
                startAtFrom: undefined,
                startAtTo: undefined,
                sort: undefined,
                page: 1,
                limit: 10,
                fields: undefined,
            });
            expect(result).toEqual(expectedResult);
        });
        it('should handle query parameters', async () => {
            const queryParams = {
                search: 'test',
                startAtFrom: '2025-01-01',
                startAtTo: '2025-01-31',
                sort: 'newest',
                page: 2,
                limit: 20,
                fields: 'id,status',
            };
            const expectedResult = {
                data: [fixtures_1.staticCallLog],
                pagination: {
                    page: 2,
                    limit: 20,
                    total: 1,
                    totalPages: 1,
                },
            };
            service.findAll.mockResolvedValue(expectedResult);
            const result = await controller.findAll('user-123', queryParams.search, queryParams.startAtFrom, queryParams.startAtTo, queryParams.sort, queryParams.page, queryParams.limit, queryParams.fields);
            expect(service.findAll).toHaveBeenCalledWith({
                userId: 'user-123',
                search: 'test',
                startAtFrom: '2025-01-01',
                startAtTo: '2025-01-31',
                sort: 'newest',
                page: 2,
                limit: 20,
                fields: { id: 1, status: 1 },
            });
            expect(result).toEqual(expectedResult);
        });
    });
    describe('findOne', () => {
        it('should return a single call log', async () => {
            const calllogId = 'calllog-123';
            const expectedResult = fixtures_1.staticCallLog;
            service.findOne.mockResolvedValue(expectedResult);
            const result = await controller.findOne('user-123', calllogId);
            expect(service.findOne).toHaveBeenCalledWith('user-123', calllogId);
            expect(result).toEqual(expectedResult);
        });
    });
    describe('update', () => {
        it('should update a call log', async () => {
            const calllogId = 'calllog-123';
            const updateDto = { callerName: 'Updated Name' };
            const expectedResult = { ...fixtures_1.staticCallLog, ...updateDto };
            service.update.mockResolvedValue(expectedResult);
            const result = await controller.update('user-123', calllogId, updateDto);
            expect(service.update).toHaveBeenCalledWith('user-123', calllogId, updateDto);
            expect(result).toEqual(expectedResult);
        });
    });
    describe('delete', () => {
        it('should delete a call log', async () => {
            const calllogId = 'calllog-123';
            const expectedResult = fixtures_1.staticCallLog;
            service.delete.mockResolvedValue(expectedResult);
            const result = await controller.delete('user-123', calllogId);
            expect(service.delete).toHaveBeenCalledWith('user-123', calllogId);
            expect(result).toEqual(expectedResult);
        });
    });
    describe('getSummary', () => {
        it('should return call logs summary', async () => {
            const expectedResult = {
                totalCalls: 10,
                totalDuration: 3600,
                averageDuration: 360,
                averageCallDuration: 360,
            };
            service.getSummary.mockResolvedValue(expectedResult);
            const result = await controller.getSummary('user-123');
            expect(service.getSummary).toHaveBeenCalledWith('user-123', undefined, undefined);
            expect(result).toEqual(expectedResult);
        });
        it('should handle date range parameters', async () => {
            const startAtFrom = '2025-01-01';
            const startAtTo = '2025-01-31';
            const expectedResult = {
                totalCalls: 5,
                averageCallDuration: 360,
            };
            service.getSummary.mockResolvedValue(expectedResult);
            const result = await controller.getSummary('user-123', startAtFrom, startAtTo);
            expect(service.getSummary).toHaveBeenCalledWith('user-123', startAtFrom, startAtTo);
            expect(result).toEqual(expectedResult);
        });
    });
    describe('getTodayMetrics', () => {
        it('should return today metrics', async () => {
            const serviceResult = { totalCalls: 5 };
            const expectedResult = { totalCalls: 5 };
            service.getTodayMetrics.mockResolvedValue(serviceResult);
            const result = await controller.getTodayMetrics('user-123');
            expect(service.getTodayMetrics).toHaveBeenCalledWith('user-123');
            expect(result).toEqual(expectedResult);
        });
        it('should handle non-numeric totalCalls', async () => {
            const serviceResult = { totalCalls: 'invalid' };
            const expectedResult = { totalCalls: 0 };
            service.getTodayMetrics.mockResolvedValue(serviceResult);
            const result = await controller.getTodayMetrics('user-123');
            expect(service.getTodayMetrics).toHaveBeenCalledWith('user-123');
            expect(result).toEqual(expectedResult);
        });
    });
});
//# sourceMappingURL=calllog.controller.unit.test.js.map