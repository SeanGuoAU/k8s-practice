"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const transcript_controller_1 = require("../../../src/modules/transcript/transcript.controller");
const transcript_service_1 = require("../../../src/modules/transcript/transcript.service");
const fixtures_1 = require("../../fixtures");
// ============================================================================
// Transcript Controller Unit Tests - Testing individual methods with mocked dependencies
// ============================================================================
describe('TranscriptController (Unit)', () => {
    let controller;
    let service;
    beforeEach(async () => {
        const mockService = {
            create: jest.fn(),
            findByCallLogId: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
            findCallLogById: jest.fn(),
        };
        const module = await testing_1.Test.createTestingModule({
            controllers: [transcript_controller_1.TranscriptController],
            providers: [
                {
                    provide: transcript_service_1.TranscriptService,
                    useValue: mockService,
                },
            ],
        }).compile();
        controller = module.get(transcript_controller_1.TranscriptController);
        service = module.get(transcript_service_1.TranscriptService);
    });
    describe('create', () => {
        it('should create a transcript', async () => {
            const calllogId = 'calllog-123';
            const createTranscriptDto = (0, fixtures_1.createMockTranscriptDto)();
            const mockCallLog = {
                callSid: 'CA1234567890abcdef',
                userId: 'user-123',
                callerNumber: '1234567890',
                startAt: new Date(),
            };
            const expectedResult = {
                ...fixtures_1.staticTranscript,
                ...createTranscriptDto,
                _id: fixtures_1.staticTranscript._id,
            };
            service.findCallLogById.mockResolvedValue(mockCallLog);
            service.create.mockResolvedValue(expectedResult);
            const result = await controller.create(calllogId, createTranscriptDto);
            expect(service.findCallLogById).toHaveBeenCalledWith(calllogId);
            expect(service.create).toHaveBeenCalledWith({
                callSid: mockCallLog.callSid,
                summary: createTranscriptDto.summary,
                keyPoints: createTranscriptDto.keyPoints,
            });
            expect(result).toEqual(expectedResult);
        });
    });
    describe('findByCalllogId', () => {
        it('should return transcript by call log ID', async () => {
            const calllogId = 'calllog-123';
            const expectedResult = fixtures_1.staticTranscript;
            service.findByCallLogId.mockResolvedValue(expectedResult);
            const result = await controller.findByCalllogId(calllogId);
            expect(service.findByCallLogId).toHaveBeenCalledWith(calllogId);
            expect(result).toEqual(expectedResult);
        });
    });
    describe('updateByCalllogId', () => {
        it('should update transcript by call log ID', async () => {
            const calllogId = 'calllog-123';
            const updateTranscriptDto = { summary: 'Updated summary' };
            const mockTranscript = {
                _id: 'transcript-123',
                callSid: 'CA1234567890abcdef',
                summary: 'Test summary',
            };
            const expectedResult = {
                ...fixtures_1.staticTranscript,
                ...updateTranscriptDto,
                _id: fixtures_1.staticTranscript._id,
            };
            service.findByCallLogId.mockResolvedValue(mockTranscript);
            service.update.mockResolvedValue(expectedResult);
            const result = await controller.updateByCalllogId(calllogId, updateTranscriptDto);
            expect(service.findByCallLogId).toHaveBeenCalledWith(calllogId);
            expect(service.update).toHaveBeenCalledWith(mockTranscript._id, updateTranscriptDto);
            expect(result).toEqual(expectedResult);
        });
    });
    describe('deleteByCalllogId', () => {
        it('should delete transcript by call log ID', async () => {
            const calllogId = 'calllog-123';
            const mockTranscript = {
                _id: 'transcript-123',
                callSid: 'CA1234567890abcdef',
                summary: 'Test summary',
            };
            const expectedResult = {
                ...fixtures_1.staticTranscript,
                _id: fixtures_1.staticTranscript._id,
            };
            service.findByCallLogId.mockResolvedValue(mockTranscript);
            service.delete.mockResolvedValue(expectedResult);
            const result = await controller.deleteByCalllogId(calllogId);
            expect(service.findByCallLogId).toHaveBeenCalledWith(calllogId);
            expect(service.delete).toHaveBeenCalledWith(mockTranscript._id);
            expect(result).toEqual(expectedResult);
        });
    });
});
//# sourceMappingURL=transcript.controller.unit.test.js.map