import { useState, useMemo } from "react";
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
 * - Functional filter controls for status, farm, method, and date
 * - Progress bars for confidence levels
 * - Status badges for disease detection
 * - CSV export functionality
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
  // Filter state
  const [filters, setFilters] = useState({
    status: "All Results",
    farm: "All Farms",
    method: "All Methods",
    date: "All Dates"
  });

  // Get unique values for filter options
  const uniqueFarms = useMemo(() => ["All Farms", ...Array.from(new Set(analyses.map(a => a.farmLocation)))], [analyses]);
  const uniqueMethods = useMemo(() => ["All Methods", ...Array.from(new Set(analyses.map(a => a.propagationMethod)))], [analyses]);
  const uniqueDates = useMemo(() => ["All Dates", ...Array.from(new Set(analyses.map(a => a.dateTime.slice(0, 10))))], [analyses]);

  /**
   * Handles filter changes and updates parent component
   */
  const handleFilterChange = (filterType: string, value: string) => {
    const newFilters = { ...filters, [filterType]: value };
    setFilters(newFilters);
    if (onFilter) {
      onFilter(newFilters);
    }
  };

  /**
   * Handles CSV export functionality
   */
  const handleExportCSV = () => {
    if (onExport) {
      onExport();
    } else {
      // Fallback CSV export implementation
      const csvContent = generateCSV(analyses);
      downloadCSV(csvContent, 'analysis_results.csv');
    }
  };

  /**
   * Generates CSV content from analysis data
   */
  const generateCSV = (data: Analysis[]) => {
    const headers = ['Date', 'Time', 'Farm Location', 'Propagation Method', 'Disease Status', 'Confidence', 'Severity'];
    const rows = data.map(analysis => [
      new Date(analysis.dateTime).toLocaleDateString(),
      new Date(analysis.dateTime).toLocaleTimeString(),
      analysis.farmLocation,
      analysis.propagationMethod,
      analysis.diseaseStatus,
      `${analysis.confidence}%`,
      analysis.severity
    ]);
    
    return [headers, ...rows].map(row => row.join(',')).join('\n');
  };

  /**
   * Downloads CSV file
   */
  const downloadCSV = (content: string, filename: string) => {
    const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

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
            Review and analyze disease detection results across farms in Calauan, Laguna
          </p>
        </div>
        <div className="header-actions">
          <button className="export-button" onClick={handleExportCSV}>
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
            <button 
              className={filters.status === "All Results" ? "filter-button-active" : "filter-button-inactive"}
              onClick={() => handleFilterChange("status", "All Results")}
            >
              All Results
            </button>
            <button 
              className={filters.status === "Healthy" ? "filter-button-active" : "filter-button-inactive"}
              onClick={() => handleFilterChange("status", "Healthy")}
            >
              Healthy
            </button>
            <button 
              className={filters.status === "Diseased" ? "filter-button-active" : "filter-button-inactive"}
              onClick={() => handleFilterChange("status", "Diseased")}
            >
              Diseased
            </button>
          </div>
          
          <div className="filter-group">
            <span className="filter-label">Farm:</span>
            <select 
              className="filter-select"
              value={filters.farm}
              onChange={(e) => handleFilterChange("farm", e.target.value)}
            >
              {uniqueFarms.map(farm => (
                <option key={farm} value={farm}>{farm}</option>
              ))}
            </select>
          </div>
          
          <div className="filter-group">
            <span className="filter-label">Method:</span>
            <select 
              className="filter-select"
              value={filters.method}
              onChange={(e) => handleFilterChange("method", e.target.value)}
            >
              {uniqueMethods.map(method => (
                <option key={method} value={method}>{method}</option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <span className="filter-label">Date:</span>
            <select 
              className="filter-select"
              value={filters.date}
              onChange={(e) => handleFilterChange("date", e.target.value)}
            >
              {uniqueDates.map(date => (
                <option key={date} value={date}>
                  {date === "All Dates" ? "All Dates" : new Date(date).toLocaleDateString()}
                </option>
              ))}
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
              {analyses.length > 0 ? (
                analyses.map((analysis) => (
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
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="no-data-message">
                    No analysis results available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AnalysisResults;
