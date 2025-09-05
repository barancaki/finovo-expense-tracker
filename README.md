# Finovo - Personal Expense Tracker

A modern SaaS application for tracking personal expenses with beautiful UI and powerful analytics.

## Features

- 🔐 **Authentication**: Secure email/password authentication with NextAuth
- 💰 **Expense Management**: Add, edit, delete, and categorize expenses
- 📊 **Analytics**: Visual charts and statistics for spending patterns
- 🔍 **Filtering**: Filter expenses by category, date range with quick filters
- 📱 **Responsive Design**: Beautiful UI that works on all devices
- 📈 **Charts**: Monthly expense trends visualization
- 📄 **Export**: Export expense data as CSV for backup/analysis
- 🎨 **Modern UI**: Built with Tailwind CSS and reusable components

## Tech Stack

- **Frontend**: Next.js 14, React, TypeScript
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js
- **Styling**: Tailwind CSS
- **Charts**: Chart.js with react-chartjs-2
- **Forms**: React Hook Form

## Getting Started

### Prerequisites

- Node.js 18+ installed
- PostgreSQL database
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd finovo
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp env.example .env.local
   ```
   
   Edit `.env.local` with your configuration:
   ```env
   # Database
   DATABASE_URL="postgresql://username:password@localhost:5432/finovo_db"
   
   # NextAuth
   NEXTAUTH_URL="http://localhost:3000"
   NEXTAUTH_SECRET="your-secret-key-here"
   ```

4. **Set up the database**
   ```bash
   # Generate Prisma client
   npx prisma generate
   
   # Push database schema
   npm run db:push
   
   # Seed the database with demo data
   npm run db:seed
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Demo Account

After seeding the database, you can use this demo account:
- **Email**: demo@finovo.com
- **Password**: demo123

## Project Structure

```
finovo/
├── app/                    # Next.js 13+ app directory
│   ├── api/               # API routes
│   ├── auth/              # Authentication pages
│   ├── dashboard/         # Dashboard page
│   ├── profile/           # Profile page
│   └── page.tsx           # Landing page
├── components/            # Reusable UI components
│   ├── ui/                # Basic UI components
│   ├── layout/            # Layout components
│   ├── expenses/          # Expense-related components
│   ├── dashboard/         # Dashboard components
│   └── charts/            # Chart components
├── lib/                   # Utility libraries
├── prisma/                # Database schema and migrations
├── types/                 # TypeScript type definitions
└── utils/                 # Utility functions
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run db:push` - Push schema changes to database
- `npm run db:studio` - Open Prisma Studio
- `npm run db:seed` - Seed database with demo data

## Database Schema

The application uses the following main models:

- **User**: User accounts with authentication
- **Expense**: Individual expense records
- **Account/Session**: NextAuth session management

## Features in Detail

### Expense Categories
- Food
- Transport
- Utilities
- Shopping
- Entertainment
- Healthcare
- Education
- Travel
- Other

### Filtering Options
- By category
- By date range
- Quick filters (last 7/30/90 days)

### Analytics
- Total expenses
- Average expense amount
- Monthly expense trends
- Category breakdown
- Top spending categories

### Export Features
- CSV export with all expense data
- Includes date, amount, category, description
- Ready for Excel or other analysis tools

## Deployment

### Database Setup
1. Set up a PostgreSQL database (recommend Railway, PlanetScale, or Supabase)
2. Update `DATABASE_URL` in your environment variables
3. Run `npx prisma db push` to create tables

### Environment Variables
Set these in your production environment:
```env
DATABASE_URL="your-production-database-url"
NEXTAUTH_URL="https://yourdomain.com"
NEXTAUTH_SECRET="your-production-secret"
```

### Deploy to Vercel
1. Connect your repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy!

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support, email support@finovo.com or create an issue in the repository.
