# PineappleVision - AI-Powered Pineapple Disease Detection System

## Overview

PineappleVision is a comprehensive web application designed to revolutionize pineapple farming through AI-powered disease detection and propagation method analysis. The system helps farmers in Calbazon, Laguna make informed decisions about crop management and disease prevention by providing instant, accurate analysis of pineapple plant health.

## User Preferences

Preferred communication style: Simple, everyday language.

## Recent Changes

- **Button Functionality Enhancement (2025-01-15)**: Added real functionality to key application buttons
  - Upload button now processes files with simulated disease detection analysis
  - CSV export button creates actual downloadable CSV files with sample data
  - Submit button includes loading states and user feedback
  - Added form validation and error handling

## System Architecture

The application follows a modern full-stack architecture with clear separation between frontend and backend concerns:

- **Frontend**: React-based SPA with TypeScript
- **Backend**: Express.js server with RESTful API
- **Database**: PostgreSQL with Drizzle ORM
- **Build System**: Vite for development and production builds
- **Deployment**: Single-server deployment with static file serving

## Key Components

### Frontend Architecture
- **Framework**: React 18 with functional components and hooks
- **Routing**: Wouter for client-side routing
- **UI Components**: Radix UI primitives with shadcn/ui styling
- **Styling**: Tailwind CSS with custom CSS variables
- **State Management**: TanStack React Query for server state
- **Form Handling**: React Hook Form with Zod validation

### Backend Architecture
- **Server**: Express.js with TypeScript
- **Database ORM**: Drizzle ORM with PostgreSQL dialect
- **Validation**: Zod schemas for request/response validation
- **Storage**: Abstracted storage interface with in-memory implementation
- **Development**: Hot module replacement with Vite integration

### Database Schema
The system uses three main entities:
- **Users**: Authentication and user management
- **Farms**: Farm location and sector information
- **Analyses**: Disease detection results with confidence scores and propagation methods

## Data Flow

1. **Image Upload**: Users upload pineapple images through the analyze form
2. **Processing**: Images are processed for disease detection (simulated with mock data)
3. **Analysis Storage**: Results are stored with farm association and confidence metrics
4. **Dashboard Display**: Statistics and insights are calculated and displayed
5. **Reporting**: Comprehensive reports generated with farm performance metrics

## External Dependencies

### Core Dependencies
- **@neondatabase/serverless**: PostgreSQL connection for Neon database
- **@tanstack/react-query**: Server state management
- **@radix-ui/react-***: Accessible UI component primitives
- **drizzle-orm**: Type-safe database operations
- **wouter**: Lightweight client-side routing
- **zod**: Runtime type validation

### Development Dependencies
- **Vite**: Build tool and development server
- **TypeScript**: Static type checking
- **Tailwind CSS**: Utility-first CSS framework
- **ESBuild**: Fast JavaScript bundler

## Deployment Strategy

The application is designed for single-server deployment with the following characteristics:

1. **Build Process**: 
   - Frontend built with Vite to static files
   - Backend bundled with ESBuild for Node.js runtime
   - Assets served from `dist/public` directory

2. **Production Setup**:
   - Express server serves both API routes and static files
   - Database migrations handled via Drizzle Kit
   - Environment variables for database connection

3. **Development Environment**:
   - Vite dev server with HMR for frontend
   - tsx for TypeScript execution in development
   - Replit-specific optimizations and error handling

4. **Database Management**:
   - PostgreSQL as primary database
   - Drizzle migrations in `migrations/` directory
   - Connection pooling through Neon serverless driver

The architecture prioritizes simplicity and maintainability while providing a scalable foundation for AI-powered agricultural analytics.