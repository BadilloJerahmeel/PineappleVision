import { useState } from "react";
import HeroSection from "../components/HeroSection";
import FeaturesSection from "../components/FeaturesSection";
import AnalyzeForm from "../components/AnalyzeForm";
import { TrendingUp } from "lucide-react";
import "../styles/Home.css";

/**
 * Home Page Component - Dashboard
 * 
 * This is the main dashboard page that displays key statistics, upload functionality,
 * and propagation method insights. It serves as the central hub for users to monitor
 * the overall health and performance of their pineapple crops.
 * 
 * Features:
 * - Dashboard statistics (total scans, healthy plants, disease alerts, success rate)
 * - Batch upload functionality for image analysis
 * - Propagation method insights with progress indicators
 * - Responsive layout with professional agricultural styling
 * 
 * Components used:
 * - HeroSection: Main header with title and refresh button
 * - FeaturesSection: Statistics cards display
 * - AnalyzeForm: File upload and analysis form
 * 
 * State management:
 * - dashboardStats: Object containing current statistics
 * - uploadFiles: Array of uploaded files for analysis
 * 
 * Mock data is used for demonstration purposes as specified in requirements.
 */
const Home = () => {
  // Dashboard statistics state
  const [dashboardStats] = useState({
    totalScans: 2847,
    healthyPlants: 76,
    diseaseAlerts: 12,
    successRate: 94
  });

  // Propagation method insights data
  const propagationData = [
    {
      method: "Crown Cutting",
      diseaseRate: 76,
      description: "Most effective method - high success rate, moderate disease resilience"
    },
    {
      method: "Suckers",
      diseaseRate: 45,
      description: "Better disease resistance, somewhat lower performance"
    }
  ];

  /**
   * Handles dashboard refresh functionality
   * In a real implementation, this would fetch updated data from the API
   */
  const handleRefresh = () => {
    console.log("Refreshing dashboard data...");
    // TODO: Implement actual data refresh from API
    // This would typically:
    // 1. Call API to get latest statistics
    // 2. Update dashboard state
    // 3. Show loading indicator
    // 4. Handle any errors
  };

  /**
   * Handles file upload for batch analysis
   * Processes uploaded files and prepares them for analysis
   */
  const handleFileUpload = (files: File[]) => {
    console.log("Files uploaded:", files);
    // TODO: Implement actual file upload processing
    // This would typically:
    // 1. Validate file types and sizes
    // 2. Upload files to server
    // 3. Trigger analysis processing
    // 4. Update UI with progress
  };

  /**
   * Handles form submission for analysis
   * Processes form data and initiates analysis
   */
  const handleAnalysisSubmit = (formData: any) => {
    console.log("Analysis submitted:", formData);
    // TODO: Implement actual analysis submission
    // This would typically:
    // 1. Validate form data
    // 2. Submit to analysis API
    // 3. Show processing status
    // 4. Redirect to results page
  };

  return (
    <div className="home-page">
      {/* Main header section with title and refresh button */}
      <HeroSection onRefresh={handleRefresh} />

      <div className="home-content">
        {/* Statistics cards section */}
        <FeaturesSection stats={dashboardStats} />

        {/* Main content grid with upload and insights */}
        <div className="content-grid">
          {/* Batch upload section */}
          <div className="upload-section">
            <AnalyzeForm 
              onSubmit={handleAnalysisSubmit}
              onFileUpload={handleFileUpload}
            />
          </div>

          {/* Propagation method insights */}
          <div className="insights-section">
            <div className="insights-card">
              <h2 className="insights-title">
                <TrendingUp className="title-icon" />
                Propagation Method Insights
              </h2>
              
              <div className="insights-content">
                {propagationData.map((item, index) => (
                  <div key={index} className="insight-item">
                    <div className="insight-header">
                      <span className="method-name">{item.method}</span>
                      <span className="disease-rate">Disease Rate: {item.diseaseRate}%</span>
                    </div>
                    
                    <div className="progress-container">
                      <div 
                        className={`progress-bar ${index === 0 ? 'progress-primary' : 'progress-secondary'}`}
                        style={{ width: `${item.diseaseRate}%` }}
                      />
                    </div>
                    
                    <p className="insight-description">{item.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
