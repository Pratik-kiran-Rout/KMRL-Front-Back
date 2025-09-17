# KMRL DocHub - Full Stack Makefile

.PHONY: install dev clean test build docker-build docker-up setup

# Install all dependencies (frontend + backend)
install:
	npm install
	cd backend && python -m venv venv && venv\Scripts\activate && pip install --upgrade pip && pip install -e .

# Development setup
dev:
	npm install
	cd backend && python -m venv venv && venv\Scripts\activate && pip install --upgrade pip && pip install -e .[dev]

# Start development servers (both frontend and backend)
start:
	npm run start

# Frontend only
frontend:
	npm run dev

# Backend only  
backend:
	npm run backend:dev

# Clean all environments
clean:
	npm run clean

# Run tests
test:
	npm run lint
	npm run backend:test

# Build for production
build:
	npm run build
	cd backend && venv\Scripts\activate && python -m build

# Docker commands
docker-build:
	docker-compose build

docker-up:
	docker-compose up -d

docker-down:
	docker-compose down

docker-logs:
	docker-compose logs -f

# Complete setup (recommended for first time)
setup:
	npm run setup

# Backend specific commands
backend-setup:
	npm run backend:setup

backend-clean:
	npm run backend:clean