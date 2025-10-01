# 🚀 TORAFLOW Backend Admin Panel Setup

## 📋 Overview

This guide will help you set up the complete backend admin panel for TORAFLOW AI Agency with Supabase integration, authentication, and flow management system.

## 🛠️ Prerequisites

- Node.js 18+ installed
- Supabase account
- Git

## 🔧 Setup Instructions

### 1. Install Dependencies

The required Supabase packages are already included in package.json:
```bash
npm install
```

### 2. Create Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Create a new project
3. Wait for the project to be ready
4. Go to Project Settings > API
5. Copy your project URL and anon key

### 3. Environment Configuration

1. Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```

2. Fill in your Supabase credentials:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

### 4. Database Setup

1. Go to your Supabase project dashboard
2. Navigate to SQL Editor
3. Copy and paste the contents of `database/schema.sql`
4. Run the SQL script to create all tables and policies

### 5. Authentication Setup

The authentication system is already configured with:
- ✅ Email/Password authentication
- ✅ Automatic profile creation
- ✅ Role-based access control
- ✅ Session management with middleware
- ✅ Protected admin routes

### 6. Start Development Server

```bash
npm run dev
```

Visit:
- **Frontend**: http://localhost:3000
- **Admin Panel**: http://localhost:3000/admin
- **Sign In**: http://localhost:3000/signin

## 🔐 Authentication Flow

### First User Setup
1. Go to `/signup` and create an account
2. The first user will automatically get admin role
3. Check your email for verification
4. Sign in at `/signin`
5. Access admin panel at `/admin`

### Admin Features
- ✅ Dashboard with analytics
- ✅ Flow management (CRUD operations)
- ✅ Demo booking management
- ✅ Contact form submissions
- ✅ User management
- ✅ Real-time updates

## 📊 Database Schema

### Core Tables
- **profiles** - User profiles and roles
- **flows** - AI automation flows (replaces blog)
- **demo_bookings** - Demo appointment bookings
- **contact_submissions** - Contact form submissions
- **newsletter_subscriptions** - Email subscriptions

### Analytics Tables
- **page_views** - Page visit tracking
- **flow_interactions** - Flow engagement metrics
- **user_preferences** - User settings

## 🔒 Security Features

### Row Level Security (RLS)
- ✅ All tables have RLS enabled
- ✅ Users can only access their own data
- ✅ Admins have full access
- ✅ Public content is properly exposed

### Authentication Security
- ✅ JWT token-based authentication
- ✅ Secure session management
- ✅ Protected API routes
- ✅ CSRF protection

## 🎯 Admin Panel Features

### Dashboard (`/admin`)
- Overview statistics
- Recent flows and bookings
- Quick action buttons
- Analytics charts

### Flows Management (`/admin/flows`)
- Create, edit, delete flows
- Status management (draft/published)
- Category and complexity filtering
- Rich text editor for descriptions
- ReactFlow diagram integration

### Demo Bookings (`/admin/bookings`)
- View all demo requests
- Booking status management
- Calendar integration
- Email notifications

### Contact Management (`/admin/contacts`)
- Contact form submissions
- Status tracking (new/read/replied)
- Response management

### User Management (`/admin/users`)
- User list and profiles
- Role management
- Activity tracking

### Analytics (`/admin/analytics`)
- Page view statistics
- Flow interaction metrics
- User engagement data
- Performance insights

## 🔄 API Endpoints

### Server Actions (App Router)
- `signIn()` - User authentication
- `signUp()` - User registration
- `signOut()` - User logout
- `getFlows()` - Fetch flows with filters
- `createFlow()` - Create new flow
- `updateFlow()` - Update existing flow
- `deleteFlow()` - Delete flow

### Real-time Features
- Live flow updates
- Real-time notifications
- Collaborative editing
- Live analytics

## 🚀 Deployment

### Vercel Deployment
1. Connect your GitHub repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy automatically on push

### Supabase Production
1. Upgrade to Supabase Pro if needed
2. Configure custom domain
3. Set up backup policies
4. Monitor usage and performance

## 🛡️ Production Checklist

### Security
- [ ] Enable 2FA for Supabase account
- [ ] Review RLS policies
- [ ] Set up monitoring and alerts
- [ ] Configure CORS properly
- [ ] Enable audit logging

### Performance
- [ ] Optimize database queries
- [ ] Set up CDN for images
- [ ] Enable caching
- [ ] Monitor response times
- [ ] Set up error tracking

### Backup
- [ ] Configure automated backups
- [ ] Test restore procedures
- [ ] Document recovery process
- [ ] Set up monitoring alerts

## 🆘 Troubleshooting

### Common Issues

**Authentication not working:**
- Check environment variables
- Verify Supabase URL and keys
- Check RLS policies
- Ensure middleware is configured

**Database connection issues:**
- Verify Supabase project status
- Check network connectivity
- Review database logs
- Validate SQL schema

**Admin panel access denied:**
- Check user role in profiles table
- Verify RLS policies
- Check middleware configuration
- Review authentication flow

### Support
For issues and questions:
1. Check the ABOUTCODE.md documentation
2. Review Supabase documentation
3. Check GitHub issues
4. Contact the development team

## 📈 Next Steps

### Immediate Enhancements
1. Add file upload for flow images
2. Implement email notifications
3. Add export functionality
4. Create API documentation

### Advanced Features
1. Multi-language support
2. Advanced analytics
3. A/B testing framework
4. Integration with external tools

---

**🎉 Your TORAFLOW backend admin panel is now ready!**

The system provides a complete content management solution with industry-standard security, real-time features, and comprehensive analytics. Start by creating your first AI automation flow and explore the admin dashboard features.
