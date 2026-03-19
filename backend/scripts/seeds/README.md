# Database Seed Scripts

This directory contains seed scripts used to initialize test data.

## Available Seed Scripts

### 1. Calllog Seed (`seed:calllog`)
- **File**: `seed-inbox-data.ts`
- **Purpose**: Create calllog-related test data
- **Command**: `pnpm seed:calllog`

### 2. Telephony Seed (`seed:telephony`)
- **File**: `seed-telephony-test-data.ts`
- **Purpose**: Create telephony test data including users, companies, and services
- **Command**: `pnpm seed:telephony`

### 3. All Seeds (`seed:all`)
- **Purpose**: Run all seed scripts
- **Command**: `pnpm seed:all` or `pnpm seed`

## Usage

### Run a single seed
```bash
# Run calllog data only
pnpm seed:calllog

# Run telephony data only
pnpm seed:telephony
```

### Run all seeds
```bash
# Run all seed scripts
pnpm seed:all
# Or
pnpm seed
```

## Test Data Notes

### Calllog test data
- Includes calllog-related test data
- Used for testing calllog-related API endpoints

### Telephony test data
- Creates test user: `john.doe@example.com` / `Admin123!`
- Creates test company: ABC Cleaning Services
- Creates 5 test services:
  1. House Cleaning - $120
  2. Garden Maintenance - $80
  3. Plumbing Service - $150
  4. Carpet Cleaning - $100
  5. Window Cleaning - $90

## Notes

1. Running seed scripts may clear existing test data
2. Ensure MongoDB connectivity is healthy
3. Ensure environment variables are configured correctly
4. Each seed script can run independently

## File Structure

```
scripts/seeds/
├── index.ts                    # Main entry file that imports all seeds
├── seed-calllog.ts            # Calllog seed entry
├── seed-telephony.ts          # Telephony seed entry
├── run-calllog-seed.ts        # Calllog seed runner
├── run-telephony-seed.ts      # Telephony seed runner
├── seed-inbox-data.ts         # Calllog test data
├── seed-telephony-test-data.ts # Telephony test data
└── README.md                  # This document
``` 