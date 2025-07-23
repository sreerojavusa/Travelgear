# Trip Gear Rental Platform

A modern, full-stack web application for renting outdoor gear and equipment for trips and adventures.

## Features

- 🔐 User authentication (signup/login)
- 🏪 Browse and search rental items
- 🛒 Shopping cart functionality
- 📊 User dashboard with rental history
- 💳 Rental management system
- 📱 Responsive design
- 🎨 Modern UI with Tailwind CSS

## Tech Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS
- **Backend**: Supabase (PostgreSQL database, Authentication, Real-time)
- **Icons**: Lucide React
- **Routing**: React Router DOM
- **Build Tool**: Vite

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Supabase account (for database and authentication)

### Installation

1. Clone the repository
```bash
git clone <your-repo-url>
cd trip-gear-rental
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables
```bash
cp .env.example .env
```

4. Update the `.env` file with your Supabase credentials:
```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

5. Start the development server
```bash
npm run dev
```

### Supabase Setup

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to Settings > API to get your project URL and anon key
3. Run the SQL migration in the Supabase SQL editor (found in `supabase/migrations/`)
4. Update your `.env` file with the credentials

## Demo Mode

The application includes demo data and will work without Supabase configuration. You'll see a demo mode banner when running without proper credentials.

## Project Structure

```
src/
├── components/          # Reusable UI components
├── contexts/           # React contexts (Auth)
├── lib/               # Utilities and configurations
├── pages/             # Page components
└── App.tsx            # Main application component

supabase/
└── migrations/        # Database schema and seed data
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Database Schema

The application uses the following main tables:
- `profiles` - User profile information
- `categories` - Product categories
- `items` - Rental items
- `rentals` - Rental transactions
- `cart_items` - Shopping cart items

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is licensed under the MIT License.