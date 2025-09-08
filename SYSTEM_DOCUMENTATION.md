# PineappleVision System Documentation

# PL
### Primary Languages
1. 1.
   TypeScript/JavaScript
- Main server files ( *.ts )
- React client components ( *.tsx )
- Configuration files ( tsconfig.json , vite.config.ts )
2. 1.
   Python
- AI/ML processing ( python_inference.py )
- TensorFlow model handling
- Virtual environment ( tfenv/ )
### Web Technologies
1. 1.
   HTML/CSS
- Client interface ( index.html )
- Tailwind CSS ( tailwind.config.ts )
- PostCSS ( postcss.config.js )
### Configuration & Data
1. 1.
   JSON
- Package management ( package.json )
- Model registry ( model-registry.json )
- Project configuration files
### Framework Stack
1. 1.
   Frontend
- React (TypeScript)
- Vite bundler
- Tailwind CSS
2. 1.
   Backend
- Node.js/TypeScript server
- Python AI services
- WebSocket for real-time communication
Note: The system uses a hybrid approach, combining TypeScript for the main application and Python specifically for AI/ML operations with TensorFlow.



## Table of Contents

1. [System Overview](#system-overview)
2. [Architecture Details](#architecture-details)
3. [Frontend Components](#frontend-components)
4. [Backend Services](#backend-services)
5. [AI Integration](#ai-integration)
6. [Database Schema](#database-schema)
7. [API Endpoints](#api-endpoints)
8. [Data Flow](#data-flow)
9. [Development Workflow](#development-workflow)
10. [Deployment Guide](#deployment-guide)
11. [Monitoring & Maintenance](#monitoring--maintenance)
12. [Troubleshooting](#troubleshooting)

---

## System Overview

**PineappleVision** is a comprehensive web application designed for AI-powered pineapple disease detection and farm management. The system serves farmers in Calauan, Laguna with real-time analysis, comprehensive reporting, and data-driven insights for crop health management.

### Core Features
- **Disease Detection**: AI-powered image analysis for early disease identification
- **Farm Management**: Multi-farm monitoring and analysis tracking
- **Analytics Dashboard**: Real-time statistics and performance metrics
- **Reporting System**: Comprehensive reports with export capabilities
- **Historical Analysis**: Trend analysis and historical data comparison

### Technology Stack
- **Frontend**: React 18 + TypeScript + Tailwind CSS
- **Backend**: Express.js + Node.js + TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **AI Integration**: TensorFlow.js / PyTorch / ONNX support
- **Build Tools**: Vite for development and production builds

---

## Architecture Details

### High-Level Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend       │    │   AI Service    │
│   (React SPA)   │◄──►│   (Express.js)  │◄──►│   (ML Models)   │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Static Files  │    │   PostgreSQL    │    │   Model Store   │
│   (Vite Build)  │    │   Database      │    │   (Versioned)   │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### Component Architecture

#### Frontend Layer
- **Pages**: Route-level components for main application sections
- **Components**: Reusable UI components with specific functionality
- **Hooks**: Custom React hooks for state management and side effects
- **Services**: API communication and data fetching logic
- **Styles**: Component-specific CSS and global styling

#### Backend Layer
- **Routes**: API endpoint definitions and request handling
- **Services**: Business logic and data processing
- **Storage**: Data access layer and database operations
- **AI Integration**: Model management and inference services
- **Middleware**: Authentication, validation, and error handling

#### Data Layer
- **Database**: PostgreSQL for persistent data storage
- **Models**: Drizzle ORM schema definitions and migrations
- **Cache**: In-memory storage for performance optimization
- **Files**: Image storage and processing pipeline

---

## Frontend Components

### Page Components

#### 1. Home Page (`client/src/pages/Home.tsx`)
**Purpose**: Main dashboard with statistics and upload functionality

**Key Features**:
- Real-time farm statistics display
- Image upload interface for disease detection
- Quick access to recent analyses
- Performance metrics visualization

**Data Dependencies**:
- Dashboard statistics from `/api/dashboard/stats`
- Farm data for location selection
- Recent analyses for quick preview

#### 2. Analyze Page (`client/src/pages/Analyze.tsx`)
**Purpose**: Analysis history and detailed insights

**Key Features**:
- Historical analysis table with filtering
- Confidence level visualizations
- Farm-based analysis grouping
- Export functionality for analysis data

**Data Dependencies**:
- All analyses from `/api/analyses`
- Farm information for location context
- Filtering and sorting capabilities

#### 3. Reports Page (`client/src/pages/Report.tsx`)
**Purpose**: Comprehensive analytics and reporting

**Key Features**:
- Farm performance comparisons
- Disease distribution charts
- Export capabilities (PDF, CSV)
- Time-based trend analysis

**Data Dependencies**:
- Report data from `/api/reports`
- Aggregated statistics and metrics
- Chart data for visualizations

#### 4. About Us Page (`client/src/pages/AboutUs.tsx`)
**Purpose**: Project information and team details

**Key Features**:
- Mission statement and project goals
- Team member profiles and expertise
- Technology stack information
- Contact information and links

**Data Dependencies**:
- Static content and team information
- Project statistics and achievements

### Core Components

#### Header Component (`client/src/components/Header.tsx`)
**Purpose**: Navigation sidebar with branding

**Features**:
- Logo and brand identity
- Navigation menu with active states
- Consistent styling across pages
- Responsive design for mobile devices

#### Upload Form (`client/src/components/AnalyzeForm.tsx`)
**Purpose**: File upload interface for disease detection

**Features**:
- Drag-and-drop file upload
- Multiple upload modes (single/batch)
- File validation and size checking
- Progress indicators and error handling

**Integration Points**:
- Connects to `/api/analyze/images` for processing
- Validates file types and sizes
- Provides user feedback and status updates

#### Analysis Results (`client/src/components/AnalysisResults.tsx`)
**Purpose**: Display analysis history in table format

**Features**:
- Sortable and filterable data table
- Confidence level progress bars
- Status badges for disease detection
- Export functionality integration

#### Statistics Cards (`client/src/components/FeaturesSection.tsx`)
**Purpose**: Dashboard metrics visualization

**Features**:
- Key performance indicators
- Color-coded status indicators
- Trend visualization with changes
- Responsive grid layout

---

## Backend Services

### Core Services

#### Storage Service (`server/storage.ts`)
**Purpose**: Data access layer and business logic

**Interfaces**:
```typescript
interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Farm operations
  getAllFarms(): Promise<Farm[]>;
  getFarm(id: number): Promise<Farm | undefined>;
  createFarm(farm: InsertFarm): Promise<Farm>;
  
  // Analysis operations
  getAllAnalyses(): Promise<Analysis[]>;
  getAnalysesByFarm(farmId: number): Promise<Analysis[]>;
  createAnalysis(analysis: InsertAnalysis): Promise<Analysis>;
  
  // Reporting operations
  getDashboardStats(): Promise<any>;
  getReportData(): Promise<any>;
}
```

**Current Implementation**:
- In-memory storage with sample data
- Ready for PostgreSQL integration
- Sample farm data for Calauan, Laguna
- Mock analysis results for development

#### Route Handlers (`server/routes.ts`)
**Purpose**: API endpoint definitions and request handling

**Endpoints**:
- `GET /api/farms` - Retrieve all farm locations
- `GET /api/analyses` - Get analysis history
- `POST /api/analyses` - Create new analysis record
- `GET /api/dashboard/stats` - Dashboard statistics
- `GET /api/reports` - Report data and metrics
- `POST /api/analyze/images` - Image analysis (AI integration)
- `GET /api/models/status` - AI model status
- `POST /api/models/switch` - Switch AI model versions

---

## AI Integration

### AI Service (`server/ai-service.ts`)

**Purpose**: Core AI model integration and inference engine

**Key Classes**:

#### AIService Class
```typescript
class AIService {
  async initialize(): Promise<void>
  async detectDisease(request: ImageAnalysisRequest): Promise<DetectionResult>
  async processBatch(requests: ImageAnalysisRequest[]): Promise<DetectionResult[]>
  getModelInfo(): ModelInfo
}
```

**Features**:
- Multi-framework support (TensorFlow, PyTorch, ONNX)
- Image preprocessing pipeline
- Batch processing capabilities
- Confidence scoring and severity assessment
- Performance monitoring and metrics

**Configuration**:
```typescript
interface AIModelConfig {
  modelPath: string;
  modelType: 'tensorflow' | 'pytorch' | 'onnx';
  inputSize: { width: number; height: number };
  classes: string[];
  confidenceThreshold: number;
}
```

### Model Manager (`server/model-manager.ts`)

**Purpose**: AI model lifecycle management

**Features**:
- Model version control and registry
- Hot-swapping between model versions
- Performance monitoring and metrics
- Health checks and diagnostics
- Automatic model loading and fallbacks

**Model Registry**:
```json
{
  "versions": [
    {
      "version": "v1.0.0",
      "path": "./models/pineapple-disease-detector/v1.0.0/model.h5",
      "accuracy": 92.5,
      "trainingDate": "2025-01-15T00:00:00.000Z",
      "isActive": true,
      "metadata": {
        "trainingDataSize": 10000,
        "epochs": 100,
        "validationAccuracy": 92.5,
        "testAccuracy": 89.7
      }
    }
  ]
}
```

### Disease Classification

**Supported Disease Classes**:
1. **Healthy** - No disease detected, normal plant condition
2. **Fruit Rot** - Internal fruit rot
3. **Mealybug Wilt** - Crown and top rot disease
5. **Root Rot** - Root system diseases affecting nutrient uptake

**Confidence Scoring**:
- Threshold: 60% minimum confidence for disease detection
- Severity levels: None, Mild (60-75%), Moderate (75-90%), Severe (90%+)
- Bounding box detection for disease localization

---

## Database Schema

### Core Tables

#### Users Table
```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(255) UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(50) DEFAULT 'farmer',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### Farms Table
```sql
CREATE TABLE farms (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  location VARCHAR(255) NOT NULL,
  sector VARCHAR(100),
  total_plants INTEGER DEFAULT 0,
  owner_id INTEGER REFERENCES users(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### Analyses Table
```sql
CREATE TABLE analyses (
  id SERIAL PRIMARY KEY,
  farm_id INTEGER REFERENCES farms(id),
  image_path VARCHAR(500),
  disease_status VARCHAR(100) NOT NULL,
  confidence DECIMAL(5,2),
  severity VARCHAR(50),
  propagation_method VARCHAR(100),
  detection_results JSONB,
  analyzed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Relationships
- Users can own multiple farms (1:N)
- Farms can have multiple analyses (1:N)
- Analyses contain detection results and metadata

---

## API Endpoints

### Farm Management
- `GET /api/farms` - List all farms
- `POST /api/farms` - Create new farm
- `GET /api/farms/:id` - Get specific farm details
- `PUT /api/farms/:id` - Update farm information

### Analysis Operations
- `GET /api/analyses` - Get all analyses
- `GET /api/analyses/farm/:farmId` - Get farm-specific analyses
- `POST /api/analyses` - Create new analysis record
- `DELETE /api/analyses/:id` - Remove analysis record

### AI Integration
- `POST /api/analyze/images` - Submit images for AI analysis
- `GET /api/models/status` - Check AI model status
- `POST /api/models/switch` - Switch active model version
- `GET /api/models/capabilities` - Get model capabilities

### Reporting
- `GET /api/dashboard/stats` - Dashboard statistics
- `GET /api/reports` - Comprehensive report data
- `GET /api/reports/export/csv` - Export data as CSV
- `GET /api/reports/export/pdf` - Generate PDF report

---

## Data Flow

### Image Analysis Workflow

1. **Image Upload**
   ```
   User selects images → Frontend validation → File upload to server
   ```

2. **AI Processing**
   ```
   Server receives images → AI Service processes → Results generated
   ```

3. **Data Storage**
   ```
   Results saved to database → Analysis record created → Stats updated
   ```

4. **User Feedback**
   ```
   Results returned to frontend → UI updates → User notification
   ```

### Dashboard Data Flow

1. **Statistics Collection**
   ```
   Aggregate analysis data → Calculate metrics → Cache results
   ```

2. **Real-time Updates**
   ```
   New analyses trigger updates → Dashboard refreshes → Live metrics
   ```

### Report Generation

1. **Data Aggregation**
   ```
   Collect farm data → Process metrics → Generate charts
   ```

2. **Export Processing**
   ```
   Format data → Generate files → Download delivery
   ```

---

## Development Workflow

### Local Development Setup

1. **Prerequisites**
   ```bash
   Node.js 18+
   npm or yarn
   PostgreSQL (optional for full database)
   ```

2. **Installation**
   ```bash
   git clone [repository]
   cd pineapplevision
   npm install
   ```

3. **Environment Configuration**
   ```bash
   cp .env.example .env
   # Configure database and AI model paths
   ```

4. **Start Development Server**
   ```bash
   npm run dev
   ```

### Code Organization

```
project/
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Route-level page components
│   │   ├── hooks/          # Custom React hooks
│   │   ├── lib/            # Utility functions and helpers
│   │   └── styles/         # Component-specific CSS
├── server/                 # Backend Express application
│   ├── ai-service.ts       # AI model integration
│   ├── model-manager.ts    # Model lifecycle management
│   ├── routes.ts           # API route definitions
│   ├── storage.ts          # Data access layer
│   └── index.ts            # Server entry point
├── shared/                 # Shared types and schemas
│   └── schema.ts           # Database schema definitions
├── models/                 # AI model storage
│   ├── README.md           # Model deployment guide
│   └── model-registry.json # Version registry
└── docs/                   # Documentation
    └── SYSTEM_DOCUMENTATION.md
```

### Adding New Features

1. **Frontend Components**
   - Create component in `client/src/components/`
   - Add corresponding CSS file in `client/src/styles/`
   - Export from component index if needed
   - Add to page component or routing

2. **Backend Endpoints**
   - Define route in `server/routes.ts`
   - Add business logic to appropriate service
   - Update storage interface if database access needed
   - Add input validation using Zod schemas

3. **Database Changes**
   - Update schema in `shared/schema.ts`
   - Create migration using Drizzle Kit
   - Update storage interface in `server/storage.ts`
   - Test with development data

---

## Deployment Guide

### AI Model Integration

1. **Model Preparation**
   ```bash
   # Place trained model in models directory
   mkdir -p models/pineapple-disease-detector/v1.0.0/
   cp your_model.h5 models/pineapple-disease-detector/v1.0.0/model.h5
   ```

2. **Model Configuration**
   ```json
   {
     "modelType": "tensorflow",
     "inputSize": {"width": 224, "height": 224},
     "classes": ["Healthy", "Fruit Rot", "Mealybug Wilt", "Root Rot"],
     "confidenceThreshold": 0.6
   }
   ```

3. **Model Activation**
   ```javascript
   // The system will auto-load the best available model
   // Or manually activate via API:
   POST /api/models/switch
   {"version": "v1.0.0"}
   ```

### Production Deployment

1. **Build Application**
   ```bash
   npm run build
   ```

2. **Environment Variables**
   ```bash
   NODE_ENV=production
   DATABASE_URL=postgresql://...
   AI_MODEL_PATH=/path/to/models
   ```

3. **Start Production Server**
   ```bash
   npm start
   ```

### Database Setup

1. **Create Database**
   ```sql
   CREATE DATABASE pineapplevision;
   ```

2. **Run Migrations**
   ```bash
   npm run db:migrate
   ```

3. **Seed Data** (optional)
   ```bash
   npm run db:seed
   ```

---

## Monitoring & Maintenance

### Performance Monitoring

**AI Model Metrics**:
- Inference time per image
- Memory usage and optimization
- Model accuracy in production
- Error rates and failure modes

**Application Metrics**:
- API response times
- Database query performance
- User engagement statistics
- System resource utilization

### Health Checks

**Model Health**:
```javascript
GET /api/models/status
// Returns model availability, performance metrics
```

**System Health**:
- Database connectivity
- File system access
- Memory and CPU usage
- API endpoint availability

### Maintenance Tasks

**Regular Updates**:
- Model retraining and deployment
- Database maintenance and optimization
- Security updates and patches
- Performance tuning and optimization

**Data Management**:
- Analysis data archival
- Image storage cleanup
- Log rotation and management
- Backup and recovery procedures

---

## Troubleshooting

### Common Issues

#### AI Model Problems

**Model Not Loading**:
```
Error: Model file not found
Solution: Check model path and file permissions
```

**Low Inference Accuracy**:
```
Issue: Confidence scores consistently low
Solution: Verify image preprocessing, check model version
```

**Memory Issues**:
```
Error: Out of memory during inference
Solution: Implement batch processing, optimize model size
```

#### Frontend Issues

**Component Not Updating**:
```
Issue: Data not refreshing
Solution: Check React Query cache invalidation
```

**Styling Problems**:
```
Issue: CSS classes not applied
Solution: Verify Tailwind compilation, check class names
```

#### Backend Issues

**Database Connection**:
```
Error: Connection refused
Solution: Check DATABASE_URL, verify PostgreSQL service
```

**API Endpoint Errors**:
```
Error: 500 Internal Server Error
Solution: Check server logs, verify request validation
```

### Debug Mode

Enable detailed logging:
```javascript
// Add to environment variables
DEBUG=pineapplevision:*
LOG_LEVEL=debug
```

### Getting Help

1. **Check Documentation**: Review this document and README files
2. **Examine Logs**: Server and browser console logs
3. **Test Endpoints**: Use API testing tools for backend issues
4. **Component Inspection**: React Developer Tools for frontend debugging
5. **Model Validation**: Test AI models with sample images

---

## Future Enhancements

### Planned Features

1. **Advanced AI Capabilities**
   - Multi-disease detection in single images
   - Disease severity progression tracking
   - Treatment recommendation system
   - Integration with IoT sensors

2. **Enhanced Analytics**
   - Predictive modeling for disease outbreaks
   - Weather data integration
   - Crop yield optimization recommendations
   - Comparative analysis across regions

3. **User Experience**
   - Mobile application development
   - Offline analysis capabilities
   - Real-time notifications and alerts
   - Collaborative farm management tools

4. **Integration Capabilities**
   - Third-party agricultural APIs
   - Weather service integration
   - Supply chain management systems
   - Government reporting compliance

### Technical Improvements

1. **Performance Optimization**
   - Model quantization and optimization
   - Edge computing deployment
   - Caching layer improvements
   - Database query optimization

2. **Scalability Enhancements**
   - Microservices architecture
   - Container orchestration
   - Load balancing implementation
   - Auto-scaling capabilities

3. **Security Enhancements**
   - Advanced authentication systems
   - Data encryption at rest and transit
   - Audit logging and compliance
   - API rate limiting and protection

---

This documentation provides a comprehensive overview of the PineappleVision system. Regular updates should be made as new features are added and the system evolves.