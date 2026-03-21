"use strict";
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
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.seedTelephonyTestData = seedTelephonyTestData;
const mongoose_1 = require("mongoose");
const bcrypt = __importStar(require("bcryptjs"));
const crypto_1 = require("crypto");
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/dispatchai';
const SALT_ROUNDS = 10;
// Create schemas
const userSchema = new mongoose_1.Schema({
    firstName: String,
    lastName: String,
    email: { type: String, required: true, unique: true },
    password: String,
    twilioPhoneNumber: String,
    fullPhoneNumber: String,
    receivedAdverts: { type: Boolean, default: true },
    status: { type: String, default: 'active' },
    statusReason: String,
    position: String,
    role: { type: String, default: 'user' },
    googleId: String,
    avatar: String,
    provider: { type: String, default: 'local' },
    tokenRefreshTime: { type: Date, default: Date.now }
}, { timestamps: true });
const serviceSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    description: String,
    price: { type: Number, required: true },
    userId: { type: String, required: true },
    isAvailable: { type: Boolean, default: true }
}, { timestamps: true });
const companySchema = new mongoose_1.Schema({
    businessName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    abn: { type: String, required: true, unique: true },
    number: { type: String, required: true },
    address: {
        unitAptPOBox: { type: String },
        streetAddress: { type: String, required: true },
        suburb: { type: String, required: true },
        state: { type: String, required: true },
        postcode: { type: String, required: true }
    },
    user: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });
async function seedTelephonyTestData() {
    try {
        await (0, mongoose_1.connect)(MONGODB_URI);
        console.log('✅ Connected to MongoDB');
        // Create models
        const UserModel = (0, mongoose_1.model)('User', userSchema);
        const ServiceModel = (0, mongoose_1.model)('Service', serviceSchema);
        const CompanyModel = (0, mongoose_1.model)('Company', companySchema);
        // Check whether the test user already exists
        const existingUser = await UserModel.findOne({ email: 'john.doe@example.com' });
        if (existingUser) {
            console.log('👤 Test user already exists, updating...');
            // Update user info
            const hashedPassword = await bcrypt.hash('Admin123!', SALT_ROUNDS);
            await UserModel.updateOne({ email: 'john.doe@example.com' }, {
                firstName: 'John',
                lastName: 'Doe',
                password: hashedPassword,
                twilioPhoneNumber: '+19787235265',
                fullPhoneNumber: '+19787235265',
                receivedAdverts: true,
                status: 'active',
                statusReason: '',
                position: 'Business Owner',
                role: 'user',
                googleId: null,
                avatar: null,
                provider: 'local',
                tokenRefreshTime: new Date()
            });
            // Remove existing services and company data for this user
            await ServiceModel.deleteMany({ userId: existingUser._id.toString() });
            await CompanyModel.deleteMany({ user: existingUser._id }); // Use ObjectId
            console.log('🧹 Cleared existing services and company data for test user');
            const testUser = existingUser;
            console.log('👤 Updated test user:', testUser.email);
        }
        else {
            console.log('👤 Creating new test user...');
            // Create test user
            const hashedPassword = await bcrypt.hash('Admin123!', SALT_ROUNDS);
            const testUser = await UserModel.create({
                firstName: 'John',
                lastName: 'Doe',
                email: 'john.doe@example.com',
                password: hashedPassword,
                twilioPhoneNumber: '+19787235265',
                fullPhoneNumber: '+19787235265',
                receivedAdverts: true,
                status: 'active',
                statusReason: '',
                position: 'Business Owner',
                role: 'user',
                googleId: null,
                avatar: null,
                provider: 'local',
                tokenRefreshTime: new Date()
            });
            console.log('👤 Created test user:', testUser.email);
        }
        // Get or create user (ensure we have the correct user ID)
        const testUser = await UserModel.findOne({ email: 'john.doe@example.com' });
        if (!testUser) {
            throw new Error('Failed to create or find test user');
        }
        // Create company info
        const testCompany = await CompanyModel.findOneAndUpdate({ user: testUser._id }, {
            businessName: 'ABC Cleaning Services',
            email: 'info@abccleaning.com',
            abn: '12345678901',
            number: '+15559876543',
            address: {
                streetAddress: '123 Main Street',
                suburb: 'Sydney',
                state: 'NSW',
                postcode: '2000'
            },
            user: testUser._id
        }, { upsert: true, new: true });
        console.log('🏢 Created test company:', testCompany.businessName);
        // Create service list
        const services = [
            {
                name: 'House Cleaning',
                description: 'Professional house cleaning service including dusting, vacuuming, and bathroom cleaning',
                price: 120.00,
                userId: testUser._id.toString(),
                isAvailable: true
            },
            {
                name: 'Garden Maintenance',
                description: 'Complete garden care including mowing, trimming, and plant care',
                price: 80.00,
                userId: testUser._id.toString(),
                isAvailable: true
            },
            {
                name: 'Plumbing Service',
                description: 'Emergency and routine plumbing repairs and maintenance',
                price: 150.00,
                userId: testUser._id.toString(),
                isAvailable: true
            },
            {
                name: 'Carpet Cleaning',
                description: 'Deep carpet cleaning and stain removal service',
                price: 100.00,
                userId: testUser._id.toString(),
                isAvailable: true
            },
            {
                name: 'Window Cleaning',
                description: 'Professional window cleaning for residential and commercial properties',
                price: 90.00,
                userId: testUser._id.toString(),
                isAvailable: true
            }
        ];
        const createdServices = await ServiceModel.insertMany(services);
        console.log('🔧 Created services:', createdServices.map(s => s.name));
        // Create Redis test data (simulating CallSkeleton)
        console.log('\n📞 Redis Test Data Structure:');
        console.log('CallSkeleton example:');
        console.log(JSON.stringify({
            callSid: 'CA' + (0, crypto_1.randomUUID)().replace(/-/g, '').substring(0, 32),
            services: createdServices.map(s => ({
                id: s._id.toString(),
                name: s.name,
                price: s.price,
                description: s.description
            })),
            company: {
                id: testCompany._id.toString(),
                name: testCompany.businessName,
                email: testCompany.email,
                phone: testCompany.number
            },
            user: {
                service: null,
                serviceBookedTime: null,
                userInfo: {}
            },
            history: [],
            servicebooked: false,
            confirmEmailsent: false,
            createdAt: new Date().toISOString()
        }, null, 2));
        console.log('\n🎯 Test Credentials:');
        console.log('Email: john.doe@example.com');
        console.log('Password: Admin123!');
        console.log('Phone: +19787235265');
        console.log('\n📋 Available Services for Testing:');
        createdServices.forEach((service, index) => {
            console.log(`${index + 1}. ${service.name} - $${service.price} - ${service.description}`);
        });
        console.log('\n🚀 Telephony Test Data Setup Complete!');
        console.log('You can now test the phone system with this data.');
    }
    catch (error) {
        console.error('❌ Error seeding telephony test data:', error);
    }
    finally {
        await mongoose_1.connection.close();
        console.log('🔌 Disconnected from MongoDB');
    }
}
// Run when this file is executed directly
if (require.main === module) {
    seedTelephonyTestData();
}
//# sourceMappingURL=seed-telephony-test-data.js.map