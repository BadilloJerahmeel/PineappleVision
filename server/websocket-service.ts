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

interface WebSocketMessage {
  type: 'dashboard_update' | 'propagation_update' | 'analysis_result' | 'refresh_request' | 'analysis_request' | 'test_message' | 'test_response' | 'error';
  data: any;
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
  initialize(server: Server) {
    this.wss = new WebSocketServer({ server, path: '/ws' });
    
    this.wss.on('connection', (ws: WebSocket) => {
      console.log('WebSocket client connected');
      this.clients.add(ws);
      
      // Send initial data to new client
      this.sendInitialData(ws);
      
      ws.on('message', (data: Buffer) => {
        try {
          const message: WebSocketMessage = JSON.parse(data.toString());
          this.handleMessage(ws, message);
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
          this.sendError(ws, 'Invalid message format');
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
  // Replace the simulateAnalysis method with real analysis
  private async handleAnalysisRequest(ws: WebSocket, data: any) {
    try {
      if (!data.imageBuffer) {
        throw new Error("No image data provided");
      }
  
      const activeModel = modelManager.getActiveModel();
      if (!activeModel) {
        throw new Error("AI model not available");
      }
  
      const result = await activeModel.detectDisease({
        imageBuffer: Buffer.from(data.imageBuffer),
        farmLocation: data.farmLocation || 'Unknown',
        propagationMethod: data.propagationMethod || 'Unknown',
        timestamp: new Date().toISOString()
      });
  
      // Store the analysis result with correct field mappings
      const analysisResult = {
        farmId: data.farmId || 0,
        propagationMethod: data.propagationMethod || 'Unknown',
        diseaseStatus: result.diseaseClass || 'Unknown',
        confidence: result.confidence || 0,
        severity: result.severity || 'Unknown',
        dateTime: new Date()
      };

      await storage.createAnalysis({
        ...analysisResult,
        isHealthy: analysisResult.diseaseStatus.toLowerCase() === 'healthy'
      });
  
      // Broadcast results to all clients
      this.broadcast({
        type: 'analysis_result',
        data: result
      });
  
    } catch (error) {
      console.error('Error handling analysis request:', error);
      this.sendError(ws, error instanceof Error ? error.message : 'Analysis request failed');
    }
  }

  /**
   * Simulates analysis processing for demonstration
   * In production, this would call the actual AI model
   */
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