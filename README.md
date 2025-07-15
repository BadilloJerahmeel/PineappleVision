# PineappleVision - AI-Powered Disease Detection Dashboard

A comprehensive web application for pineapple disease detection and farm management, specifically designed for agricultural operations in Calbazon, Laguna.

## 🌱 Features

- **Dashboard Home**: Real-time statistics showing total scans, healthy plants percentage, disease alerts, and success rates
- **Analysis History**: Detailed table of all disease detection analyses with farm locations and confidence levels
- **Comprehensive Reports**: Analytics charts showing farm performance and disease distribution
- **About Us**: Information about the project mission and team members
- **File Upload**: Drag-and-drop interface for uploading pineapple plant images
- **Responsive Design**: Works on desktop and mobile devices

## 🚀 Getting Started

### Prerequisites

- Node.js (version 18 or higher)
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone [your-repo-url]
   cd pineapplevision
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the application**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5000` to view the application

## 📁 Project Structure

```
pineapplevision/
├── client/               # Frontend React application
│   ├── src/
│   │   ├── components/   # Reusable UI components
│   │   ├── pages/        # Main application pages
│   │   ├── hooks/        # Custom React hooks
│   │   ├── lib/          # Utility functions
│   │   └── styles/       # Component-specific CSS
├── server/               # Backend Express server
│   ├── routes.ts         # API route definitions
│   ├── storage.ts        # Data storage interface
│   └── index.ts          # Server entry point
├── shared/               # Shared types and schemas
└── README.md            # This file
```

## 🔧 How to Modify and Add Functionality

### Adding Button Functions

The application has several buttons that can be enhanced with real functionality:

#### 1. Upload Button (Home Page)
**Location**: `client/src/components/AnalyzeForm.tsx`

**Current Code**:
```tsx
const handleSubmit = (e: React.FormEvent) => {
  e.preventDefault();
  // Add your upload logic here
  console.log('Form submitted with files:', files);
};
```

**To Add Real Upload**:
```tsx
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  
  const formData = new FormData();
  files.forEach(file => formData.append('images', file));
  
  try {
    const response = await fetch('/api/analyze', {
      method: 'POST',
      body: formData
    });
    const result = await response.json();
    // Handle success - show results or redirect
    console.log('Analysis complete:', result);
  } catch (error) {
    console.error('Upload failed:', error);
  }
};
```

#### 2. Export Buttons (Reports Page)
**Location**: `client/src/components/DownloadButton.tsx`

**Current Code**:
```tsx
const handlePdfDownload = () => {
  console.log('Downloading PDF report...');
};

const handleCsvExport = () => {
  console.log('Exporting CSV data...');
};
```

**To Add Real Export**:
```tsx
const handlePdfDownload = () => {
  // Generate PDF report
  const link = document.createElement('a');
  link.href = '/api/reports/pdf';
  link.download = 'farm-report.pdf';
  link.click();
};

const handleCsvExport = () => {
  // Export CSV data
  const link = document.createElement('a');
  link.href = '/api/reports/csv';
  link.download = 'analysis-data.csv';
  link.click();
};
```

#### 3. Filter Buttons (Analyze Page)
**Location**: `client/src/components/AnalysisResults.tsx`

**To Add Real Filtering**:
```tsx
const [filteredAnalyses, setFilteredAnalyses] = useState(analyses);

const handleFilter = (filterType: string, value: string) => {
  let filtered = analyses;
  
  if (value !== 'all') {
    filtered = analyses.filter(analysis => {
      switch (filterType) {
        case 'status':
          return analysis.diseaseStatus === value;
        case 'farm':
          return analysis.farmLocation === value;
        case 'method':
          return analysis.propagationMethod === value;
        default:
          return true;
      }
    });
  }
  
  setFilteredAnalyses(filtered);
};
```

### Adding New Features

#### 1. Real-time Disease Detection
Add AI/ML integration by connecting to image analysis APIs or uploading to cloud vision services.

#### 2. Database Integration
Replace the current in-memory storage with a real database by modifying `server/storage.ts`.

#### 3. User Authentication
Add login/logout functionality and user-specific data access.

#### 4. Email Notifications
Send alerts when diseases are detected or analysis is complete.

## 🎨 Customizing the Design

### Colors and Theme
Modify colors in `client/src/index.css`:
```css
:root {
  --primary-green: #16a34a;
  --light-green: #dcfce7;
  --dark-green: #166534;
}
```

### Adding New Pages
1. Create a new component in `client/src/pages/`
2. Add the route in `client/src/App.tsx`
3. Update navigation in `client/src/components/Header.tsx`

## 📊 Sample Data

The application includes sample data for demonstration:
- 5 farm locations in Calbazon, Laguna
- Disease detection analysis results
- Performance statistics and metrics

## 🔌 API Endpoints

Current backend endpoints (can be expanded):
- `GET /api/farms` - Get all farms
- `GET /api/analyses` - Get analysis history
- `GET /api/dashboard-stats` - Get dashboard statistics
- `POST /api/analyze` - Submit images for analysis

## 🛠️ Technologies Used

- **Frontend**: React, TypeScript, Tailwind CSS, Wouter (routing)
- **Backend**: Express.js, Node.js
- **Database**: In-memory storage (ready for PostgreSQL)
- **UI Components**: Radix UI, shadcn/ui
- **Charts**: Recharts
- **Build Tool**: Vite

## 📝 Development Tips

1. **Adding New Components**: Place reusable components in `client/src/components/`
2. **State Management**: Use React Query for server state, useState for local state
3. **Styling**: Use Tailwind CSS classes, create component-specific CSS files when needed
4. **Type Safety**: All components use TypeScript with proper type definitions

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/new-feature`)
3. Make your changes
4. Test thoroughly
5. Commit your changes (`git commit -am 'Add new feature'`)
6. Push to the branch (`git push origin feature/new-feature`)
7. Create a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For questions or support:
- Check the documentation above
- Review the code comments in each component
- Open an issue in the repository

---

**PineappleVision** - Revolutionizing pineapple farming through AI-powered disease detection.