import { Target, Lightbulb, TrendingUp } from "lucide-react";
import "../styles/AboutUsContent.css";

/**
 * AboutUsContent Component - About Page Content
 * 
 * This component displays information about the PineappleVision project including
 * mission statement, innovation highlights, impact metrics, and team member profiles.
 * 
 * Features:
 * - Project mission, innovation, and impact cards
 * - Team member profiles with photos and skills
 * - Professional layout with consistent styling
 * - Social media links for team members
 * 
 * Props: None (uses static content)
 * 
 * Team member data includes:
 * - Profile photos
 * - Names and roles
 * - Skill sets and technologies
 * - Contact information
 */
const AboutUsContent = () => {
  // Mission cards configuration
  const missionCards = [
    {
      icon: Target,
      iconColor: "text-green-600",
      bgColor: "bg-green-100",
      title: "Project Mission",
      description: "Revolutionizing pineapple farming through AI-powered disease detection and propagation method analysis to improve crop yields and reduce losses."
    },
    {
      icon: Lightbulb,
      iconColor: "text-blue-600",
      bgColor: "bg-blue-100",
      title: "Innovation",
      description: "Combining computer vision and machine learning to provide farmers with instant, accurate analysis of pineapple plant health and growth patterns."
    },
    {
      icon: TrendingUp,
      iconColor: "text-purple-600",
      bgColor: "bg-purple-100",
      title: "Impact",
      description: "Empowering farmers in Calbazon, Laguna with cutting-edge technology to make informed decisions about crop management and disease prevention."
    }
  ];

  // Team members configuration
  const teamMembers = [
    {
      name: "Robong, Dexter D.",
      role: "Frontend Developer & Model Integration",
      photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=300&h=300",
      description: "Specializes in React development and AI model integration. Responsible for creating interactive user interfaces and converting machine learning models with TensorFlow.",
      skills: ["React", "TensorFlow", "JavaScript", "Computer Vision"]
    },
    {
      name: "Badillo, Jerahmeel A.",
      role: "Backend Developer & Data Specialist",
      photo: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=300&h=300",
      description: "Expert in server-side development and data processing. Manages database operations, API development, and ensures robust data preprocessing for the system.",
      skills: ["Django", "Python", "MongoDB", "Data Processing"]
    },
    {
      name: "Calapiao, Jan Reimon S.",
      role: "UX/UI Designer & System Tester",
      photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=300&h=300",
      description: "Focuses on user experience design and comprehensive system testing. Ensures the application is user-friendly and performs testing across mobile and desktop platforms.",
      skills: ["Figma", "UX Research", "QA Testing", "Design Systems"]
    }
  ];

  /**
   * Renders skill badges for team members
   */
  const renderSkills = (skills: string[]) => {
    const skillColors = {
      "React": "bg-blue-100 text-blue-700",
      "TensorFlow": "bg-green-100 text-green-700",
      "JavaScript": "bg-purple-100 text-purple-700",
      "Computer Vision": "bg-gray-100 text-gray-700",
      "Django": "bg-green-100 text-green-700",
      "Python": "bg-blue-100 text-blue-700",
      "MongoDB": "bg-purple-100 text-purple-700",
      "Data Processing": "bg-gray-100 text-gray-700",
      "Figma": "bg-purple-100 text-purple-700",
      "UX Research": "bg-blue-100 text-blue-700",
      "QA Testing": "bg-green-100 text-green-700",
      "Design Systems": "bg-gray-100 text-gray-700"
    };

    return (
      <div className="skills-container">
        {skills.map((skill, index) => (
          <span 
            key={index} 
            className={`skill-badge ${skillColors[skill] || "bg-gray-100 text-gray-700"}`}
          >
            {skill}
          </span>
        ))}
      </div>
    );
  };

  return (
    <div className="about-content">
      {/* Header */}
      <div className="about-header">
        <h1 className="about-title">About PineappleVision</h1>
        <p className="about-description">
          Early Disease Detection in Pineapple Crops Using Computer Vision and Machine Learning to 
          Determine Seedling Propagation Method: Crown Cutting or Suckers in Various Farms in Calbazon, Laguna
        </p>
      </div>

      {/* Mission Cards */}
      <div className="mission-cards">
        {missionCards.map((card, index) => {
          const Icon = card.icon;
          
          return (
            <div key={index} className="mission-card">
              <div className={`mission-icon ${card.bgColor}`}>
                <Icon className={`icon ${card.iconColor}`} />
              </div>
              <h3 className="mission-title">{card.title}</h3>
              <p className="mission-description">{card.description}</p>
            </div>
          );
        })}
      </div>

      {/* Team Section */}
      <div className="team-section">
        <div className="team-header">
          <h2 className="team-title">Meet Our Team</h2>
          <p className="team-description">
            A dedicated team of developers and designers working to revolutionize pineapple farming.
          </p>
        </div>

        <div className="team-grid">
          {teamMembers.map((member, index) => (
            <div key={index} className="team-member">
              <img 
                src={member.photo} 
                alt={member.name}
                className="member-photo"
              />
              <h3 className="member-name">{member.name}</h3>
              <p className="member-role">{member.role}</p>
              <p className="member-description">{member.description}</p>
              
              {renderSkills(member.skills)}
              
              <div className="member-social">
                <a href="#" className="social-link linkedin" aria-label="LinkedIn">
                  <i className="fab fa-linkedin"></i>
                </a>
                <a href="#" className="social-link github" aria-label="GitHub">
                  <i className="fab fa-github"></i>
                </a>
                <a href="#" className="social-link email" aria-label="Email">
                  <i className="fas fa-envelope"></i>
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AboutUsContent;
