import { useState } from "react";
import { Camera, CheckCircle, AlertTriangle, Percent } from "lucide-react";
import AnalysisResults from "../components/AnalysisResults";
import "../styles/Analyze.css";

/**
 * Analyze Page Component - Analysis History & Insights
 * 
 * This page displays the analysis history and insights for disease detection results.
 * It shows a comprehensive table of analysis results with filtering capabilities.
 * 
 * IMPORTANT: As per requirements, this page excludes yield estimates and action buttons
 * that may be shown in the original mockup. This exclusion is intentional and documented.
 * 
 * Features:
 * - Analysis summary statistics
 * - Historical analysis results table
 * - Filtering by status, farm, and propagation method
 * - Export functionality for data
 * - Confidence level indicators
 * 
 * State management:
 * - analysisStats: Summary statistics for analyses
 * - analysisHistory: Array of historical analysis results
 * - filters: Current filter settings
 * 
 * Mock data is used for demonstration purposes as specified in requirements.
 */
const Analyze = () => {
  // Analysis summary statistics
  const [analysisStats] = useState({
    totalAnalyses: 6,
    healthyPlants: 3,
    diseaseCases: 3,
    avgConfidence: 93
  });

  // Mock analysis history data
  // Note: This would typically come from an API call
  const [analysisHistory] = useState([
    {
      id: "1",
      dateTime: "2024-01-15T10:32:00",
      farmLocation: "Farm A - Calbazon North",
      propagationMethod: "Crown Cutting",
      diseaseStatus: "Healthy",
      confidence: 95,
      severity: "None",
      isHealthy: true
    },
    {
      id: "2",
      dateTime: "2024-01-15T10:15:00",
      farmLocation: "Farm B - Calbazon Central",
      propagationMethod: "Suckers",
      diseaseStatus: "Bacterial Heart Rot",
      confidence: 87,
      severity: "Moderate",
      isHealthy: false
    },
    {
      id: "3",
      dateTime: "2024-01-14T15:45:00",
      farmLocation: "Farm C - Calbazon South",
      propagationMethod: "Crown Cutting",
      diseaseStatus: "Fusarium Wilt",
      confidence: 92,
      severity: "Severe",
      isHealthy: false
    },
    {
      id: "4",
      dateTime: "2024-01-14T14:30:00",
      farmLocation: "Farm A - Calbazon North",
      propagationMethod: "Suckers",
      diseaseStatus: "Healthy",
      confidence: 98,
      severity: "None",
      isHealthy: true
    },
    {
      id: "5",
      dateTime: "2024-01-13T11:20:00",
      farmLocation: "Farm D - Calbazon East",
      propagationMethod: "Crown Cutting",
      diseaseStatus: "Black Rot",
      confidence: 85,
      severity: "Mild",
      isHealthy: false
    },
    {
      id: "6",
      dateTime: "2024-01-13T09:45:00",
      farmLocation: "Farm B - Calbazon Central",
      propagationMethod: "Suckers",
      diseaseStatus: "Healthy",
      confidence: 89,
      severity: "None",
      isHealthy: true
    }
  ]);

  // Statistics cards configuration
  const statCards = [
    {
      icon: Camera,
      iconColor: "text-blue-600",
      bgColor: "bg-blue-100",
      title: "Total Analyses",
      value: analysisStats.totalAnalyses.toString(),
      subtitle: ""
    },
    {
      icon: CheckCircle,
      iconColor: "text-green-600",
      bgColor: "bg-green-100",
      title: "Healthy Plants",
      value: analysisStats.healthyPlants.toString(),
      subtitle: "50% of total"
    },
    {
      icon: AlertTriangle,
      iconColor: "text-red-600",
      bgColor: "bg-red-100",
      title: "Disease Cases",
      value: analysisStats.diseaseCases.toString(),
      subtitle: "50% of total"
    },
    {
      icon: Percent,
      iconColor: "text-yellow-600",
      bgColor: "bg-yellow-100",
      title: "Avg Confidence",
      value: `${analysisStats.avgConfidence}%`,
      subtitle: "High accuracy"
    }
  ];

  /**
   * Handles filter changes for the analysis results
   * Updates the displayed results based on selected filters
   */
  const handleFilter = (filters: any) => {
    console.log("Applying filters:", filters);
    // TODO: Implement actual filtering logic
    // This would typically:
    // 1. Update filter state
    // 2. Filter analysis history data
    // 3. Update displayed results
  };

  /**
   * Handles CSV export functionality
   * Exports analysis data to CSV format
   */
  const handleExport = () => {
    console.log("Exporting analysis data to CSV...");
    // TODO: Implement actual CSV export
    // This would typically:
    // 1. Convert analysis data to CSV format
    // 2. Create downloadable file
    // 3. Trigger download
    
    // Mock CSV export for demonstration
    const csvData = analysisHistory.map(item => ({
      Date: new Date(item.dateTime).toLocaleDateString(),
      Time: new Date(item.dateTime).toLocaleTimeString(),
      Farm: item.farmLocation,
      Method: item.propagationMethod,
      Status: item.diseaseStatus,
      Confidence: `${item.confidence}%`,
      Severity: item.severity
    }));
    
    console.log("CSV Data:", csvData);
    // In a real implementation, this would create and download a CSV file
  };

  return (
    <div className="analyze-page">
      {/* Statistics Cards */}
      <div className="analyze-stats">
        <div className="stats-grid">
          {statCards.map((card, index) => {
            const Icon = card.icon;
            
            return (
              <div key={index} className="stat-card">
                <div className="stat-content">
                  <div className={`stat-icon ${card.bgColor}`}>
                    <Icon className={`icon ${card.iconColor}`} />
                  </div>
                  <div className="stat-info">
                    <div className="stat-value">{card.value}</div>
                    <p className="stat-title">{card.title}</p>
                    {card.subtitle && <p className="stat-subtitle">{card.subtitle}</p>}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Analysis Results Table */}
      <div className="analyze-results">
        <AnalysisResults 
          analyses={analysisHistory}
          onFilter={handleFilter}
          onExport={handleExport}
        />
      </div>
    </div>
  );
};

export default Analyze;
