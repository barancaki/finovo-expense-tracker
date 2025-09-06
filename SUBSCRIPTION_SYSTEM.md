# Subscription System Documentation

## Overview

This project now includes a comprehensive subscription system with three account types:

1. **Free Trial** - 1 day access with basic features
2. **Pro** - 1 month access with advanced features  
3. **Ultimate** - 1 month access with AI analyzer (future feature)

## Features

### Subscription Types

- **FREE_TRIAL**: 1 day access, basic expense tracking
- **PRO**: 30 days access, advanced reports, data export
- **ULTIMATE**: 30 days access, everything in Pro + AI analyzer (placeholder)

### Key Components

#### Database Schema
- Added `subscriptionType`, `subscriptionStart`, `subscriptionEnd` fields to User model
- Created `SubscriptionType` enum with three values

#### API Endpoints
- `GET /api/subscription` - Get current subscription info
- `POST /api/subscription` - Update subscription
- `POST /api/subscription/cleanup` - Clean up expired trials

#### UI Components
- `SubscriptionCard` - Individual plan display
- `SubscriptionStatus` - Current subscription status with countdown
- `/subscription` page - Full subscription management interface

#### Middleware
- Automatic subscription validation on protected routes
- Redirects expired users to subscription page

## Usage

### For Users

1. **New Users**: Automatically get FREE_TRIAL (1 day)
2. **Upgrade**: Visit `/subscription` page to upgrade plans
3. **Expired Trials**: Automatically redirected to subscription page

### For Developers

#### Check Subscription Status
```typescript
import { canAccessFeature } from '@/lib/subscription'

const hasAccess = canAccessFeature(
  user.subscriptionType, 
  user.subscriptionEnd, 
  'advanced' // 'basic' | 'advanced' | 'ai'
)
```

#### Subscription Info
```typescript
import { getSubscriptionInfo } from '@/lib/subscription'

const info = getSubscriptionInfo(
  user.subscriptionType,
  user.subscriptionStart,
  user.subscriptionEnd
)
```

### Automatic Cleanup

#### Manual Cleanup
```bash
npm run cleanup:trials
```

#### Cron Job Setup
Add to your crontab to run daily at 2 AM:
```bash
0 2 * * * cd /path/to/project && npm run cleanup:trials
```

## Security Features

- **Automatic Data Deletion**: Free trial users' data is automatically deleted when trial expires
- **Route Protection**: Middleware prevents access to protected routes for expired users
- **Session Validation**: Subscription status is validated on each request

## Future Enhancements

- **Payment Integration**: Add Stripe/PayPal for actual payments
- **AI Analyzer**: Implement the AI expense analyzer for Ultimate users
- **Email Notifications**: Send expiration warnings
- **Admin Dashboard**: Manage subscriptions from admin panel

## Configuration

### Environment Variables
- `NEXT_PUBLIC_APP_URL` - Used by cleanup script
- `DATABASE_URL` - Database connection string

### Subscription Plans
Plans are configured in `/types/index.ts`:
```typescript
export const SUBSCRIPTION_PLANS: Record<SubscriptionType, SubscriptionPlan>
```

## Database Migration

To apply the subscription schema changes:

```bash
npx prisma db push
npx prisma generate
```

## Testing

1. Create a new user (gets FREE_TRIAL automatically)
2. Visit `/subscription` to see plans
3. Upgrade to PRO or ULTIMATE
4. Test expiration by manually setting `subscriptionEnd` to past date
5. Run cleanup script to test data deletion

## Notes

- All new users start with FREE_TRIAL
- Subscription end dates are calculated automatically
- Data deletion is irreversible - ensure backups if needed
- Middleware runs on all protected routes
- AI analyzer feature is placeholder for future implementation
