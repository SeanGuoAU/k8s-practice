"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
describe('Health Check (Unit)', () => {
    it('should be defined', () => {
        expect(true).toBe(true);
    });
    it('should have a valid test environment', () => {
        expect(process.env.NODE_ENV).toBe('test');
    });
});
//# sourceMappingURL=health.test.js.map