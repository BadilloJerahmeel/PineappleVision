/**
 * AI Service Module - Disease Detection Integration
 * 
 * This module handles the integration with trained AI models for pineapple disease detection.
 * It provides interfaces for loading models, processing images, and returning analysis results.
 * 
 * Features:
 * - Model loading and initialization
 * - Image preprocessing for AI analysis
 * - Disease detection and classification
 * - Confidence scoring and severity assessment
 * - Batch processing capabilities
 */

import * as tf from '@tensorflow/tfjs';
import { Jimp } from 'jimp';
import * as path from 'path';
import * as fs from 'fs';
import { spawn } from 'child_process';
import { fileURLToPath } from 'url';

// Get __dirname equivalent for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export interface AIModelConfig {
  modelPath: string;
  modelType: 'tensorflow' | 'pytorch' | 'onnx';
  inputSize: { width: number; height: number };
  classes: string[];
  confidenceThreshold: number;
}

export interface DetectionResult {
  diseaseClass: string;
  confidence: number;
  severity: 'None' | 'Mild' | 'Moderate' | 'Severe';
  boundingBoxes?: Array<{
    x: number;
    y: number;
    width: number;
    height: number;
    confidence: number;
  }>;
  metadata: {
    processingTime: number;
    modelVersion: string;
    imageSize: { width: number; height: number };
  };
}

export interface ImageAnalysisRequest {
  imageBuffer: Buffer;
  farmLocation: string;
  propagationMethod: string;
  timestamp: string;
}

export class AIService {
  private model: any = null;
  private config: AIModelConfig;
  private isInitialized: boolean = false;

  constructor(config: AIModelConfig) {
    this.config = config;
  }

  /**
   * Initialize the AI model
   * Load the trained model from the specified path
   */
  async initialize(): Promise<void> {
    try {
      console.log('Initializing AI model...');
      
      switch (this.config.modelType) {
        case 'tensorflow':
          console.log(`Loading TensorFlow model from: ${this.config.modelPath}`);
          if (this.config.modelPath.endsWith('.keras')) {
            console.log('Keras model detected - will use Python subprocess for inference');
            // Verify the model file exists
            if (!fs.existsSync(this.config.modelPath)) {
              throw new Error(`Model file not found: ${this.config.modelPath}`);
            }
            this.model = {
              type: 'keras',
              path: this.config.modelPath,
              predict: async (input: any) => {
                return await this.runKerasInference(input);
              }
            };
          } else {
            // Try to load TensorFlow.js format model
            const modelUrl = this.config.modelPath.startsWith('http') 
              ? this.config.modelPath 
              : `file://${path.resolve(this.config.modelPath)}`;
            this.model = await tf.loadLayersModel(modelUrl);
          }
          console.log('TensorFlow model loaded successfully');
          break;
        case 'pytorch':
          throw new Error('PyTorch models not supported yet');
        case 'onnx':
          throw new Error('ONNX models not supported yet');
        default:
          throw new Error(`Unsupported model type: ${this.config.modelType}`);
      }

      this.isInitialized = true;
      console.log('AI model initialized successfully');
    } catch (error) {
      console.error('Failed to initialize AI model:', error);
      throw new Error(`Model initialization failed: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * Preprocess image for AI analysis
   * Resize, normalize, and convert to tensor format
   */
  private async preprocessImage(imageBuffer: Buffer): Promise<any> {
    try {
      // Load image with Jimp
      const image = await Jimp.read(imageBuffer);
      const originalSize = { width: image.width, height: image.height };
      
      // Resize to model input size
      const { width, height } = this.config.inputSize;
      image.resize({ w: width, h: height });
      
      // Convert to RGB array
      const imageData = new Float32Array(width * height * 3);
      let idx = 0;
      
      for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
          const pixel = image.getPixelColor(x, y);
          const r = (pixel >> 24) & 0xFF;
          const g = (pixel >> 16) & 0xFF;
          const b = (pixel >> 8) & 0xFF;
          // Normalize pixel values to [0, 1]
          imageData[idx++] = r / 255.0;
          imageData[idx++] = g / 255.0;
          imageData[idx++] = b / 255.0;
        }
      }
      
      // Convert to tensor with shape [1, height, width, 3]
      const tensor = tf.tensor4d(imageData, [1, height, width, 3]);
      
      return {
        tensor,
        originalSize,
      };
    } catch (error) {
      console.error('Image preprocessing failed:', error);
      throw new Error(`Image preprocessing failed: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * Run disease detection on a single image
   */
  async detectDisease(request: ImageAnalysisRequest): Promise<DetectionResult> {
    if (!this.isInitialized) {
      throw new Error('AI model not initialized. Call initialize() first.');
    }

    const startTime = Date.now();

    try {
      // Preprocess the image
      const preprocessed = await this.preprocessImage(request.imageBuffer);
      
      // Run inference
      // TODO: Replace with actual model inference
      const predictions = await this.runInference(preprocessed.tensor);
      
      // Post-process results
      const result = this.postprocessResults(predictions, {
        processingTime: Date.now() - startTime,
        modelVersion: '1.0.0',
        imageSize: preprocessed.originalSize,
      });

      return result;
    } catch (error) {
      console.error('Disease detection failed:', error);
      throw new Error('Analysis failed');
    }
  }

  /**
   * Create Python inference script for Keras models
   */
  private async createPythonInferenceScript(): Promise<void> {
    const scriptPath = path.join(__dirname, '../python_inference.py');
    
    if (fs.existsSync(scriptPath)) {
      return; // Script already exists
    }
    
    const pythonScript = `import sys
import json
import numpy as np
from tensorflow import keras
from tensorflow.keras.models import load_model

def main():
    if len(sys.argv) != 3:
        print("Usage: python inference.py <input_file> <output_file>", file=sys.stderr)
        sys.exit(1)
    
    input_file = sys.argv[1]
    output_file = sys.argv[2]
    
    try:
        # Load input data
        with open(input_file, 'r') as f:
            input_data = json.load(f)
        
        # Load model
        model = load_model(input_data['modelPath'])
        
        # Prepare input tensor
        data = np.array(input_data['data']).reshape(input_data['shape'])
        
        # Run inference
        predictions = model.predict(data)
        
        # Prepare output
        output_data = {
            'predictions': predictions.flatten().tolist()
        }
        
        # Save output
        with open(output_file, 'w') as f:
            json.dump(output_data, f)
            
    except Exception as e:
        print(f"Error during inference: {str(e)}", file=sys.stderr)
        sys.exit(1)

if __name__ == "__main__":
    main()
`;
    
    fs.writeFileSync(scriptPath, pythonScript);
  }

  /**
   * Check if Python dependencies are available
   */
  private async checkPythonDependencies(): Promise<{ available: boolean; missing: string[] }> {
    return new Promise((resolve) => {
      const checkProcess = spawn('python', ['-c', 'import numpy, tensorflow; print("OK")']);
      let stdout = '';
      let stderr = '';
      
      checkProcess.stdout.on('data', (data) => {
        stdout += data.toString();
      });
      
      checkProcess.stderr.on('data', (data) => {
        stderr += data.toString();
      });
      
      checkProcess.on('close', (code) => {
        if (code === 0 && stdout.includes('OK')) {
          resolve({ available: true, missing: [] });
        } else {
          const missing = [];
          if (stderr.includes('numpy')) missing.push('numpy');
          if (stderr.includes('tensorflow')) missing.push('tensorflow');
          resolve({ available: false, missing });
        }
      });
    });
  }

  /**
   * Run inference using Python subprocess for Keras models
   */
  private async runKerasInference(inputTensor: any): Promise<tf.Tensor> {
    try {
      // Check Python dependencies first
      const depCheck = await this.checkPythonDependencies();
      if (!depCheck.available) {
        throw new Error(`Python dependencies missing: ${depCheck.missing.join(', ')}. Please install them using: pip install ${depCheck.missing.join(' ')}`);
      }

      // Convert tensor to array and save as temporary file
      const tensorData = await inputTensor.data();
      const tensorShape = inputTensor.shape;
      
      const tempInputFile = path.join(__dirname, '../temp_input.json');
      const tempOutputFile = path.join(__dirname, '../temp_output.json');
      
      // Prepare input data
      const inputData = {
        data: Array.from(tensorData),
        shape: tensorShape,
        modelPath: this.config.modelPath
      };
      
      // Write input to temporary file
      fs.writeFileSync(tempInputFile, JSON.stringify(inputData));
      
      // Create Python inference script if it doesn't exist
      await this.createPythonInferenceScript();
      
      // Run Python inference
      const pythonProcess = spawn('python', [path.join(__dirname, '../python_inference.py'), tempInputFile, tempOutputFile]);
      
      return new Promise((resolve, reject) => {
        let stderr = '';
        
        pythonProcess.stderr.on('data', (data) => {
          stderr += data.toString();
        });
        
        pythonProcess.on('close', (code) => {
          try {
            if (code !== 0) {
              // Provide more helpful error messages
              if (stderr.includes('ModuleNotFoundError')) {
                const missingModule = stderr.match(/No module named '([^']+)'/)?.[1] || 'unknown';
                throw new Error(`Python module '${missingModule}' is not installed. Please install it using: pip install ${missingModule}`);
              }
              throw new Error(`Python inference failed: ${stderr}`);
            }
            
            // Read output
            const outputData = JSON.parse(fs.readFileSync(tempOutputFile, 'utf8'));
            
            // Clean up temporary files
            if (fs.existsSync(tempInputFile)) fs.unlinkSync(tempInputFile);
            if (fs.existsSync(tempOutputFile)) fs.unlinkSync(tempOutputFile);
            
            // Return as tensor
            resolve(tf.tensor1d(outputData.predictions));
          } catch (error) {
            reject(error);
          }
        });
      });
    } catch (error) {
      throw new Error(`Keras inference failed: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * Run model inference
   */
  private async runInference(inputTensor: any): Promise<any> {
    try {
      if (!this.model) {
        throw new Error('Model not loaded');
      }

      switch (this.config.modelType) {
        case 'tensorflow':
          console.log('Running TensorFlow inference...');
          
          if (this.model.type === 'keras') {
            // Use Python subprocess for Keras models
            const predictions = await this.model.predict(inputTensor);
            const classScores = await predictions.data();
            
            // Clean up tensors
            inputTensor.dispose();
            predictions.dispose();
            
            return {
              classScores: Array.from(classScores),
              detections: [], // No bounding box detection for classification
            };
          } else {
            // Use TensorFlow.js for native models
            const predictions = this.model.predict(inputTensor) as tf.Tensor;
            const classScores = await predictions.data();
            
            // Clean up tensors
            inputTensor.dispose();
            predictions.dispose();
            
            return {
              classScores: Array.from(classScores),
              detections: [], // No bounding box detection for classification
            };
          }
        default:
          throw new Error(`Inference not implemented for ${this.config.modelType}`);
      }
    } catch (error) {
      console.error('Model inference failed:', error);
      throw new Error(`Model inference failed: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * Post-process model predictions into structured results
   */
  private postprocessResults(predictions: any, metadata: any): DetectionResult {
    // TODO: Implement actual post-processing logic
    const { classScores, detections } = predictions;
    
    // Find highest confidence class
    const maxIndex = classScores.indexOf(Math.max(...classScores));
    const confidence = Math.round(classScores[maxIndex] * 100);
    const diseaseClass = this.config.classes[maxIndex] || 'Unknown';
    
    // Determine severity based on confidence and class
    let severity: 'None' | 'Mild' | 'Moderate' | 'Severe' = 'None';
    if (diseaseClass !== 'Healthy' && confidence > this.config.confidenceThreshold) {
      if (confidence >= 90) severity = 'Severe';
      else if (confidence >= 75) severity = 'Moderate';
      else if (confidence >= 60) severity = 'Mild';
    }

    return {
      diseaseClass,
      confidence,
      severity,
      boundingBoxes: detections.map((det: any) => ({
        x: det.x,
        y: det.y,
        width: det.width,
        height: det.height,
        confidence: det.confidence,
      })),
      metadata,
    };
  }

  /**
   * Process multiple images in batch
   */
  async processBatch(requests: ImageAnalysisRequest[]): Promise<DetectionResult[]> {
    const results: DetectionResult[] = [];
    
    for (const request of requests) {
      try {
        const result = await this.detectDisease(request);
        results.push(result);
      } catch (error) {
        console.error(`Failed to process image for ${request.farmLocation}:`, error);
        // Add error result
        results.push({
          diseaseClass: 'Error',
          confidence: 0,
          severity: 'None',
          metadata: {
            processingTime: 0,
            modelVersion: '1.0.0',
            imageSize: { width: 0, height: 0 },
          },
        });
      }
    }

    return results;
  }

  /**
   * Get model information and statistics
   */
  getModelInfo(): { config: AIModelConfig; isInitialized: boolean; supportedFormats: string[] } {
    return {
      config: this.config,
      isInitialized: this.isInitialized,
      supportedFormats: ['jpg', 'jpeg', 'png', 'tiff'],
    };
  }
}

// Default configuration for pineapple disease detection
export const defaultAIConfig: AIModelConfig = {
  modelPath: './models/best_model.keras',
  modelType: 'tensorflow',
  inputSize: { width: 224, height: 224 },
  classes: ['Healthy', 'Fruit Rot', 'Mealybug Wilt', 'Root Rot'],
  confidenceThreshold: 0.6,
};

// Singleton instance
export const aiService = new AIService(defaultAIConfig);