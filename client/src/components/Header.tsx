import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Leaf, Home, Search, BarChart3, Info } from "lucide-react";
import "../styles/Header.css";

/**
 * Header Component - Sidebar Navigation
 * 
 * This component provides persistent navigation across all pages of the application.
 * It includes the PineappleVision logo and navigation links to all main pages.
 * 
 * Features:
 * - Logo with brand name and tagline
 * - Navigation menu with active state indication
 * - Responsive design with hover effects
 * - Gradient background for active navigation items
 * 
 * Props: None
 * 
 * Navigation links:
 * - Home: Dashboard with statistics and upload functionality
 * - Analyze: Analysis history and insights page
 * - Reports: Reports and analytics page
 * - About Us: Information about the project and team
 */
const Header = () => {
  const [location] = useLocation();

  // Navigation items configuration
  const navItems = [
    { id: "home", path: "/", icon: Home, label: "Home" },
    { id: "analyze", path: "/analyze", icon: Search, label: "Analyze" },
    { id: "reports", path: "/report", icon: BarChart3, label: "Reports" },
    { id: "about", path: "/aboutus", icon: Info, label: "About Us" },
  ];

  return (
    <div className="header-container">
      {/* Logo Section */}
      <div className="logo-section">
        <div className="logo-wrapper">
          <div className="logo-icon">
            <Leaf className="leaf-icon" />
          </div>
          <div className="logo-text">
            <h1 className="brand-name">PineappleVision</h1>
            <p className="brand-tagline">Disease Detection</p>
          </div>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="nav-container">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location === item.path;
          
          return (
            <Link key={item.id} href={item.path}>
              <button
                className={`nav-item ${isActive ? "active" : ""}`}
                aria-label={`Navigate to ${item.label}`}
              >
                <Icon className="nav-icon" />
                <span className="nav-label">{item.label}</span>
              </button>
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="header-footer">
        <p className="copyright">© 2024 PineappleVision</p>
      </div>
    </div>
  );
};

export default Header;
