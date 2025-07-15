import { Filter, Download } from "lucide-react";
import "../styles/AnalysisResults.css";

/**
 * AnalysisResults Component - Analysis History Table
 * 
 * This component displays the results of disease detection analyses in a table format.
 * It shows analysis history with filtering capabilities and excludes yield estimates
 * as per the requirements.
 * 
 * Features:
 * - Data table with analysis results
 * - Filter controls for status, farm, and method
 * - Progress bars for confidence levels
 * - Status badges for disease detection
 * - Export functionality
 * 
 * Props:
 * - analyses: Array of analysis data to display
 * - onFilter: Function to handle filter changes
 * - onExport: Function to handle CSV export
 * 
 * Note: Yield estimate column and action buttons are intentionally excluded
 * as specified in the requirements.
 */
interface Analysis {
  id: string;
  dateTime: string;
  farmLocation: string;
  propagationMethod: string;
  diseaseStatus: string;
  confidence: number;
  severity: string;
  isHealthy: boolean;
}

interface AnalysisResultsProps {
  analyses: Analysis[];
  onFilter?: (filters: any) => void;
  onExport?: () => void;
}

const AnalysisResults = ({ analyses, onFilter, onExport }: AnalysisResultsProps) => {
  /**
   * Renders status badge with appropriate color coding
   */
  const renderStatusBadge = (status: string, isHealthy: boolean) => {
    const baseClass = "status-badge";
    const colorClass = isHealthy ? "status-healthy" : "status-diseased";
    
    return (
      <span className={`${baseClass} ${colorClass}`}>
        {status}
      </span>
    );
  };

  /**
   * Renders severity badge with color coding
   */
  const renderSeverityBadge = (severity: string) => {
    const baseClass = "severity-badge";
    let colorClass = "severity-none";
    
    switch (severity.toLowerCase()) {
      case "severe":
        colorClass = "severity-severe";
        break;
      case "moderate":
        colorClass = "severity-moderate";
        break;
      case "mild":
        colorClass = "severity-mild";
        break;
      default:
        colorClass = "severity-none";
    }
    
    return (
      <span className={`${baseClass} ${colorClass}`}>
        {severity}
      </span>
    );
  };

  /**
   * Renders confidence level with progress bar
   */
  const renderConfidenceBar = (confidence: number) => {
    return (
      <div className="confidence-container">
        <div className="confidence-bar">
          <div 
            className="confidence-fill"
            style={{ width: `${confidence}%` }}
          />
        </div>
        <span className="confidence-text">{confidence}%</span>
      </div>
    );
  };

  return (
    <div className="analysis-results">
      {/* Header with Filter and Export */}
      <div className="results-header">
        <div className="header-content">
          <h1 className="results-title">Analysis History & Insights</h1>
          <p className="results-description">
            Review and analyze disease detection results across farms in Calbazon, Laguna
          </p>
        </div>
        <div className="header-actions">
          <button className="filter-button" onClick={() => onFilter && onFilter({})}>
            <Filter className="button-icon" />
            Filter by Date
          </button>
          <button className="export-button" onClick={onExport}>
            <Download className="button-icon" />
            Export CSV
          </button>
        </div>
      </div>

      {/* Filter Section */}
      <div className="filter-section">
        <div className="filter-controls">
          <div className="filter-group">
            <span className="filter-label">Status:</span>
            <button className="filter-button-active">All Results</button>
            <button className="filter-button-inactive">Healthy</button>
            <button className="filter-button-inactive">Diseased</button>
          </div>
          
          <div className="filter-group">
            <span className="filter-label">Farm:</span>
            <select className="filter-select">
              <option>All Farms</option>
              <option>Farm A</option>
              <option>Farm B</option>
              <option>Farm C</option>
              <option>Farm D</option>
            </select>
          </div>
          
          <div className="filter-group">
            <span className="filter-label">Method:</span>
            <select className="filter-select">
              <option>All Methods</option>
              <option>Crown Cutting</option>
              <option>Suckers</option>
            </select>
          </div>
        </div>
      </div>

      {/* Results Table */}
      <div className="results-table-container">
        <div className="table-header">
          <h2 className="table-title">Analysis Results ({analyses.length} records)</h2>
        </div>
        
        <div className="table-wrapper">
          <table className="results-table">
            <thead>
              <tr>
                <th>Date & Time</th>
                <th>Farm Location</th>
                <th>Propagation Method</th>
                <th>Disease Status</th>
                <th>Confidence</th>
                <th>Severity</th>
                {/* Note: Yield Estimate column intentionally excluded as per requirements */}
              </tr>
            </thead>
            <tbody>
              {analyses.map((analysis) => (
                <tr key={analysis.id}>
                  <td className="date-cell">
                    {new Date(analysis.dateTime).toLocaleDateString()}
                    <br />
                    <span className="time-text">
                      {new Date(analysis.dateTime).toLocaleTimeString()}
                    </span>
                  </td>
                  <td>{analysis.farmLocation}</td>
                  <td>{analysis.propagationMethod}</td>
                  <td>
                    {renderStatusBadge(analysis.diseaseStatus, analysis.isHealthy)}
                  </td>
                  <td>
                    {renderConfidenceBar(analysis.confidence)}
                  </td>
                  <td>
                    {renderSeverityBadge(analysis.severity)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AnalysisResults;
