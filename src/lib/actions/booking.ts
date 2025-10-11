'use server';

// Note: Install googleapis package: npm install googleapis
// import { google } from 'googleapis';

interface BookingData {
  name: string;
  email: string;
  company: string;
  phone: string;
  date: string;
  time: string;
}

/**
 * Create a Google Calendar event for the demo booking
 * 
 * Setup Instructions:
 * 1. Go to Google Cloud Console (https://console.cloud.google.com/)
 * 2. Create a new project or select existing one
 * 3. Enable Google Calendar API
 * 4. Create OAuth 2.0 credentials (Service Account)
 * 5. Download the JSON key file
 * 6. Add to .env.local:
 *    GOOGLE_SERVICE_ACCOUNT_EMAIL=your-service-account@project.iam.gserviceaccount.com
 *    GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
 *    GOOGLE_CALENDAR_ID=your-calendar-id@group.calendar.google.com
 */

export async function createCalendarEvent(bookingData: BookingData) {
  try {
    // Check if googleapis package is installed
    let google;
    try {
      const googleapis = await import('googleapis');
      google = googleapis.google;
    } catch (error) {
      console.warn('googleapis package not installed. Run: npm install googleapis');
      return {
        success: true,
        message: 'Booking saved (Calendar integration requires googleapis package)',
        calendarEvent: null
      };
    }

    // Check if Google Calendar is configured
    if (!process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL || !process.env.GOOGLE_PRIVATE_KEY) {
      console.warn('Google Calendar not configured. Skipping calendar event creation.');
      return {
        success: true,
        message: 'Booking saved (Calendar integration pending setup)',
        calendarEvent: null
      };
    }

    // Initialize Google Calendar API
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
      },
      scopes: ['https://www.googleapis.com/auth/calendar'],
    });

    const calendar = google.calendar({ version: 'v3', auth });

    // Parse date and time
    const [year, month, day] = bookingData.date.split('-').map(Number);
    const [hours, minutes] = bookingData.time.split(':').map(Number);
    
    const startDateTime = new Date(year, month - 1, day, hours, minutes);
    const endDateTime = new Date(startDateTime.getTime() + 60 * 60 * 1000); // 1 hour duration

    // Create calendar event
    const event = {
      summary: `AI Demo - ${bookingData.name}`,
      description: `
Demo booking with ${bookingData.name}
Company: ${bookingData.company || 'N/A'}
Phone: ${bookingData.phone || 'N/A'}
Email: ${bookingData.email}

This is an automated booking from the Toraflow website.
      `.trim(),
      start: {
        dateTime: startDateTime.toISOString(),
        timeZone: 'UTC', // Adjust to your timezone
      },
      end: {
        dateTime: endDateTime.toISOString(),
        timeZone: 'UTC',
      },
      attendees: [
        { email: bookingData.email, displayName: bookingData.name },
      ],
      reminders: {
        useDefault: false,
        overrides: [
          { method: 'email', minutes: 24 * 60 }, // 1 day before
          { method: 'popup', minutes: 30 }, // 30 minutes before
        ],
      },
      conferenceData: {
        createRequest: {
          requestId: `demo-${Date.now()}`,
          conferenceSolutionKey: { type: 'hangoutsMeet' },
        },
      },
    };

    const calendarId = process.env.GOOGLE_CALENDAR_ID || 'primary';
    
    const response = await calendar.events.insert({
      calendarId,
      requestBody: event,
      conferenceDataVersion: 1,
      sendUpdates: 'all', // Send email invitations to attendees
    });

    return {
      success: true,
      message: 'Booking confirmed and calendar invite sent!',
      calendarEvent: {
        id: response.data.id,
        link: response.data.htmlLink,
        meetLink: response.data.hangoutLink,
      },
    };
  } catch (error) {
    console.error('Error creating calendar event:', error);
    return {
      success: false,
      message: 'Booking saved but calendar invite failed. We will contact you shortly.',
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Save booking to database (implement based on your database)
 */
export async function saveBooking(bookingData: BookingData) {
  try {
    // TODO: Implement database save
    // Example with Supabase:
    // const { data, error } = await supabase
    //   .from('demo_bookings')
    //   .insert([bookingData]);
    
    console.log('Booking data:', bookingData);
    
    return {
      success: true,
      message: 'Booking saved successfully',
    };
  } catch (error) {
    console.error('Error saving booking:', error);
    return {
      success: false,
      message: 'Failed to save booking',
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Main booking handler - saves to database and creates calendar event
 */
export async function handleDemoBooking(bookingData: BookingData) {
  try {
    // Save to database
    const dbResult = await saveBooking(bookingData);
    
    if (!dbResult.success) {
      return dbResult;
    }

    // Create calendar event
    const calendarResult = await createCalendarEvent(bookingData);
    
    return {
      success: true,
      message: calendarResult.message,
      data: {
        booking: bookingData,
        calendar: calendarResult.calendarEvent,
      },
    };
  } catch (error) {
    console.error('Error handling demo booking:', error);
    return {
      success: false,
      message: 'An error occurred while processing your booking',
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}
