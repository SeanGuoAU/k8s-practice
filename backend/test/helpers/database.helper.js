"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DatabaseTestHelper = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const fixtures_1 = require("../fixtures");
class DatabaseTestHelper {
    constructor(moduleRef) {
        this.moduleRef = moduleRef;
        this.callLogModel = moduleRef.get((0, mongoose_1.getModelToken)('CallLog'));
        this.transcriptModel = moduleRef.get((0, mongoose_1.getModelToken)('Transcript'));
        this.transcriptChunkModel = moduleRef.get((0, mongoose_1.getModelToken)('TranscriptChunk'));
        this.settingModel = moduleRef.get((0, mongoose_1.getModelToken)('Setting'));
        this.userModel = moduleRef.get((0, mongoose_1.getModelToken)('User'));
        this.companyModel = moduleRef.get((0, mongoose_1.getModelToken)('Company'));
        this.planModel = moduleRef.get((0, mongoose_1.getModelToken)('Plan'));
        this.subscriptionModel = moduleRef.get((0, mongoose_1.getModelToken)('Subscription'));
        this.serviceBookingModel = moduleRef.get((0, mongoose_1.getModelToken)('ServiceBooking'));
        this.serviceModel = moduleRef.get((0, mongoose_1.getModelToken)('Service'));
    }
    async cleanupAll() {
        await Promise.all([
            this.transcriptChunkModel.deleteMany({}),
            this.transcriptModel.deleteMany({}),
            this.callLogModel.deleteMany({}),
            this.settingModel.deleteMany({}),
            this.userModel.deleteMany({}),
            this.companyModel.deleteMany({}),
            this.planModel.deleteMany({}),
            this.subscriptionModel.deleteMany({}),
            this.serviceBookingModel.deleteMany({}),
            this.serviceModel.deleteMany({}),
        ]);
    }
    async seedBasicData() {
        await this.callLogModel.create(fixtures_1.staticCallLog);
        await this.transcriptModel.create(fixtures_1.staticTranscript);
    }
    async seedTranscriptChunks() {
        await this.transcriptChunkModel.create(fixtures_1.staticTranscriptChunks);
    }
    async createTestTranscriptChunk(data) {
        return await this.transcriptChunkModel.create(data);
    }
    async findTranscriptChunkById(id) {
        return await this.transcriptChunkModel.findById(id);
    }
    async countTranscriptChunks(filter = {}) {
        return await this.transcriptChunkModel.countDocuments(filter);
    }
    async verifyTranscriptExists(transcriptId) {
        const transcript = await this.transcriptModel.findById(transcriptId);
        return !!transcript;
    }
    async createDuplicateStartTimeChunk(transcriptId, startAt) {
        return await this.transcriptChunkModel.create({
            transcriptId: new mongoose_2.Types.ObjectId(transcriptId),
            speakerType: 'AI',
            text: 'Original chunk',
            startAt,
        });
    }
    // Accessors for tests that need direct model access
    get userModelAccessor() {
        return this.userModel;
    }
    get planModelAccessor() {
        return this.planModel;
    }
    get subscriptionModelAccessor() {
        return this.subscriptionModel;
    }
    // Calendar-related helpers
    async createServiceBooking(data) {
        return await this.serviceBookingModel.create(data);
    }
    async createService(data) {
        return await this.serviceModel.create(data);
    }
    async createUser(user) {
        const userWithDefaults = {
            address: {
                unitAptPOBox: '',
                streetAddress: 'Default Test Street',
                suburb: 'Default Test Suburb',
                state: 'NSW',
                postcode: '2000',
            },
            ...user, // Allow override if provided
        };
        return await this.userModel.create(userWithDefaults);
    }
    async countServiceBookings(filter = {}) {
        return await this.serviceBookingModel.countDocuments(filter);
    }
    async countServices(filter = {}) {
        return await this.serviceModel.countDocuments(filter);
    }
    // Company helper
    async createCompany(company = {}) {
        const uniqueAbn = (Date.now().toString() + Math.floor(Math.random() * 1000).toString()).slice(0, 11);
        const address = company.address || {};
        const companyObj = {
            businessName: company.businessName || 'Test Business',
            address: {
                unitAptPOBox: address.unitAptPOBox || '',
                streetAddress: address.streetAddress || '123 Test St',
                suburb: address.suburb || 'Testville',
                state: address.state || 'TS',
                postcode: address.postcode || '1234',
            },
            abn: company.abn || uniqueAbn,
            user: typeof company.user === 'string'
                ? new mongoose_2.Types.ObjectId(company.user)
                : company.user || new mongoose_2.Types.ObjectId(),
        };
        return await this.companyModel.create(companyObj);
    }
}
exports.DatabaseTestHelper = DatabaseTestHelper;
//# sourceMappingURL=database.helper.js.map