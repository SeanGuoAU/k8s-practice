# Telephony Test Data Guide

## Overview
This seed script creates a complete telephony test environment, including user, company, and service data.

## Run Test Data

### 1. Run telephony seed script
```bash
cd backend
npm run seed:telephony
```

### 2. Run all seeds (including telephony)
```bash
cd backend
npm run seed
```

## Created Test Data

### Test user
- **Email**: john.doe@example.com
- **Password**: Admin123!
- **Phone**: +1-555-123-4567

### Test company
- **Name**: ABC Cleaning Services
- **Email**: info@abccleaning.com
- **Phone**: +1-555-987-6543
- **Address**: 123 Main Street, Sydney NSW 2000

### Available services
1. **House Cleaning** - $120.00
  - Professional house cleaning service including dusting, vacuuming, and bathroom cleaning

2. **Garden Maintenance** - $80.00
  - Complete garden care including mowing, trimming, and plant care

3. **Plumbing Service** - $150.00
  - Emergency and routine plumbing repairs and maintenance

4. **Carpet Cleaning** - $100.00
  - Deep carpet cleaning and stain removal service

5. **Window Cleaning** - $90.00
  - Professional window cleaning for residential and commercial properties

## Testing Flow

### 1. Start services
```bash
# Start backend service
npm run dev

# Start AI service
cd ../ai
python -m uvicorn app.main:app --reload
```

### 2. Configure Twilio webhook
Ensure your Twilio configuration points to the correct webhook URLs:
- Voice Webhook: `https://your-domain/api/telephony/voice`
- Status Webhook: `https://your-domain/api/telephony/status`

### 3. Make a test call
1. Call your Twilio number
2. Verify AI recognizes company name "ABC Cleaning Services"
3. Ask about available services and verify all five are listed
4. Test information collection flow (name, phone, address, email, service selection, scheduling)

### 4. Suggested scenarios
- **Service inquiry**: "What services do you offer?"
- **Booking request**: "I'd like to book a house cleaning service"
- **Info collection**: AI should guide customer information collection
- **Scheduling**: "I'd like it tomorrow morning"

## Redis Data Structure

The seed creates data structures that match the `CallSkeleton` interface:

```json
{
  "callSid": "CAxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
  "services": [
    {
      "id": "service_id",
      "name": "House Cleaning",
      "price": 120.00,
      "description": "Professional house cleaning service..."
    }
  ],
  "company": {
    "id": "company_id",
    "name": "ABC Cleaning Services",
    "email": "info@abccleaning.com",
    "phone": "+1-555-987-6543"
  },
  "user": {
    "service": null,
    "serviceBookedTime": null,
    "userInfo": {}
  },
  "history": [],
  "servicebooked": false,
  "confirmEmailsent": false,
  "createdAt": "2024-01-01T00:00:00.000Z"
}
```

## Troubleshooting

### Common issues
1. **MongoDB connection failed**: Ensure MongoDB is running
2. **Data not created**: Check console output for errors
3. **AI service not responding**: Ensure AI service is running and reachable

### Log checks
- Backend logs: check NestJS application logs
- AI service logs: check Python application logs
- Twilio logs: check call logs in Twilio Console

## Reset Data
To reset test data, rerun the seed script:
```bash
npm run seed:telephony
```

This clears existing data and recreates the test dataset.