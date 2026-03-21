"use strict";
// ============================================================================
// Mock Data Unified Export - Provides clean API for all mock data
// ============================================================================
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createUsers = exports.createUser = exports.createTranscript = exports.createChunks = exports.createChunk = exports.createCallLogs = exports.createCallLog = exports.createServiceBookings = exports.createServiceBooking = void 0;
// Static mock data exports
__exportStar(require("./static/calendar"), exports);
__exportStar(require("./static/calllog"), exports);
__exportStar(require("./static/common"), exports);
__exportStar(require("./static/setting"), exports);
__exportStar(require("./static/transcript"), exports);
__exportStar(require("./static/user"), exports);
// Dynamic mock data generator exports
__exportStar(require("./dynamic/calendar"), exports);
__exportStar(require("./dynamic/calllog"), exports);
__exportStar(require("./dynamic/common"), exports);
__exportStar(require("./dynamic/setting"), exports);
__exportStar(require("./dynamic/transcript"), exports);
__exportStar(require("./dynamic/user"), exports);
// Convenient aliases for commonly used functions
var calendar_1 = require("./dynamic/calendar");
Object.defineProperty(exports, "createServiceBooking", { enumerable: true, get: function () { return calendar_1.createMockServiceBookingDto; } });
Object.defineProperty(exports, "createServiceBookings", { enumerable: true, get: function () { return calendar_1.createMockServiceBookings; } });
var calllog_1 = require("./dynamic/calllog");
Object.defineProperty(exports, "createCallLog", { enumerable: true, get: function () { return calllog_1.createMockCallLogDto; } });
Object.defineProperty(exports, "createCallLogs", { enumerable: true, get: function () { return calllog_1.createMockCallLogDtos; } });
var transcript_1 = require("./dynamic/transcript");
Object.defineProperty(exports, "createChunk", { enumerable: true, get: function () { return transcript_1.createMockTranscriptChunkDto; } });
Object.defineProperty(exports, "createChunks", { enumerable: true, get: function () { return transcript_1.createMockTranscriptChunkDtos; } });
Object.defineProperty(exports, "createTranscript", { enumerable: true, get: function () { return transcript_1.createMockTranscriptDto; } });
var user_1 = require("./dynamic/user");
Object.defineProperty(exports, "createUser", { enumerable: true, get: function () { return user_1.createMockUserDto; } });
Object.defineProperty(exports, "createUsers", { enumerable: true, get: function () { return user_1.createMockUserDtos; } });
//# sourceMappingURL=index.js.map