# KMRL DocHub - Full Stack Platform

## Project Overview

KMRL DocHub is an intelligent document management and compliance platform designed for Kochi Metro Rail Limited. It provides AI-powered document processing, real-time analytics, and comprehensive compliance management with a modern React frontend and FastAPI backend.

## Features

- **AI-Powered Document Processing**: OCR, NLP, and intelligent summarization
- **Multi-language Support**: English, Malayalam, and Hindi interface
- **Real-time Analytics**: Performance metrics and predictive insights
- **Knowledge Graph**: Neo4j-powered relationship mapping
- **IoT Integration**: Unified namespace connectivity for metro operations
- **AR Document Preview**: Augmented reality overlay for field operations
- **Compliance Management**: Regulatory compliance and audit tracking
- **Dark Mode Support**: Complete light/dark theme system

## Quick Start

### Prerequisites
- Node.js 18+ & npm
- Python 3.11+
- Git

### One-Command Setup
```bash
# Clone and setup everything
git clone <YOUR_GIT_URL>
cd kmrl-dochub
setup.bat
```

### Development
```bash
# Start both frontend and backend
npm run start

# Or individually
npm run dev          # Frontend only
npm run backend:dev  # Backend only
```

### Docker (Alternative)
```bash
make docker-up
# or
docker-compose up -d
```

## Available Scripts

### Full Stack
- `npm run start` - Start both frontend and backend
- `npm run setup` - Complete project setup
- `npm run clean` - Clean all environments

### Frontend
- `npm run dev` - Start React development server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint

### Backend
- `npm run backend:dev` - Start FastAPI server
- `npm run backend:setup` - Setup Python environment
- `npm run backend:test` - Run Python tests

### Docker
- `npm run docker:up` - Start all services
- `npm run docker:down` - Stop all services
- `npm run docker:logs` - View logs

## Technology Stack

### Frontend
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **UI**: shadcn/ui + Tailwind CSS
- **State**: React Context API
- **Routing**: React Router DOM

### Backend
- **Framework**: FastAPI (Python 3.11+)
- **Database**: SQLite + Neo4j + Redis
- **AI/ML**: Transformers, Tesseract OCR
- **Queue**: Celery
- **Auth**: JWT

## Project Structure

```
kmrl-dochub/
├── src/                 # React frontend
│   ├── components/      # UI components
│   ├── pages/          # Page components
│   └── i18n/           # Internationalization
├── backend/            # FastAPI backend
│   ├── app/            # Python application
│   ├── data/           # Local storage
│   └── requirements.txt
├── docker-compose.yml  # Full stack orchestration
├── package.json        # Frontend + backend scripts
└── setup.bat          # One-command setup
```