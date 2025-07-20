# PineappleVision - System Architecture

## 🏗️ High-Level System Architecture

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                              PineappleVision System                            │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                 │
│  ┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐           │
│  │   Frontend      │    │   Backend       │    │   AI Service    │           │
│  │   (React SPA)   │◄──►│   (Express.js)  │◄──►│   (ML Models)   │           │
│  └─────────────────┘    └─────────────────┘    └─────────────────┘           │
│           │                       │                       │                    │
│           │                       │                       │                    │
│           ▼                       ▼                       ▼                    │
│  ┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐           │
│  │   Static Files  │    │   PostgreSQL    │    │   Model Store   │           │
│  │   (Vite Build)  │    │   Database      │    │   (Versioned)   │           │
│  └─────────────────┘    └─────────────────┘    └─────────────────┘           │
│                                                                                 │
└─────────────────────────────────────────────────────────────────────────────────┘
```

## 📊 Detailed Component Architecture

### Frontend Layer (React + TypeScript)

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                              Frontend Architecture                             │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                 │
│  ┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐           │
│  │   Pages         │    │   Components    │    │   Services      │           │
│  │                 │    │                 │    │                 │           │
│  │ • Home.tsx      │    │ • Header.tsx    │    │ • WebSocket     │           │
│  │ • Analyze.tsx   │    │ • AnalyzeForm   │    │ • API Client    │           │
│  │ • Report.tsx    │    │ • AnalysisResults│   │ • File Upload   │           │
│  │ • AboutUs.tsx   │    │ • ReportSummary │    │ • State Mgmt    │           │
│  └─────────────────┘    └─────────────────┘    └─────────────────┘           │
│           │                       │                       │                    │
│           └───────────────────────┼───────────────────────┘                    │
│                                   │                                            │
│                                   ▼                                            │
│  ┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐           │
│  │   Hooks         │    │   Styles        │    │   Utils         │           │
│  │                 │    │                 │    │                 │           │
│  │ • useMobile     │    │ • Component CSS │    │ • Query Client  │           │
│  │ • useToast      │    │ • Tailwind CSS  │    │ • Form Utils    │           │
│  │ • Custom Hooks  │    │ • Responsive    │    │ • Validation    │           │
│  └─────────────────┘    └─────────────────┘    └─────────────────┘           │
│                                                                                 │
└─────────────────────────────────────────────────────────────────────────────────┘
```

### Backend Layer (Express.js + Node.js)

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                              Backend Architecture                             │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                 │
│  ┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐           │
│  │   Routes        │    │   Services      │    │   Middleware    │           │
│  │                 │    │                 │    │                 │           │
│  │ • API Routes    │    │ • AI Service    │    │ • CORS          │           │
│  │ • WebSocket     │    │ • Model Manager │    │ • Validation    │           │
│  │ • File Upload   │    │ • Storage       │    │ • Error Handler │           │
│  │ • Static Files  │    │ • Analytics     │    │ • Auth (Future) │           │
│  └─────────────────┘    └─────────────────┘    └─────────────────┘           │
│           │                       │                       │                    │
│           └───────────────────────┼───────────────────────┘                    │
│                                   │                                            │
│                                   ▼                                            │
│  ┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐           │
│  │   Database      │    │   Storage       │    │   Utils         │           │
│  │                 │    │                 │    │                 │           │
│  │ • PostgreSQL    │    │ • File System   │    │ • Image Proc    │           │
│  │ • Drizzle ORM   │    │ • Model Files   │    │ • Validation    │           │
│  │ • Migrations    │    │ • Temp Storage  │    │ • Logging       │           │
│  └─────────────────┘    └─────────────────┘    └─────────────────┘           │
│                                                                                 │
└─────────────────────────────────────────────────────────────────────────────────┘
```

## 🔄 Data Flow Architecture

### 1. Image Upload & Analysis Flow

```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│   User      │    │   Frontend  │    │   Backend   │    │   AI Model  │
│   Upload    │───►│   Form      │───►│   API       │───►│   Process   │
└─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘
       │                   │                   │                   │
       │                   │                   │                   │
       ▼                   ▼                   ▼                   ▼
┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│   Image     │    │   Validation│    │   File Proc │    │   Results   │
│   File      │    │   & Preview │    │   & Storage │    │   & Metrics │
└─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘
       │                   │                   │                   │
       │                   │                   │                   │
       ▼                   ▼                   ▼                   ▼
┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│   Metadata  │    │   WebSocket │    │   Database  │    │   Dashboard │
│   Collection│    │   Update    │    │   Storage   │    │   Display   │
└─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘
```

### 2. Real-time Updates Flow

```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│   WebSocket │    │   Backend   │    │   Frontend  │    │   UI        │
│   Server    │───►│   Broadcast │───►│   Listen    │───►│   Update    │
└─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘
       │                   │                   │                   │
       │                   │                   │                   │
       ▼                   ▼                   ▼                   ▼
┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│   Message   │    │   State     │    │   Component │    │   Real-time │
│   Types     │    │   Updates   │    │   Re-render │    │   Display   │
└─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘
```

## 👤 User Journey & System Flow

### User Interaction Flowchart

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                              User Journey Flowchart                            │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                 │
│  ┌─────────────┐                                                               │
│  │   User      │                                                               │
│  │   Arrives   │                                                               │
│  └─────┬───────┘                                                               │
│        │                                                                        │
│        ▼                                                                        │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐   │
│  │   Home      │───►│   Dashboard │───►│   View      │───►│   Navigate   │   │
│  │   Page      │    │   Stats     │    │   Insights  │    │   to Pages   │   │
│  └─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘   │
│        │                       │                       │                       │
│        │                       │                       │                       │
│        ▼                       ▼                       ▼                       │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐   │
│  │   Upload    │    │   Analyze   │    │   Reports   │    │   About Us   │   │
│  │   Images    │    │   History   │    │   & Export  │    │   & Info     │   │
│  └─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘   │
│        │                       │                       │                       │
│        │                       │                       │                       │
│        ▼                       ▼                       ▼                       │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐   │
│  │   Select    │    │   View      │    │   Generate  │    │   Learn      │   │
│  │   Files     │    │   Results   │    │   Reports   │    │   About      │   │
│  └─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘   │
│        │                       │                       │                       │
│        │                       │                       │                       │
│        ▼                       ▼                       ▼                       │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐   │
│  │   Choose    │    │   Filter    │    │   Download  │    │   Contact    │   │
│  │   Method    │    │   & Sort    │    │   PDF/CSV   │    │   Team       │   │
│  └─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘   │
│        │                       │                       │                       │
│        │                       │                       │                       │
│        ▼                       ▼                       ▼                       │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐   │
│  │   Enter     │    │   Export    │    │   View      │    │   Return     │   │
│  │   Metadata  │    │   Data      │    │   Charts    │    │   to Home    │   │
│  └─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘   │
│        │                       │                       │                       │
│        │                       │                       │                       │
│        ▼                       ▼                       ▼                       │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐   │
│  │   Submit    │    │   View      │    │   Analyze   │    │   Continue   │   │
│  │   Analysis  │    │   Results   │    │   Trends    │    │   Using      │   │
│  └─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘   │
│        │                       │                       │                       │
│        │                       │                       │                       │
│        ▼                       ▼                       ▼                       │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐   │
│  │   View      │    │   Track     │    │   Make      │    │   System     │   │
│  │   Results   │    │   Progress  │    │   Decisions │    │   Loop       │   │
│  └─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘   │
│                                                                                 │
└─────────────────────────────────────────────────────────────────────────────────┘
```

### Detailed User Workflow

#### 1. **Initial Access & Navigation**
```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│   User      │    │   Home      │    │   Dashboard │    │   Navigation │
│   Opens     │───►│   Page      │───►│   Overview  │───►│   Menu       │
│   Browser   │    │   Loads     │    │   Displays  │    │   Available  │
└─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘
       │                   │                   │                   │
       │                   │                   │                   │
       ▼                   ▼                   ▼                   ▼
┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│   Real-time │    │   Connection│    │   Statistics│    │   Page       │
│   Stats     │    │   Status    │    │   Cards     │    │   Selection  │
└─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘
```

#### 2. **Image Upload & Analysis Process**
```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│   User      │    │   File      │    │   Validation│    │   Metadata   │
│   Selects   │───►│   Upload    │───►│   & Preview │───►│   Collection │
│   Images    │    │   Interface │    │   Process   │    │   Modal      │
└─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘
       │                   │                   │                   │
       │                   │                   │                   │
       ▼                   ▼                   ▼                   ▼
┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│   Choose    │    │   Enter     │    │   Submit    │    │   Processing │
│   Method    │    │   Details   │    │   Analysis  │    │   & Results  │
└─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘
       │                   │                   │                   │
       │                   │                   │                   │
       ▼                   ▼                   ▼                   ▼
┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│   Crown     │    │   Date/Time │    │   WebSocket │    │   Real-time │
│   Cutting   │    │   Location  │    │   Request   │    │   Updates    │
│   or Suckers│    │   Farm Info │    │   Sent      │    │   Display    │
└─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘
```

#### 3. **Analysis Results & History**
```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│   View      │    │   Filter    │    │   Sort      │    │   Export     │
│   Results   │───►│   by Status │───►│   by Date   │───►│   Data       │
│   Table     │    │   Method    │    │   Farm      │    │   CSV/PDF    │
└─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘
       │                   │                   │                   │
       │                   │                   │                   │
       ▼                   ▼                   ▼                   ▼
┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│   Disease   │    │   Confidence│    │   Severity  │    │   Download   │
│   Status    │    │   Levels    │    │   Levels    │    │   Files      │
└─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘
```

#### 4. **Reports & Analytics**
```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│   Access    │    │   View      │    │   Generate  │    │   Export     │
│   Reports   │───►│   Charts    │───►│   Analytics │───►│   Reports    │
│   Page      │    │   & Graphs  │    │   Data      │    │   PDF/CSV    │
└─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘
       │                   │                   │                   │
       │                   │                   │                   │
       ▼                   ▼                   ▼                   ▼
┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│   Farm      │    │   Disease   │    │   Time      │    │   Share      │
│   Performance│    │   Distribution│   │   Periods  │    │   Results    │
└─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘
```

### User Decision Points

#### **Upload Decision Tree**
```
┌─────────────┐
│   Start     │
│   Upload    │
└─────┬───────┘
      │
      ▼
┌─────────────┐    ┌─────────────┐
│   Single    │    │   Batch     │
│   Upload    │    │   Upload    │
└─────┬───────┘    └─────┬───────┘
      │                  │
      ▼                  ▼
┌─────────────┐    ┌─────────────┐
│   1 Image   │    │   2-5       │
│   Required  │    │   Images    │
└─────┬───────┘    └─────┬───────┘
      │                  │
      ▼                  ▼
┌─────────────┐    ┌─────────────┐
│   Validate  │    │   Validate  │
│   & Process │    │   & Process │
└─────────────┘    └─────────────┘
```

#### **Analysis Method Selection**
```
┌─────────────┐
│   Choose    │
│   Method    │
└─────┬───────┘
      │
      ▼
┌─────────────┐    ┌─────────────┐
│   Crown     │    │   Suckers   │
│   Cutting   │    │   Method    │
└─────┬───────┘    └─────┬───────┘
      │                  │
      ▼                  ▼
┌─────────────┐    ┌─────────────┐
│   Process   │    │   Process   │
│   Analysis  │    │   Analysis  │
└─────────────┘    └─────────────┘
```

### Error Handling & Recovery

#### **Upload Error Flow**
```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│   Upload    │    │   Validation│    │   Error     │    │   User       │
│   Attempt   │───►│   Fails     │───►│   Message   │───►│   Corrects   │
└─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘
       │                   │                   │                   │
       │                   │                   │                   │
       ▼                   ▼                   ▼                   ▼
┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│   File      │    │   Size/Type │    │   Display   │    │   Retry      │
│   Selection │    │   Invalid   │    │   Warning   │    │   Upload     │
└─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘
```

#### **Connection Error Flow**
```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│   WebSocket │    │   Connection│    │   Fallback  │    │   HTTP       │
│   Fails     │───►│   Lost      │───►│   to HTTP   │───►│   Request    │
└─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘
       │                   │                   │                   │
       │                   │                   │                   │
       ▼                   ▼                   ▼                   ▼
┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│   Show      │    │   Auto      │    │   Continue  │    │   Process    │
│   Warning   │    │   Reconnect │    │   Function  │    │   Request    │
└─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘
```

### User Experience Touchpoints

#### **Key User Interactions**
1. **Home Page**: Dashboard overview with real-time statistics
2. **Upload Process**: Drag-and-drop or file selection interface
3. **Analysis Modal**: Metadata collection (date, time, location, method)
4. **Results View**: Real-time analysis results with confidence scores
5. **History Page**: Filterable and sortable analysis history
6. **Reports Page**: Comprehensive analytics and export capabilities
7. **About Page**: Project information and team details

#### **User Feedback Points**
- ✅ **Success**: Analysis completed, results displayed
- ⚠️ **Warning**: File validation issues, connection problems
- ❌ **Error**: Upload failures, processing errors
- 🔄 **Loading**: Processing indicators, progress bars

## 🗄️ Database Schema Architecture

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                              Database Schema                                   │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                 │
│  ┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐           │
│  │   Users         │    │   Farms         │    │   Analyses      │           │
│  │                 │    │                 │    │                 │           │
│  │ • id (PK)       │    │ • id (PK)       │    │ • id (PK)       │           │
│  │ • username      │    │ • name          │    │ • fileName      │           │
│  │ • email         │    │ • location      │    │ • farmId (FK)   │           │
│  │ • password_hash │    │ • sector        │    │ • propagation   │           │
│  │ • created_at    │    │ • total_plants  │    │ • diseaseStatus │           │
│  │ • updated_at    │    │ • created_at    │    │ • confidence    │           │
│  └─────────────────┘    └─────────────────┘    │ • severity      │           │
│                                                 │ • timestamp     │           │
│                                                 │ • metadata      │           │
│                                                 └─────────────────┘           │
│                                                                                 │
│  ┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐           │
│  │   Model         │    │   Performance   │    │   Reports       │           │
│  │   Versions      │    │   Metrics       │    │                 │           │
│  │                 │    │                 │    │ • id (PK)       │           │
│  │ • id (PK)       │    │ • id (PK)       │    │ • farmId (FK)   │           │
│  │ • version       │    │ • modelId (FK)  │    │ • period        │           │
│  │ • path          │    │ • accuracy      │    │ • summary       │           │
│  │ • accuracy      │    │ • processingTime│    │ • details       │           │
│  │ • isActive      │    │ • memoryUsage   │    │ • created_at    │           │
│  │ • metadata      │    │ • errorRate     │    └─────────────────┘           │
│  └─────────────────┘    └─────────────────┘                                   │
│                                                                                 │
└─────────────────────────────────────────────────────────────────────────────────┘
```

## 🔧 Technology Stack Architecture

### Frontend Stack
```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                              Frontend Technology Stack                        │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                 │
│  ┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐           │
│  │   Framework     │    │   UI Library    │    │   Styling       │           │
│  │                 │    │                 │    │                 │           │
│  │ • React 18      │    │ • Radix UI      │    │ • Tailwind CSS  │           │
│  │ • TypeScript    │    │ • shadcn/ui     │    │ • Custom CSS    │           │
│  │ • Vite          │    │ • Lucide Icons  │    │ • Responsive    │           │
│  │ • Wouter Router │    │ • Toast         │    │ • Dark Mode     │           │
│  └─────────────────┘    └─────────────────┘    └─────────────────┘           │
│           │                       │                       │                    │
│           └───────────────────────┼───────────────────────┘                    │
│                                   │                                            │
│                                   ▼                                            │
│  ┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐           │
│  │   State Mgmt    │    │   Data Fetching │    │   Build Tools   │           │
│  │                 │    │                 │    │                 │           │
│  │ • React Query   │    │ • Fetch API     │    │ • Vite          │           │
│  │ • useState      │    │ • WebSocket     │    │ • TypeScript    │           │
│  │ • useReducer    │    │ • File Upload   │    │ • ESLint        │           │
│  │ • Context API   │    │ • Form Data     │    │ • Prettier      │           │
│  └─────────────────┘    └─────────────────┘    └─────────────────┘           │
│                                                                                 │
└─────────────────────────────────────────────────────────────────────────────────┘
```

### Backend Stack
```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                              Backend Technology Stack                         │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                 │
│  ┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐           │
│  │   Runtime       │    │   Framework     │    │   Database      │           │
│  │                 │    │                 │    │                 │           │
│  │ • Node.js       │    │ • Express.js    │    │ • PostgreSQL    │           │
│  │ • TypeScript    │    │ • WebSocket     │    │ • Drizzle ORM   │           │
│  │ • ES Modules    │    │ • Multer        │    │ • Migrations    │           │
│  │ • Async/Await   │    │ • CORS          │    │ • Connection    │           │
│  └─────────────────┘    └─────────────────┘    └─────────────────┘           │
│           │                       │                       │                    │
│           └───────────────────────┼───────────────────────┘                    │
│                                   │                                            │
│                                   ▼                                            │
│  ┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐           │
│  │   AI/ML         │    │   Validation    │    │   Development   │           │
│  │                 │    │                 │    │                 │           │
│  │ • TensorFlow.js │    │ • Zod Schema    │    │ • tsx           │           │
│  │ • Model Manager │    │ • Joi           │    │ • Nodemon       │           │
│  │ • Inference     │    │ • Type Guards   │    │ • Cross-env     │           │
│  │ • Preprocessing │    │ • Sanitization  │    │ • Hot Reload    │           │
│  └─────────────────┘    └─────────────────┘    └─────────────────┘           │
│                                                                                 │
└─────────────────────────────────────────────────────────────────────────────────┘
```

## 🌐 Network Architecture

### Development Environment
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Browser       │    │   Vite Dev      │    │   Express       │
│   (Frontend)    │◄──►│   Server        │◄──►│   Server        │
│   Port: 5173    │    │   Port: 5173    │    │   Port: 5000    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   WebSocket     │    │   Static Files  │    │   Database      │
│   Connection    │    │   (HMR)         │    │   PostgreSQL    │
│   Port: 5000    │    │   Hot Reload    │    │   Port: 5432    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### Production Environment
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Client        │    │   Load Balancer │    │   Application   │
│   Browser       │◄──►│   (Nginx)       │◄──►│   Server        │
│                 │    │   Port: 80/443  │    │   Port: 5000    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   CDN           │    │   Static Files  │    │   Database      │
│   (Assets)      │    │   (Built)       │    │   PostgreSQL    │
│   Global        │    │   Optimized     │    │   Managed       │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 🔐 Security Architecture

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                              Security Layers                                  │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                 │
│  ┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐           │
│  │   Frontend      │    │   Backend       │    │   Database      │           │
│  │   Security      │    │   Security      │    │   Security      │           │
│  │                 │    │                 │    │                 │           │
│  │ • Input Val.    │    │ • CORS          │    │ • Connection    │           │
│  │ • XSS Prevention│    │ • Rate Limiting │    │   Encryption    │           │
│  │ • CSRF Tokens   │    │ • File Upload   │    │ • Prepared      │           │
│  │ • Content Sec.  │    │   Validation    │    │   Statements    │           │
│  └─────────────────┘    └─────────────────┘    └─────────────────┘           │
│           │                       │                       │                    │
│           └───────────────────────┼───────────────────────┘                    │
│                                   │                                            │
│                                   ▼                                            │
│  ┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐           │
│  │   Network       │    │   Authentication│    │   Authorization │           │
│  │   Security      │    │   (Future)      │    │   (Future)      │           │
│  │                 │    │                 │    │                 │           │
│  │ • HTTPS/TLS     │    │ • JWT Tokens    │    │ • Role-based    │           │
│  │ • WebSocket     │    │ • Session Mgmt  │    │   Access        │           │
│  │   Security      │    │ • OAuth 2.0     │    │ • API Keys      │           │
│  │ • Firewall      │    │ • 2FA           │    │ • Permissions   │           │
│  └─────────────────┘    └─────────────────┘    └─────────────────┘           │
│                                                                                 │
└─────────────────────────────────────────────────────────────────────────────────┘
```

## 📈 Scalability Architecture

### Horizontal Scaling
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Load          │    │   Application   │    │   Database      │
│   Balancer      │◄──►│   Instances     │◄──►│   Cluster       │
│   (Nginx)       │    │   (Multiple)    │    │   (Read Replicas)│
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   CDN           │    │   Cache Layer   │    │   Backup        │
│   (Global)      │    │   (Redis)       │    │   (Automated)   │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### Vertical Scaling
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   CPU           │    │   Memory        │    │   Storage       │
│   Optimization  │    │   Management    │    │   Optimization  │
│                 │    │                 │    │                 │
│ • Multi-core    │    │ • Garbage       │    │ • SSD Storage   │
│ • Load Balancing│    │   Collection    │    │ • Compression   │
│ • Async Proc.   │    │ • Memory Pool   │    │ • Caching       │
│ • Worker Threads│    │ • Leak Detection│    │ • Archiving     │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 🚀 Deployment Architecture

### Development Deployment
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Local         │    │   Development   │    │   Local         │
│   Development   │◄──►│   Environment   │◄──►│   Database      │
│   Machine       │    │   (Hot Reload)  │    │   (SQLite)      │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### Production Deployment
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Cloud         │    │   Application   │    │   Managed       │
│   Platform      │◄──►│   Container     │◄──►│   Database      │
│   (Vercel/Netlify)│  │   (Docker)      │    │   (Neon/PlanetScale)│
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   CI/CD         │    │   Monitoring    │    │   Backup        │
│   Pipeline      │    │   (Logs/Metrics)│    │   (Automated)   │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 📋 Component Interaction Matrix

| Component | Home | Analyze | Report | AboutUs | Backend | Database |
|-----------|------|---------|--------|---------|---------|----------|
| **Home** | ✅ | 🔗 | 🔗 | 🔗 | 🔗 | 🔗 |
| **Analyze** | 🔗 | ✅ | 🔗 | 🔗 | 🔗 | 🔗 |
| **Report** | 🔗 | 🔗 | ✅ | 🔗 | 🔗 | 🔗 |
| **AboutUs** | 🔗 | 🔗 | 🔗 | ✅ | ❌ | ❌ |
| **Backend** | 🔗 | 🔗 | 🔗 | ❌ | ✅ | 🔗 |
| **Database** | 🔗 | 🔗 | 🔗 | ❌ | 🔗 | ✅ |

**Legend:**
- ✅ Direct Component
- 🔗 Connected/Related
- ❌ No Direct Connection

## 🔄 State Management Architecture

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                              State Management Flow                            │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                 │
│  ┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐           │
│  │   Local State   │    │   Server State  │    │   Global State  │           │
│  │                 │    │                 │    │                 │           │
│  │ • useState      │    │ • React Query   │    │ • Context API   │           │
│  │ • useReducer    │    │ • WebSocket     │    │ • Redux (Future)│           │
│  │ • Form State    │    │ • Cache         │    │ • Zustand       │           │
│  │ • UI State      │    │ • Background    │    │ • State Machine │           │
│  └─────────────────┘    └─────────────────┘    └─────────────────┘           │
│           │                       │                       │                    │
│           └───────────────────────┼───────────────────────┘                    │
│                                   │                                            │
│                                   ▼                                            │
│  ┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐           │
│  │   Persistence   │    │   Synchronization│   │   Error Handling│           │
│  │                 │    │                 │    │                 │           │
│  │ • localStorage  │    │ • Real-time     │    │ • Error Boundaries│          │
│  │ • sessionStorage│    │ • Optimistic    │    │ • Retry Logic    │           │
│  │ • IndexedDB     │    │ • Conflict Res. │    │ • Fallback UI    │           │
│  │ • Cookies       │    │ • Offline Sync  │    │ • Error Reporting│           │
│  └─────────────────┘    └─────────────────┘    └─────────────────┘           │
│                                                                                 │
└─────────────────────────────────────────────────────────────────────────────────┘
```

This comprehensive system architecture provides a complete overview of the PineappleVision system, including all components, data flows, technology stack, deployment considerations, and user interaction patterns. The architecture is designed to be scalable, maintainable, user-friendly, and follows modern web development best practices. 