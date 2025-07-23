import { WebSocketServer, WebSocket } from 'ws';
import { Server } from 'http';
import { storage } from './storage';
import { modelManager } from './model-manager';

/**
 * WebSocket Service for Real-time Dashboard Updates
 * 
 * This service handles WebSocket connections for the PineappleVision dashboard,
 * providing real-time updates for dashboard statistics, propagation insights,
 * and analysis results.
 * 
 * Features:
 * - Real-time dashboard statistics broadcasting
 * - Propagation method insights updates
 * - Analysis result notifications
 * - Connection management and health monitoring
 * - Fallback to HTTP endpoints when WebSocket unavailable
 */

interface AnalysisRequestData {
  files: Array<{
    buffer: Buffer | number[];
    name?: string;
  }>;
  propagationMethod?: string;
  metadata?: {
    farmId?: string | number;
    farmLocation?: string;
    date?: string;
    time?: string;
  };
  timestamp?: string;
}

interface WebSocketMessage {
  type: 'dashboard_update' | 'propagation_update' | 'analysis_result' | 'refresh_request' | 'analysis_request' | 'test_message' | 'test_response' | 'error';
  data: any;
  files?: Array<any>; // Add this to support the current message structure
  propagationMethod?: string;
  metadata?: any;
  timestamp?: string;
}

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

class WebSocketService {
  private wss: WebSocketServer | null = null;
  private clients: Set<WebSocket> = new Set();
  private heartbeatInterval: NodeJS.Timeout | null = null;

  /**
   * Initializes the WebSocket server
   * Sets up connection handling and message processing
   */
  initialize(server: Server, path: string = '/ws-app') {
    this.wss = new WebSocketServer({ 
      server,
      path,
      perMessageDeflate: false
    });
    
    this.wss.on('connection', (ws: WebSocket) => {
      console.log('WebSocket client connected');
      this.clients.add(ws);
      
      // Send initial data to new client
      this.sendInitialData(ws);
      
      ws.on('error', (error) => {
        console.error('WebSocket connection error:', error);
        this.sendError(ws, 'Connection error occurred');
        this.clients.delete(ws);
      });
      
      ws.on('message', async (data: Buffer) => {
        try {
          const rawMessage = data.toString();
          console.log('Received data:', rawMessage);
          
          const message = JSON.parse(rawMessage);
          
          // Validate basic message structure
          if (!message || typeof message !== 'object') {
            throw new Error('Message must be a valid JSON object');
          }
          
          if (!message.type || typeof message.type !== 'string') {
            throw new Error('Message must contain a valid type field');
          }

          // For analysis requests, restructure the data to match expected format
          if (message.type === 'analysis_request') {
            const analysisData: AnalysisRequestData = {
              files: message.files || [],
              propagationMethod: message.propagationMethod || message.metadata?.propagationMethod,
              metadata: message.metadata,
              timestamp: message.timestamp
            };

            // Validate files array
            if (!Array.isArray(analysisData.files)) {
              throw new Error('Files must be an array');
            }

            // Process each file in the array
            if (analysisData.files.length === 0) {
              throw new Error('No files provided for analysis');
            }

            // Create a properly structured message
            const structuredMessage: WebSocketMessage = {
              type: 'analysis_request',
              data: analysisData
            };

            await this.handleMessage(ws, structuredMessage);
            return;
          }

          // Handle other message types
          await this.handleMessage(ws, message as WebSocketMessage);
          
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
          this.sendError(ws, error instanceof Error ? error.message : 'Invalid message format');
        }
      });
      
      ws.on('close', () => {
        console.log('WebSocket client disconnected');
        this.clients.delete(ws);
      });
      
      ws.on('error', (error) => {
        console.error('WebSocket error:', error);
        this.clients.delete(ws);
      });
    });
    
    // Start heartbeat to keep connections alive
    this.startHeartbeat();
    
    console.log('WebSocket server initialized on /ws');
  }

  /**
   * Sends initial dashboard data to a new client
   */
  private async sendInitialData(ws: WebSocket) {
    try {
      // Send dashboard statistics
      const stats = await this.getDashboardStats();
      this.sendMessage(ws, {
        type: 'dashboard_update',
        data: stats
      });
      
      // Send propagation insights
      const insights = await this.getPropagationInsights();
      this.sendMessage(ws, {
        type: 'propagation_update',
        data: insights
      });
    } catch (error) {
      console.error('Error sending initial data:', error);
    }
  }

  /**
   * Handles incoming WebSocket messages
   */
  private async handleMessage(ws: WebSocket, message: WebSocketMessage) {
    switch (message.type) {
      case 'refresh_request':
        await this.handleRefreshRequest(ws);
        break;
      
      case 'analysis_request':
        await this.handleAnalysisRequest(ws, message.data);
        break;
      
      case 'test_message':
        console.log('Received test message:', message.data);
        this.sendMessage(ws, {
          type: 'test_response',
          data: 'Test response from server'
        });
        break;
      
      default:
        console.warn('Unknown message type:', message.type);
        this.sendError(ws, `Unknown message type: ${message.type}`);
    }
  }

  /**
   * Handles refresh requests from clients
   */
  private async handleRefreshRequest(ws: WebSocket) {
    try {
      const stats = await this.getDashboardStats();
      this.broadcast({
        type: 'dashboard_update',
        data: stats
      });
      
      const insights = await this.getPropagationInsights();
      this.broadcast({
        type: 'propagation_update',
        data: insights
      });
    } catch (error) {
      console.error('Error handling refresh request:', error);
      this.sendError(ws, 'Failed to refresh data');
    }
  }

  /**
   * Handles analysis requests from clients
   */
  private async handleAnalysisRequest(ws: WebSocket, data: AnalysisRequestData) {
    try {
      // Validate request data
      if (!data || !Array.isArray(data.files) || data.files.length === 0) {
        throw new Error('Invalid analysis request: No files provided');
      }

      console.log('Received analysis request with', data.files.length, 'files');

      // Get active model
      const activeModel = modelManager.getActiveModel();
      if (!activeModel) {
        throw new Error('AI model not available');
      }

      // Process each file
      for (const file of data.files) {
        try {
          // Validate file data
          if (!file || !file.buffer) {
            throw new Error(`Invalid file data: Buffer is required for file ${file.name || 'unnamed'}`);
          }

          console.log('Processing file:', file.name || 'unnamed');

          // Convert ArrayBuffer to Buffer if needed
          let imageBuffer: Buffer;
          if (file.buffer instanceof ArrayBuffer) {
            imageBuffer = Buffer.from(file.buffer);
          } else if (Array.isArray(file.buffer)) {
            imageBuffer = Buffer.from(file.buffer);
          } else if (Buffer.isBuffer(file.buffer)) {
            imageBuffer = file.buffer;
          } else {
            throw new Error(`Invalid buffer type for file ${file.name || 'unnamed'}`);
          }

          // Prepare analysis request
          const analysisRequest = {
            imageBuffer,
            farmLocation: data.metadata?.farmLocation || 'Unknown',
            propagationMethod: data.propagationMethod || 'Unknown',
            timestamp: data.timestamp || new Date().toISOString()
          };

          // Run disease detection
          console.log('Running disease detection...');
          const result = await activeModel.detectDisease(analysisRequest);

          // Prepare analysis result
          const analysisResult = {
            id: `analysis_${Date.now()}_${file.name}`,
            fileName: file.name || 'unnamed',
            propagationMethod: data.propagationMethod || 'Unknown',
            diseaseStatus: result.diseaseClass,
            confidence: result.confidence,
            severity: result.severity,
            timestamp: data.timestamp || new Date().toISOString()
          };

          // Store result
          await storage.createAnalysis({
            dateTime: new Date(analysisResult.timestamp),
            propagationMethod: analysisResult.propagationMethod,
            diseaseStatus: analysisResult.diseaseStatus,
            confidence: analysisResult.confidence,
            severity: analysisResult.severity,
            farmId: data.metadata?.farmId ? Number(data.metadata.farmId) : 0,
            isHealthy: result.diseaseClass.toLowerCase() === 'healthy'
          });

          // Send result back to client
          this.sendMessage(ws, {
            type: 'analysis_result',
            data: analysisResult
          });

          console.log('Analysis complete:', analysisResult.diseaseStatus);
        } catch (error) {
          // Send error for this specific file but continue processing others
          console.error(`Error processing file ${file.name || 'unnamed'}:`, error);
          this.sendMessage(ws, {
            type: 'error',
            data: {
              fileName: file.name || 'unnamed',
              error: error instanceof Error ? error.message : 'Analysis failed'
            }
          });
        }
      }

    } catch (error) {
      console.error('Error in analysis request:', error);
      
      // Send error back to client
      this.sendMessage(ws, {
        type: 'error',
        data: {
          error: error instanceof Error ? error.message : 'Analysis failed'
        }
      });
    }
  }

  /**
   * Simulates analysis processing for demonstration
   * In production, this would call the actual AI model
   */
  // Delete the entire simulateAnalysis method as it's no longer needed
  private async simulateAnalysis(data: any): Promise<AnalysisResult[]> {
    const { files, propagationMethod } = data;
    
    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    return files.map((file: File, index: number) => ({
      id: `analysis_${Date.now()}_${index}`,
      fileName: file.name || `image_${index}.jpg`,
      propagationMethod: propagationMethod || 'Crown Cutting',
      diseaseStatus: Math.random() > 0.7 ? 'Disease Detected' : 'Healthy',
      confidence: Math.floor(Math.random() * 30) + 70, // 70-100%
      severity: Math.random() > 0.5 ? 'Mild' : 'Moderate',
      timestamp: new Date().toISOString()
    }));
  }

  /**
   * Gets current dashboard statistics
   */
  private async getDashboardStats(): Promise<DashboardStats> {
    try {
      // In production, this would fetch from database
      // Starting with zeros until real analysis data is available
      return {
        totalScans: 0,
        healthyPlants: 0,
        diseaseAlerts: 0,
        successRate: 0
      };
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      return {
        totalScans: 0,
        healthyPlants: 0,
        diseaseAlerts: 0,
        successRate: 0
      };
    }
  }

  /**
   * Gets current propagation insights
   */
  private async getPropagationInsights(): Promise<PropagationInsight[]> {
    try {
      // In production, this would fetch from database
      // Starting with empty array until real analysis data is available
      return [];
    } catch (error) {
      console.error('Error fetching propagation insights:', error);
      return [];
    }
  }

  /**
   * Sends a message to a specific client
   */
  private sendMessage(ws: WebSocket, message: WebSocketMessage) {
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify(message));
    }
  }

  /**
   * Broadcasts a message to all connected clients
   */
  private broadcast(message: WebSocketMessage) {
    this.clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(message));
      }
    });
  }

  /**
   * Sends an error message to a client
   */
  private sendError(ws: WebSocket, error: string) {
    this.sendMessage(ws, {
      type: 'error',
      data: error
    });
  }

  /**
   * Starts heartbeat to keep connections alive
   */
  private startHeartbeat() {
    this.heartbeatInterval = setInterval(() => {
      this.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
          client.ping();
        }
      });
    }, 30000); // Send ping every 30 seconds
  }

  /**
   * Stops the heartbeat interval
   */
  stop() {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
      this.heartbeatInterval = null;
    }
    
    if (this.wss) {
      this.wss.close();
      this.wss = null;
    }
  }

  /**
   * Gets the number of connected clients
   */
  getConnectedClientsCount(): number {
    return this.clients.size;
  }
}

// Export singleton instance
export const websocketService = new WebSocketService();