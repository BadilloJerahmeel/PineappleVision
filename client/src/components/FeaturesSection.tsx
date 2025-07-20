import { Camera, CheckCircle, AlertTriangle, Star } from "lucide-react";
import "../styles/FeaturesSection.css";

/**
 * FeaturesSection Component - Real-time Statistics Cards
 * 
 * This component displays real-time statistics and metrics for the dashboard
 * received via WebSocket connection. It shows total scans, healthy plants 
 * percentage, disease alerts, and success rate with live updates.
 * 
 * Features:
 * - Four main statistics cards with real-time data
 * - Color-coded icons for different metrics
 * - Live updates from WebSocket connection
 * - Responsive grid layout
 * - Loading states for data updates
 * 
 * Props:
 * - stats: Object containing real-time statistics from WebSocket
 * - isLoading: Optional loading state indicator
 */
interface StatCard {
  icon: React.ElementType;
  iconColor: string;
  title: string;
  value: string;
  change: string;
  changeColor: string;
}

interface FeaturesProps {
  stats: {
    totalScans: number;
    healthyPlants: number;
    diseaseAlerts: number;
    successRate: number;
  };
  isLoading?: boolean;
}

const FeaturesSection = ({ stats, isLoading = false }: FeaturesProps) => {
  // Statistics cards configuration with real-time data
  const statCards: StatCard[] = [
    {
      icon: Camera,
      iconColor: "text-blue-600",
      title: "Total Scans",
      value: stats.totalScans.toLocaleString(),
      change: "+8%",
      changeColor: "text-blue-600"
    },
    {
      icon: CheckCircle,
      iconColor: "text-green-600",
      title: "Healthy Plants",
      value: `${stats.healthyPlants}%`,
      change: "+4%",
      changeColor: "text-green-600"
    },
    {
      icon: AlertTriangle,
      iconColor: "text-red-600",
      title: "Disease Alerts",
      value: stats.diseaseAlerts.toString(),
      change: "-18%",
      changeColor: "text-red-600"
    },
    {
      icon: Star,
      iconColor: "text-yellow-600",
      title: "Success Rate",
      value: `${stats.successRate}%`,
      change: "+2%",
      changeColor: "text-green-600"
    }
  ];

  return (
    <div className="features-section">
      {/* Loading indicator for real-time updates */}
      {isLoading && (
        <div className="loading-indicator">
          <div className="loading-spinner"></div>
          <span>Updating statistics...</span>
        </div>
      )}
      
      <div className="stats-grid">
        {statCards.map((card, index) => {
          const Icon = card.icon;
          
          return (
            <div key={index} className={`stat-card ${isLoading ? 'loading' : ''}`}>
              <div className="stat-content">
                <div className="stat-header">
                  <div className={`stat-icon-wrapper ${card.iconColor.replace('text-', 'bg-').replace('-600', '-100')}`}>
                    <Icon className={`stat-icon ${card.iconColor}`} />
                  </div>
                  <span className="stat-title">{card.title}</span>
                </div>
                <div className="stat-value">{card.value}</div>
              </div>
              <div className={`stat-change ${card.changeColor}`}>
                {card.change}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default FeaturesSection;
