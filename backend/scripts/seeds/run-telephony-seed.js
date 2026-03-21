"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const seed_telephony_test_data_1 = require("./seed-telephony-test-data");
console.log('🚀 Starting Telephony Test Data Seeding...');
console.log('=====================================');
(0, seed_telephony_test_data_1.seedTelephonyTestData)()
    .then(() => {
    console.log('\n✅ Telephony test data seeding completed successfully!');
    console.log('\n📞 Next Steps for Testing:');
    console.log('1. Start your backend services');
    console.log('2. Configure Twilio webhook URLs');
    console.log('3. Make a test call to your Twilio number');
    console.log('4. The AI should recognize the services and company data');
    process.exit(0);
})
    .catch((error) => {
    console.error('❌ Failed to seed telephony test data:', error);
    process.exit(1);
});
//# sourceMappingURL=run-telephony-seed.js.map