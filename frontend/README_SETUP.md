# ITPilot Frontend Setup Guide

## Overview
This is the Next.js 14 frontend for ITPilot - an AI-powered IT support and device management platform.

## Theme
- **Primary Color**: Orange (#f97316) - Used for CTAs, highlights, and accents
- **Dark Color**: Pure Black (#0a0a0a) - Used for text and dark backgrounds
- **Light Color**: White (#ffffff) - Used for light backgrounds and contrast

## Technology Stack
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS with custom orange/black/white theme
- **State Management**: Zustand
- **API Client**: Axios with interceptors
- **Animations**: Framer Motion
- **Forms**: React Hook Form + Zod validation
- **Charts**: Recharts
- **Icons**: Lucide React
- **Real-time**: Socket.io Client
- **Notifications**: Sonner

## Installation

```bash
# Navigate to frontend directory
cd /home/user/ITPilot/frontend

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local

# Update .env.local with your backend URL
NEXT_PUBLIC_API_URL=http://localhost:8000/api
NEXT_PUBLIC_WS_URL=ws://localhost:8000
```

## Running the Application

```bash
# Development mode
npm run dev

# Production build
npm run build
npm start

# Type checking
npm run type-check

# Linting
npm run lint
```

## Project Structure

```
frontend/
├── app/                          # Next.js app directory
│   ├── (auth)/                  # Auth route group
│   │   ├── login/
│   │   ├── register/
│   │   └── layout.tsx
│   ├── (dashboard)/             # Dashboard route group
│   │   ├── dashboard/          # Main dashboard
│   │   ├── devices/            # Device management
│   │   ├── tickets/            # Ticket system
│   │   ├── chat/               # AI chatbot
│   │   └── layout.tsx
│   ├── layout.tsx              # Root layout
│   ├── page.tsx                # Landing page
│   ├── providers.tsx           # React Query & Auth providers
│   └── globals.css             # Global styles
│
├── components/                  # Reusable components
│   ├── ui/                     # Base UI components
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── Input.tsx
│   │   └── Badge.tsx
│   └── layout/                 # Layout components
│       ├── Navbar.tsx
│       ├── Sidebar.tsx
│       └── Footer.tsx
│
├── lib/                        # Utilities & services
│   ├── api.ts                 # Axios instance & API endpoints
│   ├── websocket.ts           # WebSocket manager
│   ├── auth.ts                # Auth utilities
│   ├── store.ts               # Zustand stores
│   ├── types.ts               # TypeScript types
│   └── utils.ts               # Helper functions
│
├── public/                     # Static assets
├── tailwind.config.ts         # Tailwind configuration
├── postcss.config.js          # PostCSS configuration
├── next.config.js             # Next.js configuration
└── tsconfig.json              # TypeScript configuration
```

## Key Features

### Authentication
- JWT-based authentication with refresh tokens
- Protected routes with automatic redirects
- Login and registration pages with validation
- Password strength indicators

### Dashboard
- Real-time statistics and metrics
- Interactive charts (tickets, devices, performance)
- Recent activity feed
- Responsive grid layout

### Device Management
- Device listing with filters and search
- Real-time status monitoring
- CPU and memory usage visualization
- Device CRUD operations

### Ticket System
- Ticket creation and management
- Status and priority filtering
- Assignment system
- Comment threads

### AI Chatbot
- Real-time chat interface
- Conversation management
- Message history
- Typing indicators
- AI-powered responses

### Real-time Updates
- WebSocket integration for live updates
- Automatic reconnection
- Toast notifications for events
- Activity feed updates

## Environment Variables

```env
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:8000/api
NEXT_PUBLIC_WS_URL=ws://localhost:8000

# Optional
NEXT_PUBLIC_APP_NAME=ITPilot
NEXT_PUBLIC_APP_VERSION=1.0.0
```

## Design System

### Colors
- **Primary (Orange)**: `#f97316` - Buttons, links, highlights
- **Black**: `#0a0a0a` - Text, dark backgrounds
- **White**: `#ffffff` - Light backgrounds, cards
- **Success**: `#22c55e` - Success states
- **Warning**: `#eab308` - Warning states
- **Danger**: `#ef4444` - Error states
- **Info**: `#3b82f6` - Info states

### Typography
- **Font Family**: Inter (sans-serif)
- **Headings**: Bold, various sizes
- **Body**: Regular, 16px base

### Spacing
- Consistent 4px/8px grid system
- Responsive padding and margins

### Components
- Modern, clean design
- Glassmorphism effects
- Smooth animations
- Accessible (ARIA labels, keyboard navigation)

## API Integration

The frontend connects to the Django backend API at:
- **Base URL**: `http://localhost:8000/api`
- **WebSocket**: `ws://localhost:8000`

### API Endpoints Used
- `POST /auth/login/` - User login
- `POST /auth/register/` - User registration
- `GET /auth/me/` - Get current user
- `GET /devices/` - List devices
- `GET /tickets/` - List tickets
- `POST /chat/messages/` - Send chat message
- `GET /dashboard/stats/` - Get dashboard stats

## Development Notes

### Code Quality
- TypeScript for type safety
- ESLint for code linting
- Consistent code formatting
- Component reusability

### Performance
- Image optimization
- Code splitting
- Lazy loading
- Memoization where needed

### Accessibility
- ARIA labels
- Keyboard navigation
- Focus management
- Screen reader support

### Mobile Support
- Mobile-first responsive design
- Touch-friendly interactions
- Optimized layouts for small screens

## Troubleshooting

### Common Issues

1. **Module not found errors**
   ```bash
   npm install
   ```

2. **API connection errors**
   - Check backend is running
   - Verify NEXT_PUBLIC_API_URL in .env.local
   - Check CORS settings in backend

3. **WebSocket connection errors**
   - Verify NEXT_PUBLIC_WS_URL in .env.local
   - Check backend WebSocket server

4. **Build errors**
   ```bash
   npm run type-check
   rm -rf .next
   npm run build
   ```

## Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Zustand](https://github.com/pmndrs/zustand)
- [React Hook Form](https://react-hook-form.com/)
- [Framer Motion](https://www.framer.com/motion/)

## Support

For issues or questions, please contact the development team.
