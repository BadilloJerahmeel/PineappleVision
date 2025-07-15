import { Calendar, MapPin, TrendingUp, Shield } from "lucide-react";
import "../styles/ReportSummary.css";

/**
 * ReportSummary Component - Report Statistics Overview
 * 
 * This component displays high-level statistics and summary information for the reports page.
 * It provides key metrics about farm analysis and disease detection results.
 * 
 * Features:
 * - Summary statistics cards
 * - Time period and farm filtering
 * - Key performance indicators
 * - Visual indicators for metrics
 * 
 * Props:
 * - summaryData: Object containing report summary statistics
 * - onPeriodChange: Function to handle time period changes
 * - onFarmFilter: Function to handle farm filtering
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
}

const ReportSummary = ({ summaryData, onPeriodChange, onFarmFilter }: ReportSummaryProps) => {
  // Summary cards configuration
  const summaryCards = [
    {
      icon: MapPin,
      iconColor: "text-blue-600",
      title: "Total Farms",
      value: summaryData.totalFarms.toString(),
      subtitle: "Calbazon, Laguna",
      bgColor: "bg-blue-100"
    },
    {
      icon: TrendingUp,
      iconColor: "text-green-600",
      title: "Farms Analyzed",
      value: summaryData.farmsAnalyzed.toString(),
      subtitle: "Across all farms",
      bgColor: "bg-green-100"
    },
    {
      icon: Calendar,
      iconColor: "text-yellow-600",
      title: "Overall Health Rate",
      value: `${summaryData.overallHealthRate}%`,
      subtitle: "+1% from last month",
      bgColor: "bg-yellow-100"
    },
    {
      icon: Shield,
      iconColor: "text-red-600",
      title: "Success Cases",
      value: summaryData.successCases.toString(),
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
            Comprehensive analysis of disease detection and propagation methods across farms in Calbazon, Laguna
          </p>
        </div>
        
        <div className="header-controls">
          <select 
            className="control-select"
            onChange={(e) => onPeriodChange && onPeriodChange(e.target.value)}
          >
            <option value="6months">Last 6 Months</option>
            <option value="3months">Last 3 Months</option>
            <option value="1month">Last Month</option>
          </select>
          
          <select 
            className="control-select"
            onChange={(e) => onFarmFilter && onFarmFilter(e.target.value)}
          >
            <option value="all">All Farms</option>
            <option value="farm-a">Farm A</option>
            <option value="farm-b">Farm B</option>
            <option value="farm-c">Farm C</option>
            <option value="farm-d">Farm D</option>
          </select>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="summary-cards">
        {summaryCards.map((card, index) => {
          const Icon = card.icon;
          
          return (
            <div key={index} className="summary-card">
              <div className="card-content">
                <div className={`card-icon ${card.bgColor}`}>
                  <Icon className={`icon ${card.iconColor}`} />
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
