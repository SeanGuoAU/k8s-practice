"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createMockTranscriptDto = createMockTranscriptDto;
exports.createMockTranscriptChunkDto = createMockTranscriptChunkDto;
exports.createMockTranscriptChunkDtos = createMockTranscriptChunkDtos;
const common_1 = require("./common");
// ============================================================================
// Transcript Dynamic Mock Data Generators - For integration tests
// ============================================================================
/**
 * Generate a random Transcript DTO for integration tests
 */
function createMockTranscriptDto(overrides = {}) {
    return {
        summary: 'Test summary for dynamic transcript ' + (0, common_1.generateRandomNumber)(1000),
        keyPoints: [
            'Key point 1 for dynamic test',
            'Key point 2 for dynamic test',
            'Key point 3 for dynamic test',
        ],
        ...overrides,
    };
}
/**
 * Generate a random TranscriptChunk DTO for integration tests
 */
function createMockTranscriptChunkDto(overrides = {}) {
    return {
        speakerType: Math.random() > 0.5 ? 'AI' : 'User',
        text: 'Dynamic test text ' + (0, common_1.generateRandomNumber)(1000),
        startAt: (0, common_1.generateRandomNumber)(3600), // 0-3600 seconds
        ...overrides,
    };
}
/**
 * Generate multiple random TranscriptChunk DTOs
 */
function createMockTranscriptChunkDtos(count, overrides = {}) {
    return Array.from({ length: count }, () => createMockTranscriptChunkDto(overrides));
}
//# sourceMappingURL=transcript.js.map