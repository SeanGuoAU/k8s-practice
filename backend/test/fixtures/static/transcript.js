"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mockPaginationResponse = exports.mockQueryParams = exports.mockCreateDuplicateChunksDto = exports.mockCreateMultipleChunksDto = exports.mockCreateChunkDto = exports.staticTranscriptChunks = exports.staticTranscript = void 0;
const common_1 = require("./common");
// ============================================================================
// Transcript Static Mock Data - For unit tests
// ============================================================================
// Static Transcript data for unit tests
exports.staticTranscript = {
    _id: common_1.mockObjectIds.transcriptId.toString(),
    callSid: common_1.testStrings.callSid,
    summary: 'Test summary for transcript',
    keyPoints: [
        "User Lee from Canada's warehouse needs room repair after hailstorm.",
        'Lee requests a booking for repair services.',
        'Suburb mentioned is Gungahlin, confirming service area.',
        'Sophiie offers to send a booking link for scheduling.',
        'User requests emergency assistance for a customer, advised to call emergency services.',
    ],
    createdAt: common_1.testDates.baseDate,
    updatedAt: common_1.testDates.baseDate,
};
// Static TranscriptChunk data for unit tests
exports.staticTranscriptChunks = [
    {
        _id: common_1.mockObjectIds.chunkId1.toString(),
        transcriptId: common_1.mockObjectIds.transcriptId.toString(),
        speakerType: 'AI',
        text: 'Hello, this is AI.',
        startAt: 0,
        createdAt: common_1.testDates.baseDate,
        updatedAt: common_1.testDates.baseDate,
    },
    {
        _id: common_1.mockObjectIds.chunkId2.toString(),
        transcriptId: common_1.mockObjectIds.transcriptId.toString(),
        speakerType: 'User',
        text: 'Hi, this is user.',
        startAt: 61,
        createdAt: common_1.testDates.baseDate,
        updatedAt: common_1.testDates.baseDate,
    },
];
// DTO data for creating transcript chunks
exports.mockCreateChunkDto = {
    speakerType: 'AI',
    text: 'Hello, this is AI.',
    startAt: 0,
};
exports.mockCreateMultipleChunksDto = [
    {
        speakerType: 'AI',
        text: 'Hello, this is AI.',
        startAt: 0,
    },
    {
        speakerType: 'User',
        text: 'Hi, this is user.',
        startAt: 61,
    },
];
exports.mockCreateDuplicateChunksDto = [
    {
        speakerType: 'AI',
        text: 'First chunk',
        startAt: 100,
    },
    {
        speakerType: 'User',
        text: 'Second chunk with same start time',
        startAt: 100, // Duplicate startAt
    },
];
// Query parameters for testing
exports.mockQueryParams = {
    speakerType: 'AI',
    startAt: 0,
    page: 1,
    limit: 20,
};
// Expected pagination response
exports.mockPaginationResponse = {
    page: 1,
    limit: 20,
    total: 2,
    totalPages: 1,
    hasNextPage: false,
    hasPrevPage: false,
};
//# sourceMappingURL=transcript.js.map