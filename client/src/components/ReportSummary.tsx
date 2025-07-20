import { Calendar, MapPin, TrendingUp, Shield, Loader2, AlertCircle } from "lucide-react";
import "../styles/ReportSummary.css";

/**
 * ReportSummary Component - Report Statistics Overview
 * 
 * This component displays high-level statistics and summary information for the reports page.
 * It provides key metrics about farm analysis and disease detection results with real-time updates.
 * 
 * Features:
 * - Summary statistics cards with loading states
 * - Time period and farm filtering
 * - Key performance indicators
 * - Visual indicators for metrics
 * - Error handling and display
 * 
 * Props:
 * - summaryData: Object containing report summary statistics
 * - onPeriodChange: Function to handle time period changes
 * - onFarmFilter: Function to handle farm filtering
 * - loading: Boolean to show loading state
 * - error: String containing error message
 */
interface ReportSummaryProps {
  summaryData: {
    totalFarms: number;
    farmsAnalyzed: number;
    overallHealthRate: number;
    successCases: number;
  };
  onPeriodChange?: (period: string) => void;
  onFarmFilter?: (farm: string) => void;
  loading?: boolean;
  error?: string | null;
}

const ReportSummary = ({ summaryData, onPeriodChange, onFarmFilter, loading = false, error }: ReportSummaryProps) => {
  // Summary cards configuration
  const summaryCards = [
    {
      icon: MapPin,
      iconColor: "text-blue-600",
      title: "Total Farms",
      value: loading ? "..." : summaryData.totalFarms.toString(),
      subtitle: "Calauan, Laguna",
      bgColor: "bg-blue-100"
    },
    {
      icon: TrendingUp,
      iconColor: "text-green-600",
      title: "Farms Analyzed",
      value: loading ? "..." : summaryData.farmsAnalyzed.toString(),
      subtitle: "Across all farms",
      bgColor: "bg-green-100"
    },
    {
      icon: Calendar,
      iconColor: "text-yellow-600",
      title: "Overall Health Rate",
      value: loading ? "..." : `${summaryData.overallHealthRate}%`,
      subtitle: "+1% from last month",
      bgColor: "bg-yellow-100"
    },
    {
      icon: Shield,
      iconColor: "text-red-600",
      title: "Success Cases",
      value: loading ? "..." : summaryData.successCases.toString(),
      subtitle: "6% from last month",
      bgColor: "bg-red-100"
    }
  ];

  return (
    <div className="report-summary">
      {/* Header with Controls */}
      <div className="summary-header">
        <div className="header-content">
          <h1 className="summary-title">Reports & Analytics</h1>
          <p className="summary-description">
            Comprehensive analysis of disease detection and propagation methods across farms in Calauan, Laguna
          </p>
        </div>
        
        <div className="header-controls">
          <select 
            className="control-select"
            onChange={(e) => onPeriodChange && onPeriodChange(e.target.value)}
            disabled={loading}
          >
            <option value="6months">Last 6 Months</option>
            <option value="3months">Last 3 Months</option>
            <option value="1month">Last Month</option>
          </select>
          
          <select 
            className="control-select"
            onChange={(e) => onFarmFilter && onFarmFilter(e.target.value)}
            disabled={loading}
          >
            <option value="all">All Farms</option>
            <option value="farm-a">Farm A</option>
            <option value="farm-b">Farm B</option>
            <option value="farm-c">Farm C</option>
            <option value="farm-d">Farm D</option>
          </select>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="error-message">
          <AlertCircle className="error-icon" />
          <span>{error}</span>
        </div>
      )}

      {/* Summary Cards */}
      <div className="summary-cards">
        {summaryCards.map((card, index) => {
          const Icon = card.icon;
          
          return (
            <div key={index} className={`summary-card ${loading ? 'loading' : ''}`}>
              <div className="card-content">
                <div className={`card-icon ${card.bgColor}`}>
                  {loading ? (
                    <Loader2 className="icon loading-spinner" />
                  ) : (
                    <Icon className={`icon ${card.iconColor}`} />
                  )}
                </div>
                <div className="card-info">
                  <div className="card-value">{card.value}</div>
                  <p className="card-title">{card.title}</p>
                  <p className="card-subtitle">{card.subtitle}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ReportSummary;
