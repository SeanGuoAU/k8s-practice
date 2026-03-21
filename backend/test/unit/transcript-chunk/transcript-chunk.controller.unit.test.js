"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const transcript_chunk_controller_1 = require("../../../src/modules/transcript-chunk/transcript-chunk.controller");
const transcript_chunk_service_1 = require("../../../src/modules/transcript-chunk/transcript-chunk.service");
const fixtures_1 = require("../../fixtures");
// ============================================================================
// TranscriptChunk Controller Unit Tests - Testing individual methods with mocked dependencies
// ============================================================================
describe('TranscriptChunkController (Unit)', () => {
    let controller;
    let service;
    beforeEach(async () => {
        const mockService = {
            create: jest.fn(),
            createMany: jest.fn(),
            findAll: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
        };
        const module = await testing_1.Test.createTestingModule({
            controllers: [transcript_chunk_controller_1.TranscriptChunkController],
            providers: [
                {
                    provide: transcript_chunk_service_1.TranscriptChunkService,
                    useValue: mockService,
                },
            ],
        }).compile();
        controller = module.get(transcript_chunk_controller_1.TranscriptChunkController);
        service = module.get(transcript_chunk_service_1.TranscriptChunkService);
    });
    describe('create', () => {
        it('should create a single transcript chunk', async () => {
            const transcriptId = 'transcript-123';
            const createChunkDto = (0, fixtures_1.createMockTranscriptChunkDto)();
            const expectedResult = fixtures_1.staticTranscriptChunks[0];
            service.create.mockResolvedValue(expectedResult);
            const result = await controller.create(transcriptId, createChunkDto);
            expect(service.create).toHaveBeenCalledWith(transcriptId, createChunkDto);
            expect(result).toEqual(expectedResult);
        });
        it('should create multiple transcript chunks', async () => {
            const transcriptId = 'transcript-123';
            const createChunksDto = fixtures_1.mockCreateMultipleChunksDto;
            const expectedResult = fixtures_1.staticTranscriptChunks;
            service.createMany.mockResolvedValue(expectedResult);
            const result = await controller.create(transcriptId, createChunksDto);
            expect(service.createMany).toHaveBeenCalledWith(transcriptId, createChunksDto);
            expect(result).toEqual(expectedResult);
        });
    });
    describe('findAll', () => {
        it('should return paginated transcript chunks', async () => {
            const transcriptId = 'transcript-123';
            const query = fixtures_1.mockQueryParams;
            const expectedResult = {
                data: fixtures_1.staticTranscriptChunks,
                pagination: fixtures_1.mockPaginationResponse,
            };
            service.findAll.mockResolvedValue(expectedResult);
            const result = await controller.findAll(transcriptId, query);
            expect(service.findAll).toHaveBeenCalledWith(transcriptId, query);
            expect(result).toEqual(expectedResult);
        });
        it('should handle empty query parameters', async () => {
            const transcriptId = 'transcript-123';
            const query = {};
            const expectedResult = {
                data: fixtures_1.staticTranscriptChunks,
                pagination: fixtures_1.mockPaginationResponse,
            };
            service.findAll.mockResolvedValue(expectedResult);
            const result = await controller.findAll(transcriptId, query);
            expect(service.findAll).toHaveBeenCalledWith(transcriptId, query);
            expect(result).toEqual(expectedResult);
        });
    });
    describe('findOne', () => {
        it('should return a single transcript chunk', async () => {
            const transcriptId = 'transcript-123';
            const chunkId = 'chunk-123';
            const expectedResult = fixtures_1.staticTranscriptChunks[0];
            service.findOne.mockResolvedValue(expectedResult);
            const result = await controller.findOne(transcriptId, chunkId);
            expect(service.findOne).toHaveBeenCalledWith(transcriptId, chunkId);
            expect(result).toEqual(expectedResult);
        });
    });
    describe('update', () => {
        it('should update a transcript chunk', async () => {
            const chunkId = 'chunk-123';
            const updateDto = { text: 'Updated text' };
            const expectedResult = { ...fixtures_1.staticTranscriptChunks[0], ...updateDto };
            service.update.mockResolvedValue(expectedResult);
            const result = await controller.update(chunkId, updateDto);
            expect(service.update).toHaveBeenCalledWith(chunkId, updateDto);
            expect(result).toEqual(expectedResult);
        });
    });
    describe('delete', () => {
        it('should delete a transcript chunk', async () => {
            const chunkId = 'chunk-123';
            const expectedResult = fixtures_1.staticTranscriptChunks[0];
            service.delete.mockResolvedValue(expectedResult);
            const result = await controller.delete(chunkId);
            expect(service.delete).toHaveBeenCalledWith(chunkId);
            expect(result).toEqual(expectedResult);
        });
    });
});
//# sourceMappingURL=transcript-chunk.controller.unit.test.js.map