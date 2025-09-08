import { spawn, ChildProcess } from 'child_process';
import axios from 'axios';
import path from 'path';
import { fileURLToPath } from 'url';
import { log } from './vite';

// Get __dirname equivalent for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class PythonAIService {
  private pythonProcess: ChildProcess | null = null;
  private isRunning = false;
  private readonly pythonPort = 5001;
  private readonly pythonHost = '127.0.0.1';
  private readonly baseUrl = `http://${this.pythonHost}:${this.pythonPort}`;
  private startupAttempts = 0;
  private readonly maxStartupAttempts = 3;
  private initialized = false;

  constructor() {
    // Don't auto-start to avoid blocking Node.js server startup
    // Will start on first prediction request
  }

  async initialize(): Promise<void> {
    if (this.initialized) return;
    this.initialized = true;
    await this.startPythonService();
  }

  private async startPythonService(): Promise<void> {
    if (this.isRunning || this.startupAttempts >= this.maxStartupAttempts) {
      return;
    }

    this.startupAttempts++;
    log(`Starting Python AI service (attempt ${this.startupAttempts}/${this.maxStartupAttempts})...`);

    try {
      const pythonDir = path.join(__dirname, 'python');
      const startPath = path.join(pythonDir, 'start.py');

      // Start Python Flask server using the startup script
      this.pythonProcess = spawn('python', [startPath], {
        cwd: pythonDir,
        stdio: ['pipe', 'pipe', 'pipe']
      });

      this.pythonProcess.stdout?.on('data', (data) => {
        log(`Python AI: ${data.toString().trim()}`);
      });

      this.pythonProcess.stderr?.on('data', (data) => {
        const message = data.toString().trim();
        if (!message.includes('WARNING') && !message.includes('INFO')) {
          log(`Python AI Error: ${message}`);
        }
      });

      this.pythonProcess.on('close', (code) => {
        log(`Python AI service exited with code ${code}`);
        this.isRunning = false;
        this.pythonProcess = null;
        
        // Restart if it wasn't intentionally stopped
        if (code !== 0 && this.startupAttempts < this.maxStartupAttempts) {
          setTimeout(() => this.startPythonService(), 5000);
        }
      });

      this.pythonProcess.on('error', (error) => {
        log(`Failed to start Python AI service: ${error.message}`);
        this.isRunning = false;
        this.pythonProcess = null;
      });

      // Wait for service to be ready
      await this.waitForService();
      this.isRunning = true;
      log('Python AI service started successfully!');

    } catch (error) {
      log(`Error starting Python AI service: ${error instanceof Error ? error.message : 'Unknown error'}`);
      if (this.startupAttempts < this.maxStartupAttempts) {
        setTimeout(() => this.startPythonService(), 5000);
      }
    }
  }

  private async waitForService(maxWaitTime = 30000): Promise<void> {
    const startTime = Date.now();
    const checkInterval = 1000;

    while (Date.now() - startTime < maxWaitTime) {
      try {
        await axios.get(`${this.baseUrl}/health`, { timeout: 2000 });
        return; // Service is ready
      } catch (error) {
        // Service not ready yet, wait and try again
        await new Promise(resolve => setTimeout(resolve, checkInterval));
      }
    }

    throw new Error('Python AI service failed to start within timeout period');
  }

  async predict(imageData: string): Promise<any> {
    // Initialize service if not already done
    if (!this.initialized) {
      await this.initialize();
    }
    
    if (!this.isRunning) {
      throw new Error('Python AI service is not running');
    }

    try {
      const response = await axios.post(`${this.baseUrl}/predict`, {
        image: imageData
      }, {
        timeout: 30000, // 30 second timeout for predictions
        headers: {
          'Content-Type': 'application/json'
        }
      });

      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.code === 'ECONNREFUSED') {
          throw new Error('Python AI service is not available');
        }
        throw new Error(`Prediction failed: ${error.response?.data?.error || error.message}`);
      }
      throw error;
    }
  }

  async getModelInfo(): Promise<any> {
    if (!this.isRunning) {
      throw new Error('Python AI service is not running');
    }

    try {
      const response = await axios.get(`${this.baseUrl}/model/info`, {
        timeout: 5000
      });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(`Failed to get model info: ${error.response?.data?.error || error.message}`);
      }
      throw error;
    }
  }

  async healthCheck(): Promise<{ status: string; details: string }> {
    try {
      if (!this.isRunning) {
        return {
          status: 'unhealthy',
          details: 'Python AI service is not running'
        };
      }

      const response = await axios.get(`${this.baseUrl}/health`, {
        timeout: 5000
      });

      return {
        status: response.data.model_loaded ? 'healthy' : 'degraded',
        details: response.data.model_loaded 
          ? 'Python AI service is running with model loaded'
          : 'Python AI service is running but model is not loaded'
      };
    } catch (error) {
      return {
        status: 'unhealthy',
        details: `Python AI service health check failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  }

  isServiceRunning(): boolean {
    return this.isRunning;
  }

  async stop(): Promise<void> {
    if (this.pythonProcess) {
      log('Stopping Python AI service...');
      this.pythonProcess.kill('SIGTERM');
      this.pythonProcess = null;
      this.isRunning = false;
    }
  }
}

// Export singleton instance
export const pythonAIService = new PythonAIService();