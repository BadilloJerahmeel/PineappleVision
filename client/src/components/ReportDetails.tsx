import { Download } from "lucide-react";
import "../styles/ReportDetails.css";

/**
 * ReportDetails Component - Detailed Analytics Charts
 * 
 * This component displays detailed analytics including farm performance and disease distribution.
 * It provides comprehensive visual representations of data through charts and progress bars.
 * 
 * Features:
 * - Farm performance by location with progress bars
 * - Disease distribution visualization
 * - Interactive charts and data displays
 * - Export functionality for charts
 * 
 * Props:
 * - farmData: Array of farm performance data
 * - diseaseData: Array of disease distribution data
 * - onChartExport: Function to handle chart export
 */
interface FarmPerformance {
  name: string;
  location: string;
  sector: string;
  totalPlants: number;
  healthyPercentage: number;
  crownCutting: number;
  suckers: number;
  diseasedPercentage: number;
}

interface DiseaseDistribution {
  name: string;
  count: number;
  percentage: number;
  color: string;
}

interface ReportDetailsProps {
  farmData: FarmPerformance[];
  diseaseData: DiseaseDistribution[];
  onChartExport?: (chartType: string) => void;
}

const ReportDetails = ({ farmData, diseaseData, onChartExport }: ReportDetailsProps) => {
  /**
   * Renders farm performance chart with progress bars
   */
  const renderFarmPerformance = () => {
    return (
      <div className="chart-container">
        <div className="chart-header">
          <h2 className="chart-title">Farm Performance by Location</h2>
          <button 
            className="chart-export-btn"
            onClick={() => onChartExport && onChartExport('farm-performance')}
          >
            <Download className="btn-icon" />
          </button>
        </div>
        
        <div className="farm-performance-list">
          {farmData.map((farm, index) => (
            <div key={index} className="farm-item">
              <div className="farm-header">
                <div className="farm-info">
                  <p className="farm-name">{farm.name}</p>
                  <p className="farm-location">{farm.location} • {farm.sector}</p>
                </div>
                <div className="farm-stats">
                  <p className="plant-count">{farm.totalPlants} plants</p>
                  <p className="health-rate">Healthy: {farm.healthyPercentage}%</p>
                </div>
              </div>
              
              <div className="progress-bar-container">
                <div 
                  className="progress-bar"
                  style={{ width: `${farm.healthyPercentage}%` }}
                />
              </div>
              
              <div className="farm-metrics">
                <span className="metric">Crown Cutting: {farm.crownCutting}</span>
                <span className="metric">Diseased: {farm.diseasedPercentage}%</span>
                <span className="metric">Suckers: {farm.suckers}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  /**
   * Renders disease distribution chart
   */
  const renderDiseaseDistribution = () => {
    return (
      <div className="chart-container">
        <div className="chart-header">
          <h2 className="chart-title">Disease Distribution</h2>
          <button 
            className="chart-export-btn"
            onClick={() => onChartExport && onChartExport('disease-distribution')}
          >
            <Download className="btn-icon" />
          </button>
        </div>
        
        <div className="disease-distribution-list">
          {diseaseData.map((disease, index) => (
            <div key={index} className="disease-item">
              <div className="disease-header">
                <div className="disease-info">
                  <div 
                    className="disease-indicator"
                    style={{ backgroundColor: disease.color }}
                  />
                  <span className="disease-name">{disease.name}</span>
                </div>
                <div className="disease-stats">
                  <span className="disease-count">{disease.count} plants</span>
                  <span className="disease-percentage">{disease.percentage}%</span>
                </div>
              </div>
              
              <div className="disease-bar-container">
                <div 
                  className="disease-bar"
                  style={{ 
                    width: `${disease.percentage}%`,
                    backgroundColor: disease.color
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="report-details">
      <div className="charts-grid">
        {renderFarmPerformance()}
        {renderDiseaseDistribution()}
      </div>
    </div>
  );
};

export default ReportDetails;
