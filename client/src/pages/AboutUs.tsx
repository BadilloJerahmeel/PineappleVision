import AboutUsContent from "../components/AboutUsContent";
import "../styles/AboutUs.css";

/**
 * About Us Page Component
 * 
 * This page provides information about the PineappleVision project, including
 * the mission statement, innovation highlights, impact metrics, and team member profiles.
 * 
 * Features:
 * - Project overview and mission statement
 * - Innovation and impact highlights
 * - Team member profiles with photos, roles, and skills
 * - Contact information and social media links
 * 
 * Components used:
 * - AboutUsContent: Main content component containing all about information
 * 
 * The page content is static and focuses on providing comprehensive information
 * about the project goals, technology stack, and team members.
 * 
 * Static content includes:
 * - Mission: Revolutionizing pineapple farming through AI
 * - Innovation: Computer vision and machine learning integration
 * - Impact: Empowering farmers with technology
 * - Team: Three team members with detailed profiles
 */
const AboutUs = () => {
  return (
    <div className="about-page">
      <AboutUsContent />
    </div>
  );
};

export default AboutUs;
