# Admin Panel System Documentation

## Overview

The admin panel system allows administrators to manually approve user subscription requests instead of automatic upgrades. This provides full control over who gets access to Pro and Ultimate plans.

## Key Features

### 🔐 **Admin Authentication**
- Only users with `isAdmin: true` can access admin features
- Admin status is checked on all admin API endpoints
- Admin link appears in navbar only for admin users

### 📋 **Subscription Request System**
- Users submit requests for Pro/Ultimate plans instead of automatic upgrades
- Requests include reason and timestamp
- Admin can approve or reject requests
- Prevents duplicate requests for same subscription type

### 🎛️ **Admin Panel Interface**
- **Dashboard**: Overview of users, pending requests, and active subscriptions
- **Request Management**: View and manage all subscription requests
- **User Management**: View all users with their subscription status
- **Real-time Updates**: Data refreshes after actions

## Database Schema Changes

### New Fields Added to User Model:
```sql
ALTER TABLE "User" ADD COLUMN "isAdmin" BOOLEAN DEFAULT false;
```

### New SubscriptionRequest Model:
```sql
CREATE TABLE "SubscriptionRequest" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "userId" TEXT NOT NULL,
  "requestedType" "SubscriptionType" NOT NULL,
  "status" "RequestStatus" DEFAULT 'PENDING',
  "reason" TEXT,
  "adminNotes" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE
);

CREATE TYPE "RequestStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');
```

## API Endpoints

### Admin Endpoints

#### `GET /api/admin/users`
- **Purpose**: Get all users with subscription info
- **Access**: Admin only
- **Returns**: Array of users with pending request counts

#### `GET /api/admin/requests`
- **Purpose**: Get all subscription requests
- **Access**: Admin only
- **Returns**: Array of requests with user details

#### `POST /api/admin/requests`
- **Purpose**: Approve or reject subscription requests
- **Access**: Admin only
- **Body**: `{ requestId, action: 'APPROVED'|'REJECTED', adminNotes? }`
- **Action**: Updates request status and user subscription if approved

### Updated Subscription Endpoint

#### `POST /api/subscription`
- **Purpose**: Submit subscription request (no longer auto-upgrades)
- **Body**: `{ subscriptionType, reason? }`
- **Returns**: Confirmation message
- **Validation**: Prevents duplicate requests

## Usage Instructions

### Making a User Admin

1. **Using the script** (recommended):
```bash
npm run make-admin <email>
```

2. **Manual database update**:
```sql
UPDATE "User" SET "isAdmin" = true WHERE email = 'admin@example.com';
```

### Admin Workflow

1. **Access Admin Panel**: Visit `/admin` (only visible to admin users)
2. **Review Requests**: Check pending subscription requests
3. **Approve/Reject**: Click buttons to approve or reject requests
4. **Monitor Users**: View all users and their subscription status

### User Workflow

1. **Request Subscription**: Visit `/subscription` and click upgrade button
2. **Wait for Approval**: Request is submitted and awaits admin review
3. **Get Notified**: User receives confirmation that request was submitted
4. **Access Granted**: Once approved, user gets the requested subscription

## Security Features

- **Admin-only Access**: All admin endpoints require `isAdmin: true`
- **Session Validation**: Admin status checked on every request
- **Request Validation**: Prevents duplicate requests and invalid data
- **Audit Trail**: All requests tracked with timestamps and admin notes

## UI Components

### Admin Panel (`/admin`)
- **Stats Cards**: Total users, pending requests, active subscriptions
- **Tabbed Interface**: Switch between requests and users view
- **Action Buttons**: Approve/reject requests with one click
- **User Table**: Complete user overview with subscription status

### Updated Subscription Page (`/subscription`)
- **Request Submission**: Users submit requests instead of direct upgrades
- **Status Messages**: Clear feedback about request submission
- **No Payment Required**: System designed for manual approval workflow

## Configuration

### Environment Variables
- No additional environment variables required
- Uses existing database connection

### Admin Setup
1. Create a user account normally
2. Run `npm run make-admin <email>` to make them admin
3. Admin can now access `/admin` panel

## Future Enhancements

- **Email Notifications**: Notify users when requests are approved/rejected
- **Bulk Actions**: Approve/reject multiple requests at once
- **Request History**: View all past requests and their outcomes
- **Admin Roles**: Different levels of admin access
- **Audit Logging**: Track all admin actions with timestamps

## Troubleshooting

### Common Issues

1. **"Admin access required" error**:
   - Ensure user has `isAdmin: true` in database
   - Check session is properly loaded

2. **"Already have pending request" error**:
   - User already submitted request for that subscription type
   - Admin needs to approve/reject existing request first

3. **Admin panel not visible**:
   - Check user's admin status in database
   - Ensure session includes `isAdmin: true`

### Database Queries

**Check admin status**:
```sql
SELECT email, "isAdmin" FROM "User" WHERE email = 'user@example.com';
```

**View pending requests**:
```sql
SELECT sr.*, u.email, u.name 
FROM "SubscriptionRequest" sr 
JOIN "User" u ON sr."userId" = u.id 
WHERE sr.status = 'PENDING';
```

**Make user admin**:
```sql
UPDATE "User" SET "isAdmin" = true WHERE email = 'admin@example.com';
```

## Integration Notes

- **Middleware**: Admin routes are protected by authentication middleware
- **Session Management**: Admin status included in JWT tokens
- **Database**: Uses existing Prisma setup with new models
- **UI**: Integrates with existing design system and dark mode
