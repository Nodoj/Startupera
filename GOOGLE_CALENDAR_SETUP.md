# Google Calendar Integration Setup Guide

This guide will help you integrate Google Calendar with the demo booking system.

## Prerequisites

- Google Cloud Platform account
- Access to Google Calendar
- Node.js and npm installed

## Step 1: Install Required Package

```bash
npm install googleapis
```

## Step 2: Google Cloud Console Setup

### 2.1 Create/Select a Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click on the project dropdown at the top
3. Click "New Project" or select an existing one
4. Give it a name like "Toraflow Demo Booking"

### 2.2 Enable Google Calendar API

1. In the Google Cloud Console, go to "APIs & Services" > "Library"
2. Search for "Google Calendar API"
3. Click on it and press "Enable"

### 2.3 Create Service Account

1. Go to "APIs & Services" > "Credentials"
2. Click "Create Credentials" > "Service Account"
3. Fill in the details:
   - **Service account name**: `demo-booking-service`
   - **Service account ID**: Will be auto-generated
   - **Description**: "Service account for demo booking calendar integration"
4. Click "Create and Continue"
5. Skip the optional steps (roles and user access)
6. Click "Done"

### 2.4 Create Service Account Key

1. Click on the service account you just created
2. Go to the "Keys" tab
3. Click "Add Key" > "Create new key"
4. Select "JSON" format
5. Click "Create"
6. A JSON file will be downloaded - **keep this safe!**

## Step 3: Google Calendar Setup

### 3.1 Create a Dedicated Calendar (Optional but Recommended)

1. Go to [Google Calendar](https://calendar.google.com/)
2. On the left sidebar, click the "+" next to "Other calendars"
3. Select "Create new calendar"
4. Name it "Demo Bookings" or similar
5. Click "Create calendar"

### 3.2 Share Calendar with Service Account

1. Find your new calendar in the left sidebar
2. Click the three dots next to it > "Settings and sharing"
3. Scroll down to "Share with specific people"
4. Click "Add people"
5. Enter the service account email (from the JSON file: `client_email`)
6. Set permission to "Make changes to events"
7. Click "Send"

### 3.3 Get Calendar ID

1. In the calendar settings, scroll down to "Integrate calendar"
2. Copy the "Calendar ID" (looks like: `abc123@group.calendar.google.com`)
3. If using your primary calendar, the ID is your Gmail address

## Step 4: Environment Variables Setup

Create or update your `.env.local` file in the project root:

```env
# Google Calendar Integration
GOOGLE_SERVICE_ACCOUNT_EMAIL=your-service-account@project-id.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour\nPrivate\nKey\nHere\n-----END PRIVATE KEY-----\n"
GOOGLE_CALENDAR_ID=your-calendar-id@group.calendar.google.com
```

### How to get these values from the JSON file:

```json
{
  "type": "service_account",
  "project_id": "your-project-id",
  "private_key_id": "...",
  "private_key": "-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n",  // ← Use this
  "client_email": "demo-booking-service@project-id.iam.gserviceaccount.com",      // ← Use this
  "client_id": "...",
  "auth_uri": "...",
  "token_uri": "...",
  "auth_provider_x509_cert_url": "...",
  "client_x509_cert_url": "..."
}
```

**Important Notes:**
- Keep the `\n` characters in the private key
- Wrap the private key in double quotes
- Never commit the `.env.local` file to version control
- Add `.env.local` to your `.gitignore` file

## Step 5: Test the Integration

1. Restart your development server:
   ```bash
   npm run dev
   ```

2. Go to the contact page and try booking a demo

3. Check your Google Calendar - you should see the event created

4. The attendee should receive an email invitation

## Troubleshooting

### Error: "Calendar API has not been used in project"

- Make sure you enabled the Google Calendar API in Step 2.2
- Wait a few minutes for the API to be fully enabled

### Error: "Insufficient Permission"

- Make sure you shared the calendar with the service account (Step 3.2)
- Check that the service account has "Make changes to events" permission

### Error: "Invalid credentials"

- Verify the private key is correctly formatted with `\n` characters
- Make sure there are no extra spaces or line breaks
- Check that the service account email matches exactly

### Events not appearing in calendar

- Verify the Calendar ID is correct
- Check if the calendar is shared with the service account
- Look at the server console for error messages

### Attendees not receiving emails

- Make sure `sendUpdates: 'all'` is set in the calendar event creation
- Check that the attendee email is valid
- Look in spam/junk folders

## Security Best Practices

1. **Never commit credentials to Git**
   - Add `.env.local` to `.gitignore`
   - Use environment variables for all sensitive data

2. **Rotate keys regularly**
   - Create new service account keys periodically
   - Delete old keys from Google Cloud Console

3. **Limit service account permissions**
   - Only grant calendar access, nothing more
   - Use a dedicated calendar for bookings

4. **Monitor usage**
   - Check Google Cloud Console for API usage
   - Set up alerts for unusual activity

## Alternative: OAuth 2.0 Flow

If you want users to connect their own Google Calendar instead of using a service account:

1. Create OAuth 2.0 credentials instead of service account
2. Implement OAuth flow in your app
3. Store user tokens securely
4. Use user's calendar for events

This is more complex but gives users control over their own calendars.

## Next Steps

Once Google Calendar integration is working:

1. **Email notifications**: Set up email service (SendGrid, Resend, etc.)
2. **Database storage**: Save bookings to your database
3. **Admin dashboard**: Create interface to manage bookings
4. **Reminders**: Set up automated reminder emails
5. **Cancellation**: Implement booking cancellation flow
6. **Rescheduling**: Allow users to reschedule bookings

## Support

If you encounter issues:

1. Check the server console for detailed error messages
2. Verify all environment variables are set correctly
3. Test the service account credentials in Google Cloud Console
4. Review Google Calendar API documentation: https://developers.google.com/calendar/api

## Resources

- [Google Calendar API Documentation](https://developers.google.com/calendar/api)
- [Service Account Documentation](https://cloud.google.com/iam/docs/service-accounts)
- [googleapis npm package](https://www.npmjs.com/package/googleapis)
