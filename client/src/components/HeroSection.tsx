import { RefreshCw } from "lucide-react";
import "../styles/HeroSection.css";

/**
 * HeroSection Component - Dashboard Header
 * 
 * This component displays the main dashboard header with title, description, and refresh button.
 * It provides context about the PineappleVision system and its location focus.
 * 
 * Features:
 * - Main title and descriptive subtitle
 * - Refresh button for updating dashboard data
 * - Professional agricultural theme
 * 
 * Props:
 * - onRefresh: Function to call when refresh button is clicked
 */
interface HeroSectionProps {
  onRefresh?: () => void;
}

const HeroSection = ({ onRefresh }: HeroSectionProps) => {
  return (
    <div className="hero-section">
      <div className="hero-content">
        <div className="hero-text">
          <h1 className="hero-title">PineappleVision Dashboard</h1>
          <p className="hero-description">
            Early disease detection using computer vision and machine learning for pineapple crops in Calbazon, Laguna
          </p>
        </div>
        <div className="hero-actions">
          <button 
            className="refresh-button"
            onClick={onRefresh}
            aria-label="Refresh dashboard data"
          >
            <RefreshCw className="refresh-icon" />
            Refresh
          </button>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
