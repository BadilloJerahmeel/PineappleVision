/**
 * Model Manager - Handles AI Model Lifecycle
 * 
 * This module manages the lifecycle of AI models including:
 * - Model loading and unloading
 * - Version management
 * - Performance monitoring
 * - Model switching and updates
 */

import { AIService, AIModelConfig } from './ai-service';
import * as fs from 'fs';
import * as path from 'path';

export interface ModelVersion {
  version: string;
  path: string;
  accuracy: number;
  trainingDate: string;
  isActive: boolean;
  metadata: {
    trainingDataSize: number;
    epochs: number;
    validationAccuracy: number;
    testAccuracy: number;
  };
}

export interface ModelPerformanceMetrics {
  totalPredictions: number;
  averageConfidence: number;
  accuracyRate: number;
  processingTimeMs: number;
  memoryUsageMB: number;
  errorRate: number;
}

export class ModelManager {
  private models: Map<string, AIService> = new Map();
  private activeModel: string | null = null;
  private modelVersions: ModelVersion[] = [];
  private performanceMetrics: ModelPerformanceMetrics = {
    totalPredictions: 0,
    averageConfidence: 0,
    accuracyRate: 0,
    processingTimeMs: 0,
    memoryUsageMB: 0,
    errorRate: 0,
  };

  constructor() {
    this.loadModelRegistry();
  }

  /**
   * Load model registry from configuration file
   */
  private loadModelRegistry(): void {
    try {
      const registryPath = path.join(process.cwd(), 'models', 'model-registry.json');
      if (fs.existsSync(registryPath)) {
        const registry = JSON.parse(fs.readFileSync(registryPath, 'utf8'));
        this.modelVersions = registry.versions || [];
      }
    } catch (error) {
      console.warn('Could not load model registry:', error);
    }
  }

  /**
   * Register a new model version
   */
  async registerModel(version: string, config: AIModelConfig, metadata: ModelVersion['metadata']): Promise<void> {
    const modelVersion: ModelVersion = {
      version,
      path: config.modelPath,
      accuracy: metadata.validationAccuracy,
      trainingDate: new Date().toISOString(),
      isActive: false,
      metadata,
    };

    // Add to registry
    this.modelVersions.push(modelVersion);
    
    // Save registry
    await this.saveModelRegistry();
    
    console.log(`Model version ${version} registered successfully`);
  }

  /**
   * Load and activate a specific model version
   */
  async loadModel(version: string): Promise<void> {
    const modelVersion = this.modelVersions.find(v => v.version === version);
    if (!modelVersion) {
      throw new Error(`Model version ${version} not found`);
    }

    // Check if model file exists
    if (!fs.existsSync(modelVersion.path)) {
      throw new Error(`Model file not found at ${modelVersion.path}`);
    }

    // Create AI service instance
    const config: AIModelConfig = {
      modelPath: modelVersion.path,
      modelType: 'tensorflow', // TODO: Make this configurable
      inputSize: { width: 224, height: 224 },
      classes: ['Healthy', 'Fruit Rot', 'Mealybug Wilt', 'Root Rot'],
      confidenceThreshold: 0.6,
    };

    const aiService = new AIService(config);
    await aiService.initialize();

    // Store in models map
    this.models.set(version, aiService);
    
    // Update active model
    if (this.activeModel) {
      this.modelVersions.find(v => v.version === this.activeModel)!.isActive = false;
    }
    this.activeModel = version;
    modelVersion.isActive = true;

    await this.saveModelRegistry();
    console.log(`Model ${version} loaded and activated`);
  }

  /**
   * Get the currently active model
   */
  getActiveModel(): AIService | null {
    if (!this.activeModel || !this.models.has(this.activeModel)) {
      return null;
    }
    return this.models.get(this.activeModel)!;
  }

  /**
   * Switch to a different model version
   */
  async switchModel(version: string): Promise<void> {
    if (this.models.has(version)) {
      // Model already loaded, just switch
      if (this.activeModel) {
        this.modelVersions.find(v => v.version === this.activeModel)!.isActive = false;
      }
      this.activeModel = version;
      this.modelVersions.find(v => v.version === version)!.isActive = true;
      await this.saveModelRegistry();
    } else {
      // Load the model first
      await this.loadModel(version);
    }
  }

  /**
   * Unload a model from memory
   */
  async unloadModel(version: string): Promise<void> {
    if (this.models.has(version)) {
      this.models.delete(version);
      
      if (this.activeModel === version) {
        this.activeModel = null;
        this.modelVersions.find(v => v.version === version)!.isActive = false;
        await this.saveModelRegistry();
      }
      
      console.log(`Model ${version} unloaded from memory`);
    }
  }

  /**
   * Update performance metrics
   */
  updateMetrics(processingTime: number, confidence: number, success: boolean): void {
    this.performanceMetrics.totalPredictions++;
    this.performanceMetrics.processingTimeMs = 
      (this.performanceMetrics.processingTimeMs + processingTime) / 2;
    this.performanceMetrics.averageConfidence = 
      (this.performanceMetrics.averageConfidence + confidence) / 2;
    
    if (!success) {
      this.performanceMetrics.errorRate = 
        (this.performanceMetrics.errorRate * (this.performanceMetrics.totalPredictions - 1) + 1) / 
        this.performanceMetrics.totalPredictions;
    }

    // Update memory usage (simplified)
    this.performanceMetrics.memoryUsageMB = process.memoryUsage().heapUsed / 1024 / 1024;
  }

  /**
   * Get all registered model versions
   */
  getModelVersions(): ModelVersion[] {
    return [...this.modelVersions];
  }

  /**
   * Get performance metrics
   */
  getPerformanceMetrics(): ModelPerformanceMetrics {
    return { ...this.performanceMetrics };
  }

  /**
   * Save model registry to file
   */
  private async saveModelRegistry(): Promise<void> {
    try {
      const registryPath = path.join(process.cwd(), 'models', 'model-registry.json');
      const modelsDir = path.dirname(registryPath);
      
      // Ensure models directory exists
      if (!fs.existsSync(modelsDir)) {
        fs.mkdirSync(modelsDir, { recursive: true });
      }

      const registry = {
        versions: this.modelVersions,
        lastUpdated: new Date().toISOString(),
      };

      fs.writeFileSync(registryPath, JSON.stringify(registry, null, 2));
    } catch (error) {
      console.error('Failed to save model registry:', error);
    }
  }

  /**
   * Auto-load the best available model on startup
   */
  async autoLoadBestModel(): Promise<void> {
    if (this.modelVersions.length === 0) {
      console.log('No models registered. Waiting for model deployment...');
      return;
    }

    // Find the model with highest accuracy
    const bestModel = this.modelVersions
      .filter(v => fs.existsSync(v.path))
      .sort((a, b) => b.accuracy - a.accuracy)[0];

    if (bestModel) {
      await this.loadModel(bestModel.version);
      console.log(`Auto-loaded best model: ${bestModel.version} (accuracy: ${bestModel.accuracy}%)`);
    }
  }

  /**
   * Health check for the active model
   */
  async healthCheck(): Promise<{ status: 'healthy' | 'unhealthy'; details: any }> {
    const activeModel = this.getActiveModel();
    
    if (!activeModel) {
      return {
        status: 'unhealthy',
        details: { error: 'No active model loaded' }
      };
    }

    try {
      const modelInfo = activeModel.getModelInfo();
      const metrics = this.getPerformanceMetrics();
      
      return {
        status: 'healthy',
        details: {
          modelInfo,
          metrics,
          activeVersion: this.activeModel,
          memoryUsage: process.memoryUsage(),
        }
      };
    } catch (error) {
      return {
        status: 'unhealthy',
        details: { error: error instanceof Error ? error.message : 'Unknown error' }
      };
    }
  }
}

// Singleton instance
export const modelManager = new ModelManager();