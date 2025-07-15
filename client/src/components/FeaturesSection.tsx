import { Camera, CheckCircle, AlertTriangle, Star } from "lucide-react";
import "../styles/FeaturesSection.css";

/**
 * FeaturesSection Component - Statistics Cards
 * 
 * This component displays key statistics and metrics for the dashboard.
 * It shows total scans, healthy plants percentage, disease alerts, and success rate.
 * 
 * Features:
 * - Four main statistics cards
 * - Color-coded icons for different metrics
 * - Percentage changes and trend indicators
 * - Responsive grid layout
 * 
 * Props:
 * - stats: Object containing the statistics to display
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
}

const FeaturesSection = ({ stats }: FeaturesProps) => {
  // Statistics cards configuration
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
      <div className="stats-grid">
        {statCards.map((card, index) => {
          const Icon = card.icon;
          
          return (
            <div key={index} className="stat-card">
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
