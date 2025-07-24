# 🍍 PineappleVision - AI-Powered Pineapple Disease Detection System

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-18+-blue.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5+-blue.svg)](https://www.typescriptlang.org/)

A comprehensive web application for detecting and analyzing pineapple crop diseases using advanced AI technology. Built specifically for farmers in Calauan, Laguna to provide real-time disease detection, farm management, and data-driven insights for crop health optimization.

## 🌟 Key Features

### 🔬 AI-Powered Disease Detection
- **Real-time Analysis**: Upload images for instant AI-powered disease identification
- **Multi-Disease Support**: Detects Fruit Rot, MealybugWilt, Root Rot, and healthy plants
- **Confidence Scoring**: Provides confidence levels and severity assessment
- **Batch Processing**: Analyze multiple images simultaneously for efficiency

### 📊 Farm Management Dashboard
- **Live Statistics**: Real-time farm health metrics and performance indicators
- **Historical Analysis**: Track disease trends and farm performance over time
- **Multi-Farm Support**: Manage and monitor multiple farm locations
- **Export Capabilities**: Generate PDF and CSV reports for record-keeping

### 🔄 Real-Time Updates
- **WebSocket Integration**: Live updates across all application components
- **Instant Notifications**: Real-time alerts for disease detection results
- **Synchronized Data**: Consistent data across multiple user sessions

### 📈 Analytics & Reporting
- **Comprehensive Reports**: Detailed analytics with visual charts and graphs
- **Disease Distribution**: Track disease patterns across farms and time periods
- **Performance Metrics**: Monitor farm health rates and success indicators
- **Data Export**: Export analysis results in multiple formats

## 🚀 Quick Start

### Prerequisites
- **Node.js** 18+ 
- **npm** or **yarn**
- **Git**

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/PineappleVision.git
   cd PineappleVision
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Access the application**
   - Open your browser to `http://localhost:5000`
   - The application will be ready for use!

## 🏗️ System Architecture

### 💻 Programming Languages
- **TypeScript** - Primary language for both frontend and backend development
- **JavaScript** - ES6+ for dynamic functionality and legacy compatibility
- **Python** - AI model training, conversion scripts, and data processing
- **SQL** - Database queries and schema management
- **HTML5** - Semantic markup and structure
- **CSS3** - Styling with modern features and animations

### 🚀 Frontend Technologies
- **React 18** - Modern component-based UI library with hooks
- **TypeScript** - Type-safe JavaScript for better development experience
- **Tailwind CSS** - Utility-first CSS framework for rapid styling
- **Radix UI** - Accessible, unstyled component primitives
- **React Query (@tanstack/react-query)** - Data fetching and caching
- **Wouter** - Lightweight client-side routing
- **Framer Motion** - Animation library for smooth interactions
- **Recharts** - Composable charting library for data visualization
- **React Hook Form** - Performant forms with easy validation
- **Lucide React** - Beautiful & consistent icon library
- **Vite** - Fast build tool and development server

### ⚙️ Backend Technologies
- **Node.js** - JavaScript runtime for server-side development
- **Express.js** - Fast, unopinionated web framework
- **TypeScript** - Type safety for backend services
- **WebSocket (ws)** - Real-time bidirectional communication
- **Multer** - Middleware for handling multipart/form-data (file uploads)
- **Express Session** - Session middleware for user authentication
- **Passport.js** - Authentication middleware with local strategy
- **CORS** - Cross-origin resource sharing configuration

### 🤖 AI & Machine Learning
- **TensorFlow.js** - JavaScript machine learning library
- **@tensorflow/tfjs-node** - Node.js backend for TensorFlow.js
- **@tensorflow/tfjs-converter** - Model conversion utilities
- **Jimp** - JavaScript image processing library
- **Python TensorFlow** - Model training and conversion (external)
- **Keras** - High-level neural networks API
- **NumPy & Pandas** - Data manipulation (Python ecosystem)

### 🗄️ Database & Storage
- **PostgreSQL** - Primary relational database
- **Drizzle ORM** - Type-safe database toolkit
- **Drizzle Kit** - Database migration and schema management
- **Connect-PG-Simple** - PostgreSQL session store
- **File System** - Local storage for images and model files
- **JSON** - Configuration and metadata storage

### 🛠️ Development Tools
- **Vite** - Build tool and development server
- **ESBuild** - Fast JavaScript bundler
- **TSX** - TypeScript execution environment
- **Cross-env** - Cross-platform environment variables
- **PostCSS** - CSS transformation tool
- **Autoprefixer** - CSS vendor prefixing

### 📦 Package Management
- **npm** - Node.js package manager
- **package.json** - Dependency management and scripts
- **package-lock.json** - Exact dependency versions

### 🔧 Build & Deployment
- **TypeScript Compiler** - Type checking and compilation
- **Vite Build** - Production optimization and bundling
- **ESBuild** - Server-side bundling
- **Environment Variables** - Configuration management
- **Docker** - Containerization (optional)
- **Vercel** - Deployment platform integration

### 🌐 Web Technologies
- **HTTP/HTTPS** - Web communication protocols
- **WebSocket** - Real-time communication protocol
- **REST API** - RESTful web services architecture
- **JSON** - Data interchange format
- **FormData** - File upload handling
- **Blob/Buffer** - Binary data processing

### 🎨 UI/UX Libraries
- **Tailwind CSS** - Utility-first CSS framework
- **Tailwind Merge** - Utility for merging Tailwind classes
- **Tailwindcss Animate** - Animation utilities
- **Class Variance Authority** - Component variant management
- **CLSX** - Conditional className utility
- **React Icons** - Popular icon library
- **Embla Carousel** - Carousel/slider component

### 📊 Data Visualization
- **Recharts** - React charting library
- **Chart.js** - Flexible charting library
- **D3.js** - Data-driven documents (if needed)

### 🔐 Security & Validation
- **Zod** - TypeScript-first schema validation
- **Zod Validation Error** - Better error messages
- **Passport Local** - Local authentication strategy
- **Express Session** - Secure session management
- **CORS** - Cross-origin request handling
- **Input Validation** - Server-side data validation

### 🧪 Testing & Quality
- **TypeScript** - Compile-time type checking
- **ESLint** - Code linting and style enforcement
- **Prettier** - Code formatting
- **Husky** - Git hooks (if configured)

### 📱 Progressive Web App
- **Service Workers** - Offline functionality (if implemented)
- **Web App Manifest** - PWA configuration
- **Responsive Design** - Mobile-first approach
- **Touch Gestures** - Mobile interaction support

## 📁 Project Structure

```
PineappleVision/
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/         # Main application pages
│   │   ├── hooks/         # Custom React hooks
│   │   ├── lib/           # Utility functions and helpers
│   │   └── styles/        # CSS and styling files
│   └── public/            # Static assets
├── server/                # Backend Express application
│   ├── ai-service.ts      # AI model integration service
│   ├── routes.ts          # API route definitions
│   ├── storage.ts         # Database operations
│   └── websocket-service.ts # Real-time communication
├── models/                # AI model storage
│   ├── tfjs-model/        # TensorFlow.js converted models
│   └── pineapple-disease-detector/ # Model versions
├── scripts/               # Utility and deployment scripts
└── shared/                # Shared types and schemas
```

## 🤖 AI Model Integration

### Supported Disease Classes
1. **Healthy** - No disease detected
2. **Fruit Rot** - Fruit decay and deterioration
3. **MealybugWilt** - Mealybug infestation and wilting
4. **Root Rot** - Root system diseases
5. **No Disease** - Unclassified or uncertain cases

### Model Requirements
- **Input Size**: 224x224 pixels RGB images
- **Formats**: JPEG, PNG, TIFF supported
- **Accuracy**: Minimum 85% validation accuracy
- **Performance**: < 500ms inference time

### Adding Your Trained Model

1. **Convert your Keras model** using the provided conversion guide
2. **Place model files** in `models/tfjs-model/`
3. **Restart the server** to load the new model
4. **Test with sample images** to verify functionality

See [MODEL_DOCUMENTATION.md](./MODEL_DOCUMENTATION.md) for detailed model integration instructions.

## 🔧 Configuration

### Environment Variables
```bash
# Server Configuration
PORT=5000
NODE_ENV=development

# Database Configuration
DATABASE_URL=postgresql://user:password@localhost:5432/pineapplevision

# AI Model Configuration
MODEL_PATH=./models/tfjs-model
CONFIDENCE_THRESHOLD=0.6

# WebSocket Configuration
WS_PORT=5001
```

### Model Configuration
```json
{
  "modelType": "tensorflow",
  "inputSize": {"width": 224, "height": 224},
  "classes": ["Healthy", "Fruit Rot", "MealybugWilt", "Root Rot", "No Disease"],
  "confidenceThreshold": 0.6
}
```

## 📱 Usage Guide

### 🏠 Home Dashboard
- View real-time farm statistics and health metrics
- Quick access to recent analyses and alerts
- Upload images directly from the dashboard
- Monitor overall system performance

### 🔍 Analysis Page
- Upload single or multiple pineapple images
- View detailed analysis results with confidence scores
- Filter and sort historical analyses
- Export analysis data for record-keeping

### 📊 Reports Page
- Generate comprehensive farm performance reports
- Visualize disease distribution and trends
- Compare performance across multiple farms
- Export reports in PDF and CSV formats

### ℹ️ About Page
- Learn about the project mission and goals
- Meet the development team
- Access technical documentation and support

## 🛠️ Development

### Available Scripts
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run check        # Type checking
npm run db:push      # Push database schema changes
```

### Development Workflow
1. **Create feature branch** from main
2. **Implement changes** with proper testing
3. **Run type checking** and linting
4. **Test thoroughly** with sample data
5. **Submit pull request** for review

## 🚀 Deployment

### Production Build
```bash
# Build the application
npm run build

# Start production server
npm run start
```

### Docker Deployment
```bash
# Build Docker image
docker build -t pineapplevision .

# Run container
docker run -p 5000:5000 pineapplevision
```

### Environment Setup
- Configure production database connection
- Set up file storage and backup systems
- Configure monitoring and logging
- Set up SSL certificates for HTTPS

## 🔍 Troubleshooting

### Common Issues

**Model not loading:**
- Verify model files are in correct directory
- Check file permissions and paths
- Ensure TensorFlow.js dependencies are installed

**Image upload failures:**
- Check file size limits (default: 10MB)
- Verify supported file formats (JPEG, PNG, TIFF)
- Ensure sufficient disk space

**WebSocket connection issues:**
- Verify WebSocket port configuration
- Check firewall settings
- Ensure server is running and accessible

### Performance Optimization
- Enable image compression for faster uploads
- Implement model caching for improved response times
- Use CDN for static asset delivery
- Configure database connection pooling

## 📚 Documentation

- **[System Documentation](./SYSTEM_DOCUMENTATION.md)** - Detailed technical documentation
- **[Model Documentation](./MODEL_DOCUMENTATION.md)** - AI model integration guide
- **[API Documentation](./API_DOCUMENTATION.md)** - REST API reference
- **[Deployment Guide](./DEPLOYMENT_GUIDE.md)** - Production deployment instructions

## 🤝 Contributing

1. **Fork the repository**
2. **Create a feature branch** (`git checkout -b feature/amazing-feature`)
3. **Commit your changes** (`git commit -m 'Add amazing feature'`)
4. **Push to the branch** (`git push origin feature/amazing-feature`)
5. **Open a Pull Request**

### Development Guidelines
- Follow TypeScript best practices
- Write comprehensive tests for new features
- Maintain consistent code formatting
- Update documentation for API changes

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Team

- **Development Team**: AI specialists and full-stack developers
- **Agricultural Experts**: Pineapple farming consultants
- **UI/UX Designers**: User experience specialists
- **Quality Assurance**: Testing and validation experts

## 🆘 Support

For support and questions:
- **Issues**: [GitHub Issues](https://github.com/your-username/PineappleVision/issues)
- **Documentation**: Check the docs folder for detailed guides
- **Community**: Join our developer community discussions

## 🔮 Roadmap

### Upcoming Features
- **Mobile Application**: Native iOS and Android apps
- **Advanced Analytics**: Machine learning insights and predictions
- **Multi-language Support**: Localization for different regions
- **API Integration**: Third-party agricultural system integration
- **Offline Mode**: Offline analysis capabilities

---

**Built with ❤️ for the agricultural community in Calauan, Laguna**