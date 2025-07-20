# PineappleVision - AI-Powered Pineapple Disease Detection

A comprehensive web application for detecting and analyzing pineapple crop diseases using AI technology.

## Features

- **Real-time Disease Detection**: Upload images for instant AI analysis
- **Batch Processing**: Analyze multiple images simultaneously
- **Live Dashboard**: Real-time statistics and insights
- **Comprehensive Reports**: Detailed analytics and export capabilities
- **WebSocket Integration**: Live updates across all components

## WebSocket Configuration

### Report Page Real-time Updates

The Report page (`client/src/pages/Report.tsx`) uses WebSocket connections for real-time data updates:

#### Connection Setup
```typescript
const WS_URL = process.env.NODE_ENV === 'production'
  ? 'wss://your-backend-url.com/ws'
  : 'ws://localhost:5000/ws';
```

#### Expected Message Format
The backend should send messages in the following format:

```typescript
// Report summary data
{
  type: 'report_summary',
  data: {
    totalFarms: number,
    farmsAnalyzed: number,
    overallHealthRate: number,
    successCases: number
  }
}

// Farm performance data
{
  type: 'farm_performance',
  data: [
    {
      name: string,
      location: string,
      sector: string,
      totalPlants: number,
      healthyPercentage: number,
      crownCutting: number,
      suckers: number,
      diseasedPercentage: number
    }
  ]
}

// Disease distribution data (excluding "Other Diseases")
{
  type: 'disease_distribution',
  data: [
    {
      name: string,
      count: number,
      percentage: number,
      color: string
    }
  ]
}

// Complete report update
{
  type: 'report_update',
  data: {
    summary: ReportSummaryData,
    farms: FarmPerformance[],
    diseases: DiseaseDistribution[]
  }
}
```

#### Error Handling
- Automatic reconnection with exponential backoff
- Loading states while waiting for data
- Error messages for connection issues
- Clean empty states until data arrives

#### Features
- Real-time summary statistics
- Live farm performance charts
- Disease distribution updates (excluding "Other Diseases")
- Functional PDF and CSV export
- Loading indicators and error handling

## Installation

1. Clone the repository
2. Install dependencies: `npm install`
3. Start the development server: `npm run dev`
4. Start the backend server: `cd server && npm start`

## Usage

- **Home**: View dashboard with real-time statistics
- **Analyze**: Upload and analyze pineapple images
- **Reports**: View comprehensive analytics and export data
- **About Us**: Learn about the project

## Technology Stack

- **Frontend**: React, TypeScript, Tailwind CSS
- **Backend**: Node.js, Express, WebSocket
- **AI**: Custom disease detection models
- **Real-time**: WebSocket for live updates