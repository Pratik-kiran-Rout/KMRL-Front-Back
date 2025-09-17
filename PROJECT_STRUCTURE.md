# KMRL DocHub - Complete Project Structure Documentation

## Project Overview

**KMRL DocHub** is an intelligent document management and compliance platform designed for Kochi Metro Rail Limited. It provides AI-powered document processing, real-time analytics, and comprehensive compliance management with a modern React frontend and FastAPI backend.

### Key Features
- AI-Powered Document Processing (OCR, NLP, Summarization)
- Multi-language Support (English, Malayalam, Hindi)
- Real-time Analytics & Predictive Insights
- Knowledge Graph Visualization (Neo4j)
- IoT Integration & Unified Namespace
- AR Document Preview
- Compliance Management & Audit Tracking
- Dark Mode Support with "Metro Signal-Glow" Design

---

## Root Directory Structure

```
d:\CORDING\KMRL-front-back\
└── KMRL-Front-Back\
    ├── KMRL-Front-AI\          # Main application directory
    └── package-lock.json       # Root package lock file
```

---

## Main Application Structure

```
KMRL-Front-AI\
├── 📁 backend\                 # FastAPI Backend Application
├── 📁 md files\               # Documentation & Requirements
├── 📁 public\                 # Static Frontend Assets
├── 📁 src\                    # React Frontend Source Code
├── 📄 Configuration Files     # Build & deployment configs
└── 📄 Documentation Files     # Project documentation
```

---

## Backend Architecture (`backend/`)

### Core Application Structure
```
backend/
├── app/                       # Main Python application
│   ├── api/                   # API route handlers
│   │   ├── __init__.py
│   │   ├── ai.py             # AI services endpoints
│   │   ├── auth.py           # Authentication endpoints
│   │   ├── documents.py      # Document management endpoints
│   │   ├── graph.py          # Knowledge graph endpoints
│   │   └── schemas.py        # Pydantic data models
│   │
│   ├── core/                 # Core configuration & database
│   │   ├── config.py         # Application configuration
│   │   ├── database.py       # Database connection & setup
│   │   └── security.py       # Security utilities
│   │
│   ├── models/               # SQLAlchemy database models
│   │   ├── __init__.py
│   │   ├── document.py       # Document data model
│   │   └── user.py           # User data model
│   │
│   ├── services/             # Business logic services
│   │   ├── __init__.py
│   │   ├── ai_service.py     # AI processing service
│   │   ├── graph_service.py  # Knowledge graph service
│   │   └── ocr_service.py    # OCR processing service
│   │
│   ├── __init__.py
│   └── main.py               # FastAPI application entry point
│
├── 📄 Configuration & Setup Files
├── 📄 Utility Scripts
└── 📄 Documentation
```

### Backend Configuration & Setup Files
```
backend/
├── .env.example              # Environment variables template
├── docker-compose.yml        # Docker services orchestration
├── Dockerfile               # Backend container definition
├── pyproject.toml           # Python project configuration
├── requirements.txt         # Python dependencies
└── README.md               # Backend documentation
```

### Backend Utility Scripts
```
backend/
├── check_all_users.py       # User verification utility
├── check_user.py           # Individual user check
├── create_user.py          # User creation script
├── install_missing.bat     # Dependency installer
├── list_users.py           # User listing utility
├── quick_check.py          # Quick system check
├── reset_user.py           # User reset utility
├── run.bat                 # Windows run script
├── run.py                  # Python run script
├── setup_complete.bat      # Complete setup script
├── setup_fresh.bat         # Fresh installation script
├── setup.bat               # Main setup script
├── test_document.py        # Document testing
├── test_document.txt       # Test document file
├── test_security.py        # Security testing
└── update_password.py      # Password update utility
```

---

## Frontend Architecture (`src/`)

### Component Organization
```
src/
├── components/               # React UI components
│   ├── admin/               # Administrative components
│   │   └── UserManagement.tsx
│   │
│   ├── ai/                  # AI-related components
│   │   ├── AIChatPage.tsx
│   │   └── FloatingChatbot.tsx
│   │
│   ├── analytics/           # Analytics & reporting
│   │   └── AnalyticsDashboard.tsx
│   │
│   ├── ar/                  # Augmented Reality features
│   │   └── ARPreview.tsx
│   │
│   ├── auth/                # Authentication components
│   │   └── LoginPage.tsx
│   │
│   ├── compliance/          # Compliance management
│   │   └── ComplianceCenter.tsx
│   │
│   ├── dashboard/           # Dashboard widgets
│   │   ├── ComplianceWidget.tsx
│   │   ├── RecentDocuments.tsx
│   │   └── StatsCards.tsx
│   │
│   ├── iot/                 # IoT integration components
│   │   └── IoTDashboard.tsx
│   │
│   ├── knowledge-graph/     # Knowledge graph visualization
│   │   ├── KnowledgeGraph.tsx
│   │   ├── KnowledgeGraphEnhanced.tsx
│   │   └── KnowledgeGraphImproved.tsx
│   │
│   ├── layout/              # Layout components
│   │   ├── Header.tsx
│   │   └── Sidebar.tsx
│   │
│   ├── notifications/       # Notification system
│   │   └── NotificationCenter.tsx
│   │
│   ├── profile/             # User profile management
│   │   └── ProfilePage.tsx
│   │
│   ├── search/              # Search & discovery
│   │   └── SearchDiscovery.tsx
│   │
│   ├── settings/            # System settings
│   │   └── SystemSettings.tsx
│   │
│   ├── theme/               # Theme management
│   │   └── ThemeProvider.tsx
│   │
│   ├── training/            # Training modules
│   │   └── TrainingCenter.tsx
│   │
│   ├── ui/                  # Reusable UI components (shadcn/ui)
│   │   ├── accordion.tsx
│   │   ├── alert-dialog.tsx
│   │   ├── alert.tsx
│   │   ├── aspect-ratio.tsx
│   │   ├── avatar.tsx
│   │   ├── badge.tsx
│   │   ├── breadcrumb.tsx
│   │   ├── button.tsx
│   │   ├── calendar.tsx
│   │   ├── card.tsx
│   │   ├── carousel.tsx
│   │   ├── chart.tsx
│   │   ├── checkbox.tsx
│   │   ├── collapsible.tsx
│   │   ├── command.tsx
│   │   ├── context-menu.tsx
│   │   ├── dialog.tsx
│   │   ├── drawer.tsx
│   │   ├── dropdown-menu.tsx
│   │   ├── form.tsx
│   │   ├── hover-card.tsx
│   │   ├── input-otp.tsx
│   │   ├── input.tsx
│   │   ├── label.tsx
│   │   ├── menubar.tsx
│   │   ├── navigation-menu.tsx
│   │   ├── pagination.tsx
│   │   ├── popover.tsx
│   │   ├── progress.tsx
│   │   ├── radio-group.tsx
│   │   ├── resizable.tsx
│   │   ├── scroll-area.tsx
│   │   ├── select.tsx
│   │   ├── separator.tsx
│   │   ├── sheet.tsx
│   │   ├── sidebar.tsx
│   │   ├── skeleton.tsx
│   │   ├── slider.tsx
│   │   ├── sonner.tsx
│   │   ├── switch.tsx
│   │   ├── table.tsx
│   │   ├── tabs.tsx
│   │   ├── textarea.tsx
│   │   ├── toast.tsx
│   │   ├── toaster.tsx
│   │   ├── toggle-group.tsx
│   │   ├── toggle.tsx
│   │   ├── tooltip.tsx
│   │   └── use-toast.ts
│   │
│   ├── upload/              # Document upload components
│   │   ├── UploadZone.tsx
│   │   └── UploadZoneEnhanced.tsx
│   │
│   └── viewer/              # Document viewer components
│       ├── DocumentViewer.tsx
│       └── DocumentViewerEnhanced.tsx
│
├── contexts/                # React contexts
│   └── AuthContext.tsx
│
├── hooks/                   # Custom React hooks
│   ├── use-mobile.tsx
│   └── use-toast.ts
│
├── i18n/                    # Internationalization
│   ├── LanguageProvider.tsx
│   └── translations.ts
│
├── lib/                     # Utility libraries
│   └── utils.ts
│
├── pages/                   # Page components
│   ├── Index.tsx
│   └── NotFound.tsx
│
├── services/                # API services
│   └── api.ts
│
├── App.css                  # Global styles
├── App.tsx                  # Main App component
├── index.css               # Base styles
├── main.tsx                # Application entry point
└── vite-env.d.ts           # Vite type definitions
```

---

## Documentation Structure (`md files/`)

```
md files/
├── BACKEND_PROTOTYPE_ROADMAP.md    # Backend development roadmap
├── BACKEND_REQUIREMENTS.md         # Detailed backend requirements
└── BACKEND_ROADMAP.md             # Backend implementation plan
```

---

## Static Assets (`public/`)

```
public/
├── favicon.ico             # Application favicon
├── placeholder.svg         # Placeholder graphics
└── robots.txt             # Search engine directives
```

---

## Configuration Files

### Frontend Configuration
```
KMRL-Front-AI/
├── .gitignore              # Git ignore rules
├── bun.lockb              # Bun package lock
├── components.json         # shadcn/ui configuration
├── docker-compose.yml      # Frontend Docker services
├── Dockerfile.frontend     # Frontend container definition
├── eslint.config.js       # ESLint configuration
├── index.html             # HTML entry point
├── Makefile               # Build automation
├── package-lock.json      # NPM package lock
├── package.json           # NPM dependencies & scripts
├── postcss.config.js      # PostCSS configuration
├── setup.bat              # Windows setup script
├── tailwind.config.ts     # Tailwind CSS configuration
├── tsconfig.app.json      # TypeScript app configuration
├── tsconfig.json          # Main TypeScript configuration
├── tsconfig.node.json     # Node.js TypeScript configuration
└── vite.config.ts         # Vite build configuration
```

### Key Documentation Files
```
KMRL-Front-AI/
├── App Feature Roadmap and Design Prompt.md  # Comprehensive feature roadmap
└── README.md                                  # Main project documentation
```

---

## Technology Stack

### Frontend Technologies
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **UI Library**: shadcn/ui + Tailwind CSS
- **State Management**: React Context API + TanStack Query
- **Routing**: React Router DOM
- **Styling**: Tailwind CSS with custom "Metro Signal-Glow" theme
- **Icons**: Lucide React
- **Charts**: Recharts
- **Forms**: React Hook Form + Zod validation

### Backend Technologies
- **Framework**: FastAPI (Python 3.11+)
- **Database**: SQLite (development) / PostgreSQL (production)
- **Vector Database**: FAISS (development) / Milvus (production)
- **Graph Database**: Neo4j
- **Cache**: Redis
- **AI/ML**: Transformers, Sentence Transformers, Tesseract OCR
- **Authentication**: JWT with passlib
- **Task Queue**: Celery
- **API Documentation**: OpenAPI/Swagger

### Infrastructure & DevOps
- **Containerization**: Docker + Docker Compose
- **Orchestration**: Kubernetes (production)
- **Monitoring**: Prometheus + Grafana
- **Load Balancer**: NGINX
- **CI/CD**: GitHub Actions (implied)

---

## Development Workflow

### Available NPM Scripts
```json
{
  "dev": "vite",                                    // Start frontend dev server
  "build": "vite build",                           // Build for production
  "backend:setup": "cd backend && python setup",   // Setup Python environment
  "backend:dev": "cd backend && uvicorn app.main:app --reload",  // Start backend
  "docker:up": "docker-compose up -d",            // Start all services
  "start": "concurrently \"npm run dev\" \"npm run backend:dev\"",  // Start full stack
  "setup": "npm install && npm run backend:setup" // Complete project setup
}
```

### Development Environment Setup
1. **Prerequisites**: Node.js 18+, Python 3.11+, Git
2. **Quick Start**: Run `setup.bat` for one-command setup
3. **Development**: Use `npm run start` for full-stack development
4. **Docker**: Use `docker-compose up -d` for containerized development

---

## Architecture Patterns

### Frontend Architecture
- **Component-Based**: Modular React components with clear separation of concerns
- **Feature-Based Organization**: Components grouped by business functionality
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Dark Theme**: "Metro Signal-Glow" design language with KMRL branding
- **Accessibility**: WCAG compliance with screen reader support

### Backend Architecture
- **Microservices-Ready**: Modular service architecture
- **API-First**: RESTful API design with OpenAPI documentation
- **Event-Driven**: Async processing with Celery task queues
- **Security-First**: JWT authentication, RBAC, encryption at rest/transit
- **Scalable**: Horizontal scaling with containerization

### Data Architecture
- **Multi-Database**: 
  - SQLite/PostgreSQL for transactional data
  - Neo4j for knowledge graphs
  - FAISS/Milvus for vector search
  - Redis for caching
- **Real-time**: WebSocket support for live collaboration
- **Audit Trail**: Immutable logging with blockchain integration (Hyperledger Fabric)

---

## Security & Compliance

### Security Features
- **Authentication**: Multi-factor authentication with Aadhaar integration
- **Authorization**: Role-based access control (RBAC)
- **Encryption**: AES-256 at rest, TLS 1.3 in transit
- **API Security**: Rate limiting, input validation, CORS configuration
- **Audit Logging**: Comprehensive activity tracking

### Compliance Standards
- **DPDP Act**: Indian data protection compliance
- **GDPR**: European data protection compliance
- **Railway Safety**: Industry-specific compliance (CMRS/MoHUA)
- **Government Standards**: MeitY security guidelines

---

## Deployment Architecture

### Development Environment
- **Local Development**: Docker Compose with hot reloading
- **Database**: SQLite for simplicity
- **Storage**: Local file system
- **Services**: All services in single compose file

### Production Environment
- **Orchestration**: Kubernetes with Helm charts
- **Database**: PostgreSQL with TimescaleDB, Neo4j cluster
- **Storage**: Cloud storage (AWS S3/GCP Cloud Storage)
- **Monitoring**: Prometheus + Grafana + ELK stack
- **Load Balancing**: NGINX with WAF
- **Auto-scaling**: Kubernetes HPA based on metrics

---

## Future Roadmap

### Phase 1: Core Intelligence Engine (MVP)
- ✅ Document upload & OCR processing
- ✅ AI summarization & semantic search
- ✅ Basic dashboard & mobile support
- ✅ JWT authentication

### Phase 2: Collaborative & Predictive Platform
- 🔄 Multi-channel ingestion (SharePoint, Email, WhatsApp)
- 🔄 Real-time collaboration & annotations
- 🔄 Knowledge graph visualization
- 🔄 Predictive analytics with Prophet

### Phase 3: Integrated Enterprise Network
- 📋 IoT/UNS integration via MQTT
- 📋 Executive & admin portals
- 📋 Blockchain audit trails
- 📋 AR document preview
- 📋 Advanced compliance reporting

---

## Contact & Support

- **Project**: KMRL DocHub - Intelligent Document Management Platform
- **Organization**: Kochi Metro Rail Limited (KMRL)
- **License**: MIT
- **Repository**: https://github.com/kmrl/dochub.git
- **Documentation**: See README.md files in respective directories

---

*This documentation provides a comprehensive overview of the KMRL DocHub project structure. For detailed implementation guides, refer to the specific README files in each directory.*