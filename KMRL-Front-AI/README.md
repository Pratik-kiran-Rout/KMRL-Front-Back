# KMRL DocHub

## Project Overview

KMRL DocHub is an intelligent document management and compliance platform designed for Kochi Metro Rail Limited. It provides AI-powered document processing, real-time analytics, and comprehensive compliance management.

## Features

- **AI-Powered Document Processing**: Intelligent document analysis and summarization
- **Multi-language Support**: English, Malayalam, and Hindi interface
- **Real-time Analytics**: Performance metrics and predictive insights
- **IoT Integration**: Unified namespace connectivity for metro operations
- **AR Document Preview**: Augmented reality overlay for field operations
- **Compliance Management**: Regulatory compliance and audit tracking
- **Knowledge Graph**: Interactive network visualization of document relationships
- **Dark Mode Support**: Complete light/dark theme system

## Development Setup

Requirements: Node.js & npm - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

```sh
# Clone the repository
git clone <YOUR_GIT_URL>

# Navigate to project directory
cd kmrl-dochub

# Install dependencies
npm install

# Start development server
npm run dev
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Technology Stack

- **Frontend**: React 18 with TypeScript
- **Build Tool**: Vite
- **UI Framework**: shadcn/ui components
- **Styling**: Tailwind CSS
- **State Management**: React Context API
- **Routing**: React Router DOM
- **Charts**: Recharts
- **Notifications**: Sonner

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # Base UI components (shadcn/ui)
│   ├── layout/         # Layout components (Header, Sidebar)
│   ├── dashboard/      # Dashboard-specific components
│   ├── analytics/      # Analytics and reporting
│   ├── ai/            # AI chat and assistant
│   └── ...            # Feature-specific components
├── i18n/              # Internationalization
├── hooks/             # Custom React hooks
├── lib/               # Utility functions
└── pages/             # Page components
```