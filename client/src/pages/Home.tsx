import { useState, useEffect, useRef } from "react";
import HeroSection from "../components/HeroSection";
import FeaturesSection from "../components/FeaturesSection";
import AnalyzeForm from "../components/AnalyzeForm";
import { TrendingUp, CheckCircle, AlertTriangle, X, Calendar, Clock, MapPin } from "lucide-react";
import { Toggle } from "../components/ui/toggle";
import "../styles/Home.css";

/**
 * WebSocket Message Types
 * Interface definitions for real-time communication with the backend
 */
interface DashboardStats {
  totalScans: number;
  healthyPlants: number;
  diseaseAlerts: number;
  successRate: number;
}

interface PropagationInsight {
  method: string;
  diseaseRate: number;
  description: string;
}

interface AnalysisResult {
  id: string;
  fileName: string;
  propagationMethod: string;
  diseaseStatus: string;
  confidence: number;
  severity: string;
  timestamp: string;
}

interface WebSocketMessage {
  type: 'dashboard_update' | 'propagation_update' | 'analysis_result' | 'test_response' | 'error';
  data: DashboardStats | PropagationInsight[] | AnalysisResult | string;
}

/**
 * Analysis Metadata Interface
 * Defines the structure for analysis metadata collected in the modal
 */
interface AnalysisMetadata {
  date: string;
  time: string;
  farmLocation: string;
  propagationMethod: string;
}

/**
 * Home Page Component - Real-time Dashboard with Analysis Modal
 * 
 * This is the main dashboard page that displays real-time statistics, upload functionality,
 * and propagation method insights via WebSocket connection. It serves as the central hub
 * for users to monitor the overall health and performance of their pineapple crops.
 * 
 * Features:
 * - Real-time dashboard statistics via WebSocket
 * - Propagation method toggle (Crown Cutting/Suckers)
 * - Single/Batch upload functionality with restrictions
 * - Real-time analysis results display
 * - WebSocket connection management with fallback
 * - Custom analysis modal for metadata collection
 * 
 * Components used:
 * - HeroSection: Main header with title and refresh button
 * - FeaturesSection: Real-time statistics cards display
 * - AnalyzeForm: File upload and analysis form
 * - AnalysisModal: Custom modal for metadata collection
 * 
 * State management:
 * - dashboardStats: Real-time statistics from WebSocket
 * - propagationData: Real-time propagation insights
 * - propagationMethod: Currently selected propagation method
 * - analysisResults: Fixed section displaying latest analysis results
 * - wsConnection: WebSocket connection reference
 * - isConnected: WebSocket connection status
 * - modalState: Modal visibility and form data
 * - uploadedFiles: Files uploaded for analysis
 */
const Home = () => {
  // WebSocket connection state
  const wsRef = useRef<WebSocket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Real-time data state (replaces mock data)
  const [dashboardStats, setDashboardStats] = useState<DashboardStats>({
    totalScans: 0,
    healthyPlants: 0,
    diseaseAlerts: 0,
    successRate: 0
  });

  const [propagationData, setPropagationData] = useState<PropagationInsight[]>([]);
  const [propagationMethod, setPropagationMethod] = useState<'Crown Cutting' | 'Suckers'>('Crown Cutting');
  
  // Analysis results state
  const [analysisResults, setAnalysisResults] = useState<AnalysisResult[]>([]);
  const [showResults, setShowResults] = useState(false);

  // Modal and file upload state
  const [showModal, setShowModal] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [modalFormData, setModalFormData] = useState<AnalysisMetadata>({
    date: new Date().toISOString().split('T')[0], // Today's date as default
    time: new Date().toTimeString().slice(0, 5), // Current time as default
    farmLocation: '',
    propagationMethod: 'Crown Cutting'
  });

  // WebSocket URL - easily configurable for different environments
  const WS_URL = process.env.NODE_ENV === 'production' 
    ? 'wss://your-backend-url.com/ws-app' 
    : 'ws://localhost:5000/ws-app';

  /**
   * Establishes WebSocket connection with automatic reconnection
   * Handles connection lifecycle and message processing
   */
  const connectWebSocket = () => {
    try {
      console.log('Connecting to WebSocket:', WS_URL);
      wsRef.current = new WebSocket(WS_URL);

      wsRef.current.onopen = () => {
        console.log('WebSocket connected successfully');
        setIsConnected(true);
        
        // Clear any existing reconnect timeout
        if (reconnectTimeoutRef.current) {
          clearTimeout(reconnectTimeoutRef.current);
          reconnectTimeoutRef.current = null;
        }
      };

      wsRef.current.onmessage = (event) => {
        try {
          const message: WebSocketMessage = JSON.parse(event.data);
          console.log('Received WebSocket message:', message);
          handleWebSocketMessage(message);
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
        }
      };

      wsRef.current.onclose = (event) => {
        console.log('WebSocket disconnected:', event.code, event.reason);
        setIsConnected(false);
        
        // Attempt to reconnect after 3 seconds unless component is unmounting
        if (!event.wasClean) {
          reconnectTimeoutRef.current = setTimeout(() => {
            if (wsRef.current?.readyState === WebSocket.CLOSED) {
              console.log('Attempting to reconnect...');
              connectWebSocket();
            }
          }, 3000);
        }
      };

      wsRef.current.onerror = (error) => {
        console.error('WebSocket error:', error);
        setIsConnected(false);
      };

    } catch (error) {
      console.error('Failed to establish WebSocket connection:', error);
      setIsConnected(false);
    }
  };

  /**
   * Handles incoming WebSocket messages and updates appropriate state
   * Processes different message types for real-time updates
   */
  const handleWebSocketMessage = (message: WebSocketMessage) => {
    switch (message.type) {
      case 'dashboard_update':
        setDashboardStats(message.data as DashboardStats);
        break;
      
      case 'propagation_update':
        setPropagationData(message.data as PropagationInsight[]);
        break;
      
      case 'analysis_result':
        const result = message.data as AnalysisResult;
        setAnalysisResults(prev => [result, ...prev.slice(0, 4)]); // Keep latest 5 results
        setShowResults(true);
        break;
      
      case 'test_response':
        console.log('Received test response:', message.data);
        break;
      
      case 'error':
        console.error('WebSocket error message:', message.data);
        break;
      
      default:
        console.warn('Unknown WebSocket message type:', message.type);
    }
  };

  /**
   * Sends analysis request via WebSocket with fallback to HTTP POST
   * Handles both single and batch upload scenarios with metadata
   */
  const sendAnalysisRequest = async (files: File[], selectedMethod: string, metadata: AnalysisMetadata) => {
    // Convert files to base64 for reliable JSON transmission
    const fileBuffers = await Promise.all(files.map(async (file) => {
      const arrayBuffer = await file.arrayBuffer();
      const uint8Array = new Uint8Array(arrayBuffer);
      
      // Convert to base64 string using FileReader for better compatibility
      const base64String = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
          const result = reader.result as string;
          // Remove the data URL prefix (e.g., "data:image/jpeg;base64,")
          const base64 = result.split(',')[1];
          resolve(base64);
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
      
      return {
        name: file.name,
        buffer: base64String,
        type: file.type
      };
    }));

    const analysisData = {
      type: 'analysis_request',
      files: fileBuffers,
      propagationMethod: selectedMethod,
      metadata: metadata,
      timestamp: new Date().toISOString()
    };

    // Try WebSocket first
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      try {
        wsRef.current.send(JSON.stringify(analysisData));
        console.log('Analysis request sent via WebSocket with metadata:', metadata);
        return true;
      } catch (error) {
        console.error('WebSocket send failed, falling back to HTTP:', error);
      }
    }

    // Fallback to HTTP POST remains unchanged
    try {
      const formData = new FormData();
      files.forEach((file, index) => {
        formData.append(`image_${index}`, file);
      });
      formData.append('propagationMethod', selectedMethod);
      formData.append('metadata', JSON.stringify(metadata));

      const response = await fetch('/api/analyze', {
        method: 'POST',
        body: formData
      });

      if (response.ok) {
        const result = await response.json();
        console.log('Analysis request sent via HTTP POST with metadata:', metadata);
        return true;
      } else {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
    } catch (error) {
      console.error('HTTP fallback failed:', error);
      return false;
    }
  };

  /**
   * Handles dashboard refresh functionality
   * Requests fresh data from the backend via WebSocket
   */
  const handleRefresh = () => {
    console.log("Requesting fresh dashboard data...");
    
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({
        type: 'refresh_request',
        timestamp: new Date().toISOString()
      }));
    } else {
      console.warn('WebSocket not connected, cannot refresh data');
      // Try to reconnect
      connectWebSocket();
    }
  };

  /**
   * Test WebSocket connection manually
   */
  const testWebSocketConnection = () => {
    console.log('Testing WebSocket connection...');
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({
        type: 'test_message',
        data: 'Test message from client',
        timestamp: new Date().toISOString()
      }));
      console.log('Test message sent');
    } else {
      console.log('WebSocket not connected, attempting to reconnect...');
      connectWebSocket();
    }
  };

  /**
   * Handles file upload for analysis
   * Stores uploaded files for modal access
   */
  const handleFileUpload = (files: File[]) => {
    console.log("Files uploaded:", files);
    setUploadedFiles(files);
    // File validation is handled in AnalyzeForm component
  };

  /**
   * Handles form submission for analysis
   * Opens modal if files are present, otherwise shows warning
   */
  const handleAnalysisSubmit = async (formData: any) => {
    console.log("Analysis submitted:", formData);
    
    // Check if files are present
    if (!formData.files || formData.files.length === 0) {
      alert('Please upload at least one image before analyzing.');
      return;
    }
    
    // Store files and open modal for metadata collection
    setUploadedFiles(formData.files);
    setModalFormData(prev => ({
      ...prev,
      propagationMethod: propagationMethod
    }));
    setShowModal(true);
  };

  /**
   * Handles modal form submission
   * Collects metadata and proceeds with analysis
   */
  const handleModalSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    
    if (!modalFormData.farmLocation.trim()) {
      alert('Please enter a farm location.');
      return;
    }
    
    console.log('Modal form submitted with metadata:', modalFormData);
    
    // Close modal
    setShowModal(false);
    
    // Proceed with analysis using collected metadata
    const success = await sendAnalysisRequest(uploadedFiles, modalFormData.propagationMethod, modalFormData);
    
    if (success) {
      console.log('Analysis request sent successfully with metadata');
      // Clear uploaded files after successful submission
      setUploadedFiles([]);
    } else {
      console.error('Failed to send analysis request');
      alert('Failed to send analysis request. Please try again.');
    }
  };

  /**
   * Handles modal form input changes
   * Updates modal form data state
   */
  const handleModalInputChange = (field: keyof AnalysisMetadata, value: string) => {
    setModalFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  /**
   * Closes the analysis modal
   * Resets modal form data to defaults
   */
  const closeModal = () => {
    setShowModal(false);
    setModalFormData({
      date: new Date().toISOString().split('T')[0],
      time: new Date().toTimeString().slice(0, 5),
      farmLocation: '',
      propagationMethod: propagationMethod
    });
  };

  /**
   * Handles propagation method toggle
   * Updates the selected propagation method for analysis
   */
  const handlePropagationToggle = (method: 'Crown Cutting' | 'Suckers') => {
    setPropagationMethod(method);
    // Update modal form data if modal is open
    if (showModal) {
      setModalFormData(prev => ({
        ...prev,
        propagationMethod: method
      }));
    }
    console.log('Propagation method changed to:', method);
  };

  /**
   * Closes the analysis results section
   */
  const closeResults = () => {
    setShowResults(false);
  };

  // Initialize WebSocket connection on component mount
  useEffect(() => {
    connectWebSocket();

    // Cleanup on unmount
    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, []);

  return (
    <div className="home-page">
      {/* Main header section with title and refresh button */}
      <HeroSection onRefresh={handleRefresh} />

      <div className="home-content">
        {/* Connection status indicator */}
        <div className={`connection-status ${isConnected ? 'connected' : 'disconnected'}`}>
          <div className={`status-dot ${isConnected ? 'connected' : 'disconnected'}`} />
          {isConnected ? 'Connected' : 'Disconnected'}
          <button 
            onClick={testWebSocketConnection}
            className="test-connection-btn"
            title="Test WebSocket connection"
          >
            Test Connection
          </button>
        </div>

        {/* Statistics cards section */}
        <FeaturesSection stats={dashboardStats} />

        {/* Main content grid with upload and insights */}
        <div className="content-grid">
          {/* Batch upload section */}
          <div className="upload-section">
            <AnalyzeForm 
              onSubmit={handleAnalysisSubmit}
              onFileUpload={handleFileUpload}
              propagationMethod={propagationMethod}
              onPropagationToggle={handlePropagationToggle}
            />
          </div>

          {/* Propagation method insights */}
          <div className="insights-section">
            <div className="insights-card">
              <h2 className="insights-title">
                <TrendingUp className="title-icon" />
                Propagation Method Insights
              </h2>
              
              <div className="insights-content">
                {propagationData.length > 0 ? (
                  propagationData.map((item, index) => (
                    <div key={index} className="insight-item">
                      <div className="insight-header">
                        <span className="method-name">{item.method}</span>
                        <span className="disease-rate">Disease Rate: {item.diseaseRate}%</span>
                      </div>
                      
                      <div className="progress-container">
                        <div 
                          className={`progress-bar ${index === 0 ? 'progress-primary' : 'progress-secondary'}`}
                          style={{ width: `${item.diseaseRate}%` }}
                        />
                      </div>
                      
                      <p className="insight-description">{item.description}</p>
                    </div>
                  ))
                ) : (
                  <div className="no-data-message">
                    <p>No propagation insights available yet. Start analyzing images to see insights.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Analysis Results Section */}
        {showResults && analysisResults.length > 0 && (
          <div className="analysis-results-section">
            <div className="results-header">
              <h3>Latest Analysis Results</h3>
              <button onClick={closeResults} className="close-results">
                <X size={20} />
              </button>
            </div>
            
            <div className="results-grid">
              {analysisResults.map((result) => (
                <div key={result.id} className="result-card">
                  <div className="result-header">
                    <h4>{result.fileName}</h4>
                    <span className={`status-badge ${result.diseaseStatus === 'Healthy' ? 'healthy' : 'disease'}`}>
                      {result.diseaseStatus === 'Healthy' ? (
                        <CheckCircle size={16} />
                      ) : (
                        <AlertTriangle size={16} />
                      )}
                      {result.diseaseStatus}
                    </span>
                  </div>
                  
                  <div className="result-details">
                    <div className="detail-item">
                      <span className="detail-label">Method:</span>
                      <span className="detail-value">{result.propagationMethod}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Confidence:</span>
                      <span className="detail-value">{result.confidence}%</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Severity:</span>
                      <span className="detail-value">{result.severity}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Time:</span>
                      <span className="detail-value">
                        {new Date(result.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Analysis Metadata Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">Analysis Details</h2>
              <button onClick={closeModal} className="modal-close">
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleModalSubmit} className="modal-form">
              <div className="form-group">
                <label className="form-label">
                  <Calendar className="label-icon" />
                  Date
                </label>
                <input
                  type="date"
                  value={modalFormData.date}
                  onChange={(e) => handleModalInputChange('date', e.target.value)}
                  className="form-input"
                  required
                />
              </div>
              
              <div className="form-group">
                <label className="form-label">
                  <Clock className="label-icon" />
                  Time
                </label>
                <input
                  type="time"
                  value={modalFormData.time}
                  onChange={(e) => handleModalInputChange('time', e.target.value)}
                  className="form-input"
                  required
                />
              </div>
              
              <div className="form-group">
                <label className="form-label">
                  <MapPin className="label-icon" />
                  Farm Location
                </label>
                <input
                  type="text"
                  value={modalFormData.farmLocation}
                  onChange={(e) => handleModalInputChange('farmLocation', e.target.value)}
                  className="form-input"
                  placeholder="Enter farm location (e.g., Calauan, Laguna)"
                  required
                />
              </div>
              
              <div className="form-group">
                <label className="form-label">
                  <TrendingUp className="label-icon" />
                  Propagation Method
                </label>
                <div className="readonly-field">
                  {modalFormData.propagationMethod}
                </div>
              </div>
              
              <div className="modal-actions">
                <button type="button" onClick={closeModal} className="btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  Start Analysis
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
